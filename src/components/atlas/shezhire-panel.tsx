"use client";

import { useEffect, useRef, useState } from "react";
import { sources } from "@/data/atlas";
import { figures } from "@/data/figures";
import { shezhireSources, shezhireZhuzes, type ShezhireRu, type ShezhireZhuz } from "@/data/shezhire";
import { ui } from "@/data/ui-translations";
import { figureText } from "@/data/historical-translations";
import type { Locale } from "@/lib/i18n";

type Props = { open: boolean; onClose: () => void; onExploreFigure: (id: string) => void; locale: Locale };

function SourceLinks({ ids, locale }: { ids: string[]; locale: Locale }) {
  return <div className="shezhire-sources"><span>{ui[locale].sources}</span>{ids.map((id) => {
    const source = shezhireSources.find((item) => item.id === id);
    return source ? <a key={id} href={source.url} target="_blank" rel="noopener noreferrer">{source.title} ↗</a> : null;
  })}</div>;
}

function RuCard({ ru, locale, onClick }: { ru: ShezhireRu; locale: Locale; onClick: () => void }) {
  return <li><button type="button" className="shezhire-ru-card" onClick={onClick}>
    <span className="shezhire-node" aria-hidden="true" />
    <span><strong>{ru.name[locale]}</strong>{ru.association && <small>{ui[locale].shezhireAssociation}: {ru.association[locale]}</small>}</span>
    <span aria-hidden="true">↗</span>
  </button></li>;
}

function ZhuzCard({ zhuz, locale, onClick }: { zhuz: ShezhireZhuz; locale: Locale; onClick: () => void }) {
  return <button type="button" className="shezhire-zhuz-card" onClick={onClick}>
    <span className="shezhire-card-rule" aria-hidden="true" /><strong>{zhuz.name[locale]}</strong>
    <span>{zhuz.overview[locale]}</span><small>{ui[locale].shezhireOpen} <span aria-hidden="true">↗</span></small>
  </button>;
}

export function ShezhirePanel({ open, onClose, onExploreFigure, locale }: Props) {
  const [selectedZhuzId, setSelectedZhuzId] = useState<string | null>(null);
  const [selectedRuId, setSelectedRuId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const panelRef = useRef<HTMLElement>(null);
  const copy = ui[locale];
  const zhuz = shezhireZhuzes.find((item) => item.id === selectedZhuzId);
  const ru = zhuz?.ru.find((item) => item.id === selectedRuId);
  const query = search.trim().toLocaleLowerCase();
  const matches = query ? shezhireZhuzes.flatMap((item) => {
    const matchZhuz = Object.values(item.name).some((value) => value.toLocaleLowerCase().includes(query));
    const matchingRu = item.ru.filter((group) => matchZhuz || [...Object.values(group.name), ...Object.values(group.association ?? {})]
      .some((value) => value.toLocaleLowerCase().includes(query)));
    return [{ zhuz: item, ru: null as ShezhireRu | null }, ...matchingRu.map((group) => ({ zhuz: item, ru: group }))]
      .filter((result) => result.ru || matchZhuz);
  }) : [];

  useEffect(() => {
    const media = window.matchMedia("(max-width: 960px)");
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previousFocus = document.activeElement;
    panelRef.current?.querySelector<HTMLButtonElement>(".guide-close")?.focus();
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") { onClose(); return; }
      if (event.key !== "Tab" || !window.matchMedia("(max-width: 960px)").matches || !panelRef.current) return;
      const focusable = [...panelRef.current.querySelectorAll<HTMLElement>("button:not(:disabled), input:not(:disabled), a[href]")];
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => { document.removeEventListener("keydown", handleKeyDown); if (previousFocus instanceof HTMLElement) previousFocus.focus(); };
  }, [open, onClose]);

  useEffect(() => {
    if (!open || !isMobile) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [open, isMobile]);

  if (!open) return null;

  function selectZhuz(id: string) { setSelectedZhuzId(id); setSelectedRuId(null); setSearch(""); }
  function selectRu(parentId: string, id: string) { setSelectedZhuzId(parentId); setSelectedRuId(id); setSearch(""); }

  return <>
    {isMobile && <button className="guide-backdrop" type="button" tabIndex={-1} aria-label={copy.shezhireCloseLabel} onClick={onClose} />}
    <section ref={panelRef} className="guide-panel shezhire-panel" role={isMobile ? "dialog" : "region"} aria-modal={isMobile ? true : undefined} aria-labelledby="shezhire-title">
      <div className="guide-top"><div><span className="panel-overline">{copy.shezhireOverline}</span><h2 id="shezhire-title">{copy.shezhireTitle}</h2></div>
        <button type="button" className="guide-close" onClick={onClose} aria-label={copy.shezhireCloseLabel}>{copy.shezhireClose}</button></div>
      <div className="shezhire-body">
        <p className="shezhire-intro">{copy.shezhireIntro}</p>
        <p className="shezhire-boundary">{copy.shezhireCollective}</p>
        <label className="shezhire-search">{copy.shezhireSearch}<input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder={copy.shezhireSearchPlaceholder} /></label>
        {query ? <section className="shezhire-view" aria-live="polite">
          <h3>{copy.shezhireSearch}</h3>
          {matches.length ? <div className="shezhire-results">{matches.map((result) => <button key={`${result.zhuz.id}:${result.ru?.id ?? "all"}`} type="button"
            onClick={() => result.ru ? selectRu(result.zhuz.id, result.ru.id) : selectZhuz(result.zhuz.id)}>
            <span>{result.zhuz.name[locale]}</span><strong>{result.ru?.name[locale] ?? result.zhuz.name[locale]}</strong><span aria-hidden="true">↗</span>
          </button>)}</div> : <p className="empty-copy">{copy.shezhireNoResults}</p>}
        </section> : ru && zhuz ? <section key={ru.id} className="shezhire-view" aria-live="polite">
          <nav className="shezhire-breadcrumb" aria-label={copy.shezhireTitle}><button type="button" onClick={() => { setSelectedZhuzId(null); setSelectedRuId(null); }}>{copy.shezhireZhuzes}</button><span>/</span>
            <button type="button" onClick={() => setSelectedRuId(null)}>{zhuz.name[locale]}</button><span>/</span><strong>{ru.name[locale]}</strong></nav>
          <span className="shezhire-kicker">{copy.shezhireOverview}</span><h3>{ru.name[locale]}</h3>
          {ru.association && <p className="shezhire-association">{copy.shezhireAssociation}: <strong>{ru.association[locale]}</strong> · {zhuz.name[locale]}</p>}
          <p>{ru.overview?.[locale] ?? copy.shezhireMissing}</p>
          <SourceLinks ids={ru.sourceIds} locale={locale} />
          <p className="shezhire-detail-note">{copy.shezhireCollective}</p>
          <button type="button" className="shezhire-back" onClick={() => setSelectedRuId(null)}>← {copy.shezhireBack}</button>
        </section> : zhuz ? <section key={zhuz.id} className="shezhire-view" aria-live="polite">
          <nav className="shezhire-breadcrumb" aria-label={copy.shezhireTitle}><button type="button" onClick={() => setSelectedZhuzId(null)}>{copy.shezhireZhuzes}</button><span>/</span><strong>{zhuz.name[locale]}</strong></nav>
          <span className="shezhire-kicker">{copy.shezhireOverview}</span><h3>{zhuz.name[locale]}</h3><p>{zhuz.overview[locale]}</p>
          <SourceLinks ids={zhuz.sourceIds} locale={locale} />
          {zhuz.contextualFigureId && (() => {
            const figure = figures.find((item) => item.id === zhuz.contextualFigureId);
            const source = sources.find((item) => item.id === "eh-abulkhair");
            return figure && <div className="shezhire-figure"><span>{copy.shezhireFigure}</span><strong>{figureText(figure, "name", locale)}</strong>
              <p>{copy.shezhireFigureNote}</p>{source && <a href={source.url} target="_blank" rel="noopener noreferrer">{source.title} ↗</a>}
              <button type="button" onClick={() => onExploreFigure(figure.id)}>{copy.shezhireExploreFigure} ↗</button></div>;
          })()}
          <h4>{copy.shezhireGroups}</h4><ol className="shezhire-tree">{zhuz.ru.map((group) => <RuCard key={group.id} ru={group} locale={locale} onClick={() => selectRu(zhuz.id, group.id)} />)}</ol>
        </section> : <section className="shezhire-view" aria-live="polite">
          <h3>{copy.shezhireZhuzes}</h3><div className="shezhire-zhuz-list">{shezhireZhuzes.map((item) => <ZhuzCard key={item.id} zhuz={item} locale={locale} onClick={() => selectZhuz(item.id)} />)}</div>
          <p className="shezhire-detail-note">{copy.shezhireUncertain}</p><SourceLinks ids={["term"]} locale={locale} />
        </section>}
        {locale !== "ru" && <p className="learn-review">{copy.translationReview}</p>}
      </div>
    </section>
  </>;
}
