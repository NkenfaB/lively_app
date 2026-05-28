<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0, viewport-fit=cover" name="viewport"/>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&amp;family=Manrope:wght@500;700&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
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
            },
            "fontSize": {
                    "headline-sm": ["20px", {"lineHeight": "28px", "fontWeight": "600"}],
                    "headline-md": ["24px", {"lineHeight": "32px", "letterSpacing": "-0.01em", "fontWeight": "600"}],
                    "headline-lg": ["32px", {"lineHeight": "40px", "letterSpacing": "-0.02em", "fontWeight": "700"}],
                    "label-caps": ["12px", {"lineHeight": "16px", "letterSpacing": "0.05em", "fontWeight": "700"}],
                    "body-md": ["16px", {"lineHeight": "24px", "fontWeight": "400"}],
                    "body-lg": ["18px", {"lineHeight": "28px", "fontWeight": "400"}],
                    "label-md": ["14px", {"lineHeight": "20px", "fontWeight": "500"}]
            }
          },
        },
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
<body class="bg-background text-on-background font-body-md min-h-screen">
<!-- TopAppBar -->
<header class="bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center px-5 h-16 w-full fixed top-0 z-50">
<div class="flex items-center gap-3">
<span class="material-symbols-outlined text-blue-900 dark:text-blue-400" data-icon="clinical_notes">clinical_notes</span>
<h1 class="text-xl font-black text-blue-900 dark:text-blue-400">CoughScreen</h1>
</div>
<div class="flex items-center gap-2 px-3 py-1.5 bg-surface-container-low rounded-full">
<span class="material-symbols-outlined text-blue-900 text-sm" data-icon="shield">shield</span>
<span class="font-label-md text-blue-900 text-[12px]">Offline</span>
</div>
</header>
<main class="pt-20 pb-24 px-container-padding max-w-md mx-auto">
<!-- Status Indicator -->
<div class="flex justify-center mb-lg">
<div class="inline-flex items-center gap-2 px-4 py-1.5 bg-secondary-container/20 rounded-full border border-secondary-container/30">
<span class="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
<span class="font-label-md text-on-secondary-container text-xs">Model loaded / ready</span>
</div>
</div>
<!-- Hero Primary CTA -->
<section class="mb-lg">
<div class="relative overflow-hidden bg-primary rounded-xl p-lg shadow-[0_4px_12px_rgba(0,52,102,0.12)] aspect-square flex flex-col items-center justify-center text-center transition-transform active:scale-[0.98]">
<!-- Decorative background elements -->
<div class="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
<div class="absolute -top-10 -left-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
<div class="absolute -bottom-10 -right-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
</div>
<div class="mb-lg p-xl bg-white/10 rounded-full backdrop-blur-sm">
<span class="material-symbols-outlined text-[64px] text-white" data-icon="mic" style="font-variation-settings: 'FILL' 1;">mic</span>
</div>
<h2 class="font-headline-md text-white mb-xs">Record a cough</h2>
<p class="font-body-md text-white/80 max-w-[240px]">Hold the phone 30cm from your face and cough clearly</p>
</div>
</section>
<!-- Secondary Actions Grid -->
<section class="grid grid-cols-2 gap-md">
<!-- How to record - Bento Large Column -->
<div class="col-span-2 bg-white border border-gray-100 rounded-xl p-md flex items-center gap-md shadow-sm hover:bg-gray-50 transition-colors">
<div class="w-12 h-12 flex items-center justify-center bg-blue-50 text-blue-900 rounded-lg">
<span class="material-symbols-outlined" data-icon="help_outline">help_outline</span>
</div>
<div>
<h3 class="font-headline-sm text-on-surface text-md">How to record</h3>
<p class="text-sm text-outline">Learn the optimal technique</p>
</div>
<span class="material-symbols-outlined ml-auto text-outline" data-icon="chevron_right">chevron_right</span>
</div>
<!-- History -->
<div class="bg-white border border-gray-100 rounded-xl p-md flex flex-col gap-sm shadow-sm hover:bg-gray-50 transition-colors">
<div class="w-10 h-10 flex items-center justify-center bg-surface-container text-primary rounded-lg">
<span class="material-symbols-outlined" data-icon="history">history</span>
</div>
<div>
<h3 class="font-label-md text-on-surface">History</h3>
<p class="text-[12px] text-outline">12 screens saved</p>
</div>
</div>
<!-- About -->
<div class="bg-white border border-gray-100 rounded-xl p-md flex flex-col gap-sm shadow-sm hover:bg-gray-50 transition-colors">
<div class="w-10 h-10 flex items-center justify-center bg-surface-container text-primary rounded-lg">
<span class="material-symbols-outlined" data-icon="info">info</span>
</div>
<div>
<h3 class="font-label-md text-on-surface">About</h3>
<p class="text-[12px] text-outline">v2.4.1 Stable</p>
</div>
</div>
</section>
<!-- Informational Banner -->
<section class="mt-lg">
<div class="rounded-xl overflow-hidden relative h-32 flex items-center px-lg">
<img alt="Clinical Science" class="absolute inset-0 w-full h-full object-cover brightness-75" data-alt="A clean, clinical laboratory setting with advanced medical equipment and a microscope, bathed in soft blue and white lighting. The scene conveys scientific precision and medical-grade professionality, aligning with a corporate healthcare brand aesthetic. High-key lighting emphasizes a sterile, safe environment for diagnostic analysis." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBstWXuncmHVl67fs7zGgSxRYXCq4SPVu5lbiGdlLT0Y4Lv1dbhagFV_wld0B_00bL2xkWT-KyQqSIshhPgSIrYN33wu2CYSaEQrvLs7Z6jF3kxBlN4_yfACW0byz1rlkIA0OL9n74WqeFXbimKEIZFs3FuYFhEisH53uKd6eS73tQmvIvp2cYdLKypaGjObb6rt99kcWVjNRKTYplIIdIksZVcy-aPgSitdy0c_sb_6ZW4pBvFLDdAxA7WDoKOzjJEGlE3ZTKf6Eo"/>
<div class="relative z-10">
<h4 class="font-headline-sm text-white text-sm mb-1">Clinical accuracy</h4>
<p class="text-white/90 text-xs max-w-[200px]">Our AI model is trained on over 50,000 respiratory samples.</p>
</div>
</div>
</section>
</main>
<!-- BottomNavBar -->
<nav class="fixed bottom-0 left-0 w-full bg-white/95 dark:bg-slate-900/95 border-t border-gray-100 dark:border-slate-800 flex justify-around items-center px-4 pb-safe h-16 shadow-[0_-4px_12px_rgba(0,0,0,0.06)] z-50">
<!-- Home (Active) -->
<button class="flex flex-col items-center justify-center text-blue-900 dark:text-blue-400 font-semibold transition-transform scale-95 active:scale-90">
<span class="material-symbols-outlined" data-icon="home" style="font-variation-settings: 'FILL' 1;">home</span>
<span class="font-inter text-[11px] font-medium tracking-wide">Home</span>
</button>
<!-- History -->
<button class="flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-transform scale-95 active:scale-90">
<span class="material-symbols-outlined" data-icon="history">history</span>
<span class="font-inter text-[11px] font-medium tracking-wide">History</span>
</button>
<!-- Settings -->
<button class="flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-transform scale-95 active:scale-90">
<span class="material-symbols-outlined" data-icon="settings">settings</span>
<span class="font-inter text-[11px] font-medium tracking-wide">Settings</span>
</button>
</nav>
</body></html>