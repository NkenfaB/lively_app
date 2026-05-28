#!/usr/bin/env node
/**
 * make-model-manifest.mjs
 *
 * Generates the manifest.json that lives next to the .tflite file in
 * Supabase Storage. The SHA-256 here MUST match what the app computes,
 * which is: SHA-256(base64(fileBytes)). We mirror that exactly.
 *
 * Usage:
 *   node scripts/make-model-manifest.mjs \
 *     --file assets/model/baseline_cnn.tflite \
 *     --version 2 \
 *     --displayName "baseline-2026-05" \
 *     --remoteFile baseline_cnn_v2.tflite \
 *     --notes "Retrained on additional 1.2k coughs"
 *
 * Then upload BOTH:
 *   - manifest.json (the file this script prints)
 *   - <yourModel>.tflite (renamed to whatever --remoteFile says)
 * into the `models` bucket on Supabase Storage.
 */

import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const key = a.slice(2);
      const val = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : 'true';
      args[key] = val;
    }
  }
  return args;
}

const args = parseArgs(process.argv);
const file = args.file;
if (!file) {
  console.error('Missing --file <path-to-tflite>');
  process.exit(1);
}
const version = Number(args.version ?? 1);
if (!Number.isFinite(version) || version < 1) {
  console.error('Missing or invalid --version (positive integer).');
  process.exit(1);
}
const displayName = args.displayName ?? `baseline-v${version}`;
const remoteFile = args.remoteFile ?? `baseline_cnn_v${version}.tflite`;
const notes = args.notes ?? undefined;
const out = args.out;

const buf = readFileSync(resolve(file));
const base64 = buf.toString('base64');
const sha256 = createHash('sha256').update(base64, 'utf8').digest('hex');

const manifest = {
  version,
  displayName,
  file: remoteFile,
  sha256,
  releasedAt: new Date().toISOString(),
  ...(notes ? { notes } : {}),
};

const json = JSON.stringify(manifest, null, 2);
if (out) {
  writeFileSync(resolve(out), json + '\n');
  console.log(`Wrote ${out}`);
} else {
  console.log(json);
}

console.log('\n--- Upload checklist ---');
console.log(`1. Rename your file to: ${remoteFile}`);
console.log(`2. Upload it + the manifest.json above to the 'models' bucket on Supabase.`);
console.log(`3. Make sure the bucket is PUBLIC.`);
