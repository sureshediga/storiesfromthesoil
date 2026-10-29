import { useState } from "react";
import { Link } from "react-router-dom";
import { FileText, Headphones, Image as ImageIcon, MapPin, Play } from "lucide-react";
import type { Story } from "../data/stories";
import { useI18n } from "../i18n/LanguageContext";
import { themeLabelKey } from "../lib/labels";

const avatarTints = ["#1f7a3a", "#2b7eb8", "#b86a32", "#6d5a45", "#3f6b52", "#9a4d6e"];

function Cover({ src }: { src?: string }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <div className="h-full w-full bg-[linear-gradient(160deg,#e7f3ea_0%,#f7f4ea_55%,#dce8d4_100%)]">
        <div className="h-full w-full bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.7),transparent_42%)]" />
      </div>
    );
  }
  return (
    <img
      src={src}
      alt=""
      className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
      onError={() => setFailed(true)}
    />
  );
}

function MediaBadge({ story }: { story: Story }) {
  const className =
    "absolute bottom-2.5 right-2.5 inline-flex items-center gap-1 rounded-md bg-black/75 px-1.5 py-1 text-[11px] font-semibold text-white";
  if (story.primary === "video") {
    return (
      <span className={className}>
        <Play size={11} fill="currentColor" /> {story.duration ?? "Video"}
      </span>
    );
  }
  if (story.primary === "audio") {
    return (
      <span className={className}>
        <Headphones size={11} /> {story.duration}
      </span>
    );
  }
  if (story.primary === "photo") {
    return (
      <span className={className}>
        <ImageIcon size={11} /> {story.photoCount ?? 1}
      </span>
    );
  }
  return (
    <span className={className}>
      <FileText size={11} />
    </span>
  );
}

export function StoryCard({ story, compact = false }: { story: Story; compact?: boolean }) {
  const { t } = useI18n();
  const tint = avatarTints[story.author.charCodeAt(0) % avatarTints.length];
  const badge = story.badge ?? t(themeLabelKey[story.theme]);

  return (
    <Link
      to={`/stories/${story.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-[#e5ebe3] bg-white shadow-[0_1px_2px_rgba(16,32,18,0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(16,32,18,0.08)]"
    >
      <div className={`relative overflow-hidden ${compact ? "aspect-[16/9]" : "aspect-[16/10]"}`}>
        <Cover src={story.image} />
        <span className="absolute left-2.5 top-2.5 rounded-full bg-white/95 px-2 py-0.5 text-[11px] font-semibold text-[#243028] shadow-sm">
          {badge}
        </span>
        {story.pending && (
          <span className="absolute left-2.5 top-8 rounded-full bg-soil px-2 py-0.5 text-[10px] font-semibold text-white">
            {t("pending")}
          </span>
        )}
        <MediaBadge story={story} />
      </div>
      <div className="flex flex-1 flex-col p-3">
        <h3 className="font-display text-[1.05rem] font-semibold leading-snug tracking-tight text-ink group-hover:text-soil">
          {story.title}
        </h3>
        {!compact && <p className="mt-1 line-clamp-2 text-[13px] leading-snug text-muted">{story.excerpt}</p>}
        {story.location && (
          <p className="mt-2 flex items-center gap-1 text-[12px] text-[#4d5851]">
            <MapPin size={12} className="shrink-0 text-soil" />
            <span className="truncate">{story.location}</span>
          </p>
        )}
        {!compact && (
          <p className="mt-1.5 line-clamp-1 text-[12px] font-medium text-soil">
            {story.tags.slice(0, 3).join("  ·  ")}
          </p>
        )}
        <div className="mt-auto flex items-center gap-2 pt-3">
          <span
            className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-[10px] font-bold text-white"
            style={{ background: tint }}
            aria-hidden="true"
          >
            {story.initials.slice(0, 2)}
          </span>
          <span className="min-w-0 text-[12px] leading-tight">
            <span className="block truncate font-semibold text-[#243028]">
              {t("by")} {story.author}
            </span>
            {story.timeAgo && <span className="text-muted">{story.timeAgo}</span>}
          </span>
        </div>
      </div>
    </Link>
  );
}
