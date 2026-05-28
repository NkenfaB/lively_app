<!DOCTYPE html>

<html class="dark" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>CoughScreen - Home</title>
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
            display: inline-block;
            line-height: 1;
            text-transform: none;
            letter-spacing: normal;
            word-wrap: normal;
            white-space: nowrap;
            direction: ltr;
        }
        body {
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }
    </style>
<style>
    body {
      min-height: max(884px, 100dvh);
    }
  </style>
  </head>
<body class="bg-slate-950 text-white font-body-md min-h-screen flex flex-col">
<!-- TopAppBar -->
<header class="bg-slate-900 border-b border-slate-800 fixed top-0 w-full z-50 flex justify-between items-center px-5 h-16">
<div class="flex items-center gap-3">
<span class="material-symbols-outlined text-blue-400" data-icon="clinical_notes">clinical_notes</span>
<span class="font-inter text-xl font-black text-blue-400">CoughScreen</span>
</div>
<div class="flex items-center gap-4">
<button class="material-symbols-outlined p-2 rounded-full hover:bg-slate-800 transition-colors duration-200" data-icon="notifications">notifications</button>
<div class="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center border border-blue-400/30 overflow-hidden">
<img class="w-full h-full object-cover" data-alt="A professional medical headshot of a person wearing scrubs in a brightly lit modern clinic environment. The lighting is crisp and cool, maintaining the clinical medical-grade professionalism of the app. The composition is centered, highlighting reliability and expert care with soft ambient shadows." src="https://lh3.googleusercontent.com/aida-public/AB6AXuC4n_niNmEZXYY_1YP1CE5K-pFLxL1pWVAvCkM2zHLdGDJNSxkfpN86lToQdMm14gIw6Y8x_XN7lE6VHY06hE4VK99IYMYJEfIlZOXPwNPl482zcyxPHEx7gzYo5-xfCwunh7zlWHNb1LCGiCWzdxOL3k0qE-_40-vqn9BIOuCxj-cSd6YZV7ykASIx6dWzQ41NjJqJkfGi-s-RRDwIdvuVbyfUsj76wHATvklxh8pmvJu_B64jkm86VyhMvyinme5jgLbd0KG3jJI"/>
</div>
</div>
</header>
<!-- Main Content -->
<main class="flex-1 mt-16 mb-20 px-container-padding py-lg space-y-md">
<!-- Hero: Primary CTA -->
<section class="relative h-48 rounded-xl overflow-hidden shadow-xl">
<div class="absolute inset-0 bg-gradient-to-br from-primary-container via-primary to-slate-900"></div>
<div class="absolute inset-0 opacity-40 mix-blend-overlay">
<img class="w-full h-full object-cover" data-alt="A macro shot of sound waves on a digital analyzer interface. The visualization is rendered in glowing deep blues and cyan against a charcoal background, reflecting the clinical precision of cough analysis. The mood is high-tech and reassuring, with soft glows and sharp digital lines." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBJZA15T-2ap_rSK4DNd1COtzpxeTzwuJHtwdGuZXwKfCTZ8AA4SGDinG1NbbvCUyZmMZgE48xC14hq7eS1KI06Dxla5NS-uePUblQWX3FCNvSiF3yxkyKfVP8YuinDf6oyu5-_zMtjZZCr6osft9Hmaij5eRubjuFozHegSg0-zODiXGDMruX7Ofmyihk0ljol6j7CI1Y9je3VGJZe-3FBQ_C-87vrAPQGa83Wa6wO3qjWkEXGDPGeuqMSNIR3N7MCO9MEUMSJK1o"/>
</div>
<div class="relative z-10 h-full p-lg flex flex-col justify-center">
<h1 class="font-headline-md text-white mb-xs">Ready for analysis</h1>
<p class="font-body-md text-blue-100/80 mb-md max-w-[200px]">Record a 5-second sample for clinical screening.</p>
<button class="bg-blue-400 text-slate-900 font-headline-sm px-lg py-sm rounded-full w-max flex items-center gap-2 shadow-lg active:scale-95 transition-transform">
<span class="material-symbols-outlined" data-icon="mic" data-weight="fill" style="font-variation-settings: 'FILL' 1;">mic</span>
                    Record
                </button>
</div>
</section>
<!-- Bento Grid: Health Metrics -->
<div class="grid grid-cols-2 gap-md">
<!-- Risk Status Card -->
<div class="col-span-2 bg-slate-900 p-md rounded-xl border border-slate-800 shadow-sm flex items-center justify-between">
<div class="flex items-center gap-md">
<div class="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center">
<span class="material-symbols-outlined text-secondary-fixed" data-icon="shield_check">shield</span>
</div>
<div>
<span class="font-label-caps text-secondary-fixed block">CURRENT RISK</span>
<span class="font-headline-sm text-white">Low Severity</span>
</div>
</div>
<span class="material-symbols-outlined text-slate-500" data-icon="chevron_right">chevron_right</span>
</div>
<!-- Recent Scan Card (Asymmetric) -->
<div class="col-span-1 bg-slate-900 p-md rounded-xl border border-slate-800 flex flex-col justify-between aspect-square">
<span class="material-symbols-outlined text-blue-400 text-3xl" data-icon="history">history</span>
<div>
<span class="font-label-caps text-slate-500 block">LAST SCAN</span>
<span class="font-headline-sm text-white">2h ago</span>
<p class="font-label-md text-slate-400 mt-base">Non-productive</p>
</div>
</div>
<!-- Frequency Card -->
<div class="col-span-1 bg-slate-900 p-md rounded-xl border border-slate-800 flex flex-col justify-between aspect-square">
<span class="material-symbols-outlined text-on-tertiary-container text-3xl" data-icon="monitoring">monitoring</span>
<div>
<span class="font-label-caps text-slate-500 block">FREQUENCY</span>
<span class="font-headline-sm text-white">12 / day</span>
<div class="h-1 w-full bg-slate-800 rounded-full mt-sm overflow-hidden">
<div class="h-full bg-on-tertiary-container w-1/3"></div>
</div>
</div>
</div>
<!-- Insights Card (Bento Style) -->
<div class="col-span-2 bg-slate-900 p-lg rounded-xl border border-slate-800 relative overflow-hidden group">
<div class="absolute -right-4 -top-4 w-32 h-32 bg-blue-900/20 blur-3xl rounded-full"></div>
<div class="relative z-10">
<div class="flex items-center gap-sm mb-sm">
<span class="material-symbols-outlined text-blue-400" data-icon="lightbulb">lightbulb</span>
<h2 class="font-headline-sm text-white">Health Insight</h2>
</div>
<p class="font-body-md text-slate-300 leading-relaxed">
                        Your cough patterns show a 15% decrease in nighttime frequency over the last 48 hours. This indicates positive recovery.
                    </p>
<button class="mt-md text-blue-400 font-label-md flex items-center gap-xs">
                        View clinical trend
                        <span class="material-symbols-outlined text-sm" data-icon="trending_up">trending_up</span>
</button>
</div>
</div>
<!-- Environment Card -->
<div class="col-span-2 flex gap-md overflow-x-auto pb-xs no-scrollbar">
<div class="flex-shrink-0 bg-slate-900/50 backdrop-blur-sm p-md rounded-xl border border-slate-800 w-40">
<span class="material-symbols-outlined text-cyan-400 mb-xs" data-icon="air">air</span>
<span class="font-label-caps text-slate-500 block">AIR QUALITY</span>
<span class="font-body-lg font-bold text-white">42 - Good</span>
</div>
<div class="flex-shrink-0 bg-slate-900/50 backdrop-blur-sm p-md rounded-xl border border-slate-800 w-40">
<span class="material-symbols-outlined text-orange-400 mb-xs" data-icon="thermostat">thermostat</span>
<span class="font-label-caps text-slate-500 block">HUMIDITY</span>
<span class="font-body-lg font-bold text-white">45% - Optimal</span>
</div>
<div class="flex-shrink-0 bg-slate-900/50 backdrop-blur-sm p-md rounded-xl border border-slate-800 w-40">
<span class="material-symbols-outlined text-purple-400 mb-xs" data-icon="pill">pill</span>
<span class="font-label-caps text-slate-500 block">MEDICATION</span>
<span class="font-body-lg font-bold text-white">8:00 AM</span>
</div>
</div>
</div>
<!-- Secondary Actions -->
<div class="pt-sm space-y-sm">
<button class="w-full bg-slate-800/50 hover:bg-slate-800 border border-slate-700 py-md rounded-xl flex items-center justify-between px-md transition-all">
<div class="flex items-center gap-md">
<span class="material-symbols-outlined text-slate-400" data-icon="medical_services">medical_services</span>
<span class="font-body-md text-white">Consult a Professional</span>
</div>
<span class="material-symbols-outlined text-slate-500" data-icon="open_in_new">open_in_new</span>
</button>
</div>
</main>
<!-- BottomNavBar -->
<nav class="fixed bottom-0 left-0 w-full bg-slate-900/95 backdrop-blur-md flex justify-around items-center px-4 pb-safe h-16 border-t border-slate-800 shadow-[0_-4px_12px_rgba(0,0,0,0.5)] z-50">
<a class="flex flex-col items-center justify-center text-blue-400 font-semibold scale-95 active:scale-90 transition-transform" href="#">
<span class="material-symbols-outlined" data-icon="home" data-weight="fill" style="font-variation-settings: 'FILL' 1;">home</span>
<span class="font-inter text-[11px] font-medium tracking-wide">Home</span>
</a>
<a class="flex flex-col items-center justify-center text-gray-500 hover:bg-blue-900/20 scale-95 active:scale-90 transition-transform px-4 rounded-lg py-1" href="#">
<span class="material-symbols-outlined" data-icon="history">history</span>
<span class="font-inter text-[11px] font-medium tracking-wide">History</span>
</a>
<a class="flex flex-col items-center justify-center text-gray-500 hover:bg-blue-900/20 scale-95 active:scale-90 transition-transform px-4 rounded-lg py-1" href="#">
<span class="material-symbols-outlined" data-icon="settings">settings</span>
<span class="font-inter text-[11px] font-medium tracking-wide">Settings</span>
</a>
</nav>
</body></html>