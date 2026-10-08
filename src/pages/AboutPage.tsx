import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../i18n/LanguageContext";

export function AboutPage() {
  const { t } = useI18n();
  useEffect(() => {
    document.title = `${t("aboutTitle")} · ${t("brand")}`;
  }, [t]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-soil">{t("brand")}</p>
      <h1 className="font-display mt-2 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
        Every farmer has a story. Every voice matters.
      </h1>
      {t("aboutIntro") && (
        <p className="mt-6 rounded-2xl bg-[#f4faf6] px-5 py-4 text-[17px] leading-relaxed text-[#1d3b28]">
          {t("aboutIntro")}
        </p>
      )}
      <div className="mt-8 space-y-5 text-[18px] leading-relaxed text-[#243028]">
        <p>
          <strong>Stories from the Soil</strong> is an initiative to document, preserve, and share the lives,
          struggles, experiences, wisdom, and aspirations of farmers.
        </p>
        <p>
          Behind every field and every harvest is a human story — a story of hard work, uncertainty, resilience,
          success, failure, and hope. Farmers face numerous challenges, from rising costs, debt, and unpredictable
          weather to declining soil fertility, changing agricultural practices, and the struggle to sustain their
          livelihoods. Yet they also carry generations of traditional knowledge, innovative ideas, and experiences
          that often go unheard and undocumented.
        </p>
        <p className="font-display text-2xl font-semibold leading-snug text-soil">
          Stories from the Soil seeks to give these voices a platform.
        </p>
        <p>
          Our vision is to build a living, searchable digital library of farmers’ stories from across regions,
          communities, and generations. Through written narratives, photographs, audio recordings, and videos, we aim
          to capture not just how farmers cultivate the land, but also how they live, the challenges they endure, the
          choices they make, and the changes they hope to see.
        </p>
        <p>
          The platform brings together stories covering farmers’ livelihoods, hardships, agricultural practices,
          traditional wisdom, environmental challenges, migration, community initiatives, innovations, and personal
          journeys.
        </p>
        <p>
          We believe that every farmer is not just a producer of food but also a{" "}
          <strong>custodian of knowledge, a witness to change, and a storyteller</strong> whose experiences deserve
          to be heard.
        </p>
        <p>
          We invite farmers, volunteers, researchers, students, journalists, and organizations working with farming
          communities to help collect, document, translate, and share these stories.
        </p>
        <p>
          By making these stories accessible to everyone, we hope to foster understanding, preserve invaluable
          knowledge, inspire meaningful conversations, and build greater empathy and solidarity with farming
          communities.
        </p>
        <p>
          Stories from the Soil is more than a collection of farming practices. It is a collective memory of the
          people who feed us, their relationship with the land, their struggles for survival and dignity, and their
          hopes for a better future.
        </p>
      </div>
      <blockquote className="font-display mt-8 border-l-4 border-soil pl-4 text-2xl italic leading-snug">
        Every farmer has a story. Let’s make sure it is heard, remembered, and passed on.
      </blockquote>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link to="/stories" className="rounded-full bg-soil px-4 py-2 font-semibold text-white">
          {t("navStories")}
        </Link>
        <Link to="/share" className="rounded-full border border-soil px-4 py-2 font-semibold text-soil">
          {t("shareStory")}
        </Link>
        <Link to="/volunteer" className="rounded-full border border-line px-4 py-2 font-semibold">
          {t("volunteer")}
        </Link>
      </div>
    </div>
  );
}
