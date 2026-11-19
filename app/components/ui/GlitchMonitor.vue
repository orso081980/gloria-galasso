<script setup lang="ts">
defineProps<{ webp: string; jpg: string; alt: string }>()
</script>

<template>
  <!-- A calm CRT monitor. Hover it and the signal gets disturbed: pixelated TV static. -->
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

      <!-- screen texture -->
      <div class="crt-lines" aria-hidden="true" />
      <div class="crt-static crt-static-white" aria-hidden="true" />
      <div class="crt-static crt-static-tint" aria-hidden="true" />
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

.crt-lines {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(to bottom, rgb(0 0 0 / 0.2) 0 1px, transparent 1px 3px);
  pointer-events: none;
}

/*
 * TV static, same trick as the buttons on tech-paw.com: a thresholded fractal-noise
 * image used as a CSS mask over a flat colour, so only sparse speckles are painted.
 * Invisible until hover; the mask then jumps around in steps.
 */
.crt-static {
  position: absolute;
  inset: 0;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.25s;
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n' x='0' y='0'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 9 -4.4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n' x='0' y='0'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 9 -4.4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  -webkit-mask-size: 180px 180px;
  mask-size: 180px 180px;
}
.crt-static-white { background: #fff; }
.crt-static-tint { background: #ff5fb0; mix-blend-mode: screen; }

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

/* ---------- Disturbed state: only while hovering (or focus inside) ---------- */
.monitor:hover .crt-static,
.monitor:focus-within .crt-static {
  animation: crt-static-shift 0.6s step-end infinite;
}
.monitor:hover .crt-static-white,
.monitor:focus-within .crt-static-white {
  opacity: 0.42;
}
.monitor:hover .crt-static-tint,
.monitor:focus-within .crt-static-tint {
  opacity: 0.3;
  animation-duration: 0.45s;
  animation-direction: reverse;
}

@keyframes crt-static-shift {
  0% { -webkit-mask-position: 0 0; mask-position: 0 0; }
  20% { -webkit-mask-position: -38px 22px; mask-position: -38px 22px; }
  40% { -webkit-mask-position: 26px -44px; mask-position: 26px -44px; }
  60% { -webkit-mask-position: -52px -18px; mask-position: -52px -18px; }
  80% { -webkit-mask-position: 34px 40px; mask-position: 34px 40px; }
  100% { -webkit-mask-position: 0 0; mask-position: 0 0; }
}
@keyframes crt-led {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.35; }
}
</style>
