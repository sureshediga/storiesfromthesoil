import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../i18n/LanguageContext";
import { useLibrary } from "../lib/library";

export function ContributorsPage() {
  const { t } = useI18n();
  const { stories, volunteers } = useLibrary();
  const tellers = [...stories.filter((story) => !story.pending).reduce((map, story) => {
    const group = map.get(story.author) ?? [];
    group.push(story);
    map.set(story.author, group);
    return map;
  }, new Map<string, typeof stories>())];

  useEffect(() => {
    document.title = `${t("contributorsTitle")} · ${t("brand")}`;
  }, [t]);

  return (
    <div className="mx-auto max-w-[1100px] px-4 py-10 sm:px-6">
      <h1 className="font-display text-4xl font-semibold tracking-tight">{t("contributorsTitle")}</h1>
      <p className="mt-3 max-w-2xl text-lg text-[#3e4942]">{t("contributorsLead")}</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link to="/share" className="rounded-full bg-soil px-4 py-2 text-sm font-semibold text-white">
          {t("shareStory")}
        </Link>
        <Link to="/volunteer" className="rounded-full border border-soil px-4 py-2 text-sm font-semibold text-soil">
          {t("volunteer")}
        </Link>
      </div>

      <h2 className="mt-10 text-xl font-bold">{t("storytellers")}</h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {tellers.map(([author, group]) => (
          <li key={author}>
            <Link
              to={group.length > 1 ? `/stories?q=${encodeURIComponent(author)}` : `/stories/${group[0].slug}`}
              className="block rounded-xl border border-line px-4 py-3 hover:border-soil"
            >
              <span className="block font-semibold">{author}</span>
              <span className="text-sm text-muted">{group[0].location}</span>
              {group.length > 1 && (
                <span className="mt-1 block text-sm font-semibold text-soil">
                  {group.length} {t("storiesWord")}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>

      {volunteers.length > 0 && (
        <>
          <h2 className="mt-10 text-xl font-bold">{t("volunteer")}</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {volunteers.map((person) => (
              <li key={person.id} className="rounded-xl bg-[#f7faf7] px-4 py-3">
                <p className="font-semibold">{person.name}</p>
                <p className="text-sm text-muted">{person.region}</p>
                <p className="mt-1 text-sm text-soil">{person.help.join(" · ")}</p>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
