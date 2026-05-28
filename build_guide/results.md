<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" name="viewport"/>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&amp;family=Manrope:wght@500;700&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            "colors": {
                    "outline": "#737781",
                    "on-surface": "#1a1c20",
                    "primary": "#003466",
                    "primary-container": "#1a4b84",
                    "tertiary": "#433100",
                    "surface-container-high": "#e8e8ed",
                    "on-background": "#1a1c20",
                    "tertiary-fixed": "#ffdf9e",
                    "on-tertiary-fixed-variant": "#5b4300",
                    "surface-container": "#ededf3",
                    "on-tertiary-container": "#ebb100",
                    "primary-fixed-dim": "#a6c8ff",
                    "inverse-primary": "#a6c8ff",
                    "inverse-on-surface": "#f0f0f6",
                    "surface-container-highest": "#e2e2e7",
                    "on-secondary-container": "#007327",
                    "surface-tint": "#335f99",
                    "tertiary-fixed-dim": "#fabd00",
                    "error-container": "#ffdad6",
                    "on-tertiary-fixed": "#261a00",
                    "on-secondary": "#ffffff",
                    "surface-variant": "#e2e2e7",
                    "surface-dim": "#d9d9df",
                    "secondary-container": "#80f98b",
                    "on-primary-container": "#93bcfc",
                    "on-secondary-fixed": "#002106",
                    "surface": "#f9f9fe",
                    "on-error": "#ffffff",
                    "primary-fixed": "#d5e3ff",
                    "secondary": "#006e25",
                    "surface-container-lowest": "#ffffff",
                    "on-primary-fixed-variant": "#144780",
                    "on-error-container": "#93000a",
                    "on-primary-fixed": "#001c3b",
                    "background": "#f9f9fe",
                    "tertiary-container": "#5f4600",
                    "outline-variant": "#c3c6d1",
                    "surface-container-low": "#f3f3f9",
                    "on-surface-variant": "#424750",
                    "inverse-surface": "#2f3035",
                    "secondary-fixed": "#83fc8e",
                    "on-secondary-fixed-variant": "#00531a",
                    "error": "#ba1a1a",
                    "on-primary": "#ffffff",
                    "surface-bright": "#f9f9fe",
                    "on-tertiary": "#ffffff",
                    "secondary-fixed-dim": "#66df75"
            },
            "borderRadius": {
                    "DEFAULT": "0.25rem",
                    "lg": "0.5rem",
                    "xl": "0.75rem",
                    "full": "9999px"
            },
            "spacing": {
                    "xs": "8px",
                    "container-padding": "20px",
                    "md": "16px",
                    "sm": "12px",
                    "base": "4px",
                    "touch-target": "44px",
                    "lg": "24px",
                    "xl": "32px"
            },
            "fontFamily": {
                    "headline-sm": ["Inter"],
                    "headline-md": ["Inter"],
                    "headline-lg": ["Inter"],
                    "label-caps": ["Manrope"],
                    "body-md": ["Inter"],
                    "body-lg": ["Inter"],
                    "label-md": ["Manrope"]
            }
          }
        }
      }
    </script>
<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        body {
            -webkit-tap-highlight-color: transparent;
        }
    </style>
<style>
    body {
      min-height: max(884px, 100dvh);
    }
  </style>
  </head>
<body class="bg-surface text-on-surface min-h-screen pb-24">
<!-- TopAppBar Section -->
<header class="flex justify-between items-center px-5 h-16 w-full bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 fixed top-0 z-50">
<div class="flex items-center gap-3">
<span class="material-symbols-outlined text-blue-900 dark:text-blue-400" data-icon="clinical_notes">clinical_notes</span>
<h1 class="font-inter text-lg font-bold text-blue-900 dark:text-blue-400">CoughScreen</h1>
</div>
<div class="flex items-center gap-4">
<button class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-50 transition-colors">
<span class="material-symbols-outlined text-outline" data-icon="share">share</span>
</button>
</div>
</header>
<main class="mt-16 px-container-padding pt-lg space-y-md">
<!-- Screen Title -->
<header class="mb-lg">
<h2 class="font-headline-lg text-headline-lg text-on-surface">Screening Result</h2>
<p class="font-body-md text-body-md text-on-surface-variant mt-1">Analysis complete based on your recording</p>
</header>
<!-- Result Card: High Likelihood -->
<div class="bg-white rounded-xl border border-error/20 p-lg shadow-[0_4px_12px_rgba(186,26,26,0.08)] overflow-hidden relative">
<div class="absolute top-0 right-0 p-4">
<div class="bg-error-container text-on-error-container font-label-caps text-label-caps px-3 py-1 rounded-full">
                    ACTION REQUIRED
                </div>
</div>
<div class="flex items-start gap-4 mb-lg">
<div class="bg-error-container w-12 h-12 rounded-full flex items-center justify-center">
<span class="material-symbols-outlined text-error" data-icon="warning" style="font-variation-settings: 'FILL' 1;">warning</span>
</div>
<div>
<p class="font-label-caps text-label-caps text-error mb-1">COVID likelihood: High</p>
<p class="font-headline-md text-headline-md text-error">Potential COVID-19 detected</p>
</div>
</div>
<!-- Confidence Bar Section -->
<div class="space-y-sm">
<div class="flex justify-between items-end">
<span class="font-label-md text-label-md text-on-surface-variant">Confidence Score</span>
<span class="font-headline-md text-headline-md text-error">85%</span>
</div>
<div class="h-3 w-full bg-surface-container-highest rounded-full overflow-hidden">
<div class="h-full bg-error rounded-full" style="width: 85%"></div>
</div>
<p class="font-body-md text-body-md text-on-surface-variant text-sm">Our AI model has high certainty regarding this match.</p>
</div>
</div>
<!-- Guidance Section -->
<div class="bg-white rounded-xl border border-outline-variant p-md">
<div class="flex items-center gap-3 mb-sm">
<span class="material-symbols-outlined text-primary" data-icon="medical_services">medical_services</span>
<h3 class="font-headline-sm text-headline-sm">Next Steps</h3>
</div>
<p class="font-body-md text-body-md text-on-surface-variant mb-md">
                Consider confirmatory testing / seek medical advice. Avoid contact with others while waiting for clinical results.
            </p>
<div class="space-y-base">
<div class="flex items-center gap-3 p-3 rounded-lg bg-surface-container-low border border-outline-variant/30">
<span class="material-symbols-outlined text-on-surface-variant" data-icon="biotech">biotech</span>
<span class="font-label-md text-label-md">Schedule a PCR or Rapid Test</span>
</div>
<div class="flex items-center gap-3 p-3 rounded-lg bg-surface-container-low border border-outline-variant/30">
<span class="material-symbols-outlined text-on-surface-variant" data-icon="home_health">home_health</span>
<span class="font-label-md text-label-md">Monitor oxygen levels</span>
</div>
</div>
</div>
<!-- Model Output Probabilities (Expandable) -->
<details class="group bg-white rounded-xl border border-outline-variant overflow-hidden">
<summary class="list-none flex justify-between items-center p-md cursor-pointer hover:bg-surface-container-low transition-colors">
<div class="flex items-center gap-3">
<span class="material-symbols-outlined text-on-surface-variant" data-icon="analytics">analytics</span>
<span class="font-label-md text-label-md">Model output probabilities</span>
</div>
<span class="material-symbols-outlined text-outline group-open:rotate-180 transition-transform" data-icon="expand_more">expand_more</span>
</summary>
<div class="px-md pb-md space-y-md border-t border-outline-variant/30 pt-md">
<div class="space-y-base">
<div class="flex justify-between text-sm font-label-md">
<span>COVID-19 Signature</span>
<span class="text-error">0.852</span>
</div>
<div class="h-1.5 w-full bg-surface-container-high rounded-full overflow-hidden">
<div class="h-full bg-error" style="width: 85.2%"></div>
</div>
</div>
<div class="space-y-base">
<div class="flex justify-between text-sm font-label-md">
<span>Bronchitis / Other Respiratory</span>
<span class="text-on-surface-variant">0.114</span>
</div>
<div class="h-1.5 w-full bg-surface-container-high rounded-full overflow-hidden">
<div class="h-full bg-on-surface-variant" style="width: 11.4%"></div>
</div>
</div>
<div class="space-y-base">
<div class="flex justify-between text-sm font-label-md">
<span>No Respiratory Anomaly</span>
<span class="text-on-surface-variant">0.034</span>
</div>
<div class="h-1.5 w-full bg-surface-container-high rounded-full overflow-hidden">
<div class="h-full bg-on-surface-variant" style="width: 3.4%"></div>
</div>
</div>
</div>
</details>
<!-- Primary Action Buttons -->
<div class="flex flex-col gap-sm py-lg">
<button class="bg-primary text-white h-14 rounded-xl font-headline-sm flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] transition-transform">
<span class="material-symbols-outlined" data-icon="history">history</span>
                Save to history
            </button>
<button class="bg-surface-container-high text-primary h-14 rounded-xl font-headline-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-transform">
<span class="material-symbols-outlined" data-icon="mic">mic</span>
                New recording
            </button>
</div>
<!-- Disclaimer Banner -->
<footer class="bg-surface-container-highest rounded-lg p-md text-center border border-outline-variant/30">
<p class="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-widest mb-1">Legal Notice</p>
<p class="font-label-md text-label-md text-on-surface-variant font-bold">Not a diagnosis</p>
<p class="font-body-md text-[13px] leading-relaxed text-on-surface-variant/80 mt-1">
                This screening tool is for informational purposes only. It is not a clinical diagnostic device. Consult a physician for all medical decisions.
            </p>
</footer>
</main>
<!-- BottomNavBar Section -->
<nav class="fixed bottom-0 left-0 w-full bg-white/95 dark:bg-slate-900/95 flex justify-around items-center px-4 pb-safe h-16 border-t border-gray-100 dark:border-slate-800 shadow-[0_-4px_12px_rgba(0,0,0,0.06)] z-50">
<a class="flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all scale-95 active:scale-90" href="#">
<span class="material-symbols-outlined" data-icon="home">home</span>
<span class="font-inter text-[11px] font-medium tracking-wide">Home</span>
</a>
<a class="flex flex-col items-center justify-center text-blue-900 dark:text-blue-400 font-semibold hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all scale-95 active:scale-90" href="#">
<span class="material-symbols-outlined" data-icon="history" style="font-variation-settings: 'FILL' 1;">history</span>
<span class="font-inter text-[11px] font-medium tracking-wide">History</span>
</a>
<a class="flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all scale-95 active:scale-90" href="#">
<span class="material-symbols-outlined" data-icon="settings">settings</span>
<span class="font-inter text-[11px] font-medium tracking-wide">Settings</span>
</a>
</nav>
</body></html>