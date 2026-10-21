"use client";

import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";
import { ThemeToggle } from "@/components/theme-provider";
import { useEffect } from "react";
import { legal, legalContact, legalOperator, legalUpdatedOn, providerDocuments } from "@/data/legal";
import { formatAccessDate, locales, type Locale } from "@/lib/i18n";
import { brandName } from "@/lib/i18n/brand";
import { setLocalePreference, useLocale } from "@/lib/i18n/store";

export function LegalPage({ kind, initialLocale }: { kind: "privacy" | "terms"; initialLocale: Locale }) {
  const locale = useLocale(initialLocale);
  const copy = legal[locale];
  const document = copy[kind];

  useEffect(() => {
    window.document.documentElement.lang = locale;
    window.document.title = `${document.title} | ${brandName(locale)}`;
    window.document.querySelector<HTMLMetaElement>('meta[name="description"]')?.setAttribute("content", document.intro);
  }, [document, locale]);

  return <div className="legal-shell">
    <header className="legal-header">
      <Link className="legal-brand" href="/" aria-label={brandName(locale)}><BrandMark /><span>{brandName(locale)}</span></Link>
      <div className="legal-header-actions">
        <ThemeToggle locale={locale} />
        <div className="locale-switch" role="group" aria-label={copy.languageLabel}>
          {locales.map((option) => <button key={option} type="button" aria-pressed={locale === option}
            onClick={() => setLocalePreference(option)}>{option.toUpperCase()}</button>)}
        </div>
        <Link className="legal-back" href="/">{copy.backToAtlas}</Link>
      </div>
    </header>
    <main className="legal-main">
      <div className="legal-kicker">{brandName(locale)} / {kind === "privacy" ? copy.privacyLink : copy.termsLink}</div>
      <h1>{document.title}</h1>
      <p className="legal-intro">{document.intro}</p>
      <p className="legal-date">{copy.updated}: <time dateTime={legalUpdatedOn}>{formatAccessDate(locale, legalUpdatedOn)}</time></p>
      <div className="legal-sections">
        {document.sections.map((section, index) => <section key={index} aria-labelledby={`legal-section-${index}`}>
          <h2 id={`legal-section-${index}`}>{section.heading}</h2>
          {section.paragraphs.map((paragraph, paragraphIndex) => <p key={paragraphIndex}>{paragraph}</p>)}
        </section>)}
      </div>
      <aside className="legal-contact" aria-label={copy.contact}>
        <div><span>{copy.operator}</span><strong>{legalOperator}</strong></div>
        <div><span>{copy.contact}</span><a href={`mailto:${legalContact}`}>{legalContact}</a></div>
      </aside>
      {kind === "privacy" && <div className="legal-providers">
        <h2>{copy.externalPolicies}</h2>
        <ul>{providerDocuments.map((provider) => <li key={provider.id}><a href={provider.url} target="_blank" rel="noopener noreferrer">
          {provider.id === "google" ? "Google Gemini API" : provider.id === "vercel" ? "Vercel" : "OpenFreeMap"} <span aria-hidden="true">↗</span>
        </a></li>)}</ul>
      </div>}
    </main>
    <footer className="legal-footer">
      <Link href="/privacy" aria-current={kind === "privacy" ? "page" : undefined}>{copy.privacyLink}</Link>
      <Link href="/terms" aria-current={kind === "terms" ? "page" : undefined}>{copy.termsLink}</Link>
      <Link href="/">{brandName(locale)}</Link>
    </footer>
  </div>;
}
