<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&amp;family=Manrope:wght@500;700&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<style>
    .material-symbols-outlined {
      font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
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
    body {
      min-height: max(884px, 100dvh);
    }
  </style>
  </head>
<body class="bg-background text-on-background min-h-screen pb-32">
<!-- TopAppBar -->
<header class="bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center px-5 h-16 w-full sticky top-0 z-50">
<div class="flex items-center gap-3">
<span class="material-symbols-outlined text-blue-900 dark:text-blue-400" data-icon="clinical_notes">clinical_notes</span>
<h1 class="text-xl font-black text-blue-900 dark:text-blue-400 font-inter">CoughScreen</h1>
</div>
<div class="flex items-center gap-4">
<button class="hover:bg-gray-50 dark:hover:bg-slate-800 p-2 rounded-full transition-colors duration-200">
<span class="material-symbols-outlined text-gray-400" data-icon="info">info</span>
</button>
</div>
</header>
<main class="max-w-md mx-auto px-container-padding pt-8 space-y-6">
<!-- Hero Project Section -->
<section class="relative overflow-hidden rounded-xl bg-primary h-48 flex flex-col justify-end p-6 text-on-primary">
<div class="absolute inset-0 opacity-20">
<img class="w-full h-full object-cover" data-alt="A professional medical research environment featuring close-up details of sophisticated laboratory equipment and digital waveforms on high-resolution displays. The atmosphere is clinical and focused, lit with cool, surgical-grade lighting that highlights pristine surfaces and modern technology. The color palette is dominated by deep blues and crisp whites, conveying a sense of authoritative scientific discovery and reliability." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAhaOjFt-TEA7F7Pg6bcCgLRgp1d9HN3aUnjW4bxDjHs4ZWOM6JHb7nQxxqiax2PR3NU-y1oPudc-FapIRb1eX3MlmFmbOq7nK4aUZ-T9LnZik2SiWRsCLgEexko99oNFHv5oFRoKiaZ-jsQx8t3L6g9e85BSB7AiG0RY-O2uzfJ-lSSMkrzRyCN0LZ38K4Rh31bLKyoQ_Gq0TuWH-YpRNkWiT_U_ijVOINxVdMsJ4itbikj2HdfiSEvGBxhROEY6WmmPFfFWWLN1o"/>
</div>
<div class="relative z-10">
<p class="font-label-caps text-label-caps opacity-80 mb-1">THESIS PROJECT</p>
<h2 class="font-headline-md text-headline-md leading-tight">Cough Audio Classification</h2>
</div>
</section>
<!-- Description Card -->
<div class="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.04)]">
<h3 class="font-label-caps text-label-caps text-primary mb-3">RESEARCH OVERVIEW</h3>
<p class="font-body-md text-body-md text-on-surface-variant mb-4">
        A thesis project exploring on-device cough audio classification using TFLite. This study investigates the feasibility of deploying lightweight neural networks for real-time diagnostic screening.
      </p>
<div class="flex flex-wrap gap-2">
<span class="bg-primary-fixed text-on-primary-fixed px-3 py-1 rounded-full text-xs font-bold font-label-caps">TFLite</span>
<span class="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-xs font-bold font-label-caps">Edge AI</span>
<span class="bg-surface-container-highest text-on-surface-variant px-3 py-1 rounded-full text-xs font-bold font-label-caps">Healthcare</span>
</div>
</div>
<!-- Team Bento Grid -->
<div class="grid grid-cols-2 gap-4">
<div class="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl p-4 flex flex-col items-center text-center shadow-[0_4px_12px_rgba(0,0,0,0.04)]">
<div class="w-12 h-12 bg-surface-container rounded-full flex items-center justify-center mb-3">
<span class="material-symbols-outlined text-primary" data-icon="school">school</span>
</div>
<p class="font-label-caps text-[10px] text-outline mb-1">STUDENT</p>
<p class="font-headline-sm text-[16px] text-on-surface">John Smith</p>
</div>
<div class="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl p-4 flex flex-col items-center text-center shadow-[0_4px_12px_rgba(0,0,0,0.04)]">
<div class="w-12 h-12 bg-surface-container rounded-full flex items-center justify-center mb-3">
<span class="material-symbols-outlined text-primary" data-icon="badge">badge</span>
</div>
<p class="font-label-caps text-[10px] text-outline mb-1">SUPERVISOR</p>
<p class="font-headline-sm text-[16px] text-on-surface">Dr. Jane Doe</p>
</div>
</div>
<!-- Datasets Section -->
<div class="bg-surface-container-low rounded-xl p-6">
<div class="flex items-center gap-2 mb-4">
<span class="material-symbols-outlined text-primary" data-icon="database">database</span>
<h3 class="font-headline-sm text-headline-sm">Research Datasets</h3>
</div>
<div class="space-y-3">
<div class="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-gray-100 dark:border-slate-700">
<div class="flex items-center gap-3">
<span class="material-symbols-outlined text-on-secondary-container" data-icon="folder_zip">folder_zip</span>
<span class="font-body-md text-on-surface">Coswara</span>
</div>
<span class="material-symbols-outlined text-outline text-sm" data-icon="open_in_new">open_in_new</span>
</div>
<div class="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-gray-100 dark:border-slate-700">
<div class="flex items-center gap-3">
<span class="material-symbols-outlined text-on-secondary-container" data-icon="folder_zip">folder_zip</span>
<span class="font-body-md text-on-surface">COUGHVID</span>
</div>
<span class="material-symbols-outlined text-outline text-sm" data-icon="open_in_new">open_in_new</span>
</div>
</div>
</div>
<!-- Technical Details -->
<div class="space-y-4 pt-4">
<div class="flex items-center gap-4 text-outline border-b border-surface-container pb-4">
<span class="material-symbols-outlined" data-icon="verified_user">verified_user</span>
<div>
<p class="font-label-caps text-[11px] mb-0.5">ETHICS APPROVAL</p>
<p class="font-body-md text-sm text-on-surface">IRB-2023-CS04 Institutional Board</p>
</div>
</div>
<div class="flex items-center gap-4 text-outline">
<span class="material-symbols-outlined" data-icon="source">source</span>
<div>
<p class="font-label-caps text-[11px] mb-0.5">OPEN SOURCE</p>
<p class="font-body-md text-sm text-on-surface">MIT License Core Engine</p>
</div>
</div>
</div>
<!-- Footer -->
<footer class="text-center pt-8 opacity-40">
<p class="font-label-caps text-[10px] tracking-[0.2em] text-on-surface">COUGHSCREEN DIAGNOSTICS</p>
<p class="font-label-md text-xs mt-1">v1.0.2-beta.</p>
</footer>
</main>
<!-- BottomNavBar -->
<nav class="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pb-safe h-16 bg-white/95 dark:bg-slate-900/95 border-t border-gray-100 dark:border-slate-800 shadow-[0_-4px_12px_rgba(0,0,0,0.06)] z-50">
<a class="flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 scale-95 active:scale-90 transition-transform" href="#">
<span class="material-symbols-outlined" data-icon="home">home</span>
<span class="font-inter text-[11px] font-medium tracking-wide">Home</span>
</a>
<a class="flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 scale-95 active:scale-90 transition-transform" href="#">
<span class="material-symbols-outlined" data-icon="history">history</span>
<span class="font-inter text-[11px] font-medium tracking-wide">History</span>
</a>
<a class="flex flex-col items-center justify-center text-blue-900 dark:text-blue-400 font-semibold scale-95 active:scale-90 transition-transform" href="#">
<span class="material-symbols-outlined" data-icon="settings" style="font-variation-settings: 'FILL' 1;">settings</span>
<span class="font-inter text-[11px] font-medium tracking-wide">Settings</span>
</a>
</nav>
</body></html>