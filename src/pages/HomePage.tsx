import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Plus, Search, Users } from "lucide-react";
import { useI18n } from "../i18n/LanguageContext";
import { useLibrary } from "../lib/library";
import { emptyFilters, serializeFilters } from "../lib/filters";
import { FilterPanel } from "../components/FilterPanel";
import { StoryCard } from "../components/StoryCard";
import { ThemeStrip } from "../components/ThemeStrip";
import { WorldMap } from "../components/WorldMap";
export function HomePage() {
  const { t } = useI18n();
  const { stories } = useLibrary();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);

  useEffect(() => {
    document.title = t("brand");
  }, [t]);

  const featured = useMemo(() => stories.filter((story) => story.featured), [stories]);
  const recent = useMemo(() => stories.filter((story) => story.recent), [stories]);
  const visible = featured.slice(page, page + 4);
  const shown = visible.length === 4 ? visible : featured.slice(Math.max(0, featured.length - 4));

  function search(event: FormEvent) {
    event.preventDefault();
    const params = serializeFilters({ ...emptyFilters, q: query.trim() });
    navigate(`/stories?${params.toString()}`);
  }

  return (
    <div className="mx-auto grid w-full min-w-0 max-w-[1240px] gap-8 px-4 pb-16 pt-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_300px]">
      <div className="min-w-0">
        <h1 className="font-display max-w-4xl text-[2.15rem] font-semibold leading-[1.12] tracking-tight text-ink sm:text-[2.7rem]">
          {t("heroTitle")}
        </h1>
        <p className="mt-3 max-w-3xl text-[17px] leading-relaxed text-[#3e4942]">{t("heroLead")}</p>

        <form onSubmit={search} className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center" role="search">
          <label className="relative min-w-0 flex-1">
            <span className="sr-only">{t("search")}</span>
            <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#7d8881]" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t("searchPlaceholder")}
              className="h-12 w-full rounded-full border border-[#d7dfd8] bg-white pl-11 pr-4 text-[15px] outline-none ring-soil/25 placeholder:text-[#8b948d] focus:ring-2"
            />
          </label>
          <button
            type="submit"
            className="h-12 rounded-lg bg-soil px-6 text-[15px] font-semibold text-white hover:bg-soil-dark"
          >
            {t("search")}
          </button>
        </form>

        <div className="mt-6 flex flex-col items-stretch justify-center gap-5 sm:flex-row sm:items-start">
          <div className="min-w-0 sm:w-[270px]">
            <Link
              to="/share"
              className="flex h-12 items-center justify-center gap-2 rounded-full bg-soil px-4 text-[15px] font-semibold text-white hover:bg-soil-dark"
            >
              <Plus size={16} />
              {t("shareStory")}
              <ArrowRight size={16} />
            </Link>
            <p className="mt-2 text-center text-[12.5px] leading-snug text-muted">{t("shareCaption")}</p>
          </div>
          <div className="min-w-0 sm:w-[270px]">
            <Link
              to="/volunteer"
              className="flex h-12 items-center justify-center gap-2 rounded-full border border-[#b7d2c0] bg-white px-4 text-[15px] font-semibold text-[#243028] hover:border-soil hover:text-soil"
            >
              <Users size={16} className="text-soil" />
              {t("volunteer")}
              <ArrowRight size={16} />
            </Link>
            <p className="mt-2 text-center text-[12.5px] leading-snug text-muted">{t("volunteerCaption")}</p>
          </div>
        </div>

        <ThemeStrip />

        <section className="mt-9">
          <div className="mb-3 flex items-end justify-between">
            <h2 className="text-lg font-bold text-ink">{t("featured")}</h2>
            <Link to="/stories" className="text-sm font-semibold text-soil">
              {t("viewAll")} →
            </Link>
          </div>
          <div className="relative">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {shown.map((story) => (
                <StoryCard key={story.slug} story={story} />
              ))}
            </div>
            {featured.length > 4 && (
              <button
                type="button"
                aria-label={t("viewAll")}
                onClick={() => setPage((current) => (current + 1) % Math.max(1, featured.length - 3))}
                className="absolute -right-3 top-10 z-10 hidden h-10 w-10 place-items-center rounded-full border border-line bg-white shadow-md xl:grid"
              >
                <ArrowRight size={18} />
              </button>
            )}
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-3 flex items-end justify-between">
            <h2 className="text-lg font-bold text-ink">{t("recent")}</h2>
            <Link to="/stories" className="text-sm font-semibold text-soil">
              {t("viewAll")} →
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {recent.map((story) => (
              <StoryCard key={story.slug} story={story} compact />
            ))}
          </div>
        </section>
      </div>

      <aside className="min-w-0 lg:sticky lg:top-28 lg:max-h-[calc(100vh-8rem)] lg:self-start lg:overflow-auto">
        <section className="rounded-xl border border-line bg-white p-3">
          <h2 className="px-1 pb-2 text-[15px] font-bold text-ink">{t("mapCardTitle")}</h2>
          <WorldMap />
          <Link
            to="/map"
            className="mt-3 flex h-11 items-center justify-center rounded-lg bg-soil text-sm font-semibold text-white hover:bg-soil-dark"
          >
            {t("exploreMap")} →
          </Link>
        </section>
        <div className="mt-4">
          <FilterPanel
            stories={stories}
            value={{ q: "", country: "", state: "", language: "", types: [], crop: "", practice: "", theme: "", farmerType: "", year: "", region: "" }}
            onChange={(next) => navigate(`/stories?${serializeFilters(next).toString()}`)}
          />
        </div>
      </aside>
    </div>
  );
}
