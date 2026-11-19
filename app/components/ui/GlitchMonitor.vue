<script setup lang="ts">
defineProps<{ webp: string; jpg: string; alt: string }>()
</script>

<template>
  <!-- A calm CRT monitor. Hover it and it gets disturbed (glitch, colour split, noise, rolling bar). -->
  <div class="monitor relative rounded-[2rem] bg-[#1d2038] p-4 pb-3 shadow-2xl shadow-violet/30 ring-1 ring-line">
    <div class="crt relative aspect-square overflow-hidden rounded-[1.5rem] bg-black">
      <!-- the picture itself (the only layer that is not decorative) -->
      <picture class="crt-base block size-full">
        <source :srcset="webp" type="image/webp">
        <img
          :src="jpg"
          :alt="alt"
          width="640"
          height="640"
          fetchpriority="high"
          class="size-full object-cover"
        >
      </picture>

      <!-- glitch layers: colour-split ghosts + a sliced band (invisible until hover) -->
      <img :src="webp" alt="" aria-hidden="true" loading="lazy" class="crt-ghost crt-ghost-r">
      <img :src="webp" alt="" aria-hidden="true" loading="lazy" class="crt-ghost crt-ghost-c">
      <img :src="webp" alt="" aria-hidden="true" loading="lazy" class="crt-ghost crt-ghost-slice">

      <!-- screen texture -->
      <div class="crt-noise" aria-hidden="true" />
      <div class="crt-lines" aria-hidden="true" />
      <div class="crt-roll" aria-hidden="true" />
      <div class="crt-vignette" aria-hidden="true" />

      <span class="crt-osd" aria-hidden="true">CH 03 ▶ PLAY</span>
    </div>

    <div class="flex items-center justify-between px-2 pb-1 pt-3 font-mono text-[10px] tracking-widest text-white/50" aria-hidden="true">
      <span>GG-1000 · FINE-TUNED</span>
      <span class="flex items-center gap-2">
        <span class="size-1.5 rounded-full bg-white/30" />
        <span class="crt-led size-2 rounded-full bg-[#ff5f57]" />
      </span>
    </div>
  </div>
</template>

<style scoped>
/* ---------- Calm (default) state ---------- */
.crt {
  box-shadow: inset 0 0 40px rgb(0 0 0 / 0.55), 0 0 0 3px #0b0d1a;
}

.crt-ghost {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  mix-blend-mode: screen;
  pointer-events: none;
}
.crt-ghost-r { filter: sepia(1) saturate(9) hue-rotate(-55deg) brightness(0.75); }
.crt-ghost-c { filter: sepia(1) saturate(9) hue-rotate(135deg) brightness(0.75); }
.crt-ghost-slice { mix-blend-mode: normal; }

.crt-noise {
  position: absolute;
  inset: -50%;
  opacity: 0;
  mix-blend-mode: overlay;
  transition: opacity 0.2s;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  pointer-events: none;
}

.crt-lines {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(to bottom, rgb(0 0 0 / 0.2) 0 1px, transparent 1px 3px);
  pointer-events: none;
}

.crt-roll {
  position: absolute;
  inset-inline: 0;
  top: -30%;
  height: 28%;
  opacity: 0;
  background: linear-gradient(to bottom, transparent, rgb(255 255 255 / 0.14), transparent);
  pointer-events: none;
}

.crt-vignette {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at center, transparent 55%, rgb(0 0 0 / 0.5) 100%);
  pointer-events: none;
}

.crt-osd {
  position: absolute;
  left: 0.9rem;
  top: 0.8rem;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #7dff9f;
  text-shadow: 0 0 6px #7dff9f, 2px 0 0 rgb(255 0 80 / 0.55);
}

.crt-led {
  box-shadow: 0 0 8px 1px #ff5f57;
  animation: crt-led 2.4s ease-in-out infinite;
}

/* ---------- Disturbed state: only while hovering (or keyboard focus inside) ---------- */
.monitor:hover .crt,
.monitor:focus-within .crt {
  animation: crt-flicker 0.12s steps(2) infinite;
}
.monitor:hover .crt-base img,
.monitor:focus-within .crt-base img {
  animation: crt-jitter 1.6s steps(1) infinite;
}
.monitor:hover .crt-ghost-r,
.monitor:focus-within .crt-ghost-r {
  animation: crt-split-r 1.6s steps(1) infinite;
}
.monitor:hover .crt-ghost-c,
.monitor:focus-within .crt-ghost-c {
  animation: crt-split-c 1.6s steps(1) infinite;
}
.monitor:hover .crt-ghost-slice,
.monitor:focus-within .crt-ghost-slice {
  animation: crt-slice 1.6s steps(1) infinite;
}
.monitor:hover .crt-noise,
.monitor:focus-within .crt-noise {
  opacity: 0.16;
  animation: crt-noise 0.5s steps(5) infinite;
}
.monitor:hover .crt-roll,
.monitor:focus-within .crt-roll {
  opacity: 1;
  animation: crt-roll 2.2s linear infinite;
}
.monitor:hover .crt-osd,
.monitor:focus-within .crt-osd {
  animation: crt-osd 1.6s steps(1) infinite;
}

/* Two short glitch bursts per 1.6s cycle. */
@keyframes crt-jitter {
  0%, 12%, 48%, 62%, 100% { transform: none; filter: none; }
  3% { transform: translate(-7px, 0) skewX(5deg); filter: hue-rotate(40deg) saturate(1.8) contrast(1.2); }
  6% { transform: translate(6px, 2px); filter: saturate(0.5) contrast(1.4); }
  9% { transform: translate(-3px, -1px) skewX(-4deg); filter: none; }
  50% { transform: translate(4px, 0) skewX(3deg); filter: hue-rotate(-30deg); }
  55% { transform: translate(-5px, 1px); filter: contrast(1.3); }
  58% { transform: translate(2px, 0); filter: none; }
}
@keyframes crt-split-r {
  0%, 12%, 48%, 62%, 100% { opacity: 0; transform: none; }
  3% { opacity: 0.4; transform: translateX(9px); }
  6% { opacity: 0.4; transform: translateX(-7px); }
  9% { opacity: 0.3; transform: translateX(5px); }
  50% { opacity: 0.4; transform: translateX(7px); }
  56% { opacity: 0.3; transform: translateX(-5px); }
}
@keyframes crt-split-c {
  0%, 12%, 48%, 62%, 100% { opacity: 0; transform: none; }
  3% { opacity: 0.4; transform: translateX(-9px); }
  6% { opacity: 0.4; transform: translateX(7px); }
  9% { opacity: 0.3; transform: translateX(-5px); }
  50% { opacity: 0.4; transform: translateX(-7px); }
  56% { opacity: 0.3; transform: translateX(5px); }
}
@keyframes crt-slice {
  0%, 12%, 48%, 62%, 100% { opacity: 0; clip-path: inset(40% 0 50% 0); transform: none; }
  3% { opacity: 0.9; clip-path: inset(22% 0 66% 0); transform: translateX(22px); }
  6% { opacity: 0.9; clip-path: inset(58% 0 30% 0); transform: translateX(-26px); }
  9% { opacity: 0.9; clip-path: inset(40% 0 48% 0); transform: translateX(14px); }
  50% { opacity: 0.9; clip-path: inset(70% 0 20% 0); transform: translateX(-18px); }
  56% { opacity: 0.9; clip-path: inset(12% 0 78% 0); transform: translateX(16px); }
}
@keyframes crt-roll {
  from { top: -30%; }
  to { top: 110%; }
}
@keyframes crt-noise {
  0% { transform: translate(0, 0); }
  20% { transform: translate(-6%, 4%); }
  40% { transform: translate(5%, -7%); }
  60% { transform: translate(-3%, 8%); }
  80% { transform: translate(7%, 2%); }
  100% { transform: translate(0, 0); }
}
@keyframes crt-flicker {
  0% { opacity: 1; }
  100% { opacity: 0.955; }
}
@keyframes crt-osd {
  0%, 12%, 48%, 62%, 100% { opacity: 1; transform: none; }
  4% { opacity: 0.3; transform: translateX(4px); }
  8% { opacity: 1; transform: translateX(-3px); }
  52% { opacity: 0.4; transform: translateX(3px); }
}
@keyframes crt-led {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.35; }
}
</style>
