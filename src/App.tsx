import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { PageShell } from "./components/layout/PageShell";
import { AppLayout } from "./components/layout/AppLayout";
import { Home } from "./pages/Home";
import { BeritaPage } from "./pages/BeritaPage";
import { ArtikelPage } from "./pages/ArtikelPage";
import { KlasemenPage } from "./pages/KlasemenPage";
import { LivePage } from "./pages/LivePage";
import { VenuePage } from "./pages/VenuePage";
import { GaleriPage } from "./pages/GaleriPage";
import { KontakPage } from "./pages/KontakPage";
import { SyaratKetentuanPage } from "./pages/SyaratKetentuanPage";
import { KebijakanCookiePage } from "./pages/KebijakanCookiePage";
import { SitemapPage } from "./pages/SitemapPage";

/** Aplikasi PORA: HashRouter (aman untuk GitHub Pages) di atas page shell. */
export default function App() {
  return (
    <PageShell>
      <HashRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<Home />} />
            <Route path="berita" element={<BeritaPage />} />
            <Route path="berita/:slug" element={<ArtikelPage />} />
            <Route path="klasemen" element={<KlasemenPage />} />
            <Route path="live" element={<LivePage />} />
            <Route path="venue" element={<VenuePage />} />
            <Route path="galeri" element={<GaleriPage />} />
            <Route path="kontak" element={<KontakPage />} />
            <Route path="syarat-ketentuan" element={<SyaratKetentuanPage />} />
            <Route path="kebijakan-cookie" element={<KebijakanCookiePage />} />
            <Route path="sitemap" element={<SitemapPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </HashRouter>
    </PageShell>
  );
}
