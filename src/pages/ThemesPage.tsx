import { useEffect } from "react";
import { Link } from "react-router-dom";
import { themes } from "../data/stories";
import { useI18n } from "../i18n/LanguageContext";
import { useLibrary } from "../lib/library";
import { themeBlurbKey, themeLabelKey } from "../lib/labels";
import { ThemeIcon } from "../components/ThemeStrip";

export function ThemesPage() {
  const { t } = useI18n();
  const { stories } = useLibrary();
  useEffect(() => {
    document.title = `${t("themesTitle")} · ${t("brand")}`;
  }, [t]);

  return (
    <div className="mx-auto max-w-[1100px] px-4 py-10 sm:px-6">
      <h1 className="font-display text-4xl font-semibold tracking-tight">{t("themesTitle")}</h1>
      <p className="mt-3 max-w-2xl text-lg text-[#3e4942]">{t("themesLead")}</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {themes.map((theme) => (
          <Link
            key={theme.id}
            to={`/stories?theme=${theme.id}`}
            className="flex gap-4 rounded-2xl border border-line p-4 transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <ThemeIcon id={theme.id} className="h-14 w-14 shrink-0" />
            <span>
              <span className="block font-display text-2xl font-semibold leading-tight">
                {t(themeLabelKey[theme.id])}
              </span>
              <span className="mt-1 block text-sm font-semibold text-soil">
                {stories.filter((story) => story.theme === theme.id).length} {t("storiesWord")}
              </span>
              <span className="mt-2 block text-sm leading-relaxed text-muted">{t(themeBlurbKey[theme.id])}</span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
