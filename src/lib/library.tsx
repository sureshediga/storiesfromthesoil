import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { stories as seedStories, type Story, type ThemeId } from "../data/stories";

const STORY_KEY = "sfts-submissions";
const VOLUNTEER_KEY = "sfts-volunteers";

export type VolunteerOffer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  region: string;
  languages: string;
  help: string[];
  experience: string;
};

export type StoryDraft = {
  author: string;
  display: "full" | "first" | "community";
  place: string;
  country: string;
  state: string;
  language: string;
  theme: ThemeId;
  crop: string;
  farmerType: string;
  title: string;
  body: string;
  hope: string;
  image?: string;
};

type LibraryValue = {
  stories: Story[];
  volunteers: VolunteerOffer[];
  addStory: (draft: StoryDraft) => Story;
  addVolunteer: (offer: Omit<VolunteerOffer, "id">) => void;
};

const LibraryContext = createContext<LibraryValue | null>(null);

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function slugify(value: string) {
  const base = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 48);
  return `${base || "story"}-${Date.now().toString(36)}`;
}

function publicName(draft: StoryDraft) {
  if (draft.display === "first") return draft.author.trim().split(/\s+/)[0] || draft.author;
  if (draft.display === "community") return draft.author.trim();
  return draft.author.trim();
}

export function LibraryProvider({ children }: { children: ReactNode }) {
  const [extra, setExtra] = useState<Story[]>(() => readJson(STORY_KEY, []));
  const [volunteers, setVolunteers] = useState<VolunteerOffer[]>(() => readJson(VOLUNTEER_KEY, []));

  useEffect(() => {
    localStorage.setItem(STORY_KEY, JSON.stringify(extra));
  }, [extra]);

  useEffect(() => {
    localStorage.setItem(VOLUNTEER_KEY, JSON.stringify(volunteers));
  }, [volunteers]);

  const value = useMemo<LibraryValue>(() => {
    const addStory = (draft: StoryDraft) => {
      const author = publicName(draft);
      const paragraphs = [draft.body.trim(), draft.hope.trim()].filter(Boolean);
      const story: Story = {
        slug: slugify(draft.title),
        title: draft.title.trim(),
        excerpt: draft.body.trim().slice(0, 140),
        body: paragraphs,
        theme: draft.theme,
        tags: ["Community submission"],
        country: draft.country || "India",
        state: draft.state || draft.place,
        location: draft.place || draft.state || draft.country,
        author,
        initials: author
          .split(/\s+/)
          .slice(0, 2)
          .map((part) => part[0]?.toUpperCase() ?? "")
          .join(""),
        timeAgo: "Just now",
        year: String(new Date().getFullYear()),
        language: draft.language || "English",
        types: draft.image ? ["text", "photo"] : ["text"],
        primary: draft.image ? "photo" : "text",
        photoCount: draft.image ? 1 : undefined,
        crop: draft.crop || "Mixed",
        practice: "Shared account",
        farmerType: draft.farmerType || "Smallholder",
        image: draft.image,
        recent: true,
        region: "south-asia",
        pending: true,
      };
      setExtra((current) => [story, ...current]);
      return story;
    };

    const addVolunteer = (offer: Omit<VolunteerOffer, "id">) => {
      setVolunteers((current) => [{ ...offer, id: `vol-${Date.now().toString(36)}` }, ...current]);
    };

    return {
      stories: [...extra, ...seedStories],
      volunteers,
      addStory,
      addVolunteer,
    };
  }, [extra, volunteers, seedStories]);

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>;
}

export function useLibrary() {
  const value = useContext(LibraryContext);
  if (!value) throw new Error("useLibrary must be used within LibraryProvider");
  return value;
}
