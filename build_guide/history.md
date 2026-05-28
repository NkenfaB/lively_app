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
          }
        }
      }
    </script>
<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
            vertical-align: middle;
        }
        body {
            background-color: #f9f9fe;
        }
    </style>
<style>
    body {
      min-height: max(884px, 100dvh);
    }
  </style>
  </head>
<body class="bg-surface text-on-surface font-body-md min-h-screen pb-32">
<!-- TopAppBar -->
<header class="bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center px-5 h-16 w-full fixed top-0 z-50">
<div class="flex items-center gap-3">
<span class="material-symbols-outlined text-blue-900 dark:text-blue-400" data-icon="clinical_notes">clinical_notes</span>
<h1 class="font-inter text-lg font-bold text-blue-900 dark:text-blue-400">CoughScreen</h1>
</div>
<button class="text-blue-900 dark:text-blue-400 font-label-md hover:bg-gray-50 dark:hover:bg-slate-800 px-3 py-1.5 rounded-lg transition-colors duration-200">
            Clear all history
        </button>
</header>
<main class="mt-20 px-container-padding max-w-2xl mx-auto">
<!-- Hero Summary Section (Bento Style) -->
<div class="grid grid-cols-1 md:grid-cols-2 gap-md mb-lg">
<div class="bg-white border border-gray-100 p-md rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.06)] flex flex-col justify-between h-32">
<p class="font-label-caps text-outline uppercase">Total Scans</p>
<p class="font-headline-lg text-primary">24</p>
<div class="flex items-center gap-1 text-on-secondary-container bg-secondary-container/20 w-fit px-2 py-0.5 rounded-full text-xs font-bold">
<span class="material-symbols-outlined text-[14px]" data-icon="trending_up">trending_up</span>
<span>12% this month</span>
</div>
</div>
<div class="bg-primary p-md rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.06)] flex flex-col justify-between h-32 text-white">
<p class="font-label-caps text-white/70 uppercase">Health Status</p>
<p class="font-headline-sm">Monitoring Stable</p>
<p class="font-label-md text-white/60">Last updated 2h ago</p>
</div>
</div>
<h2 class="font-headline-sm text-on-surface mb-md">Past Analyses</h2>
<!-- History List (Asymmetric Glass-like Card Pattern) -->
<div class="space-y-md">
<!-- Result Card 1 -->
<div class="bg-white border border-gray-100 p-md rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.06)] flex items-center justify-between group hover:border-primary/20 transition-colors">
<div class="flex items-center gap-md">
<div class="h-12 w-12 rounded-lg bg-secondary-container/20 flex items-center justify-center text-secondary">
<span class="material-symbols-outlined" data-icon="check_circle">check_circle</span>
</div>
<div>
<p class="font-label-md text-on-surface">Oct 24, 10:30 AM</p>
<div class="flex items-center gap-2 mt-1">
<span class="bg-secondary-container/30 text-on-secondary-container px-2 py-0.5 rounded-full text-[12px] font-bold font-label-caps uppercase leading-none">Low Risk</span>
</div>
</div>
</div>
<div class="text-right">
<p class="font-headline-sm text-primary">92%</p>
<p class="font-label-caps text-outline text-[10px] uppercase">Confidence</p>
</div>
</div>
<!-- Result Card 2 -->
<div class="bg-white border border-gray-100 p-md rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.06)] flex items-center justify-between group hover:border-primary/20 transition-colors">
<div class="flex items-center gap-md">
<div class="h-12 w-12 rounded-lg bg-tertiary-fixed/20 flex items-center justify-center text-on-tertiary-container">
<span class="material-symbols-outlined" data-icon="warning">warning</span>
</div>
<div>
<p class="font-label-md text-on-surface">Oct 22, 02:15 PM</p>
<div class="flex items-center gap-2 mt-1">
<span class="bg-tertiary-fixed/30 text-on-tertiary-container px-2 py-0.5 rounded-full text-[12px] font-bold font-label-caps uppercase leading-none">Moderate Risk</span>
</div>
</div>
</div>
<div class="text-right">
<p class="font-headline-sm text-primary">78%</p>
<p class="font-label-caps text-outline text-[10px] uppercase">Confidence</p>
</div>
</div>
<!-- Result Card 3 -->
<div class="bg-white border border-gray-100 p-md rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.06)] flex items-center justify-between group hover:border-primary/20 transition-colors">
<div class="flex items-center gap-md">
<div class="h-12 w-12 rounded-lg bg-secondary-container/20 flex items-center justify-center text-secondary">
<span class="material-symbols-outlined" data-icon="check_circle">check_circle</span>
</div>
<div>
<p class="font-label-md text-on-surface">Oct 19, 09:45 AM</p>
<div class="flex items-center gap-2 mt-1">
<span class="bg-secondary-container/30 text-on-secondary-container px-2 py-0.5 rounded-full text-[12px] font-bold font-label-caps uppercase leading-none">Low Risk</span>
</div>
</div>
</div>
<div class="text-right">
<p class="font-headline-sm text-primary">96%</p>
<p class="font-label-caps text-outline text-[10px] uppercase">Confidence</p>
</div>
</div>
<!-- Illustration for Data Privacy -->
<div class="mt-xl relative rounded-2xl overflow-hidden bg-primary-container h-48 flex items-center px-lg">
<div class="relative z-10 max-w-[60%]">
<h3 class="font-headline-sm text-white mb-2">Privacy Secured</h3>
<p class="text-white/80 font-body-md leading-tight">Local-only storage - your data never leaves this device.</p>
</div>
<img alt="Data Security" class="absolute right-0 top-0 h-full w-full object-cover opacity-30 mix-blend-overlay" data-alt="A clean, medical-grade digital illustration showcasing high-tech security locks and encrypted data streams. The visual style is minimalist and corporate, using a palette of deep navy blue, crisp white, and subtle metallic silver. Soft, ambient lighting creates a professional and trustworthy mood. The composition is professional and modern, emphasizing technological reliability and medical-grade data protection." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBmknwGW4Maqnr2kLPIXZhIsQcKREn0hO1cfrsn4fOh5M2Gxv0BxJ-GyBt1gSwxOc_M_lkoJechn7p2yL5nfq2zSCk_G8rstRQfMnOGXkI2xBOkiVwReqQhDIPjQn-3f4v927u74KmXLdsdW4zSxJlowa2yHuYi43BS3bC8hbPcOAEBAmUQa1dkBDkXhARPRhUCSCUZBt-gZB0XdsydOn_0e1QfAQf0rWSAcB6l39dmTk_Sbxjfwrope6yjTGf6eeHxAk2i9sgaFPk"/>
<div class="absolute inset-0 bg-gradient-to-r from-primary-container via-primary-container/80 to-transparent"></div>
</div>
<!-- Footer Privacy Note -->
<div class="py-lg text-center">
<div class="flex items-center justify-center gap-2 text-outline mb-2">
<span class="material-symbols-outlined text-[18px]" data-icon="shield_lock">shield_lock</span>
<p class="font-label-md">HIPAA Compliant Local Storage</p>
</div>
<p class="text-[12px] text-outline px-lg leading-relaxed">
                    Local-only storage - your data never leaves this device. All audio processing is done locally on your CPU to ensure absolute clinical confidentiality.
                </p>
</div>
</div>
</main>
<!-- BottomNavBar -->
<nav class="fixed bottom-0 left-0 w-full bg-white/95 dark:bg-slate-900/95 flex justify-around items-center px-4 pb-safe h-16 z-50 border-t border-gray-100 dark:border-slate-800 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
<a class="flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 px-4 py-2 rounded-lg transition-transform scale-95 active:scale-90" href="#">
<span class="material-symbols-outlined" data-icon="home">home</span>
<span class="font-inter text-[11px] font-medium tracking-wide">Home</span>
</a>
<a class="flex flex-col items-center justify-center text-blue-900 dark:text-blue-400 font-semibold hover:bg-blue-50/50 dark:hover:bg-blue-900/20 px-4 py-2 rounded-lg transition-transform scale-95 active:scale-90" href="#">
<span class="material-symbols-outlined" data-icon="history" style="font-variation-settings: 'FILL' 1;">history</span>
<span class="font-inter text-[11px] font-medium tracking-wide">History</span>
</a>
<a class="flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 px-4 py-2 rounded-lg transition-transform scale-95 active:scale-90" href="#">
<span class="material-symbols-outlined" data-icon="settings">settings</span>
<span class="font-inter text-[11px] font-medium tracking-wide">Settings</span>
</a>
</nav>
</body></html>