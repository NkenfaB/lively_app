# Lively (CoughScreen) – Mobile App (Expo + TypeScript)

Offline-first Expo app for the thesis cough-screening demo.

## Setup

```bash
cd ~/Desktop/THESIS/lively
npm install
```

## Run (development)

```bash
npx expo start --dev-client
```

## Prebuild (native projects)

Creates `android/` and `ios/` folders for native builds:

```bash
npm run prebuild
```

Clean prebuild (regenerates native folders):

```bash
npm run prebuild:clean
```

## Supabase (Sync + Model Updates)

This app is designed to work **offline**, then **sync** when the user signs in.

1) Create a Supabase project
2) Add env vars (create `.env` from `.env.example`):
   - `EXPO_PUBLIC_SUPABASE_URL`
   - `EXPO_PUBLIC_SUPABASE_ANON_KEY`
3) Create a table `screenings` (SQL):

```sql
create table if not exists public.screenings (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at bigint not null,
  label text not null,
  confidence real not null
);

alter table public.screenings enable row level security;

create policy "screenings_select_own"
on public.screenings for select
using (auth.uid() = user_id);

create policy "screenings_upsert_own"
on public.screenings for insert
with check (auth.uid() = user_id);

create policy "screenings_update_own"
on public.screenings for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
```

4) Create a Storage bucket `models` and upload `baseline_cnn.tflite` to:
   - `models/baseline_cnn.tflite`

In the app:
- Settings → **Sign in** to enable sync
- Settings → **Sync now**
- Settings → **Check model update** downloads the latest model to the device

## Screens

- Onboarding/Consent
- Home
- How to record
- Record
- Review & analyze
- Results
- History
- Settings
- About

Design references live in `build_guide/`.
# lively_app
