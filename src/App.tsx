import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LanguageProvider } from "./i18n/LanguageContext";
import { LibraryProvider } from "./lib/library";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/HomePage";
import { StoriesPage } from "./pages/StoriesPage";
import { StoryPage } from "./pages/StoryPage";
import { ThemesPage } from "./pages/ThemesPage";
import { MapPage } from "./pages/MapPage";
import { ContributorsPage } from "./pages/ContributorsPage";
import { AboutPage } from "./pages/AboutPage";
import { SharePage } from "./pages/SharePage";
import { VolunteerPage } from "./pages/VolunteerPage";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center">
      <h1 className="font-display text-4xl font-semibold">This page is not in the library</h1>
      <p className="mt-3 text-muted">The story or page may have moved. The shelves are still open.</p>
      <Link to="/" className="mt-6 inline-block rounded-full bg-soil px-4 py-2 font-semibold text-white">
        Back to home
      </Link>
    </div>
  );
}

export function App() {
  return (
    <LanguageProvider>
      <LibraryProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="stories" element={<StoriesPage />} />
              <Route path="stories/:slug" element={<StoryPage />} />
              <Route path="themes" element={<ThemesPage />} />
              <Route path="map" element={<MapPage />} />
              <Route path="contributors" element={<ContributorsPage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="share" element={<SharePage />} />
              <Route path="volunteer" element={<VolunteerPage />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </LibraryProvider>
    </LanguageProvider>
  );
}
