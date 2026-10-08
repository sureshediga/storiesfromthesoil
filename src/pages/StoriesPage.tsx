import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import { useI18n } from "../i18n/LanguageContext";
import { useLibrary } from "../lib/library";
import { filterStories, hasFilters, parseFilters, serializeFilters } from "../lib/filters";
import { FilterPanel } from "../components/FilterPanel";
import { StoryCard } from "../components/StoryCard";
import { themeLabelKey } from "../lib/labels";
import { useEffect } from "react";

export function StoriesPage() {
  const { t } = useI18n();
  const { stories } = useLibrary();
  const [params, setParams] = useSearchParams();
  const filters = useMemo(() => parseFilters(params), [params]);
  const results = useMemo(() => filterStories(stories, filters), [stories, filters]);

  useEffect(() => {
    document.title = `${t("navStories")} · ${t("brand")}`;
  }, [t]);

  return (
    <div className="mx-auto grid w-full min-w-0 max-w-[1240px] gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_300px]">
      <div className="min-w-0">
        <h1 className="font-display text-4xl font-semibold tracking-tight">{t("navStories")}</h1>
        <p className="mt-2 max-w-2xl text-muted">{t("curatedNote")}</p>
        <form
          className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center"
          role="search"
          onSubmit={(event) => {
            event.preventDefault();
            const data = new FormData(event.currentTarget);
            const next = { ...filters, q: String(data.get("q") ?? "") };
            setParams(serializeFilters(next), { replace: true });
          }}
        >
          <label className="relative min-w-0 flex-1">
            <span className="sr-only">{t("search")}</span>
            <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#7d8881]" />
            <input
              name="q"
              defaultValue={filters.q}
              key={filters.q}
              placeholder={t("searchPlaceholder")}
              className="h-12 w-full rounded-full border border-[#d7dfd8] pl-11 pr-4 outline-none ring-soil/25 focus:ring-2"
            />
          </label>
          <button type="submit" className="h-12 rounded-lg bg-soil px-5 font-semibold text-white">
            {t("search")}
          </button>
        </form>

        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
          <span className="font-semibold text-[#243028]">
            {t("showing")} {results.length} {t("storiesWord")}
          </span>
          {filters.theme && (
            <Link to="/stories" className="rounded-full bg-[#eef6f0] px-2 py-0.5 font-semibold text-soil">
              {t(themeLabelKey[filters.theme as keyof typeof themeLabelKey] ?? "themeIssue")}
            </Link>
          )}
          {hasFilters(filters) && (
            <button
              type="button"
              className="font-semibold text-soil"
              onClick={() => setParams(new URLSearchParams(), { replace: true })}
            >
              {t("clearFilters")}
            </button>
          )}
        </div>

        {results.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-[#c9d7cc] bg-[#f7faf7] px-6 py-12 text-center">
            <h2 className="font-display text-2xl font-semibold">{t("emptyTitle")}</h2>
            <p className="mx-auto mt-2 max-w-md text-muted">{t("emptyBody")}</p>
            <button
              type="button"
              className="mt-4 rounded-full bg-soil px-4 py-2 text-sm font-semibold text-white"
              onClick={() => setParams(new URLSearchParams(), { replace: true })}
            >
              {t("clearFilters")}
            </button>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {results.map((story) => (
              <StoryCard key={story.slug} story={story} />
            ))}
          </div>
        )}
      </div>
      <aside className="min-w-0 lg:sticky lg:top-28 lg:max-h-[calc(100vh-8rem)] lg:self-start lg:overflow-auto">
        <FilterPanel
          stories={stories}
          value={filters}
          onChange={(next) => setParams(serializeFilters(next), { replace: true })}
        />
      </aside>
    </div>
  );
}
