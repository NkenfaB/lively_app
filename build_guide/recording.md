<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
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
        },
      }
    }
  </script>
<style>
    .material-symbols-outlined {
      font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
    }
    .waveform-bar {
      transition: height 0.15s ease-in-out;
    }
  </style>
<style>
    body {
      min-height: max(884px, 100dvh);
    }
  </style>
  </head>
<body class="bg-background text-on-background font-body-md min-h-screen flex flex-col">
<!-- TopAppBar -->
<header class="bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center px-5 h-16 w-full fixed top-0 z-50">
<div class="flex items-center gap-3">
<span class="material-symbols-outlined text-blue-900 dark:text-blue-400" data-icon="clinical_notes">clinical_notes</span>
<h1 class="font-inter text-lg font-bold text-blue-900 dark:text-blue-400">CoughScreen</h1>
</div>
<div class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors duration-200">
<span class="material-symbols-outlined text-gray-400" data-icon="info">info</span>
</div>
</header>
<main class="flex-grow pt-16 pb-20 px-container-padding flex flex-col items-center justify-center max-w-md mx-auto w-full">
<!-- Recording State Indicator -->
<div class="mb-lg text-center">
<div class="inline-flex items-center gap-2 bg-error-container text-on-error-container px-3 py-1 rounded-full mb-md animate-pulse">
<span class="w-2 h-2 rounded-full bg-error"></span>
<span class="font-label-caps text-label-caps uppercase tracking-widest">Recording</span>
</div>
<div class="font-headline-lg text-headline-lg text-primary tabular-nums">00:08</div>
</div>
<!-- Waveform Visualization Placeholder -->
<div class="w-full h-48 bg-surface-container-low rounded-xl mb-xl flex items-center justify-center px-lg overflow-hidden relative">
<div class="flex items-center gap-1 h-32 w-full justify-center">
<!-- Mock bars for waveform -->
<div class="w-1 bg-primary/20 rounded-full h-8"></div>
<div class="w-1 bg-primary/30 rounded-full h-12"></div>
<div class="w-1 bg-primary/40 rounded-full h-24"></div>
<div class="w-1 bg-primary/60 rounded-full h-32"></div>
<div class="w-1 bg-primary rounded-full h-20"></div>
<div class="w-1 bg-primary/80 rounded-full h-28"></div>
<div class="w-1 bg-primary/40 rounded-full h-16"></div>
<div class="w-1 bg-primary/60 rounded-full h-24"></div>
<div class="w-1 bg-primary rounded-full h-32"></div>
<div class="w-1 bg-primary/50 rounded-full h-12"></div>
<div class="w-1 bg-primary/20 rounded-full h-8"></div>
<div class="w-1 bg-primary/30 rounded-full h-16"></div>
<div class="w-1 bg-primary/70 rounded-full h-28"></div>
<div class="w-1 bg-primary rounded-full h-20"></div>
<div class="w-1 bg-primary/40 rounded-full h-12"></div>
</div>
<!-- Subtle scanline gradient -->
<div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none"></div>
</div>
<!-- Quality Checks Area -->
<div class="w-full bg-white border border-outline-variant rounded-xl p-md mb-xl shadow-sm">
<h2 class="font-label-caps text-label-caps text-outline uppercase mb-md">Real-time Quality</h2>
<div class="space-y-sm">
<div class="flex items-center justify-between p-sm rounded-lg bg-surface-container-low text-on-surface-variant opacity-50">
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-[20px]" data-icon="volume_off">volume_off</span>
<span class="font-label-md text-label-md">Too quiet</span>
</div>
<span class="material-symbols-outlined text-[18px]" data-icon="close">close</span>
</div>
<div class="flex items-center justify-between p-sm rounded-lg bg-surface-container-low text-on-surface-variant opacity-50">
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-[20px]" data-icon="nest_eco_leaf">nest_eco_leaf</span>
<span class="font-label-md text-label-md">Background noise high</span>
</div>
<span class="material-symbols-outlined text-[18px]" data-icon="close">close</span>
</div>
<div class="flex items-center justify-between p-sm rounded-lg bg-secondary-container text-on-secondary-container ring-1 ring-secondary/20">
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-[20px]" data-icon="check_circle">check_circle</span>
<span class="font-label-md text-label-md font-bold">Perfect</span>
</div>
<span class="material-symbols-outlined text-[18px]" data-icon="done_all">done_all</span>
</div>
</div>
</div>
<!-- Big Record Button (Stop State) -->
<div class="mb-xl">
<button class="w-24 h-24 rounded-full bg-error flex items-center justify-center shadow-lg active:scale-95 transition-transform group relative">
<div class="absolute inset-0 rounded-full bg-error animate-ping opacity-20"></div>
<div class="w-8 h-8 bg-white rounded-sm"></div>
</button>
</div>
<!-- Hint Text -->
<p class="text-on-surface-variant text-center font-body-md max-w-[240px] mb-xl italic">
      "Cough naturally 2–3 times"
    </p>
<!-- Actions -->
<div class="w-full flex flex-col gap-md">
<button class="w-full h-[56px] bg-primary text-on-primary rounded-xl font-headline-sm text-headline-sm shadow-md flex items-center justify-center gap-2">
<span class="material-symbols-outlined" data-icon="analytics">analytics</span>
        Stop and analyze
      </button>
<button class="w-full h-[48px] bg-transparent border border-outline text-outline rounded-xl font-label-md text-label-md flex items-center justify-center hover:bg-surface-container transition-colors">
        Cancel
      </button>
</div>
</main>
<!-- BottomNavBar (Suppressed for focused journey as per rule, but if needed for context...) -->
<!-- We suppress it here as this is a focused task/recording screen -->
<!-- Illustration for context (Bottom decorative element) -->
<div class="fixed bottom-0 left-0 w-full opacity-10 pointer-events-none">
<div class="h-32 bg-gradient-to-t from-primary/20 to-transparent"></div>
</div>
</body></html>