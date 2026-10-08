import { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { Check, Globe, Menu, UserRound, X } from "lucide-react";
import { languages } from "../i18n/copy";
import { useI18n } from "../i18n/LanguageContext";
import { Logo } from "./Logo";

const links = [
  { to: "/", key: "navHome", end: true },
  { to: "/stories", key: "navStories", end: false },
  { to: "/themes", key: "navThemes", end: false },
  { to: "/map", key: "navMap", end: false },
  { to: "/contributors", key: "navContributors", end: false },
  { to: "/about", key: "navAbout", end: false },
] as const;

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export function Layout() {
  const { t, lang, setLang } = useI18n();
  const [langOpen, setLangOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const current = languages.find((language) => language.code === lang) ?? languages[0];

  useEffect(() => {
    setMenuOpen(false);
    setLangOpen(false);
    setUserOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    function onPointer(event: MouseEvent) {
      if (!langRef.current?.contains(event.target as Node)) setLangOpen(false);
      if (!userRef.current?.contains(event.target as Node)) setUserOpen(false);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setLangOpen(false);
        setUserOpen(false);
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white text-ink">
      <ScrollToTop />
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-soil focus:px-3 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      <header className="sticky top-0 z-40 border-b border-[#edf0ec] bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 min-w-0 max-w-[1240px] items-center gap-2 px-3 sm:h-[100px] sm:gap-4 sm:px-6">
          <Logo className="h-11 max-w-[46vw] sm:h-[78px] sm:max-w-none" />
          <nav className="ml-6 hidden flex-1 items-center justify-center gap-7 lg:flex">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `border-b-2 pb-0.5 text-[15px] font-semibold ${
                    isActive ? "border-soil text-soil" : "border-transparent text-[#243028] hover:text-soil"
                  }`
                }
              >
                {t(link.key)}
              </NavLink>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-1">
            <div className="relative" ref={langRef}>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-2 text-sm font-semibold text-[#243028] hover:bg-[#f4f8f5]"
                aria-expanded={langOpen}
                aria-haspopup="listbox"
                onClick={() => {
                  setLangOpen((open) => !open);
                  setUserOpen(false);
                }}
              >
                <Globe size={16} />
                <span className="hidden sm:inline">{current.label}</span>
              </button>
              {langOpen && (
                <ul
                  role="listbox"
                  className="absolute right-0 z-50 mt-1 w-44 overflow-hidden rounded-xl border border-line bg-white py-1 shadow-lg"
                >
                  {languages.map((language) => (
                    <li key={language.code}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={language.code === lang}
                        className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-[#f4f8f5]"
                        onClick={() => {
                          setLang(language.code);
                          setLangOpen(false);
                        }}
                      >
                        {language.label}
                        {language.code === lang && <Check size={14} className="text-soil" />}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="relative" ref={userRef}>
              <button
                type="button"
                className="grid h-10 w-10 place-items-center rounded-full text-[#243028] hover:bg-[#f4f8f5]"
                aria-label={t("joinTitle")}
                aria-expanded={userOpen}
                onClick={() => {
                  setUserOpen((open) => !open);
                  setLangOpen(false);
                }}
              >
                <UserRound size={18} />
              </button>
              {userOpen && (
                <div className="absolute right-0 z-50 mt-1 w-72 rounded-xl border border-line bg-white p-4 shadow-lg">
                  <p className="font-display text-lg font-semibold">{t("joinTitle")}</p>
                  <p className="mt-1 text-sm text-muted">{t("joinBody")}</p>
                  <div className="mt-3 flex flex-col gap-2">
                    <NavLink to="/share" className="rounded-full bg-soil px-3 py-2 text-center text-sm font-semibold text-white">
                      {t("shareStory")}
                    </NavLink>
                    <NavLink
                      to="/volunteer"
                      className="rounded-full border border-soil px-3 py-2 text-center text-sm font-semibold text-soil"
                    >
                      {t("volunteer")}
                    </NavLink>
                  </div>
                </div>
              )}
            </div>
            <button
              type="button"
              className="grid h-10 w-10 place-items-center rounded-full lg:hidden"
              aria-label={t("menu")}
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <nav className="border-t border-line px-4 py-3 lg:hidden">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `block rounded-lg px-3 py-2 text-[15px] font-semibold ${isActive ? "bg-[#eef6f0] text-soil" : "text-[#243028]"}`
                }
              >
                {t(link.key)}
              </NavLink>
            ))}
          </nav>
        )}
      </header>
      <main id="content">
        <Outlet />
      </main>
      <footer className="border-t border-[#edf0ec] bg-[#f7faf7]">
        <div className="mx-auto grid w-full min-w-0 max-w-[1240px] gap-8 px-4 py-10 sm:px-6 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <div>
            <Logo />
            <p className="font-display mt-4 max-w-xl text-xl italic leading-snug text-[#243028]">{t("footerQuote")}</p>
            <p className="mt-3 max-w-lg text-sm text-muted">{t("footerNote")}</p>
          </div>
          <div className="grid grid-cols-2 gap-2 self-end text-sm font-semibold">
            {links.map((link) => (
              <NavLink key={link.to} to={link.to} end={link.end} className="text-[#243028] hover:text-soil">
                {t(link.key)}
              </NavLink>
            ))}
            <NavLink to="/share" className="text-soil">
              {t("shareStory")}
            </NavLink>
            <NavLink to="/volunteer" className="text-soil">
              {t("volunteer")}
            </NavLink>
          </div>
        </div>
      </footer>
    </div>
  );
}
