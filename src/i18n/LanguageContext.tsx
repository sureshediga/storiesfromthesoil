import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { languages, translate, type CopyKey, type Lang } from "./copy";

const STORAGE_KEY = "sfts-language";

type LanguageValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: CopyKey) => string;
};

const LanguageContext = createContext<LanguageValue | null>(null);

function readLang(): Lang {
  const saved = localStorage.getItem(STORAGE_KEY);
  return languages.some((language) => language.code === saved) ? (saved as Lang) : "en";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => readLang());

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dataset.lang = lang;
    localStorage.setItem(STORAGE_KEY, lang);
  }, [lang]);

  const value = useMemo<LanguageValue>(
    () => ({
      lang,
      setLang: setLangState,
      t: (key) => translate(lang, key),
    }),
    [lang],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useI18n() {
  const value = useContext(LanguageContext);
  if (!value) throw new Error("useI18n must be used within LanguageProvider");
  return value;
}
