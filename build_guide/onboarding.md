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
          },
        },
      }
    </script>
<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
            vertical-align: middle;
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
<body class="bg-background text-on-background font-body-md antialiased min-h-screen flex flex-col">
<!-- Top Navigation Bar -->
<header class="bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center px-5 h-16 w-full docked full-width top-0 z-50">
<div class="flex items-center gap-3">
<span class="material-symbols-outlined text-blue-900 dark:text-blue-400" data-icon="clinical_notes">clinical_notes</span>
<h1 class="text-xl font-black text-blue-900 dark:text-blue-400 font-inter">CoughScreen</h1>
</div>
<div class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors duration-200 cursor-pointer">
<span class="material-symbols-outlined text-gray-400" data-icon="help_outline">help_outline</span>
</div>
</header>
<!-- Main Content: Onboarding Canvas -->
<main class="flex-grow flex flex-col px-container-padding pt-8 pb-32 max-w-lg mx-auto w-full">
<!-- Hero Illustration / Visual Context -->
<div class="mb-8 rounded-xl overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.06)] bg-white border border-gray-100 aspect-video relative">
<img alt="Medical Professional" class="w-full h-full object-cover opacity-90" data-alt="A clean, high-key medical professional workspace with a sleek stethoscope resting on a white clinical desk. The lighting is bright and airy, reflecting a modern healthcare environment with soft blue and white tones. The overall aesthetic is authoritative and trustworthy, conveying medical-grade precision and digital health innovation in a professional laboratory setting." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAbE-hU9UclnHLh61nJW05uQ0jKKkzqrQwrPQA6BAVC-gsxXXGsAUiLc1MAKBFf_IesG-yHpxuED53I9ZhiQBpC6v-KQFHG1Qs-FY1Wy1CxBYC2rum3FGFGZTm3ynPd2ZcgfM5phs_ohk5UwhtyXlVJ6rH0WLyV98hqGQ9Kmd7l2rg1DK9g7byvKPLYU8J2iznyqD1shYDBV4K7n8wH2JVVdOPHSWWbWeJHXVEHbzaVJCiUk_5wJemiLz0HZfRTdMWs-9q1vwEBwI8"/>
<div class="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>
</div>
<!-- Title and Description -->
<div class="mb-8">
<h2 class="font-headline-lg text-headline-lg text-primary mb-3">Cough Screening (Demo)</h2>
<p class="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                This tool provides preliminary screening support, not a medical diagnosis.
            </p>
</div>
<!-- Bento-style Medical Points -->
<div class="grid grid-cols-1 gap-md mb-8">
<!-- Feature 1 -->
<div class="flex items-start gap-md p-md bg-white border border-outline-variant rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.04)]">
<div class="bg-primary-fixed w-11 h-11 flex items-center justify-center rounded-lg flex-shrink-0">
<span class="material-symbols-outlined text-primary" data-icon="signal_wifi_off">signal_wifi_off</span>
</div>
<div>
<h3 class="font-headline-sm text-headline-sm text-on-surface mb-1">Works offline</h3>
<p class="text-on-surface-variant text-label-md font-label-md">Perform screenings anywhere without requiring an active internet connection.</p>
</div>
</div>
<!-- Feature 2 -->
<div class="flex items-start gap-md p-md bg-white border border-outline-variant rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.04)]">
<div class="bg-secondary-container w-11 h-11 flex items-center justify-center rounded-lg flex-shrink-0">
<span class="material-symbols-outlined text-on-secondary-container" data-icon="memory">memory</span>
</div>
<div>
<h3 class="font-headline-sm text-headline-sm text-on-surface mb-1">Audio processed on device</h3>
<p class="text-on-surface-variant text-label-md font-label-md">All acoustic analysis happens instantly within your phone's secure hardware.</p>
</div>
</div>
<!-- Feature 3 -->
<div class="flex items-start gap-md p-md bg-white border border-outline-variant rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.04)]">
<div class="bg-tertiary-fixed w-11 h-11 flex items-center justify-center rounded-lg flex-shrink-0">
<span class="material-symbols-outlined text-tertiary" data-icon="cloud_off">cloud_off</span>
</div>
<div>
<h3 class="font-headline-sm text-headline-sm text-on-surface mb-1">No data uploaded</h3>
<p class="text-on-surface-variant text-label-md font-label-md">Your audio recordings never leave your device, ensuring total patient privacy.</p>
</div>
</div>
</div>
<!-- Consent Section -->
<div class="mt-auto space-y-lg">
<label class="flex items-start gap-md cursor-pointer group">
<div class="relative flex items-center pt-1">
<input class="peer h-6 w-6 rounded border-outline-variant text-primary focus:ring-primary focus:ring-offset-2 transition-all cursor-pointer" type="checkbox"/>
</div>
<span class="text-on-surface-variant font-body-md select-none group-active:text-primary transition-colors">
                    I understand this is not a diagnosis
                </span>
</label>
<div class="flex flex-col gap-sm">
<button class="w-full h-14 bg-primary text-on-primary font-headline-sm rounded-xl shadow-md active:scale-[0.98] transition-transform flex items-center justify-center gap-2">
                    Continue
                    <span class="material-symbols-outlined" data-icon="arrow_forward">arrow_forward</span>
</button>
<a class="w-full py-3 text-center text-primary font-label-md underline underline-offset-4 hover:text-primary-container transition-colors" href="#">
                    Privacy details
                </a>
</div>
</div>
</main>
<!-- Bottom Navigation Bar (Hidden for Onboarding focus as per Shell Visibility Rule) -->
<!-- The navigation shell is suppressed as this is a linear onboarding screen -->
</body></html>