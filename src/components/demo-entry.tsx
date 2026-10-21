"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { AtlasShell } from "@/components/atlas/atlas-shell";
import { BrandMark } from "@/components/brand-mark";
import { ReadingModeToggle, ThemeToggle } from "@/components/theme-provider";
import { accessCopy } from "@/data/demo-access-translations";
import { legal } from "@/data/legal";
import { useDemoProfile, saveDemoProfile } from "@/lib/demo-profile";
import { locales, type Locale } from "@/lib/i18n";
import { brandName } from "@/lib/i18n/brand";
import { setLocalePreference, useLocale } from "@/lib/i18n/store";

export function MuraEntry({ initialLocale }: { initialLocale: Locale }) {
  const locale = useLocale(initialLocale);
  const profile = useDemoProfile();
  const [mode, setMode] = useState<"signin" | "register">("signin");
  const copy = accessCopy[locale];

  useEffect(() => { document.documentElement.lang = locale; }, [locale]);

  if (profile === undefined) return <main className="access-loading" aria-label={copy.title}><BrandMark /><strong>{brandName(locale)}</strong></main>;
  if (profile) return <AtlasShell initialLocale={initialLocale} />;

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = mode === "register" ? String(data.get("name") ?? "").trim() : copy.visitor;
    const ru = mode === "register" ? String(data.get("ru") ?? "").trim() : "";
    saveDemoProfile({ name: name || copy.visitor, ru });
  }

  return <main className="access-layout">
    <section className="access-hero" aria-labelledby="access-hero-title">
      <div className="access-hero-top"><BrandMark /><span>{brandName(locale)} <small>{copy.subtitle}</small></span></div>
      <svg className="access-hero-art" viewBox="0 0 560 560" fill="none" aria-hidden="true">
        <circle cx="280" cy="280" r="204" stroke="currentColor" strokeWidth="1" strokeDasharray="3 9" />
        <circle cx="280" cy="280" r="157" stroke="currentColor" strokeWidth="1" />
        <circle cx="280" cy="280" r="111" stroke="currentColor" strokeWidth="1" strokeDasharray="2 8" />
        <path d="M54 352c90-52 122-34 190-94 76-68 151-95 261-54M75 428c85-90 167-75 238-115 73-41 105-75 183-76" stroke="currentColor" strokeWidth="2" />
        <path d="M280 28v58m0 388v58M28 280h58m388 0h58" stroke="currentColor" strokeWidth="1" />
        <circle cx="244" cy="258" r="6" fill="currentColor" /><circle cx="399" cy="223" r="6" fill="currentColor" /><circle cx="158" cy="386" r="6" fill="currentColor" />
      </svg>
      <div className="access-hero-content"><span className="access-overline">{copy.heroLabel}</span><h1 id="access-hero-title">{copy.heroTitle}</h1>
        <p>{copy.heroBody}</p><span className="access-hero-foot">{copy.heroFoot}</span></div>
    </section>
    <section className="access-side" aria-labelledby="access-form-title">
      <header className="access-side-header"><div className="access-side-brand"><BrandMark /><strong>{brandName(locale)}</strong></div>
        <div className="access-preferences"><ReadingModeToggle locale={locale} /><ThemeToggle locale={locale} /><div className="locale-switch" role="group" aria-label={legal[locale].languageLabel}>
          {locales.map((option) => <button key={option} type="button" lang={option} aria-pressed={locale === option} onClick={() => setLocalePreference(option)}>{option.toUpperCase()}</button>)}
        </div></div></header>
      <div className="access-form-wrap">
        <div className="access-heading"><span className="access-overline">{brandName(locale)} / {copy.subtitle}</span><h2 id="access-form-title">{mode === "signin" ? copy.welcome : copy.registerTitle}</h2><p>{copy.intro}</p></div>
        <div className="access-tabs" role="group" aria-label={copy.title}>
          <button type="button" aria-pressed={mode === "signin"} onClick={() => setMode("signin")}>{copy.signIn}</button>
          <button type="button" aria-pressed={mode === "register"} onClick={() => setMode("register")}>{copy.register}</button>
        </div>
        <form key={mode} className="access-form" onSubmit={submit} autoComplete="off">
          {mode === "register" && <label>{copy.name}<input name="name" type="text" maxLength={48} required autoComplete="off" /></label>}
          <label>{copy.contact}<input name="contact" type="text" required autoComplete="off" /></label>
          <label>{copy.password}<input name="password" type="password" required autoComplete="off" /></label>
          {mode === "register" && <label>{copy.ru}<input name="ru" type="text" maxLength={60} placeholder={copy.ruPlaceholder} autoComplete="off" /></label>}
          <button className="access-submit" type="submit">{mode === "signin" ? copy.submitSignIn : copy.submitRegister}<span aria-hidden="true">↗</span></button>
        </form>
        <p className="access-demo-note">{copy.demoNote}</p>
        <p className="access-ru-note">{copy.ruNote}</p>
      </div>
      <footer className="access-footer"><Link href="/privacy">{legal[locale].privacyLink}</Link><span aria-hidden="true">·</span><Link href="/terms">{legal[locale].termsLink}</Link></footer>
    </section>
  </main>;
}
