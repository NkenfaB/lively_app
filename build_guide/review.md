<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>CoughScreen - Review &amp; Analyze</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&amp;family=Manrope:wght@500;700&amp;family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .waveform-bar {
            transition: height 0.2s ease;
        }
    </style>
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
    body {
      min-height: max(884px, 100dvh);
    }
  </style>
  </head>
<body class="bg-surface min-h-screen flex flex-col font-body-md text-on-surface selection:bg-primary-fixed-dim">
<!-- TopAppBar -->
<header class="flex justify-between items-center px-5 h-16 w-full bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 sticky top-0 z-50">
<div class="flex items-center gap-3">
<span class="material-symbols-outlined text-blue-900 dark:text-blue-400" data-icon="clinical_notes">clinical_notes</span>
<h1 class="font-inter text-lg font-bold text-blue-900 dark:text-blue-400">CoughScreen</h1>
</div>
<button class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors duration-200">
<span class="material-symbols-outlined text-outline" data-icon="close">close</span>
</button>
</header>
<main class="flex-1 px-container-padding py-lg max-w-md mx-auto w-full flex flex-col gap-lg">
<!-- Header Section -->
<section class="flex flex-col gap-xs">
<h2 class="font-headline-md text-headline-md text-on-surface">Review Recording</h2>
<p class="font-body-md text-body-md text-on-surface-variant">Check your audio quality before proceeding to medical analysis.</p>
</section>
<!-- Audio Player Bento Card -->
<div class="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-md shadow-[0_4px_12px_rgba(0,0,0,0.06)] overflow-hidden">
<div class="h-32 w-full flex items-center justify-center gap-1 px-sm mb-lg">
<!-- Mock Waveform -->
<div class="w-1 h-8 bg-primary/20 rounded-full"></div>
<div class="w-1 h-12 bg-primary/30 rounded-full"></div>
<div class="w-1 h-20 bg-primary/40 rounded-full"></div>
<div class="w-1 h-24 bg-primary/60 rounded-full"></div>
<div class="w-1 h-16 bg-primary/40 rounded-full"></div>
<div class="w-1 h-28 bg-primary rounded-full"></div>
<div class="w-1 h-20 bg-primary/80 rounded-full"></div>
<div class="w-1 h-14 bg-primary/50 rounded-full"></div>
<div class="w-1 h-10 bg-primary/30 rounded-full"></div>
<div class="w-1 h-6 bg-primary/20 rounded-full"></div>
<div class="w-1 h-12 bg-primary/30 rounded-full"></div>
<div class="w-1 h-18 bg-primary/50 rounded-full"></div>
<div class="w-1 h-14 bg-primary/40 rounded-full"></div>
<div class="w-1 h-22 bg-primary/70 rounded-full"></div>
<div class="w-1 h-10 bg-primary/30 rounded-full"></div>
<div class="w-1 h-4 bg-primary/20 rounded-full"></div>
</div>
<!-- Playback Controls -->
<div class="flex flex-col gap-md">
<!-- Seek Bar -->
<div class="relative w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
<div class="absolute left-0 top-0 h-full w-1/3 bg-primary rounded-full"></div>
</div>
<div class="flex justify-between items-center">
<span class="font-label-md text-label-md text-on-surface-variant">0:03</span>
<button class="w-14 h-14 flex items-center justify-center bg-primary text-on-primary rounded-full shadow-lg active:scale-95 transition-transform">
<span class="material-symbols-outlined text-[32px]" data-icon="play_arrow" data-weight="fill">play_arrow</span>
</button>
<span class="font-label-md text-label-md text-on-surface-variant">0:10</span>
</div>
</div>
</div>
<!-- Details Bento Grid -->
<div class="grid grid-cols-2 gap-md">
<div class="bg-surface-container-low p-md rounded-xl flex flex-col gap-xs">
<span class="material-symbols-outlined text-primary text-[20px]" data-icon="mic_external_on">mic_external_on</span>
<p class="font-label-caps text-label-caps text-on-surface-variant uppercase">Quality</p>
<p class="font-headline-sm text-headline-sm text-secondary">High</p>
</div>
<div class="bg-surface-container-low p-md rounded-xl flex flex-col gap-xs">
<span class="material-symbols-outlined text-primary text-[20px]" data-icon="timer">timer</span>
<p class="font-label-caps text-label-caps text-on-surface-variant uppercase">Duration</p>
<p class="font-headline-sm text-headline-sm text-on-surface">10.4s</p>
</div>
<div class="col-span-2 bg-primary-container/10 p-md rounded-xl flex items-start gap-md border border-primary-container/20">
<span class="material-symbols-outlined text-primary-container mt-1" data-icon="info">info</span>
<div>
<p class="font-label-md text-label-md text-on-primary-fixed-variant font-bold">Analysis Details</p>
<p class="font-body-md text-[14px] text-on-surface-variant leading-tight">Analysis takes ~1–3 seconds using our secure offline clinical diagnostic engine.</p>
</div>
</div>
</div>
<!-- Professional Clinical Image Placeholder -->
<div class="relative w-full aspect-video rounded-xl overflow-hidden mt-md">
<img alt="Clinical Visualization" class="w-full h-full object-cover" data-alt="A clean, professional macro shot of a high-resolution tablet displaying abstract medical sound waves and diagnostic pulse data. The lighting is bright and hospital-sterile with soft blue and white tones. The shallow depth of field focuses on the clarity of the digital screen, conveying a sense of advanced healthcare technology and reliable medical data analysis." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBqLI7s-3ggMwWYzyQL5LDEADkOvKGtYI5ezwnUEtK9DMR4apCg_dqPNpukZLmpWC_o4mokPrmrB-BaUxJstbqwUOQaOVQNATrdGsFUVU33-zQ5vqGIe47u8oOQiWQUq58wHo2_Pcs4F2o7IiM7XG9MuQxnEdDuQPho8wf6aEuJWLf7ntb45Qj3E4X-lStRfAET3teALDGO6yY7WvqmQLLeuJqwPLfPOqGnh6S72WbnwZqbKl9i4zDUFbM7osMdg_zo9vzA1sM8j5s"/>
<div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
<div class="absolute bottom-4 left-4 flex items-center gap-2">
<span class="w-2 h-2 rounded-full bg-secondary-fixed animate-pulse"></span>
<span class="text-white font-label-md text-label-md">Diagnostic Engine Ready</span>
</div>
</div>
<!-- Spacer for FAB-like feel -->
<div class="flex-1"></div>
<!-- Action Buttons Section -->
<div class="flex flex-col gap-md pb-xl">
<button class="w-full h-[56px] bg-primary text-on-primary rounded-xl font-headline-sm text-headline-sm flex items-center justify-center gap-2 shadow-md hover:bg-primary-container transition-colors active:scale-[0.98]">
<span class="material-symbols-outlined" data-icon="analytics">analytics</span>
                Analyze offline
            </button>
<button class="w-full h-[56px] border-2 border-outline-variant text-primary rounded-xl font-headline-sm text-headline-sm flex items-center justify-center gap-2 hover:bg-surface-container-low transition-colors active:scale-[0.98]">
<span class="material-symbols-outlined" data-icon="replay">replay</span>
                Re-record
            </button>
<p class="text-center font-label-md text-label-md text-outline">
                Encrypted &amp; Private Analysis
            </p>
</div>
</main>
<!-- Suppressed BottomNavBar as per transactional/task rule -->
<!-- Content prioritizes the focus on analysis workflow -->
</body></html>