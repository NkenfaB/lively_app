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
<body class="bg-background text-on-background font-body-md min-h-screen pb-24">
<!-- TopAppBar -->
<header class="bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center px-5 h-16 w-full fixed top-0 z-50">
<div class="flex items-center gap-3">
<span class="material-symbols-outlined text-blue-900 dark:text-blue-400" data-icon="clinical_notes">clinical_notes</span>
<h1 class="font-inter text-lg font-bold text-blue-900 dark:text-blue-400">CoughScreen</h1>
</div>
<div class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors duration-200">
<span class="material-symbols-outlined text-outline" data-icon="more_vert">more_vert</span>
</div>
</header>
<main class="pt-20 px-container-padding max-w-md mx-auto space-y-6">
<!-- Header Section -->
<section class="py-4">
<h2 class="font-headline-md text-headline-md text-on-surface">Settings</h2>
<p class="font-body-md text-on-surface-variant mt-1">Manage your diagnostic preferences and data.</p>
</section>
<!-- Preference Toggles -->
<section class="space-y-4">
<div class="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant shadow-[0_4px_12px_rgba(0,0,0,0.06)] flex items-center justify-between">
<div class="space-y-1">
<p class="font-label-md text-on-surface">Save history on device</p>
<p class="text-xs text-on-surface-variant">Keep a local log of your screenings.</p>
</div>
<div class="relative inline-flex items-center cursor-pointer">
<div class="w-11 h-6 bg-primary rounded-full"></div>
<div class="absolute left-6 top-1 bg-white w-4 h-4 rounded-full transition-transform"></div>
</div>
</div>
<div class="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant shadow-[0_4px_12px_rgba(0,0,0,0.06)] flex items-center justify-between">
<div class="space-y-1">
<p class="font-label-md text-on-surface">Show confidence details</p>
<p class="text-xs text-on-surface-variant">Display AI probability percentages.</p>
</div>
<div class="relative inline-flex items-center cursor-pointer">
<div class="w-11 h-6 bg-primary rounded-full"></div>
<div class="absolute left-6 top-1 bg-white w-4 h-4 rounded-full transition-transform"></div>
</div>
</div>
</section>
<!-- Model Info Card (Bento Style) -->
<section class="bg-primary text-white rounded-xl p-6 relative overflow-hidden shadow-lg">
<div class="absolute top-0 right-0 p-4 opacity-10">
<span class="material-symbols-outlined text-[80px]" data-icon="memory">memory</span>
</div>
<div class="relative z-10 space-y-6">
<div class="flex items-center gap-2">
<span class="material-symbols-outlined" data-icon="intelligence">network_intelligence</span>
<h3 class="font-headline-sm text-headline-sm">Model Architecture</h3>
</div>
<div class="grid grid-cols-2 gap-4">
<div class="bg-primary-container p-3 rounded-lg border border-white/10">
<p class="font-label-caps text-[10px] uppercase opacity-70 mb-1">Input Shape</p>
<p class="font-headline-sm text-lg">64×256×1</p>
</div>
<div class="bg-primary-container p-3 rounded-lg border border-white/10">
<p class="font-label-caps text-[10px] uppercase opacity-70 mb-1">Sample Rate</p>
<p class="font-headline-sm text-lg">16 kHz</p>
</div>
<div class="col-span-2 bg-primary-container p-3 rounded-lg border border-white/10 flex items-center justify-between">
<div>
<p class="font-label-caps text-[10px] uppercase opacity-70 mb-1">TFLite model size</p>
<p class="font-headline-sm text-lg">2.4 MB</p>
</div>
<span class="material-symbols-outlined text-secondary-fixed" data-icon="verified">verified</span>
</div>
</div>
</div>
</section>
<!-- Hero Graphic (Style Guidance Placeholder) -->
<section class="w-full h-32 rounded-xl overflow-hidden relative">
<img alt="Model Data Visualization" class="w-full h-full object-cover" data-alt="A clean, professional macro shot of a medical research tablet displaying high-contrast data visualizations. The lighting is bright and modern with a dominant clinical blue and white color palette. Subtle bokeh in the background suggests a laboratory or clinic environment, conveying trust and technological precision." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBa3GXRTiuX9hpgnX-cw1AYGMRSHqLeg46pM958_LARDkxb-3Wg-FRRbV2pzgXWjc8L9XlFDS3Si_JASGDJxa-n88cNhe3JjqIoOvKE2siwgDOLFRqJ3GaGR4-mP47hI6HuWDLRsdQ82WheWZcOzTLPk480NEX1QhrjY5CsIdQ6Q6DCa13P7ScuEBMU501bGezTBDSE11iWpQROItIk5FHhgVamaWdaHp7F3BAXH0fnr_jYQVUZUoYvl4hhjUFleUWJ8YDwFzNMrh8"/>
<div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
</section>
<!-- Action Button -->
<section class="pt-4">
<button class="w-full h-14 bg-surface-container-high border border-outline-variant text-primary font-label-md rounded-xl flex items-center justify-center gap-2 hover:bg-surface-container-highest transition-colors active:scale-[0.98]">
<span class="material-symbols-outlined" data-icon="ios_share">ios_share</span>
                Export anonymized logs
            </button>
<p class="text-center text-[11px] text-on-surface-variant mt-3 px-6">
                Your data remains encrypted. Exporting creates a local JSON file excluding all personal identifiers.
            </p>
</section>
</main>
<!-- BottomNavBar -->
<nav class="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pb-safe h-16 bg-white/95 dark:bg-slate-900/95 border-t border-gray-100 dark:border-slate-800 shadow-[0_-4px_12px_rgba(0,0,0,0.06)] z-50">
<div class="flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-transform scale-95 active:scale-90">
<span class="material-symbols-outlined" data-icon="home">home</span>
<span class="font-inter text-[11px] font-medium tracking-wide">Home</span>
</div>
<div class="flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-transform scale-95 active:scale-90">
<span class="material-symbols-outlined" data-icon="history">history</span>
<span class="font-inter text-[11px] font-medium tracking-wide">History</span>
</div>
<!-- Active State for Settings -->
<div class="flex flex-col items-center justify-center text-blue-900 dark:text-blue-400 font-semibold transition-transform scale-95 active:scale-90">
<span class="material-symbols-outlined" data-icon="settings" style="font-variation-settings: 'FILL' 1;">settings</span>
<span class="font-inter text-[11px] font-medium tracking-wide">Settings</span>
</div>
</nav>
</body></html>