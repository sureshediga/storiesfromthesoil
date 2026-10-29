import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Check, ExternalLink, Link2, MapPin } from "lucide-react";
import { interviewSeries } from "../data/stories";
import { useI18n } from "../i18n/LanguageContext";
import { useLibrary } from "../lib/library";
import { StoryCard } from "../components/StoryCard";
import { themeLabelKey } from "../lib/labels";

function youtubeId(url?: string) {
  if (!url) return "";
  try {
    const parsed = new URL(url);
    if (!parsed.hostname.includes("youtube.com")) return "";
    return parsed.searchParams.get("v") ?? "";
  } catch {
    return "";
  }
}

export function StoryPage() {
  const { slug } = useParams();
  const { t } = useI18n();
  const { stories } = useLibrary();
  const story = stories.find((item) => item.slug === slug);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    document.title = story ? `${story.title} · ${t("brand")}` : t("brand");
  }, [story, t]);

  if (!story) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="font-display text-4xl font-semibold">{t("notFoundTitle")}</h1>
        <p className="mt-3 text-muted">{t("notFoundBody")}</p>
        <Link to="/stories" className="mt-6 inline-block rounded-full bg-soil px-4 py-2 font-semibold text-white">
          {t("backToStories")}
        </Link>
      </div>
    );
  }

  const related = stories
    .filter(
      (item) =>
        item.slug !== story.slug &&
        (item.author === story.author || item.theme === story.theme || item.state === story.state),
    )
    .sort((a, b) => Number(b.author === story.author) - Number(a.author === story.author))
    .slice(0, 3);
  const videoId = youtubeId(story.sourceUrl);
  const facts = [
    [t("crop"), story.crop],
    [t("farmingPractice"), story.practice],
    [t("farmerType"), story.farmerType],
    [t("year"), story.year],
  ].filter(([, value]) => value);

  async function copyLink() {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <article className="mx-auto grid w-full min-w-0 max-w-[1100px] gap-10 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_280px]">
      <div className="min-w-0">
        <Link to="/stories" className="text-sm font-semibold text-soil">
          ← {t("backToStories")}
        </Link>
        {videoId ? (
          <div className="mt-4 aspect-video overflow-hidden rounded-2xl bg-black">
            <iframe
              className="h-full w-full"
              src={`https://www.youtube-nocookie.com/embed/${videoId}`}
              title={story.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="mt-4 aspect-[16/8] overflow-hidden rounded-2xl bg-[linear-gradient(160deg,#e7f3ea_0%,#f7f4ea_55%,#dce8d4_100%)]">
            {story.image && <img src={story.image} alt="" className="h-full w-full object-cover" />}
          </div>
        )}
        <p className="mt-5 text-sm font-semibold text-soil">{story.badge ?? t(themeLabelKey[story.theme])}</p>
        <h1 className="font-display mt-1 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">{story.title}</h1>
        <p className="mt-3 max-w-2xl text-lg text-[#3e4942]">{story.excerpt}</p>
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted">
          {story.location && (
            <span className="inline-flex items-center gap-1">
              <MapPin size={14} className="text-soil" /> {story.location}
            </span>
          )}
          {story.language && (
            <span>
              {t("recordedIn")} {story.language}
            </span>
          )}
          {story.timeAgo && <span>{story.timeAgo}</span>}
        </div>
        {story.note && (
          <p className="mt-4 rounded-xl bg-[#f8f1e4] px-4 py-3 text-sm text-[#6d542c]">{story.note}</p>
        )}
        {story.quote && (
          <blockquote className="font-display mt-6 border-l-4 border-soil pl-4 text-2xl italic leading-snug text-[#1d3b28]">
            {story.quote}
          </blockquote>
        )}
        <div className="mt-6 max-w-2xl space-y-4 text-[17px] leading-relaxed text-[#243028]">
          {story.body.map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>{paragraph}</p>
          ))}
        </div>
        {story.sourceUrl && (
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a
              href={story.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-soil px-4 py-2 text-sm font-semibold text-white hover:bg-soil-dark"
            >
              <ExternalLink size={14} />
              {story.sourceLabel === "note" ? t("readSource") : story.badge === "Field recording" ? t("watchRecording") : t("watchInterview")}
            </a>
            {story.badge === interviewSeries.name && (
              <a href={interviewSeries.url} target="_blank" rel="noreferrer" className="text-sm font-semibold text-soil">
                {t("fromSeries")}
              </a>
            )}
          </div>
        )}
        <div className="mt-6 flex flex-wrap gap-2">
          {story.tags.map((tag) => (
            <Link
              key={tag}
              to={`/stories?q=${encodeURIComponent(tag)}`}
              className="rounded-full bg-[#eef6f0] px-3 py-1 text-sm font-semibold text-soil"
            >
              {tag}
            </Link>
          ))}
        </div>
        <button
          type="button"
          onClick={copyLink}
          className="mt-6 inline-flex items-center gap-2 rounded-full border border-line px-3 py-1.5 text-sm font-semibold"
        >
          {copied ? <Check size={14} className="text-soil" /> : <Link2 size={14} />}
          {copied ? t("linkCopied") : t("copyLink")}
        </button>
      </div>
      <aside className="min-w-0 space-y-4 lg:sticky lg:top-28 lg:self-start">
        <section className="rounded-2xl border border-line p-4">
          <h2 className="text-sm font-bold uppercase tracking-wide text-muted">{t("aboutStoryteller")}</h2>
          <p className="font-display mt-2 text-2xl font-semibold">{story.author}</p>
          <p className="mt-1 text-sm text-muted">{story.location}</p>
          {facts.length > 0 && (
            <dl className="mt-4 space-y-2 text-sm">
              {facts.map(([label, value]) => (
                <div key={label} className="flex justify-between gap-3">
                  <dt className="text-muted">{label}</dt>
                  <dd className="text-right font-semibold">{value}</dd>
                </div>
              ))}
            </dl>
          )}
        </section>
        {story.pending && <p className="rounded-xl bg-[#eef6f0] px-4 py-3 text-sm text-soil">{t("pending")}</p>}
        {related.length > 0 && (
          <div>
            <h2 className="mb-3 font-bold">{t("relatedStories")}</h2>
            <div className="space-y-3">
              {related.map((item) => (
                <StoryCard key={item.slug} story={item} compact />
              ))}
            </div>
          </div>
        )}
      </aside>
    </article>
  );
}
