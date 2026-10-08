import { useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { regions, type RegionId } from "../data/stories";
import { useI18n } from "../i18n/LanguageContext";
import { useLibrary } from "../lib/library";
import { regionLabelKey } from "../lib/labels";
import { WorldMap } from "../components/WorldMap";
import { StoryCard } from "../components/StoryCard";

export function MapPage() {
  const { t } = useI18n();
  const { stories } = useLibrary();
  const [params, setParams] = useSearchParams();
  const region = (params.get("region") ?? "") as RegionId | "";
  const active = regions.some((item) => item.id === region) ? region : "";
  const results = useMemo(
    () => (active ? stories.filter((story) => story.region === active) : stories),
    [stories, active],
  );

  useEffect(() => {
    document.title = `${t("mapTitle")} · ${t("brand")}`;
  }, [t]);

  return (
    <div className="mx-auto w-full min-w-0 max-w-[1100px] px-4 py-8 sm:px-6">
      <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">{t("mapTitle")}</h1>
      <p className="mt-3 max-w-2xl text-lg text-[#3e4942]">{t("mapLead")}</p>
      <div className="mt-6 overflow-hidden rounded-2xl border border-line p-3">
        <WorldMap active={active} tall />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setParams({}, { replace: true })}
          className={`rounded-full px-3 py-1.5 text-sm font-semibold ${active === "" ? "bg-soil text-white" : "bg-[#f3f7f4] text-[#243028]"}`}
        >
          {t("allRegions")}
        </button>
        {regions.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setParams({ region: item.id }, { replace: true })}
            className={`rounded-full px-3 py-1.5 text-sm font-semibold ${active === item.id ? "bg-soil text-white" : "bg-[#f3f7f4] text-[#243028]"}`}
          >
            {t(regionLabelKey[item.id])} · {stories.filter((story) => story.region === item.id).length}
          </button>
        ))}
      </div>
      <h2 className="mt-8 text-lg font-bold">
        {active ? t(regionLabelKey[active]) : t("allRegions")} · {results.length}
      </h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((story) => (
          <StoryCard key={story.slug} story={story} />
        ))}
      </div>
      {results.length === 0 && (
        <p className="mt-6 text-muted">
          {t("emptyBody")}{" "}
          <Link to="/share" className="font-semibold text-soil">
            {t("shareStory")}
          </Link>
        </p>
      )}
    </div>
  );
}
