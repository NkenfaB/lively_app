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
        }
        body {
            background-color: #f9f9fe;
            color: #1a1c20;
        }
        .bento-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
        }
    </style>
<style>
    body {
      min-height: max(884px, 100dvh);
    }
  </style>
  </head>
<body class="font-body-md text-on-background">
<!-- TopAppBar -->
<header class="bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center px-5 h-16 w-full sticky top-0 z-50">
<div class="flex items-center gap-3">
<span class="material-symbols-outlined text-blue-900 dark:text-blue-400" data-icon="clinical_notes">clinical_notes</span>
<h1 class="text-xl font-black text-blue-900 dark:text-blue-400 font-inter">CoughScreen</h1>
</div>
<button class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors duration-200 text-gray-400">
<span class="material-symbols-outlined" data-icon="close">close</span>
</button>
</header>
<main class="max-w-xl mx-auto px-container-padding pt-8 pb-32">
<!-- Header Section -->
<section class="mb-8">
<h2 class="font-headline-lg text-headline-lg text-primary mb-2">Recording Guide</h2>
<p class="font-body-lg text-body-lg text-on-surface-variant">Follow these steps to ensure clinical accuracy for your respiratory analysis.</p>
</section>
<!-- Step-by-Step Bento Grid -->
<div class="bento-grid">
<!-- Step 1 -->
<div class="col-span-2 md:col-span-1 bg-white p-6 rounded-xl border border-outline-variant shadow-[0_4px_12px_rgba(0,0,0,0.06)] flex flex-col gap-4">
<div class="w-12 h-12 bg-primary-container/10 rounded-lg flex items-center justify-center">
<span class="material-symbols-outlined text-primary text-2xl" data-icon="volume_off">volume_off</span>
</div>
<div>
<span class="font-label-caps text-label-caps text-primary mb-1 block">STEP 1</span>
<h3 class="font-headline-sm text-headline-sm text-on-surface mb-2">Quiet environment</h3>
<p class="font-label-md text-label-md text-on-surface-variant">Background noise can interfere with the analysis algorithm.</p>
</div>
<div class="mt-2 h-32 rounded-lg bg-surface-container overflow-hidden">
<img class="w-full h-full object-cover opacity-80" data-alt="A minimalist, serene home interior with soft morning light filtering through sheer curtains. The environment looks peaceful and silent, with clean white walls and a single green plant in the corner, evoking a clinical yet calming atmosphere suitable for a medical diagnostic app." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAeMOa7s_4I-kqrdfLWfDngjtbXW2xvZcs5wJz3lLX3P3ayLwuV_1K5mr5H8n114i9uUmFLAU9dBfrxArawWae6J7-o7aQ95aHBZVLMARgcbR7_ttBOzTyHJ4oKI9XBNGwuSIk1VrfITwZ26w0xvEgTgHUOW9ziJbveUwOHhqudagu6tUldYEDmpFbXMdtTsWzWQbY8ZXIxO4rQruqJzIt24lLt2cUBnmeJs2MKcn_hD9TQg5rAaYGjKJGbZsacZEkP1QkLldcmuHI"/>
</div>
</div>
<!-- Step 2 -->
<div class="col-span-2 md:col-span-1 bg-white p-6 rounded-xl border border-outline-variant shadow-[0_4px_12px_rgba(0,0,0,0.06)] flex flex-col gap-4">
<div class="w-12 h-12 bg-primary-container/10 rounded-lg flex items-center justify-center">
<span class="material-symbols-outlined text-primary text-2xl" data-icon="straighten">straighten</span>
</div>
<div>
<span class="font-label-caps text-label-caps text-primary mb-1 block">STEP 2</span>
<h3 class="font-headline-sm text-headline-sm text-on-surface mb-2">Hold phone 20–30 cm</h3>
<p class="font-label-md text-label-md text-on-surface-variant">Position the microphone toward your mouth at chest level.</p>
</div>
<div class="mt-2 h-32 rounded-lg bg-surface-container overflow-hidden">
<img class="w-full h-full object-cover opacity-80" data-alt="A side-profile close-up showing a person holding a modern smartphone at a precise distance from their face. The lighting is professional and soft, highlighting the clean ergonomic design of the device and the focused posture of the user in a high-end medical clinic setting." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDaJ0xgMbLZkJLAOzbKib0cMT_J6XxoTZARHgVJK7LoqRv2YaQiFUeMAoRdJ4B1FFvhz2NkCXipcUlwzFiz6Dw0IIS7zBLFrOvNzg778Dafm2f-rm3P8Iv5Ibhw9wDl-P9fToNTRZPZXIe5x60ozKOeJSOCrF5zpL7kumYHjmefwaVOZkuFasfzRiB9bg5Vp4vRDqtUZNlxrlPcI5mhkZPLo9RSP_JZg0U_tmzxcD8GZPgnIr0pRTWHl6P_RM70vDrqX-McNE6kyJ0"/>
</div>
</div>
<!-- Step 3 -->
<div class="col-span-2 bg-white p-6 rounded-xl border border-outline-variant shadow-[0_4px_12px_rgba(0,0,0,0.06)] flex flex-col md:flex-row gap-6 items-center">
<div class="flex-1">
<div class="w-12 h-12 bg-primary-container/10 rounded-lg flex items-center justify-center mb-4">
<span class="material-symbols-outlined text-primary text-2xl" data-icon="record_voice_over">record_voice_over</span>
</div>
<span class="font-label-caps text-label-caps text-primary mb-1 block">STEP 3</span>
<h3 class="font-headline-sm text-headline-sm text-on-surface mb-2">Cough 2–3 times</h3>
<p class="font-label-md text-label-md text-on-surface-variant">Perform strong, natural coughs. The system will automatically detect the sound waves.</p>
</div>
<div class="w-full md:w-48 h-32 rounded-lg bg-surface-container overflow-hidden">
<img class="w-full h-full object-cover opacity-80" data-alt="Abstract visualization of sound waves and digital audio frequencies in deep blue and white tones. The imagery represents medical diagnostic precision, with clean rhythmic patterns that suggest the capture of respiratory sounds in a modern health monitoring dashboard." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAWJlmqhRmTlYgs5qLTNnbmqu9u2fFNGHYMyrKgZfXSTfTjR6WeRxGi3K2Cg5Mpxuno3gToez152eei8imw3GUs5Qgio7ECPKpxRjhPrBVd_5CeBNYxY8y0qc9OPc5xavEvgdlSqf4RlN6rekTZ_SoC8eZGxt9YGL74-07tu2zeEsbqm1WQff7rn2Iv5xgI4oiUTNwsQvD13g5kUCwoHOaqnnTAjhDmS8numg0EblyycqdM6pa22P_sF0iON80yIpPyYyqfGwTtmx0"/>
</div>
</div>
<!-- Step 4 -->
<div class="col-span-2 bg-white p-6 rounded-xl border border-outline-variant shadow-[0_4px_12px_rgba(0,0,0,0.06)] flex flex-col md:flex-row-reverse gap-6 items-center">
<div class="flex-1">
<div class="w-12 h-12 bg-primary-container/10 rounded-lg flex items-center justify-center mb-4">
<span class="material-symbols-outlined text-primary text-2xl" data-icon="mic_off">mic_off</span>
</div>
<span class="font-label-caps text-label-caps text-primary mb-1 block">STEP 4</span>
<h3 class="font-headline-sm text-headline-sm text-on-surface mb-2">Avoid talking</h3>
<p class="font-label-md text-label-md text-on-surface-variant">Speech patterns can distort the diagnostic results. Maintain silence before and after coughing.</p>
</div>
<div class="w-full md:w-48 h-32 rounded-lg bg-surface-container overflow-hidden">
<img class="w-full h-full object-cover opacity-80" data-alt="A clean, minimalist medical environment with professional lighting. The focus is on a quiet consultation room, emphasizing silence and clinical concentration. The color palette consists of calming blues and sterile whites, conveying trust and reliability." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCOCM8zOuNRg6szaD3iBENXCCw8QjqFaCSMPvY8_duy9HveHYlXiP6jvxxJkEjYX7VIQPxirJP5EF6s3IdyNJscxWSpRzMukx6IucHdpmnkAfkmMc_WQK8AjTVGz9JnkvHDU0dDFYk2JCkKSVOIcUKHwBZ8wuYpP7C2Qxmo4e7ULivibdm5M_4pVAfS2M5ijxtIUyENvTBu0RaKrJSg4WLLPzVAcgIhp98yrcxABL-gZEhYmQbBdxHaEGxGOsBg_LKKY56q2jj1yBs"/>
</div>
</div>
</div>
<!-- Primary Action -->
<div class="mt-12 flex flex-col gap-4">
<button class="w-full h-[56px] bg-primary text-white rounded-full font-headline-sm text-headline-sm shadow-lg hover:bg-primary-container transition-colors duration-200 flex items-center justify-center gap-2">
<span class="material-symbols-outlined" data-icon="mic">mic</span>
                Start recording
            </button>
<p class="text-center font-label-md text-label-md text-on-surface-variant px-6">
                By starting, you agree to allow CoughScreen to access your microphone for analysis.
            </p>
</div>
</main>
<!-- BottomNavBar -->
<nav class="bg-white/95 dark:bg-slate-900/95 fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pb-safe h-16 z-50 shadow-[0_-4px_12px_rgba(0,0,0,0.06)] border-t border-gray-100 dark:border-slate-800">
<a class="flex flex-col items-center justify-center text-blue-900 dark:text-blue-400 font-semibold font-inter text-[11px] font-medium tracking-wide scale-95 active:scale-90 transition-transform" href="#">
<span class="material-symbols-outlined" data-icon="home" style="font-variation-settings: 'FILL' 1;">home</span>
            Home
        </a>
<a class="flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 font-inter text-[11px] font-medium tracking-wide scale-95 active:scale-90 transition-transform hover:bg-blue-50/50 dark:hover:bg-blue-900/20" href="#">
<span class="material-symbols-outlined" data-icon="history">history</span>
            History
        </a>
<a class="flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 font-inter text-[11px] font-medium tracking-wide scale-95 active:scale-90 transition-transform hover:bg-blue-50/50 dark:hover:bg-blue-900/20" href="#">
<span class="material-symbols-outlined" data-icon="settings">settings</span>
            Settings
        </a>
</nav>
</body></html>