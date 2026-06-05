import type { Config } from "tailwindcss";
import containerQueries from "@tailwindcss/container-queries";

/** Bungkus CSS variable jadi warna Tailwind yang mendukung opacity (mis. bg-merah/50). */
const c = (v: string) => `hsl(var(${v}) / <alpha-value>)`;

/** Konfigurasi Tailwind: hanya menunjuk ke variable global; jangan taruh hex di sini. */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "page-bg": c("--page-bg"),
        surface: c("--surface"),
        "surface-soft": c("--surface-soft"),
        "surface-dark": c("--surface-dark"),
        merah: c("--merah"),
        "merah-deep": c("--merah-deep"),
        emas: c("--emas"),
        hijau: c("--hijau"),
        "hijau-deep": c("--hijau-deep"),
        ink: c("--ink"),
        "ink-soft": c("--ink-soft"),
        "ink-muted": c("--ink-muted"),
        "emas-medali": c("--emas-medali"),
        perak: c("--perak"),
        perunggu: c("--perunggu"),
      },
      fontFamily: {
        sans: "var(--font-sans)",
        display: "var(--font-display)",
      },
      borderRadius: {
        lg: "var(--radius-lg)",
        md: "var(--radius-md)",
        pill: "var(--radius-pill)",
      },
      boxShadow: {
        card: "var(--shadow-card)",
        panel: "var(--shadow-panel)",
      },
    },
  },
  plugins: [containerQueries],
} satisfies Config;
