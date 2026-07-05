/**
 * Model manager — OTA updates for the on-device .tflite model.
 *
 * Strategy (offline-first):
 *   1. Bundled asset is always the floor — if anything fails, inference still works.
 *   2. On app launch (and on manual "check now"), fetch `manifest.json` from a
 *      public Supabase Storage bucket.
 *   3. If `manifest.version > local.version`, download `manifest.file`, verify
 *      SHA-256 against `manifest.sha256`, and atomic-move into the docs dir.
 *   4. Subsequent app launches read from the local downloaded file first.
 *
 * The manifest lives at:
 *   {SUPABASE_URL}/storage/v1/object/public/models/manifest.json
 *
 * The model file at:
 *   {SUPABASE_URL}/storage/v1/object/public/models/{manifest.file}
 *
 * Why a manifest (not just a URL)? Lets you publish multiple model versions
 * and roll back without changing app code.
 */

import * as FileSystem from 'expo-file-system';
import { Paths, Directory } from 'expo-file-system';
import * as Crypto from 'expo-crypto';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ---------- Types ----------

/** Shape stored in Supabase Storage as manifest.json. */
export type ModelManifest = {
  /** Monotonic integer; bump when shipping a new model. */
  version: number;
  /** Human-readable display, e.g. "1.0.0" or "baseline-2026-05". */
  displayName: string;
  /** Storage file name inside the `models` bucket (e.g. "baseline_cnn_v2.tflite"). */
  file: string;
  /** Lowercase hex SHA-256 of the .tflite file bytes. */
  sha256: string;
  /** ISO timestamp; just for display. */
  releasedAt: string;
  /** Optional release notes shown in Settings. */
  notes?: string;
  /** Optional minimum app version that can load this model (semver-ish string). */
  minAppVersion?: string;
};

/** Lightweight view of the currently active model. */
export type ActiveModelInfo = {
  /** `bundled` = ship-with-the-app asset; `local` = previously downloaded OTA. */
  source: 'bundled' | 'local';
  /** Absolute file:// URI if source === 'local', else null. */
  localUri: string | null;
  /** Version number we last successfully installed (0 = never updated). */
  version: number;
  /** Display name of installed local model, or null. */
  displayName: string | null;
};

// ---------- Constants ----------

const STORAGE_KEY = 'lively.modelManager.v1';
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const BUCKET = 'models';
const MANIFEST_FILE = 'manifest.json';

// Where downloaded models live. We pin the directory once.
function modelsDir(): string {
  // expo-file-system v19+: use Paths.document (a Directory instance)
  const docUri: string = Paths.document.uri;
  return `${docUri.replace(/\/$/, '')}/models/`;
}

function publicUrl(file: string): string {
  if (!SUPABASE_URL) throw new Error('EXPO_PUBLIC_SUPABASE_URL is not set.');
  return `${SUPABASE_URL.replace(/\/$/, '')}/storage/v1/object/public/${BUCKET}/${file}`;
}

// ---------- Local state (persisted) ----------

type PersistedState = {
  version: number;
  displayName: string | null;
  fileName: string | null;
  installedAt: string | null;
};

const DEFAULT_STATE: PersistedState = {
  version: 0,
  displayName: null,
  fileName: null,
  installedAt: null,
};

async function readState(): Promise<PersistedState> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    return { ...DEFAULT_STATE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_STATE;
  }
}

async function writeState(s: PersistedState): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(s));
}

// ---------- Public API ----------

/**
 * Return the active model URI. Inference code calls this first; if it returns
 * null, fall back to the bundled `require()` asset.
 */
export async function getActiveModelUri(): Promise<string | null> {
  try {
    const state = await readState();
    if (!state.fileName) return null;
    const path = `${modelsDir()}${state.fileName}`;
    const f = new FileSystem.File(path);
    if (!f.exists) return null;
    return path;
  } catch {
    return null;
  }
}

/** Returns a snapshot of the active model for UI display. */
export async function getActiveModelInfo(): Promise<ActiveModelInfo> {
  const state = await readState();
  const uri = await getActiveModelUri();
  return {
    source: uri ? 'local' : 'bundled',
    localUri: uri,
    version: state.version,
    displayName: state.displayName,
  };
}

/** Result of a manifest fetch — distinguishes "no network" from "bad response". */
type FetchManifestResult =
  | { ok: true; manifest: ModelManifest }
  | { ok: false; reason: 'no-url' | 'network' | 'not-found' | 'parse' | 'invalid'; detail?: string };

/**
 * Fetch the manifest with cache busting. Supabase Storage caches 404s and stale
 * versions at the CDN layer for up to 60s — a `?t=` query param bypasses both
 * the CDN and any local HTTP cache.
 */
export async function fetchManifestDetailed(): Promise<FetchManifestResult> {
  if (!SUPABASE_URL) return { ok: false, reason: 'no-url' };
  try {
    const url = `${publicUrl(MANIFEST_FILE)}?t=${Date.now()}`;
    const res = await fetch(url, {
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache', Pragma: 'no-cache' },
    });
    if (res.status === 404) {
      return { ok: false, reason: 'not-found', detail: 'manifest.json not in the models bucket' };
    }
    if (!res.ok) {
      return { ok: false, reason: 'network', detail: `HTTP ${res.status}` };
    }
    let json: any;
    try {
      json = await res.json();
    } catch {
      return { ok: false, reason: 'parse' };
    }
    if (
      typeof json?.version !== 'number' ||
      typeof json?.sha256 !== 'string' ||
      typeof json?.file !== 'string'
    ) {
      return { ok: false, reason: 'invalid' };
    }
    return { ok: true, manifest: json as ModelManifest };
  } catch (e) {
    return { ok: false, reason: 'network', detail: e instanceof Error ? e.message : String(e) };
  }
}

/** Back-compat: returns null on any failure, success otherwise. */
export async function fetchManifest(): Promise<ModelManifest | null> {
  const r = await fetchManifestDetailed();
  return r.ok ? r.manifest : null;
}

export type CheckResult =
  | { kind: 'no-network' }
  | { kind: 'manifest-missing'; detail?: string }
  | { kind: 'up-to-date'; manifest: ModelManifest }
  | { kind: 'update-installed'; manifest: ModelManifest }
  | { kind: 'error'; message: string };

/**
 * Check for an update and silently install it if available.
 * Safe to call on every app launch — it's cheap and offline-tolerant.
 */
export async function checkAndUpdate(): Promise<CheckResult> {
  const r = await fetchManifestDetailed();
  if (!r.ok) {
    if (r.reason === 'network' || r.reason === 'no-url') return { kind: 'no-network' };
    if (r.reason === 'not-found') return { kind: 'manifest-missing', detail: r.detail };
    return { kind: 'error', message: `manifest ${r.reason}${r.detail ? `: ${r.detail}` : ''}` };
  }
  const manifest = r.manifest;

  const state = await readState();
  if (manifest.version <= state.version) {
    return { kind: 'up-to-date', manifest };
  }

  try {
    await installFromManifest(manifest);
    return { kind: 'update-installed', manifest };
  } catch (e) {
    return { kind: 'error', message: e instanceof Error ? e.message : String(e) };
  }
}

/**
 * Download + verify + activate a specific manifest. Throws on failure.
 * Uses a temp path and atomic move so a crashed download never corrupts the
 * active model.
 */
async function installFromManifest(manifest: ModelManifest): Promise<void> {
  const dir = modelsDir();
  const modelDir = new Directory(dir);
  if (!modelDir.exists) modelDir.create();

  const finalPath = `${dir}${manifest.file}`;

  // Cache-bust via a header, NOT a query string. A `?t=…` on the URL becomes
  // part of the saved file's name (e.g. "model.tflite?t=123"), which then no
  // longer matches `manifest.file` and makes the final move fail with
  // NoSuchFileException. Keeping the path clean lets us reason about the name.
  const url = publicUrl(manifest.file);

  // expo-file-system v19+: File.downloadFileAsync(url, destination) resolves to
  // the actual File that was written. Trust the returned object — do not assume
  // its on-disk name.
  const downloaded = await FileSystem.File.downloadFileAsync(url, modelDir, {
    headers: { 'Cache-Control': 'no-cache' },
  });
  if (!downloaded.exists) throw new Error('Download produced no file.');

  // Verify SHA-256 on the file we actually got.
  const actualHash = await sha256OfFile(downloaded);
  const expected = manifest.sha256.toLowerCase();
  if (actualHash !== expected) {
    try { downloaded.delete(); } catch { /* ignore */ }
    throw new Error(
      `Checksum mismatch — expected ${expected.slice(0, 12)}…, got ${actualHash.slice(0, 12)}…`
    );
  }

  // Activate: replace any existing file at the final name, then move the
  // verified download into place. Guarded so a mid-move failure can't leave a
  // half-written active model.
  const finalFile = new FileSystem.File(finalPath);
  try {
    if (finalFile.exists) finalFile.delete();
    // Already at the target name? (download can land directly on finalPath) —
    // nothing to move.
    if (downloaded.uri.replace(/\/$/, '') !== finalFile.uri.replace(/\/$/, '')) {
      downloaded.move(finalFile);
    }
  } catch (e) {
    try { downloaded.delete(); } catch { /* ignore */ }
    throw new Error(
      `Failed to activate downloaded model: ${e instanceof Error ? e.message : String(e)}`
    );
  }

  if (!finalFile.exists) {
    throw new Error('Model activation failed — file missing after move.');
  }

  // Persist new state.
  await writeState({
    version: manifest.version,
    displayName: manifest.displayName,
    fileName: manifest.file,
    installedAt: new Date().toISOString(),
  });
}

/** Compute SHA-256 of a local file, returning lowercase hex.
 *
 *  Uses the expo-file-system v19+ File API to read as base64, then hashes
 *  with expo-crypto. The `scripts/make-model-manifest.mjs` script computes
 *  SHA-256 over the same base64 string so the hashes match end-to-end.
 */
// Structural type: expo-file-system v19 exposes `File` via two module paths
// whose nominal types don't unify (downloadFileAsync's return vs. `new File`).
// We only need `.base64()`, so accept anything providing it.
async function sha256OfFile(file: { base64(): Promise<string> }): Promise<string> {
  const base64: string = await file.base64();
  return await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, base64, {
    encoding: Crypto.CryptoEncoding.HEX,
  });
}

/** Remove the locally downloaded model and revert to the bundled one. */
export async function resetToBundled(): Promise<void> {
  const state = await readState();
  if (state.fileName) {
    try {
      const f = new FileSystem.File(`${modelsDir()}${state.fileName}`);
      if (f.exists) f.delete();
    } catch { /* ignore */ }
  }
  await writeState(DEFAULT_STATE);
}
