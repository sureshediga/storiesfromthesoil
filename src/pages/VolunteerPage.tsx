import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../i18n/LanguageContext";

export function VolunteerPage() {
  const { t } = useI18n();

  useEffect(() => {
    document.title = `${t("volunteerTitle")} · ${t("brand")}`;
  }, [t]);

  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-soil">{t("comingSoon")}</p>
      <h1 className="font-display mt-3 text-4xl font-semibold tracking-tight">{t("volunteerTitle")}</h1>
      <p className="mt-4 text-[17px] leading-relaxed text-[#3e4942]">{t("comingSoonBody")}</p>
      <Link to="/" className="mt-8 inline-block rounded-full bg-soil px-4 py-2 font-semibold text-white">
        {t("goHome")}
      </Link>
    </div>
  );
}
