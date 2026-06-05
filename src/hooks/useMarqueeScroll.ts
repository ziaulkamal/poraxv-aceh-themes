import { useEffect, useRef } from "react";

/* =============================================================
   Pelacak kecepatan scroll global (singleton) — satu listener
   dipakai bersama semua baris marquee agar hemat.
   ============================================================= */
let smooth = 0; // velocity ter-smooth (px/dtk)
let target = 0; // velocity sesaat, meluruh ke 0 saat scroll berhenti
let started = false;

/** Mulai sekali: pasang listener scroll + loop peluruhan velocity. */
function ensureStarted() {
  if (started || typeof window === "undefined") return;
  started = true;
  let lastY = window.scrollY;
  let lastT = performance.now();

  window.addEventListener(
    "scroll",
    () => {
      const now = performance.now();
      const dt = Math.max(1, now - lastT);
      target = ((window.scrollY - lastY) / dt) * 1000; // px/dtk
      lastY = window.scrollY;
      lastT = now;
    },
    { passive: true },
  );

  const loop = () => {
    smooth += (target - smooth) * 0.1; // easing menuju target
    target *= 0.9; // tanpa scroll, velocity balik ke 0
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}

/** Faktor velocity ternormalisasi: 1000 px/dtk ≈ 1 (gandakan laju marquee). */
const velocityFactor = () => smooth / 1000;

/**
 * Gerakkan track marquee via rAF: laju dasar + dorongan kecepatan scroll,
 * dan arah membalik mengikuti arah scroll (ala marquee GSAP Rayo).
 */
export function useMarqueeScroll<T extends HTMLElement>(baseVelocity: number) {
  const ref = useRef<T>(null);

  useEffect(() => {
    ensureStarted();
    const el = ref.current;
    if (!el) return;

    let half = el.scrollWidth / 2; // lebar satu salinan (konten digandakan)
    let x = 0;
    let last = performance.now();
    let raf = 0;
    let paused = false; // berhenti sejenak saat kursor menyentuh sebuah logo

    const onResize = () => {
      half = el.scrollWidth / 2;
    };
    window.addEventListener("resize", onResize);

    // Jeda saat hover logo: pakai pointerenter/leave per-anak agar gerak
    // hanya berhenti ketika kursor benar-benar di atas sebuah lambang.
    const onEnter = (e: PointerEvent) => {
      if ((e.target as HTMLElement)?.closest("[data-marquee-item]")) paused = true;
    };
    const onLeave = (e: PointerEvent) => {
      if ((e.target as HTMLElement)?.closest("[data-marquee-item]")) paused = false;
    };
    el.addEventListener("pointerover", onEnter);
    el.addEventListener("pointerout", onLeave);

    const frame = (now: number) => {
      const delta = now - last;
      last = now;

      if (!paused) {
        // Selalu kanan→kiri nonstop; scroll hanya menambah laju, tak membalik arah.
        let moveBy = baseVelocity * (delta / 1000);
        moveBy += moveBy * Math.abs(velocityFactor()); // scroll mempercepat
        x += moveBy;
      }

      // Bungkus ke rentang [0, half): saat satu salinan habis, otomatis
      // kembali ke logo pertama tanpa lompatan (konten digandakan).
      const wrapped = half > 0 ? ((x % half) + half) % half : 0;
      el.style.transform = `translate3d(${-wrapped}px,0,0)`;
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      el.removeEventListener("pointerover", onEnter);
      el.removeEventListener("pointerout", onLeave);
    };
  }, [baseVelocity]);

  return ref;
}
