import { Link } from "react-router-dom";
import { regions, type RegionId } from "../data/stories";
import { WORLD_MAP, worldLandPaths } from "../data/worldLand";
import { useI18n } from "../i18n/LanguageContext";
import { useLibrary } from "../lib/library";
import { regionLabelKey } from "../lib/labels";

const MIN_LAT = -56;
const MAX_LAT = 78;

function pinStyle(lon: number, lat: number) {
  const left = ((lon + 180) / 360) * 100;
  const top = ((MAX_LAT - lat) / (MAX_LAT - MIN_LAT)) * 100;
  return { left: `${left}%`, top: `${top}%` };
}

export function WorldMap({
  active,
  tall = false,
}: {
  active?: RegionId | "";
  tall?: boolean;
}) {
  const { t } = useI18n();
  const { stories } = useLibrary();

  return (
    <div className="relative aspect-[960/460] w-full min-w-0 overflow-hidden rounded-xl bg-[#e4f3f1]">
      <svg
        viewBox={`0 0 ${WORLD_MAP.width} ${WORLD_MAP.height}`}
        className="absolute inset-0 h-full w-full"
        role="img"
        aria-label={t("mapCardTitle")}
      >
        <rect width={WORLD_MAP.width} height={WORLD_MAP.height} fill="#e4f3f1" />
        <g fill="#b7d4c8" stroke="#f4fbf8" strokeWidth="0.8" strokeLinejoin="round">
          {worldLandPaths.map((d, index) => (
            <path key={index} d={d} />
          ))}
        </g>
      </svg>
      {regions.map((region) => {
        const count = stories.filter((story) => story.region === region.id).length;
        if (count === 0) return null;
        const selected = active === region.id;
        return (
          <Link
            key={region.id}
            to={`/map?region=${region.id}`}
            className={`absolute grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full font-bold text-white shadow-md ring-2 ring-white ${
              tall ? "h-11 w-11 text-sm" : "h-8 w-8 text-[12px]"
            } ${selected ? "bg-[#145c2c]" : "bg-soil hover:bg-soil-dark"}`}
            style={pinStyle(region.lon, region.lat)}
            aria-label={`${t(regionLabelKey[region.id])}, ${count}`}
          >
            {count}
          </Link>
        );
      })}
    </div>
  );
}
