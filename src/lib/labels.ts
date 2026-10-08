import type { CopyKey } from "../i18n/copy";
import type { RegionId, ThemeId } from "../data/stories";

export const themeLabelKey: Record<ThemeId, CopyKey> = {
  life: "themeLife",
  hardship: "themeHardship",
  climate: "themeClimate",
  traditional: "themeTraditional",
  practices: "themePractices",
  women: "themeWomen",
  migration: "themeMigration",
  innovation: "themeInnovation",
  community: "themeCommunity",
  hope: "themeHope",
};

export const themeBlurbKey: Record<ThemeId, CopyKey> = {
  life: "blurbLife",
  hardship: "blurbHardship",
  climate: "blurbClimate",
  traditional: "blurbTraditional",
  practices: "blurbPractices",
  women: "blurbWomen",
  migration: "blurbMigration",
  innovation: "blurbInnovation",
  community: "blurbCommunity",
  hope: "blurbHope",
};

export const regionLabelKey: Record<RegionId, CopyKey> = {
  "south-asia": "regionSouthAsia",
  americas: "regionAmericas",
  "europe-africa": "regionEuropeAfrica",
  "east-africa": "regionEastAfrica",
  "southeast-asia": "regionSoutheastAsia",
};
