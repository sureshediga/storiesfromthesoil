import { Link } from "react-router-dom";
import {
  Coins,
  Flower2,
  Leaf,
  Lightbulb,
  Sprout,
  Sun,
  Truck,
  UserRound,
  Users,
  Wheat,
} from "lucide-react";
import { themes, type ThemeId } from "../data/stories";
import { useI18n } from "../i18n/LanguageContext";
import { useLibrary } from "../lib/library";
import { themeLabelKey } from "../lib/labels";

const icons: Record<ThemeId, typeof Users> = {
  life: Users,
  hardship: Coins,
  climate: Sun,
  traditional: Leaf,
  practices: Wheat,
  women: UserRound,
  migration: Truck,
  innovation: Lightbulb,
  community: Users,
  hope: Flower2,
};

export function ThemeStrip() {
  const { t } = useI18n();
  const { stories } = useLibrary();
  return (
    <div className="mt-8 grid grid-cols-4 gap-2 sm:grid-cols-5 lg:grid-cols-10">
      {themes.map((theme) => {
        const Icon = icons[theme.id];
        return (
          <Link
            key={theme.id}
            to={`/stories?theme=${theme.id}`}
            className="flex min-w-0 flex-col items-center rounded-xl px-1 py-1 text-center hover:bg-[#f6faf7]"
          >
            <span className={`grid h-11 w-11 place-items-center rounded-2xl ${theme.tint} ${theme.ink}`}>
              <Icon size={20} strokeWidth={1.8} />
            </span>
            <span className="mt-2 break-words text-[11px] font-semibold leading-tight text-[#243028] sm:text-[12px]">
              {t(themeLabelKey[theme.id])}
            </span>
            <span className="mt-0.5 text-[11px] text-muted">
              {stories.filter((story) => story.theme === theme.id).length}
            </span>
          </Link>
        );
      })}
    </div>
  );
}

export function ThemeIcon({ id, className = "" }: { id: ThemeId; className?: string }) {
  const theme = themes.find((item) => item.id === id);
  const Icon = icons[id] ?? Sprout;
  return (
    <span className={`grid place-items-center rounded-2xl ${theme?.tint ?? ""} ${theme?.ink ?? ""} ${className}`}>
      <Icon size={22} strokeWidth={1.8} />
    </span>
  );
}
