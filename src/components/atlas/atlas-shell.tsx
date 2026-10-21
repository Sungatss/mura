"use client";

import Link from "next/link";
import Image from "next/image";
import { BrandMark } from "@/components/brand-mark";
import { ReadingModeToggle, ThemeToggle } from "@/components/theme-provider";
import { DemoProfileMenu } from "@/components/demo-profile-menu";
import { useCallback, useEffect, useRef, useState } from "react";
import { GuidePanel } from "./guide-panel";
import { LearningPanel } from "./learning-panel";
import { MapCanvas } from "./map-canvas";
import { ShezhirePanel } from "./shezhire-panel";
import { ShezhireTree } from "./shezhire-tree";
import { eras, sources } from "@/data/atlas";
import { eventCategory, type EventCategory } from "@/data/event-categories";
import { figures } from "@/data/figures";
import { figureArtwork } from "@/data/figure-artwork";
import { eraHistoryImages, eventHistoryImages, figureHistoryImages } from "@/data/history-images";
import { figureSignificance } from "@/data/figure-profiles";
import { ui } from "@/data/ui-translations";
import { historicalPlaces, placeVisibleInEra, type HistoricalPlace } from "@/data/historical-places";
import { legal } from "@/data/legal";
import { eraText, eventText, figureText, sourceNote, sourceTitle, territoryText } from "@/data/historical-translations";
import type { Era, EraDataset, EventFeature, HistoricalFigure } from "@/lib/atlas/types";
import { validateEraData } from "@/lib/atlas/validate";
import { formatAccessDate, formatCount, type Locale } from "@/lib/i18n";
import { setLocalePreference, useLocale } from "@/lib/i18n/store";
import { brandName } from "@/lib/i18n/brand";

type LoadState = "loading" | "ready" | "empty" | "error";

function formatDisplayText(value: string) {
  return value.replaceAll(" — ", ": ");
}

function figureRole(id: string, locale: Locale): string {
  const copy = ui[locale];
  if (["tole-bi", "kazybek-bi", "aiteke-bi"].includes(id)) return copy.figureBiRole;
  if (["bogenbay", "kabanbay"].includes(id)) return copy.figureBatyrRole;
  if (id === "bukhar-zhyrau") return copy.figureZhyrauRole;
  return copy.figureRole;
}

function SourceLinks({ ids, locale }: { ids: string[]; locale: Locale }) {
  const copy = ui[locale];
  return <ul className="source-list">{ids.map((id) => {
    const source = sources.find((item) => item.id === id);
    if (!source) return null;
    return <li key={id}>
      <a href={source.url} target="_blank" rel="noopener noreferrer" title={source.title}>{formatDisplayText(sourceTitle(id, source.title, locale))} <span aria-hidden="true">↗</span></a>
      <span>{source.license === "Все права защищены" ? copy.sourceRightsReserved : source.license}{source.note ? ` · ${sourceNote(id, source.note, locale)}` : ""}</span>
    </li>;
  })}</ul>;
}

function EventRow({ feature, locale, onSelect, illustrated = false }: { feature: EventFeature; locale: Locale; onSelect: () => void; illustrated?: boolean }) {
  const event = feature.properties;
  const copy = ui[locale];
  const image = illustrated ? eventHistoryImages[event.id] : undefined;
  return <li>
    <button type="button" className="content-row" onClick={onSelect}>
      {image && <span className="content-row-image"><Image src={image.src} alt="" fill sizes="280px" /><span>{image.label[locale]}</span></span>}
      <span className="content-row-date">{eventText(event, "dateLabel", locale)}</span>
      <span className="content-row-main">{eventText(event, "name", locale)}</span>
      <span className="content-row-meta">{event.coordinateStatus === "technical-fixture" ? copy.fixturePoint : feature.geometry ? copy.mappedApprox : copy.noExactPoint}</span>
    </button>
  </li>;
}

function FigureRow({ figure, locale, onSelect }: { figure: HistoricalFigure; locale: Locale; onSelect: () => void }) {
  const count = figure.eventIds.length;
  const eventCount = formatCount(locale, count, ui[locale].linkedEventUnits.split("|") as [string, string, string]);
  return <li><button type="button" className="content-row figure-row" onClick={onSelect}>
    <span className="content-row-main">{figureText(figure, "name", locale)}</span>
    <span className="content-row-meta">{eventCount}</span>
  </button></li>;
}

function CharacterCard({ figure, locale, eraLabel, onSelect }: { figure: HistoricalFigure; locale: Locale; eraLabel: string; onSelect: () => void }) {
  const artwork = figureArtwork[figure.id] ?? figureHistoryImages[figure.id];
  const copy = ui[locale];
  const eventCount = formatCount(locale, figure.eventIds.length, copy.linkedEventUnits.split("|") as [string, string, string]);
  return <li><button type="button" className="character-card" onClick={onSelect} aria-label={`${copy.figureExplore}: ${figureText(figure, "name", locale)}`}>
    <span className="character-card-image">{artwork
      ? <Image src={artwork.src} alt="" fill sizes="(max-width: 600px) 112px, 120px" style={{ objectPosition: artwork.position }} />
      : <span className="character-sigil" aria-hidden="true">{figureText(figure, "name", locale).slice(0, 1)}</span>}</span>
    <span className="character-card-content">
      <span className="character-card-eyebrow">{figureRole(figure.id, locale)} <span aria-hidden="true">/</span> {eraLabel}</span>
      <span className="character-card-title">{figureText(figure, "name", locale)}</span>
      <span className="character-card-summary">{figureText(figure, "description", locale)}</span>
      <span className="character-card-footer"><span>{eventCount}</span><span aria-hidden="true">↗</span></span>
    </span>
    <span className="character-card-art-label">{artwork?.label[locale] ?? copy.figureNoPortrait}</span>
  </button></li>;
}

function CompareEraSummary({ era, data, status, locale, onExplore, tone }: {
  era: Era; data: EraDataset | null; status: LoadState; locale: Locale; onExplore: () => void; tone: "first" | "second";
}) {
  const copy = ui[locale];
  const highlights = data?.events.features.filter((feature) => feature.properties.highlightRank != null && feature.properties.sourceIds.length)
    .sort((a, b) => (a.properties.highlightRank ?? 0) - (b.properties.highlightRank ?? 0)).slice(0, 3) ?? [];
  return <section className={`compare-era compare-era-${tone}`}>
    <div className="compare-era-heading"><span className="compare-swatch" aria-hidden="true" /><div><span>{tone === "first" ? copy.compareFirst : copy.compareSecond}</span><h2>{eraText(era, "label", locale)}</h2></div></div>
    <p>{eraText(era, "description", locale)}</p>
    {data && data.territories.features.length === 0 && <p className="certainty-note">{copy.noTerritories}</p>}
    {data ? highlights.length ? <ol className="compare-highlights">{highlights.map((feature) => {
      const source = sources.find((item) => feature.properties.sourceIds.includes(item.id));
      return <li key={feature.properties.id}><span>{eventText(feature.properties, "dateLabel", locale)}</span><strong>{eventText(feature.properties, "name", locale)}</strong>
        {source && <a href={source.url} target="_blank" rel="noopener noreferrer">{sourceTitle(source.id, source.title, locale)} ↗</a>}</li>;
    })}</ol> : <p className="empty-copy">{copy.compareNoHighlights}</p> : <p className="data-message" role="status">{status === "error" ? copy.dataError : status === "empty" ? copy.noData : copy.compareLoading}</p>}
    <button type="button" className="compare-explore" onClick={onExplore}>{copy.compareExplore} <span aria-hidden="true">↗</span></button>
  </section>;
}

export function AtlasShell({ initialLocale }: { initialLocale: Locale }) {
  const locale = useLocale(initialLocale);
  const [selectedId, setSelectedId] = useState(eras[0].id);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [closingEventId, setClosingEventId] = useState<string | null>(null);
  const [selectedFigureId, setSelectedFigureId] = useState<string | null>(null);
  const [closingFigureId, setClosingFigureId] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<EventCategory | "all">("all");
  const [compareOpen, setCompareOpen] = useState(false);
  const [compareId, setCompareId] = useState(eras[1].id);
  const [compareData, setCompareData] = useState<EraDataset | null>(null);
  const [compareState, setCompareState] = useState<LoadState>("loading");
  const [compareBalance, setCompareBalance] = useState(50);
  const compareCache = useRef(new Map<string, EraDataset>());
  const [data, setData] = useState<EraDataset | null>(null);
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [retry, setRetry] = useState(0);
  const [guideOpen, setGuideOpen] = useState(false);
  const [learningOpen, setLearningOpen] = useState(false);
  const [shezhireOpen, setShezhireOpen] = useState(false);
  const [shezhireDetailOpen, setShezhireDetailOpen] = useState(false);
  const [selectedZhuzId, setSelectedZhuzId] = useState<string | null>(null);
  const [selectedRuId, setSelectedRuId] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);
  const [layoutMode, setLayoutMode] = useState<"split" | "map" | "panel">("split");
  const [fullscreen, setFullscreen] = useState(false);
  const [layersOpen, setLayersOpen] = useState(false);
  const [visiblePlaceKinds, setVisiblePlaceKinds] = useState<NonNullable<HistoricalPlace["kind"]>[]>(["center", "settlement", "cultural", "assembly"]);
  const [showEventMarkers, setShowEventMarkers] = useState(true);
  const [showWarChronicle, setShowWarChronicle] = useState(true);
  const [panelWidth, setPanelWidth] = useState(360);
  const workspaceRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const closeGuide = useCallback(() => setGuideOpen(false), []);
  const closeLearning = useCallback(() => setLearningOpen(false), []);
  const closeShezhire = useCallback(() => {
    if (window.matchMedia("(max-width: 960px)").matches && shezhireDetailOpen) setShezhireDetailOpen(false);
    else setShezhireOpen(false);
  }, [shezhireDetailOpen]);
  const copy = ui[locale];
  const selectedEra = eras.find((era) => era.id === selectedId) ?? eras[0];
  const compareEra = eras.find((era) => era.id === compareId) ?? eras[1];
  const historicalEras = eras.filter((era) => era.kind === "historical-reconstruction");
  const territorySource = sources.find((item) => item.id === "cliopatria-v021");
  const events = data?.events.features ?? [];
  const categoryLabels: Record<EventCategory, string> = {
    politics: copy.mapCategoryPolitics,
    conflict: copy.mapCategoryConflict,
    records: copy.mapCategoryRecords,
    diplomacy: copy.mapCategoryDiplomacy,
    other: copy.mapCategoryOther,
  };
  const categories = [...new Set(events.map((feature) => eventCategory(feature.properties.id)))];
  const locatedCount = events.filter((feature) => feature.geometry
    && (selectedEra.kind === "technical-fixture" || !!feature.properties.coordinateSourceIds?.length)
    && (categoryFilter === "all" || eventCategory(feature.properties.id) === categoryFilter)).length;
  const visiblePlaces = historicalPlaces.filter((place) => placeVisibleInEra(place, selectedId) && visiblePlaceKinds.includes(place.kind ?? "settlement"));
  const warEvents = events.filter((feature) => eventCategory(feature.properties.id) === "conflict" && !feature.geometry);
  const activeEvent = events.find((feature) => feature.properties.id === selectedEventId);
  const activePlace = historicalPlaces.find((place) => place.id === selectedPlaceId);
  const eraFigures = figures.filter((figure) => figure.eraIds.includes(selectedId));
  const activeFigure = eraFigures.find((figure) => figure.id === selectedFigureId);
  const activeFigureVisual = activeFigure ? figureArtwork[activeFigure.id] ?? figureHistoryImages[activeFigure.id] : undefined;
  const activeEventVisual = activeEvent ? eventHistoryImages[activeEvent.properties.id] : undefined;
  const activeEraVisual = eraHistoryImages[selectedId];
  const selectedHasTerritory = Boolean(data?.territories.features.length);
  const compareHasTerritory = Boolean(compareData?.territories.features.length);
  const highlights = events.filter((feature) => feature.properties.highlightRank !== null && feature.properties.highlightRank !== undefined)
    .sort((a, b) => (a.properties.highlightRank ?? 0) - (b.properties.highlightRank ?? 0));

  useEffect(() => {
    document.documentElement.lang = locale;
    document.title = `${brandName(locale)} | ${copy.brandSubtitle}`;
    document.querySelector<HTMLMetaElement>('meta[name="description"]')?.setAttribute("content", copy.atlasIntro);
  }, [locale, copy]);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 960px)");
    const update = () => setMobile(media.matches);
    update();
    media.addEventListener("change", update);
    const frame = requestAnimationFrame(() => {
      const storedWidth = Number(localStorage.getItem("mura-panel-width"));
      const storedMode = localStorage.getItem("mura-layout-mode");
      if (Number.isFinite(storedWidth) && storedWidth >= 280 && storedWidth <= 700) setPanelWidth(storedWidth);
      if (storedMode === "map" || storedMode === "panel") setLayoutMode(storedMode);
    });
    return () => { media.removeEventListener("change", update); cancelAnimationFrame(frame); };
  }, []);

  function changeLayout(mode: "split" | "map" | "panel") {
    setFullscreen(false);
    setLayoutMode(mode);
    localStorage.setItem("mura-layout-mode", mode);
  }

  useEffect(() => {
    if (!fullscreen) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") setFullscreen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [fullscreen]);

  function resizePanel(clientX: number) {
    const rect = workspaceRef.current?.getBoundingClientRect();
    if (!rect) return;
    const width = Math.max(280, Math.min(Math.min(700, rect.width * 0.58), rect.right - clientX - 18));
    setPanelWidth(Math.round(width));
  }

  function selectShezhire(zhuzId: string | null, ruId: string | null) {
    setSelectedZhuzId(zhuzId);
    setSelectedRuId(ruId);
    setShezhireDetailOpen(Boolean(zhuzId));
    if (fullscreen && zhuzId) setFullscreen(false);
  }

  function selectEra(id: string) {
    if (id === selectedId) return;
    if (id === compareId && compareOpen) {
      setCompareId(selectedId);
      setCompareData(null);
    }
    if (id === "technical-fixture") setCompareOpen(false);
    setSelectedEventId(null);
    setSelectedPlaceId(null);
    setClosingEventId(null);
    setSelectedFigureId(null);
    setClosingFigureId(null);
    setCategoryFilter("all");
    setData(null);
    setLoadState("loading");
    setSelectedId(id);
  }

  function toggleCompare() {
    if (!compareOpen) {
      if (compareId === selectedId) setCompareId(historicalEras.find((era) => era.id !== selectedId)!.id);
      setSelectedEventId(null);
      setSelectedFigureId(null);
      setClosingEventId(null);
      setClosingFigureId(null);
      setGuideOpen(false);
      setLearningOpen(false);
      setShezhireOpen(false);
    }
    setCompareOpen((current) => !current);
  }

  function openEvent(id: string, fromMap = false) {
    if (fullscreen) { setFullscreen(false); if (!mobile) changeLayout("split"); }
    const selected = events.find((feature) => feature.properties.id === id);
    if (selected?.geometry && categoryFilter !== "all" && eventCategory(id) !== categoryFilter) setCategoryFilter("all");
    setGuideOpen(false);
    setLearningOpen(false);
    setShezhireOpen(false);
    setSelectedFigureId(null);
    setClosingFigureId(null);
    setClosingEventId(null);
    setSelectedEventId(id);
    setSelectedPlaceId(null);
    if (fromMap && window.matchMedia("(max-width: 960px)").matches) {
      requestAnimationFrame(() => panelRef.current?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
        block: "start",
      }));
    }
  }

  function closeEvent() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setSelectedEventId(null);
    else setClosingEventId(selectedEventId);
  }

  function openPlace(id: string) {
    if (fullscreen) { setFullscreen(false); if (!mobile) changeLayout("split"); }
    setSelectedPlaceId(id);
    setSelectedEventId(null);
    setSelectedFigureId(null);
    setGuideOpen(false);
    setLearningOpen(false);
    if (mobile) requestAnimationFrame(() => panelRef.current?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" }));
  }

  function openFigure(id: string) {
    setShezhireOpen(false);
    setSelectedEventId(null);
    setClosingEventId(null);
    setClosingFigureId(null);
    setSelectedFigureId(id);
  }

  function exploreShezhireFigure(id: string) {
    selectEra("kazakh-1721-1737");
    setCompareOpen(false);
    openFigure(id);
    if (window.matchMedia("(max-width: 960px)").matches) {
      requestAnimationFrame(() => panelRef.current?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
        block: "start",
      }));
    }
  }

  function closeFigure() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setSelectedFigureId(null);
    else setClosingFigureId(selectedFigureId);
  }

  useEffect(() => {
    const controller = new AbortController();
    const era = eras.find((item) => item.id === selectedId) ?? eras[0];
    const knownSources = new Set(sources.map((item) => item.id));
    async function load() {
      setData(null);
      setLoadState("loading");
      try {
        const [territoryResponse, eventResponse] = await Promise.all([
          fetch(era.territoryUrl, { signal: controller.signal }),
          fetch(era.eventUrl, { signal: controller.signal }),
        ]);
        if (!territoryResponse.ok || !eventResponse.ok) throw new Error("GeoJSON request failed");
        const [territories, eventData] = await Promise.all([territoryResponse.json(), eventResponse.json()]);
        const validated = validateEraData(era, territories, eventData, knownSources);
        if (controller.signal.aborted) return;
        setData(validated);
        setLoadState(validated.territories.features.length || validated.events.features.length ? "ready" : "empty");
      } catch (error) {
        if (controller.signal.aborted) return;
        console.error("Era data could not load", error);
        setLoadState("error");
      }
    }
    void load();
    return () => controller.abort();
  }, [selectedId, retry]);

  useEffect(() => {
    if (!compareOpen || compareId === selectedId) return;
    const cached = compareCache.current.get(compareId);
    if (cached) {
      setCompareData(cached);
      setCompareState("ready");
      return;
    }
    const controller = new AbortController();
    const era = eras.find((item) => item.id === compareId);
    if (!era || era.kind !== "historical-reconstruction") return;
    const knownSources = new Set(sources.map((item) => item.id));
    async function load() {
      setCompareData(null);
      setCompareState("loading");
      try {
        const [territoryResponse, eventResponse] = await Promise.all([
          fetch(era!.territoryUrl, { signal: controller.signal }),
          fetch(era!.eventUrl, { signal: controller.signal }),
        ]);
        if (!territoryResponse.ok || !eventResponse.ok) throw new Error("Comparison GeoJSON request failed");
        const [territories, events] = await Promise.all([territoryResponse.json(), eventResponse.json()]);
        const validated = validateEraData(era!, territories, events, knownSources);
        if (controller.signal.aborted) return;
        compareCache.current.set(compareId, validated);
        setCompareData(validated);
        setCompareState("ready");
      } catch (error) {
        if (controller.signal.aborted) return;
        console.error("Comparison era could not load", error);
        setCompareState("error");
      }
    }
    void load();
    return () => controller.abort();
  }, [compareOpen, compareId, selectedId, retry]);

  return <main className="atlas-shell">
    <header className="atlas-header">
      <div className="brand-lockup" aria-label={`${brandName(locale)}, ${copy.brandSubtitle}`}>
        <BrandMark />
        <div className="brand-text"><strong>{brandName(locale)}</strong><span>{copy.brandSubtitle}</span></div>
      </div>
      <div className="header-actions">
        <span className="header-status"><span aria-hidden="true" />{copy.headerStatus}</span>
        <ReadingModeToggle locale={locale} />
        <ThemeToggle locale={locale} />
        <div className="locale-switch" role="group" aria-label={copy.languageLabel}>
          {(["kk", "ru", "en"] as const).map((option) => <button key={option} type="button"
            lang={option} aria-label={option === "kk" ? "Қазақша" : option === "ru" ? "Русский" : "English"}
            aria-pressed={locale === option} onClick={() => setLocalePreference(option)}>{option.toUpperCase()}</button>)}
        </div>
        <button type="button" className="guide-trigger" aria-expanded={guideOpen} aria-controls="guide-title"
          onClick={() => { setLearningOpen(false); setShezhireOpen(false); setGuideOpen((current) => !current); }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M5 4h14v12H9l-4 4V4Z" /><path d="M9 8h6M9 12h4" /></svg>{copy.guideTrigger}</button>
        <button type="button" className="guide-trigger" aria-expanded={learningOpen} aria-controls="learn-title"
          onClick={() => { setGuideOpen(false); setShezhireOpen(false); setLearningOpen((current) => !current); }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M12 5C8 2 3 4 3 4v15s5-2 9 1c4-3 9-1 9-1V4s-5-2-9 1Zm0 0v15" /></svg>{copy.learnTrigger}</button>
        <button type="button" className="guide-trigger" aria-expanded={shezhireOpen} aria-controls="shezhire-title"
          onClick={() => { setGuideOpen(false); setLearningOpen(false); setShezhireOpen((current) => !current); changeLayout("split"); }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><circle cx="12" cy="5" r="2" /><circle cx="5" cy="18" r="2" /><circle cx="19" cy="18" r="2" /><path d="M12 7v5M5 16v-4h14v4" /></svg>{copy.shezhireTrigger}</button>
        <div className="layout-controls" role="group" aria-label={copy.layoutResize}>
          <button type="button" title={copy.layoutMap} aria-label={copy.layoutMap} aria-pressed={layoutMode === "map"} onClick={() => changeLayout("map")}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M17 4v16"/></svg></button>
          <button type="button" title={copy.layoutSplit} aria-label={copy.layoutSplit} aria-pressed={layoutMode === "split"} onClick={() => changeLayout("split")}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M14 4v16"/></svg></button>
          <button type="button" title={copy.layoutPanel} aria-label={copy.layoutPanel} aria-pressed={layoutMode === "panel"} onClick={() => changeLayout("panel")}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 4v16"/></svg></button>
        </div>
        <DemoProfileMenu locale={locale} />
      </div>
    </header>
    <div ref={workspaceRef} className={`atlas-workspace layout-${layoutMode}${shezhireOpen ? " is-shezhire" : ""}${fullscreen ? " is-fullscreen" : ""}`} style={{ "--atlas-panel-width": `${panelWidth}px` } as React.CSSProperties}>
      <nav className="timeline-region" aria-label={copy.timelineLabel}>
        <div className="section-heading"><h2>{copy.periods}</h2><span>{formatCount(locale, historicalEras.length, copy.cuts.split("|") as [string, string, string])}</span></div>
        <div className="timeline" role="group" aria-label={copy.timelineGroup}>
          {historicalEras.map((era, index) => <button
            key={era.id} type="button" className={`timeline-option${selectedId === era.id ? " is-active" : ""}`}
            aria-pressed={selectedId === era.id} onClick={() => selectEra(era.id)}>
            <span className="timeline-index" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><span className="timeline-dot" aria-hidden="true" /><span>{eraText(era, "label", locale)}</span>
          </button>)}
        </div>
        {selectedEra.kind === "historical-reconstruction" && <button type="button" className={`compare-toggle${compareOpen ? " is-active" : ""}`}
          aria-pressed={compareOpen} onClick={toggleCompare}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M3 7h18M3 17h18M8 3v8m8 2v8" /></svg>
          {compareOpen ? copy.compareClose : copy.compareMode}
        </button>}
        {compareOpen && <div className="compare-controls" role="group" aria-label={copy.compareMode}>
          <label>{copy.compareFirst}<select value={selectedId} onChange={(event) => selectEra(event.target.value)}>
            {historicalEras.filter((era) => era.id !== compareId).map((era) => <option key={era.id} value={era.id}>{eraText(era, "label", locale)}</option>)}
          </select></label>
          <label>{copy.compareSecond}<select value={compareId} onChange={(event) => { setCompareData(null); setCompareId(event.target.value); }}>
            {historicalEras.filter((era) => era.id !== selectedId).map((era) => <option key={era.id} value={era.id}>{eraText(era, "label", locale)}</option>)}
          </select></label>
          {selectedHasTerritory && compareHasTerritory && <div className="compare-range"><label htmlFor="compare-balance">{copy.compareBalance}</label><div><span>{copy.compareEarlier}</span>
            <input id="compare-balance" type="range" min="0" max="100" value={compareBalance} onChange={(event) => setCompareBalance(Number(event.target.value))} />
            <span>{copy.compareLater}</span></div></div>}
        </div>}
        {process.env.NODE_ENV === "development" && <button type="button" className={`fixture-option${selectedId === "technical-fixture" ? " is-active" : ""}`}
          aria-pressed={selectedId === "technical-fixture"} onClick={() => selectEra("technical-fixture")}>
          {copy.fixtureControl} <span aria-hidden="true">↗</span>
        </button>}
      </nav>
      <section className="map-region" aria-label={shezhireOpen ? copy.shezhireTitle : copy.mapLabel}>
        <div className={`map-mode-content${shezhireOpen ? " is-hidden" : ""}`} aria-hidden={shezhireOpen} inert={shezhireOpen}>
        <MapCanvas data={data} eraId={selectedId} locale={locale} categoryFilter={categoryFilter}
          visiblePlaceKinds={visiblePlaceKinds} showEventMarkers={showEventMarkers}
          compareEnabled={compareOpen} compareData={compareData} compareEraId={compareId} compareBalance={compareBalance}
          selectedEventId={selectedEventId} selectedPlaceId={selectedPlaceId} onSelectEvent={(id) => openEvent(id, true)} onSelectPlace={openPlace} />
        <div className="map-caption"><span className="caption-rule" aria-hidden="true" />{copy.mapCaption}</div>
        {selectedEra.kind === "historical-reconstruction" && !compareOpen && <div className={`map-tools${layersOpen ? " is-expanded" : ""}`}>
          <button type="button" className="map-layer-trigger" aria-expanded={layersOpen} onClick={() => setLayersOpen((open) => !open)}><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18M8 3v6m8 0v6m-8 0v6"/></svg>{copy.mapLayers} <span aria-hidden="true">{layersOpen ? "−" : "+"}</span></button>
          {layersOpen && <div className="map-layer-list">
            <label htmlFor="map-category-filter">{copy.mapFilterLabel}</label>
            <select id="map-category-filter" value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value as EventCategory | "all")}>
              <option value="all">{copy.mapCategoryAll}</option>
              {categories.map((category) => <option key={category} value={category}>{categoryLabels[category]}</option>)}
            </select>
            {(["center", "settlement", "cultural", "assembly"] as const).map((kind) => <label key={kind}><input type="checkbox" checked={visiblePlaceKinds.includes(kind)} onChange={() => setVisiblePlaceKinds((current) => current.includes(kind) ? current.filter((item) => item !== kind) : [...current, kind])} />{kind === "center" ? copy.mapLayerCenters : kind === "settlement" ? copy.mapLayerSettlements : kind === "cultural" ? copy.mapLayerCulture : copy.mapLayerAssemblies}</label>)}
            <label><input type="checkbox" checked={showEventMarkers} onChange={() => setShowEventMarkers((value) => !value)} />{copy.mapLayerEvents}</label>
            <label><input type="checkbox" checked={showWarChronicle} onChange={() => setShowWarChronicle((value) => !value)} />{copy.mapLayerWars}</label>
          </div>}
        </div>}
        {loadState === "ready" && !compareOpen && selectedEra.kind === "historical-reconstruction" && locatedCount === 0 && visiblePlaces.length === 0
          && <div className="map-empty" role="status">{copy.mapNoLocatedEvents}</div>}
        {!compareOpen && showWarChronicle && warEvents.length > 0 && <div className="war-chronicle" aria-label={copy.mapLayerWars}>
          <div className="war-chronicle-heading"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="m4 4 16 16M20 4 4 20M4 4l4 1-3 3m15-4-4 1 3 3"/></svg><strong>{copy.mapLayerWars}</strong></div>
          <div className="war-chronicle-events">{warEvents.map((feature) => <button type="button" key={feature.properties.id} onClick={() => openEvent(feature.properties.id, true)}><span>{eventText(feature.properties, "dateLabel", locale)}</span><strong>{eventText(feature.properties, "name", locale)}</strong></button>)}</div>
          <small>{copy.mapWarsNote}</small>
        </div>}
        {selectedEra.kind === "historical-reconstruction" && <div className={`map-legend${compareOpen ? " is-comparing" : ""}`}>
          {compareOpen ? <>{selectedHasTerritory && <span className="compare-legend-item"><i className="compare-swatch" aria-hidden="true" />{eraText(selectedEra, "label", locale)}</span>}
            {compareHasTerritory && <span className="compare-legend-item"><i className="compare-swatch compare-swatch-second" aria-hidden="true" />{eraText(compareEra, "label", locale)}</span>}
            <span className="compare-legend-note">{selectedHasTerritory || compareHasTerritory ? copy.boundaryApprox : copy.noTerritories}{(selectedHasTerritory || compareHasTerritory) && territorySource && <> · <a href={territorySource.url} target="_blank" rel="noopener noreferrer">Seshat ↗</a></>}</span></>
            : <>{selectedHasTerritory ? <><span className="legend-line" aria-hidden="true" />{copy.approxReconstruction}</> : copy.noTerritories}
              {events.some((feature) => feature.geometry) && <span className="legend-marker">{copy.approxMarker}</span>}</>}
        </div>}
        {visiblePlaces.length > 0 && !compareOpen && <div className="place-legend"><span className="place-legend-diamond" aria-hidden="true" />{copy.placeLabel}</div>}
        {selectedEra.kind === "technical-fixture" && <div className="map-fixture-label">{copy.fixtureMapLabel}</div>}
        </div>
        {shezhireOpen && <ShezhireTree locale={locale} selectedZhuzId={selectedZhuzId} selectedRuId={selectedRuId} onSelect={selectShezhire} />}
        {fullscreen && !shezhireOpen && <label className="map-fullscreen-era">{copy.periods}<select value={selectedId} onChange={(event) => selectEra(event.target.value)}>{historicalEras.map((era) => <option key={era.id} value={era.id}>{eraText(era, "label", locale)}</option>)}</select></label>}
        <button type="button" className="map-fullscreen-toggle" aria-label={fullscreen ? copy.fullscreenExit : shezhireOpen ? copy.treeFullscreen : copy.mapFullscreen} title={fullscreen ? copy.fullscreenExit : shezhireOpen ? copy.treeFullscreen : copy.mapFullscreen} onClick={() => setFullscreen((value) => !value)}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">{fullscreen ? <path d="M3 9h6V3m6 0v6h6M9 21v-6H3m18 0h-6v6"/> : <path d="M9 3H3v6m12-6h6v6M3 15v6h6m12-6v6h-6"/>}</svg><span>{fullscreen ? copy.fullscreenExit : shezhireOpen ? copy.treeFullscreen : copy.mapFullscreen}</span></button>
      </section>
      <div className="workspace-divider" role="separator" aria-orientation="vertical" aria-label={copy.layoutResize} tabIndex={layoutMode === "split" ? 0 : -1}
        onPointerDown={(event) => { if (layoutMode !== "split") return; event.currentTarget.setPointerCapture(event.pointerId); }}
        onPointerMove={(event) => { if (event.currentTarget.hasPointerCapture(event.pointerId)) resizePanel(event.clientX); }}
        onPointerUp={(event) => { if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId); localStorage.setItem("mura-panel-width", String(panelWidth)); }}
        onKeyDown={(event) => { if (event.key === "ArrowLeft" || event.key === "ArrowRight") { event.preventDefault(); const width = Math.max(280, Math.min(700, panelWidth + (event.key === "ArrowLeft" ? 24 : -24))); setPanelWidth(width); localStorage.setItem("mura-panel-width", String(width)); } }} />
      <aside ref={panelRef} className={`atlas-panel${guideOpen || learningOpen || shezhireOpen ? " is-guide-open" : ""}${shezhireOpen && mobile && !shezhireDetailOpen ? " shezhire-graph-only" : ""}`} aria-labelledby={guideOpen ? "guide-title" : learningOpen ? "learn-title" : shezhireOpen ? "shezhire-title" : "panel-title"}>
        <div className="atlas-panel-content" hidden={guideOpen || learningOpen || shezhireOpen}>
        <div className="panel-overline">{activePlace ? copy.placeLabel : compareOpen ? copy.compareMode : activeEvent ? copy.eventTag : activeFigure ? copy.figureTag : copy.overviewTag}</div>
        {activePlace ? <section className="place-detail" aria-labelledby="panel-title">
          <button className="back-link" type="button" onClick={() => setSelectedPlaceId(null)}>← {copy.backToPeriod}</button>
          <span className="place-detail-icon" aria-hidden="true">◇</span><h1 id="panel-title">{activePlace.name[locale]}</h1>
          <p className="detail-copy">{activePlace.description[locale]}</p>
          <p className="certainty-note">{activePlace.locationNote[locale]}</p>
          {activePlace.politicalStatus && <p className="certainty-note">{activePlace.politicalStatus[locale]} {activePlace.politicalSourceUrl && <a href={activePlace.politicalSourceUrl} target="_blank" rel="noopener noreferrer">e-history.kz ↗</a>}</p>}
          <a href={activePlace.sourceUrl} target="_blank" rel="noopener noreferrer" className="place-source">{copy.placeSource} ↗</a>
          {activePlace.eventId && <button type="button" className="place-related" onClick={() => openEvent(activePlace.eventId!)}>{copy.placeRelatedEvent}: {(() => { const linked = events.find((feature) => feature.properties.id === activePlace.eventId); return linked ? eventText(linked.properties, "name", locale) : activePlace.name[locale]; })()} ↗</button>}
        </section> : compareOpen ? <section className="compare-panel" aria-labelledby="panel-title">
          <h1 id="panel-title">{copy.compareTitle}</h1><p className="panel-intro">{copy.compareIntro}</p>
          <p className="certainty-note">{selectedHasTerritory || compareHasTerritory ? copy.boundaryApprox : copy.noTerritories}</p>
          <CompareEraSummary era={selectedEra} data={data} status={loadState} locale={locale} tone="first" onExplore={() => setCompareOpen(false)} />
          {compareState === "error" && <div className="data-message" role="alert">{copy.compareError} <button type="button" className="retry-button" onClick={() => setRetry((value) => value + 1)}>{copy.retry}</button></div>}
          <CompareEraSummary era={compareEra} data={compareData} status={compareState} locale={locale} tone="second" onExplore={() => { setCompareOpen(false); selectEra(compareId); }} />
        </section> : activeEvent ? <section key={activeEvent.properties.id}
          className={`event-detail${closingEventId === activeEvent.properties.id ? " is-closing" : ""}`}
          onAnimationEnd={(event) => {
            if (event.currentTarget === event.target && closingEventId === activeEvent.properties.id) {
              setSelectedEventId(null);
              setClosingEventId(null);
            }
          }}>
          <button className="back-link" type="button" onClick={closeEvent}>← {copy.backToPeriod} {eraText(selectedEra, "label", locale)}</button>
          <span className="event-detail-category">{categoryLabels[eventCategory(activeEvent.properties.id)]}</span>
          <h1 id="panel-title">{eventText(activeEvent.properties, "name", locale)}</h1>
          <p className="detail-date">{eventText(activeEvent.properties, "dateLabel", locale)}</p>
          {activeEventVisual && <figure className="history-visual"><div><Image src={activeEventVisual.src} alt={activeEventVisual.caption[locale]} fill sizes="(max-width: 960px) 100vw, 400px" style={{ objectPosition: activeEventVisual.position }} /></div>
            <figcaption><strong>{activeEventVisual.label[locale]}</strong> {activeEventVisual.caption[locale]} <a href={activeEventVisual.sourceUrl} target="_blank" rel="noopener noreferrer">Wikimedia Commons ↗</a> · <a href={activeEventVisual.licenseUrl} target="_blank" rel="noopener noreferrer">{activeEventVisual.license}</a> · {activeEventVisual.creator}</figcaption></figure>}
          <p className="detail-copy">{eventText(activeEvent.properties, "description", locale)}</p>
          {activeEvent.properties.placeLabel && <p className="detail-fact"><strong>{copy.place}</strong>{eventText(activeEvent.properties, "placeLabel", locale)}</p>}
          {activeEvent.properties.uncertaintyNote && <p className="detail-note"><strong>{copy.datingAccuracy}</strong>{formatDisplayText(eventText(activeEvent.properties, "uncertaintyNote", locale)!)}</p>}
          <p className="detail-note"><strong>{copy.onMap}</strong>{eventText(activeEvent.properties, "coordinateNote", locale) ?? copy.noReliableCoordinate}</p>
          <div className="panel-divider" />
          <section className="panel-section" aria-labelledby="related-figures-title">
            <div className="section-heading"><h2 id="related-figures-title">{copy.relatedFigures}</h2></div>
            {activeEvent.properties.figureIds?.length
              ? <ul className="content-list">{activeEvent.properties.figureIds.map((id) => {
                const figure = eraFigures.find((item) => item.id === id);
                return figure ? <FigureRow key={id} figure={figure} locale={locale} onSelect={() => openFigure(id)} /> : null;
              })}</ul>
              : <p className="empty-copy">{copy.noRelatedFigures}</p>}
          </section>
          <div className="panel-divider" />
          {selectedEra.kind === "historical-reconstruction" && <section className="panel-section" aria-labelledby="event-sources-title">
            <div className="section-heading"><h2 id="event-sources-title">{copy.sources}</h2></div>
            <SourceLinks ids={[...new Set([...activeEvent.properties.sourceIds, ...(activeEvent.properties.coordinateSourceIds ?? [])])]} locale={locale} />
          </section>}
        </section> : activeFigure ? <section key={activeFigure.id}
          className={`character-detail${closingFigureId === activeFigure.id ? " is-closing" : ""}`}
          onAnimationEnd={(event) => {
            if (event.currentTarget === event.target && closingFigureId === activeFigure.id) {
              setSelectedFigureId(null);
              setClosingFigureId(null);
            }
          }}>
          <button className="back-link" type="button" onClick={closeFigure}>← {copy.backToPeriod} {eraText(selectedEra, "label", locale)}</button>
          <div className="character-hero">
            {activeFigureVisual ? <Image src={activeFigureVisual.src} alt={activeFigureVisual.caption[locale]} fill sizes="(max-width: 960px) 100vw, 400px" priority style={{ objectPosition: activeFigureVisual.position }} />
              : <span className="character-sigil" aria-hidden="true">{figureText(activeFigure, "name", locale).slice(0, 1)}</span>}
            <div className="character-hero-heading"><span>{figureRole(activeFigure.id, locale)} · {eraText(selectedEra, "label", locale)}</span><h1 id="panel-title">{figureText(activeFigure, "name", locale)}</h1></div>
          </div>
          <p className="character-image-caption"><strong>{activeFigureVisual?.label[locale] ?? copy.figureNoPortrait}</strong>{activeFigureVisual?.caption[locale] ?? copy.figureNoPortraitNote}</p>
          <section className="character-text-section" aria-labelledby="figure-biography-title">
            <h2 id="figure-biography-title">{copy.figureBiography}</h2>
            <p className="detail-copy">{figureText(activeFigure, "description", locale)}</p>
          </section>
          <section className="character-text-section character-significance" aria-labelledby="figure-significance-title">
            <h2 id="figure-significance-title">{copy.figureSignificance}</h2>
            <p>{figureSignificance(activeFigure.id, locale)}</p>
          </section>
          {activeFigure.eraIds.length > 1 && <section className="character-text-section" aria-label={copy.periods}>
            <h2>{copy.periods}</h2>
            <div className="character-era-links">{activeFigure.eraIds.filter((id) => id !== selectedId).map((id) => {
              const era = eras.find((item) => item.id === id);
              return era ? <button type="button" key={id} onClick={() => { selectEra(id); setSelectedFigureId(activeFigure.id); }}>{eraText(era, "label", locale)} ↗</button> : null;
            })}</div>
          </section>}
          <div className="panel-divider" />
          <section className="panel-section" aria-labelledby="related-events-title">
            <div className="section-heading"><h2 id="related-events-title">{copy.relatedEvents}</h2></div>
            {events.some((feature) => activeFigure.eventIds.includes(feature.properties.id))
              ? <ul className="content-list">{events.filter((feature) => activeFigure.eventIds.includes(feature.properties.id))
                .map((feature) => <EventRow key={feature.properties.id} feature={feature} locale={locale} onSelect={() => openEvent(feature.properties.id)} />)}</ul>
              : <p className="empty-copy">{copy.noRelatedEvents}</p>}
          </section>
          <div className="panel-divider" />
          <section className="panel-section" aria-labelledby="figure-sources-title">
            <div className="section-heading"><h2 id="figure-sources-title">{copy.sources}</h2></div>
            <SourceLinks ids={activeFigure.sourceIds} locale={locale} />
          </section>
          {activeFigureVisual && <><div className="panel-divider" />
          <section className="panel-section" aria-labelledby="figure-artwork-title">
            <div className="section-heading"><h2 id="figure-artwork-title">{copy.figureArtworkSource}</h2></div>
            <p className="character-artwork-credit">{copy.figureArtworkCredit}: {activeFigureVisual.creator}. <a href={activeFigureVisual.sourceUrl} target="_blank" rel="noopener noreferrer">Wikimedia Commons ↗</a> · <a href={activeFigureVisual.licenseUrl} target="_blank" rel="noopener noreferrer">{activeFigureVisual.license}</a>. {copy.figureArtworkCrop}</p>
          </section></>}
        </section> : <>
          <h1 id="panel-title">{copy.atlasTitle}</h1>
          <p className="panel-intro">{copy.atlasIntro}</p>
          <div className="panel-divider" />
          <section className="panel-section data-section" aria-labelledby="territory-title" aria-live="polite">
            <div className="section-heading"><h2 id="territory-title">{eraText(selectedEra, "label", locale)}</h2><span>{selectedEra.kind === "technical-fixture" ? copy.test : selectedHasTerritory ? copy.reconstruction : copy.events}</span></div>
            <p className="era-description">{eraText(selectedEra, "description", locale)}</p>
            {activeEraVisual && <figure className="history-visual era-visual"><div><Image src={activeEraVisual.src} alt={activeEraVisual.caption[locale]} fill sizes="(max-width: 960px) 100vw, 340px" style={{ objectPosition: activeEraVisual.position }} /></div>
              <figcaption><strong>{activeEraVisual.label[locale]}</strong> {activeEraVisual.caption[locale]} <a href={activeEraVisual.sourceUrl} target="_blank" rel="noopener noreferrer">Wikimedia Commons ↗</a> · <a href={activeEraVisual.licenseUrl} target="_blank" rel="noopener noreferrer">{activeEraVisual.license}</a></figcaption></figure>}
            {loadState === "loading" && <p className="data-message" role="status">{copy.loadingLayer}</p>}
            {loadState === "error" && <div className="data-message" role="alert"><p>{copy.dataError}</p><button type="button" className="retry-button" onClick={() => setRetry((value) => value + 1)}>{copy.retry}</button></div>}
            {loadState === "empty" && <p className="data-message">{copy.noData}</p>}
            {loadState === "ready" && data && <>
              {data.territories.features.length > 0 && <p className="territory-count">{data.territories.features.map((feature) => territoryText(feature.properties, locale)).join(", ")}</p>}
              <p className="certainty-note">{selectedEra.kind === "technical-fixture" ? copy.fixtureCoordinates : selectedHasTerritory ? copy.boundaryApprox : copy.noTerritories}</p>
            </>}
            {selectedEra.kind === "historical-reconstruction" && <SourceLinks ids={selectedEra.sourceIds} locale={locale} />}
          </section>
          {selectedEra.kind === "historical-reconstruction" && <>
            <div className="panel-divider" />
            <section className="panel-section" aria-labelledby="highlights-title">
              <div className="section-heading"><h2 id="highlights-title">{copy.highlights}</h2>{loadState === "ready" && <span>{formatCount(locale, highlights.length, copy.highlightUnits.split("|") as [string, string, string])}</span>}</div>
              {loadState === "ready" && highlights.length ? <ol className="content-list highlight-list">{highlights.map((feature) => <EventRow key={feature.properties.id} feature={feature} locale={locale} onSelect={() => openEvent(feature.properties.id)} illustrated />)}</ol> : <p className="empty-copy">{loadState === "loading" ? copy.loadingEvents : copy.noHighlights}</p>}
            </section>
          </>}
          <div className="panel-divider" />
          <section className="panel-section" aria-labelledby="event-title">
            <div className="section-heading"><h2 id="event-title">{copy.events}</h2>{loadState === "ready" && <span>{events.length}</span>}</div>
            {loadState === "ready" && events.length ? <ul className="content-list">{events.map((feature) => <EventRow key={feature.properties.id} feature={feature} locale={locale} onSelect={() => openEvent(feature.properties.id)} />)}</ul>
              : <p className="empty-copy">{loadState === "loading" ? copy.loadingEvents
                : loadState === "error" ? copy.eventError
                  : selectedEra.kind === "technical-fixture" ? copy.fixtureNoEvents : copy.noEvents}</p>}
          </section>
          {selectedEra.kind === "historical-reconstruction" && <>
            <div className="panel-divider" />
            <section className="panel-section" aria-labelledby="figures-title">
              <div className="section-heading"><h2 id="figures-title">{copy.figures}</h2><span>{eraFigures.length}</span></div>
              {eraFigures.length ? <ul className="character-gallery">{eraFigures.map((figure) => <CharacterCard key={figure.id} figure={figure} locale={locale} eraLabel={eraText(selectedEra, "label", locale)} onSelect={() => openFigure(figure.id)} />)}</ul>
                : <p className="empty-copy">{copy.noFigures}</p>}
            </section>
          </>}
        </>}
        <div className="panel-footnote">
          <p>{copy.baseMapCredit}</p>
          {selectedHasTerritory && territorySource && <p>{copy.historicalPolygons} <a href={territorySource.url} target="_blank" rel="noopener noreferrer">{sourceTitle(territorySource.id, territorySource.title, locale)}</a>. {copy.license} <a href={territorySource.licenseUrl} target="_blank" rel="noopener noreferrer">{territorySource.license}</a>. {copy.coordinatesUnchanged} {formatAccessDate(locale, territorySource.accessedOn)}.</p>}
          <p>{copy.originalSourceTitles}</p>
          {locale !== "ru" && <p>{copy.translationReview}</p>}
          <nav className="panel-legal-links" aria-label={legal[locale].legalNavigation}>
            <Link href="/privacy">{legal[locale].privacyLink}</Link>
            <Link href="/terms">{legal[locale].termsLink}</Link>
          </nav>
        </div>
        </div>
        <GuidePanel key={`${selectedId}:${selectedEventId ?? ""}:${selectedFigureId ?? ""}:${locale}`}
          open={guideOpen} onClose={closeGuide} era={selectedEra} event={activeEvent} figure={activeFigure} loadState={loadState} locale={locale} />
        <LearningPanel key={`${selectedId}:${selectedFigureId ?? ""}`} open={learningOpen} onClose={closeLearning}
          era={selectedEra} figure={activeFigure} locale={locale} />
        <ShezhirePanel open={shezhireOpen && (!mobile || shezhireDetailOpen)} onClose={closeShezhire} onExploreFigure={exploreShezhireFigure} locale={locale}
          selectedZhuzId={selectedZhuzId} selectedRuId={selectedRuId} onSelect={selectShezhire} />
      </aside>
    </div>
  </main>;
}
