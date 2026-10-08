import type { MediaType, Story } from "../data/stories";

export type Filters = {
  q: string;
  country: string;
  state: string;
  language: string;
  types: MediaType[];
  crop: string;
  practice: string;
  theme: string;
  farmerType: string;
  year: string;
  region: string;
};

export const emptyFilters: Filters = {
  q: "",
  country: "",
  state: "",
  language: "",
  types: [],
  crop: "",
  practice: "",
  theme: "",
  farmerType: "",
  year: "",
  region: "",
};

const mediaTypes: MediaType[] = ["text", "photo", "video", "audio"];

export function parseFilters(params: URLSearchParams): Filters {
  const types = (params.get("type") ?? "")
    .split(",")
    .filter((type): type is MediaType => mediaTypes.includes(type as MediaType));
  return {
    q: params.get("q") ?? "",
    country: params.get("country") ?? "",
    state: params.get("state") ?? "",
    language: params.get("language") ?? "",
    types,
    crop: params.get("crop") ?? "",
    practice: params.get("practice") ?? "",
    theme: params.get("theme") ?? "",
    farmerType: params.get("farmer") ?? "",
    year: params.get("year") ?? "",
    region: params.get("region") ?? "",
  };
}

export function serializeFilters(filters: Filters) {
  const params = new URLSearchParams();
  if (filters.q) params.set("q", filters.q);
  if (filters.country) params.set("country", filters.country);
  if (filters.state) params.set("state", filters.state);
  if (filters.language) params.set("language", filters.language);
  if (filters.types.length) params.set("type", filters.types.join(","));
  if (filters.crop) params.set("crop", filters.crop);
  if (filters.practice) params.set("practice", filters.practice);
  if (filters.theme) params.set("theme", filters.theme);
  if (filters.farmerType) params.set("farmer", filters.farmerType);
  if (filters.year) params.set("year", filters.year);
  if (filters.region) params.set("region", filters.region);
  return params;
}

export function hasFilters(filters: Filters) {
  return Object.entries(filters).some(([, value]) => (Array.isArray(value) ? value.length > 0 : Boolean(value)));
}

export function filterStories(stories: Story[], filters: Filters) {
  const query = filters.q.trim().toLowerCase();
  return stories.filter((story) => {
    if (query) {
      const haystack = [
        story.title,
        story.excerpt,
        story.author,
        story.location,
        story.crop,
        story.practice,
        story.farmerType,
        story.language,
        ...story.tags,
        ...story.body,
      ]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    if (filters.country && story.country !== filters.country) return false;
    if (filters.state && story.state !== filters.state) return false;
    if (filters.language && story.language !== filters.language) return false;
    if (filters.types.length && !filters.types.some((type) => story.types.includes(type))) return false;
    if (filters.crop && story.crop !== filters.crop) return false;
    if (filters.practice && story.practice !== filters.practice) return false;
    if (filters.theme && story.theme !== filters.theme) return false;
    if (filters.farmerType && story.farmerType !== filters.farmerType) return false;
    if (filters.year && story.year !== filters.year) return false;
    if (filters.region && story.region !== filters.region) return false;
    return true;
  });
}
