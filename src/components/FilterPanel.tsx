import { useState, type ReactNode } from "react";
import { ChevronDown, SlidersHorizontal } from "lucide-react";
import { themes, type MediaType, type Story } from "../data/stories";
import { useI18n } from "../i18n/LanguageContext";
import type { CopyKey } from "../i18n/copy";
import { themeLabelKey } from "../lib/labels";
import { emptyFilters, type Filters } from "../lib/filters";

const typeKeys: { id: MediaType; label: CopyKey }[] = [
  { id: "text", label: "typeText" },
  { id: "photo", label: "typePhoto" },
  { id: "video", label: "typeVideo" },
  { id: "audio", label: "typeAudio" },
];

function unique(stories: Story[], pick: (story: Story) => string) {
  return [...new Set(stories.map(pick).filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

function Group({
  label,
  value,
  open,
  onToggle,
  children,
}: {
  label: string;
  value?: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <div className="border-b border-line">
      <button type="button" onClick={onToggle} className="flex w-full items-center justify-between py-3 text-left">
        <span>
          <span className="block text-[14px] font-semibold text-[#243028]">{label}</span>
          {value && <span className="text-[12px] font-medium text-soil">{value}</span>}
        </span>
        <ChevronDown size={16} className={`text-muted transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="pb-3">{children}</div>}
    </div>
  );
}

export function FilterPanel({
  stories,
  value,
  onChange,
}: {
  stories: Story[];
  value: Filters;
  onChange: (next: Filters) => void;
}) {
  const { t } = useI18n();
  const [open, setOpen] = useState<string>("type");
  const toggle = (id: string) => setOpen((current) => (current === id ? "" : id));

  const countries = unique(stories, (story) => story.country);
  const states = unique(
    stories.filter((story) => !value.country || story.country === value.country),
    (story) => story.state,
  );
  const languages = unique(stories, (story) => story.language);
  const crops = unique(stories, (story) => story.crop);
  const practices = unique(stories, (story) => story.practice);
  const farmerTypes = unique(stories, (story) => story.farmerType);
  const years = unique(stories, (story) => story.year).reverse();

  const choose = (patch: Partial<Filters>) => onChange({ ...value, ...patch });

  const options = (items: string[], current: string, key: keyof Filters) => (
    <div className="flex flex-col gap-1">
      <button
        type="button"
        className={`rounded-md px-2 py-1 text-left text-sm ${current === "" ? "bg-[#eef6f0] font-semibold text-soil" : "hover:bg-[#f6faf7]"}`}
        onClick={() => choose({ [key]: "" })}
      >
        {t("any")}
      </button>
      {items.map((item) => (
        <button
          key={item}
          type="button"
          className={`rounded-md px-2 py-1 text-left text-sm ${current === item ? "bg-[#eef6f0] font-semibold text-soil" : "hover:bg-[#f6faf7]"}`}
          onClick={() => choose({ [key]: item })}
        >
          {item}
        </button>
      ))}
    </div>
  );

  return (
    <section className="rounded-xl border border-line bg-white p-4">
      <div className="mb-1 flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-[15px] font-semibold text-ink">
          <SlidersHorizontal size={16} className="text-soil" />
          {t("filterStories")}
        </h2>
        <button type="button" onClick={() => onChange(emptyFilters)} className="text-sm font-semibold text-soil">
          {t("clearAll")}
        </button>
      </div>

      <Group
        label={t("countryRegion")}
        value={value.country}
        open={open === "country"}
        onToggle={() => toggle("country")}
      >
        {options(countries, value.country, "country")}
      </Group>
      <Group label={t("stateProvince")} value={value.state} open={open === "state"} onToggle={() => toggle("state")}>
        {options(states, value.state, "state")}
      </Group>
      <Group label={t("language")} value={value.language} open={open === "language"} onToggle={() => toggle("language")}>
        {options(languages, value.language, "language")}
      </Group>

      <div className="border-b border-line py-3">
        <button type="button" onClick={() => toggle("type")} className="flex w-full items-center justify-between text-left">
          <span className="text-[14px] font-semibold text-[#243028]">{t("storyType")}</span>
          <ChevronDown size={16} className={`text-muted transition ${open === "type" ? "rotate-180" : ""}`} />
        </button>
        {open === "type" && (
          <div className="mt-2 space-y-2">
            {typeKeys.map((type) => {
              const checked = value.types.includes(type.id);
              return (
                <label key={type.id} className="flex cursor-pointer items-center gap-2 text-sm text-[#243028]">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() =>
                      choose({
                        types: checked ? value.types.filter((item) => item !== type.id) : [...value.types, type.id],
                      })
                    }
                    className="h-4 w-4 accent-soil"
                  />
                  <span className="flex-1">{t(type.label)}</span>
                  <span className="text-muted">
                    ({stories.filter((story) => story.types.includes(type.id)).length})
                  </span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      <Group label={t("crop")} value={value.crop} open={open === "crop"} onToggle={() => toggle("crop")}>
        {options(crops, value.crop, "crop")}
      </Group>
      <Group
        label={t("farmingPractice")}
        value={value.practice}
        open={open === "practice"}
        onToggle={() => toggle("practice")}
      >
        {options(practices, value.practice, "practice")}
      </Group>
      <Group
        label={t("themeIssue")}
        value={value.theme ? t(themeLabelKey[value.theme as keyof typeof themeLabelKey]) : ""}
        open={open === "theme"}
        onToggle={() => toggle("theme")}
      >
        <div className="flex flex-col gap-1">
          <button
            type="button"
            className={`rounded-md px-2 py-1 text-left text-sm ${value.theme === "" ? "bg-[#eef6f0] font-semibold text-soil" : "hover:bg-[#f6faf7]"}`}
            onClick={() => choose({ theme: "" })}
          >
            {t("any")}
          </button>
          {themes.map((theme) => (
            <button
              key={theme.id}
              type="button"
              className={`rounded-md px-2 py-1 text-left text-sm ${value.theme === theme.id ? "bg-[#eef6f0] font-semibold text-soil" : "hover:bg-[#f6faf7]"}`}
              onClick={() => choose({ theme: theme.id })}
            >
              {t(themeLabelKey[theme.id])}
            </button>
          ))}
        </div>
      </Group>
      <Group
        label={t("farmerType")}
        value={value.farmerType}
        open={open === "farmer"}
        onToggle={() => toggle("farmer")}
      >
        {options(farmerTypes, value.farmerType, "farmerType")}
      </Group>
      <Group label={t("year")} value={value.year} open={open === "year"} onToggle={() => toggle("year")}>
        {options(years, value.year, "year")}
      </Group>
    </section>
  );
}
