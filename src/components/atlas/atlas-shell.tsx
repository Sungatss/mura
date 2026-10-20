"use client";

import { useCallback, useEffect, useState } from "react";
import { GuidePanel } from "./guide-panel";
import { LearningPanel } from "./learning-panel";
import { MapCanvas } from "./map-canvas";
import { eras, sources } from "@/data/atlas";
import { figures } from "@/data/figures";
import { ui } from "@/data/ui-translations";
import { eraText, eventText, figureText, sourceNote, sourceTitle, territoryText } from "@/data/historical-translations";
import type { EraDataset, EventFeature, HistoricalFigure } from "@/lib/atlas/types";
import { validateEraData } from "@/lib/atlas/validate";
import { formatAccessDate, formatCount, type Locale } from "@/lib/i18n";
import { setLocalePreference, useLocale } from "@/lib/i18n/store";

type LoadState = "loading" | "ready" | "empty" | "error";

function formatDisplayText(value: string) {
  return value.replaceAll(" — ", ": ");
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

function EventRow({ feature, locale, onSelect }: { feature: EventFeature; locale: Locale; onSelect: () => void }) {
  const event = feature.properties;
  const copy = ui[locale];
  return <li>
    <button type="button" className="content-row" onClick={onSelect}>
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

export function AtlasShell({ initialLocale }: { initialLocale: Locale }) {
  const locale = useLocale(initialLocale);
  const [selectedId, setSelectedId] = useState(eras[0].id);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [selectedFigureId, setSelectedFigureId] = useState<string | null>(null);
  const [data, setData] = useState<EraDataset | null>(null);
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [retry, setRetry] = useState(0);
  const [guideOpen, setGuideOpen] = useState(false);
  const [learningOpen, setLearningOpen] = useState(false);
  const closeGuide = useCallback(() => setGuideOpen(false), []);
  const closeLearning = useCallback(() => setLearningOpen(false), []);
  const copy = ui[locale];
  const selectedEra = eras.find((era) => era.id === selectedId) ?? eras[0];
  const territorySource = sources.find((item) => item.id === "cliopatria-v021");
  const events = data?.events.features ?? [];
  const activeEvent = events.find((feature) => feature.properties.id === selectedEventId);
  const eraFigures = figures.filter((figure) => figure.eraIds.includes(selectedId));
  const activeFigure = eraFigures.find((figure) => figure.id === selectedFigureId);
  const highlights = events.filter((feature) => feature.properties.highlightRank !== null && feature.properties.highlightRank !== undefined)
    .sort((a, b) => (a.properties.highlightRank ?? 0) - (b.properties.highlightRank ?? 0));

  useEffect(() => {
    document.documentElement.lang = locale;
    document.title = `MURA | ${copy.brandSubtitle}`;
    document.querySelector<HTMLMetaElement>('meta[name="description"]')?.setAttribute("content", copy.atlasIntro);
  }, [locale, copy]);

  function selectEra(id: string) {
    setSelectedEventId(null);
    setSelectedFigureId(null);
    setData(null);
    setLoadState("loading");
    setSelectedId(id);
  }

  function openEvent(id: string) {
    setSelectedFigureId(null);
    setSelectedEventId(id);
  }

  function openFigure(id: string) {
    setSelectedEventId(null);
    setSelectedFigureId(id);
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

  return <main className="atlas-shell">
    <header className="atlas-header">
      <div className="brand-lockup" aria-label={`MURA, ${copy.brandSubtitle}`}>
        <span className="brand-mark" aria-hidden="true">M</span>
        <div className="brand-text"><strong>MURA</strong><span>{copy.brandSubtitle}</span></div>
      </div>
      <div className="header-actions">
        <span className="header-status">{copy.headerStatus}</span>
        <div className="locale-switch" role="group" aria-label={copy.languageLabel}>
          {(["kk", "ru", "en"] as const).map((option) => <button key={option} type="button"
            lang={option} aria-label={option === "kk" ? "Қазақша" : option === "ru" ? "Русский" : "English"}
            aria-pressed={locale === option} onClick={() => setLocalePreference(option)}>{option.toUpperCase()}</button>)}
        </div>
        <button type="button" className="guide-trigger" aria-expanded={guideOpen} aria-controls="guide-title"
          onClick={() => { setLearningOpen(false); setGuideOpen((current) => !current); }}>{copy.guideTrigger}</button>
        <button type="button" className="guide-trigger" aria-expanded={learningOpen} aria-controls="learn-title"
          onClick={() => { setGuideOpen(false); setLearningOpen((current) => !current); }}>{copy.learnTrigger}</button>
      </div>
    </header>
    <div className="atlas-workspace">
      <nav className="timeline-region" aria-label={copy.timelineLabel}>
        <div className="section-heading"><h2>{copy.periods}</h2><span>{formatCount(locale, 3, copy.cuts.split("|") as [string, string, string])}</span></div>
        <div className="timeline" role="group" aria-label={copy.timelineGroup}>
          {eras.filter((era) => era.kind === "historical-reconstruction").map((era) => <button
            key={era.id} type="button" className={`timeline-option${selectedId === era.id ? " is-active" : ""}`}
            aria-pressed={selectedId === era.id} onClick={() => selectEra(era.id)}>
            <span className="timeline-dot" aria-hidden="true" /><span>{eraText(era, "label", locale)}</span>
          </button>)}
        </div>
        <button type="button" className={`fixture-option${selectedId === "technical-fixture" ? " is-active" : ""}`}
          aria-pressed={selectedId === "technical-fixture"} onClick={() => selectEra("technical-fixture")}>
          {copy.fixtureControl} <span aria-hidden="true">↗</span>
        </button>
      </nav>
      <section className="map-region" aria-label={copy.mapLabel}>
        <MapCanvas data={data} eraId={selectedId} locale={locale} onSelectEvent={openEvent} />
        <div className="map-caption"><span className="caption-rule" aria-hidden="true" />{copy.mapCaption}</div>
        {selectedEra.kind === "historical-reconstruction" && <div className="map-legend">
          <span className="legend-line" aria-hidden="true" />{copy.approxReconstruction}
          {events.some((feature) => feature.geometry) && <span className="legend-marker">{copy.approxMarker}</span>}
        </div>}
        {selectedEra.kind === "technical-fixture" && <div className="map-fixture-label">{copy.fixtureMapLabel}</div>}
      </section>
      <aside className={`atlas-panel${guideOpen || learningOpen ? " is-guide-open" : ""}`} aria-labelledby={guideOpen ? "guide-title" : learningOpen ? "learn-title" : "panel-title"}>
        <div className="atlas-panel-content" hidden={guideOpen || learningOpen}>
        <div className="panel-overline">{activeEvent ? copy.eventTag : activeFigure ? copy.figureTag : copy.overviewTag}</div>
        {activeEvent ? <>
          <button className="back-link" type="button" onClick={() => setSelectedEventId(null)}>← {copy.backToPeriod} {eraText(selectedEra, "label", locale)}</button>
          <h1 id="panel-title">{eventText(activeEvent.properties, "name", locale)}</h1>
          <p className="detail-date">{eventText(activeEvent.properties, "dateLabel", locale)}</p>
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
        </> : activeFigure ? <>
          <button className="back-link" type="button" onClick={() => setSelectedFigureId(null)}>← {copy.backToPeriod} {eraText(selectedEra, "label", locale)}</button>
          <h1 id="panel-title">{figureText(activeFigure, "name", locale)}</h1>
          <p className="detail-copy">{figureText(activeFigure, "description", locale)}</p>
          <div className="panel-divider" />
          <section className="panel-section" aria-labelledby="related-events-title">
            <div className="section-heading"><h2 id="related-events-title">{copy.relatedEvents}</h2></div>
            <ul className="content-list">{events.filter((feature) => activeFigure.eventIds.includes(feature.properties.id))
              .map((feature) => <EventRow key={feature.properties.id} feature={feature} locale={locale} onSelect={() => openEvent(feature.properties.id)} />)}</ul>
          </section>
          <div className="panel-divider" />
          <section className="panel-section" aria-labelledby="figure-sources-title">
            <div className="section-heading"><h2 id="figure-sources-title">{copy.sources}</h2></div>
            <SourceLinks ids={activeFigure.sourceIds} locale={locale} />
          </section>
        </> : <>
          <h1 id="panel-title">{copy.atlasTitle}</h1>
          <p className="panel-intro">{copy.atlasIntro}</p>
          <div className="panel-divider" />
          <section className="panel-section data-section" aria-labelledby="territory-title" aria-live="polite">
            <div className="section-heading"><h2 id="territory-title">{eraText(selectedEra, "label", locale)}</h2><span>{selectedEra.kind === "technical-fixture" ? copy.test : copy.reconstruction}</span></div>
            <p className="era-description">{eraText(selectedEra, "description", locale)}</p>
            {loadState === "loading" && <p className="data-message" role="status">{copy.loadingLayer}</p>}
            {loadState === "error" && <div className="data-message" role="alert"><p>{copy.dataError}</p><button type="button" className="retry-button" onClick={() => setRetry((value) => value + 1)}>{copy.retry}</button></div>}
            {loadState === "empty" && <p className="data-message">{copy.noData}</p>}
            {loadState === "ready" && data && <>
              <p className="territory-count">{data.territories.features.length === 0 ? copy.noTerritories : data.territories.features.map((feature) => territoryText(feature.properties, locale)).join(", ")}</p>
              <p className="certainty-note">{selectedEra.kind === "technical-fixture" ? copy.fixtureCoordinates : copy.boundaryApprox}</p>
            </>}
          </section>
          {selectedEra.kind === "historical-reconstruction" && <>
            <div className="panel-divider" />
            <section className="panel-section" aria-labelledby="highlights-title">
              <div className="section-heading"><h2 id="highlights-title">{copy.highlights}</h2>{loadState === "ready" && <span>{formatCount(locale, highlights.length, copy.highlightUnits.split("|") as [string, string, string])}</span>}</div>
              {loadState === "ready" && highlights.length ? <ol className="content-list highlight-list">{highlights.map((feature) => <EventRow key={feature.properties.id} feature={feature} locale={locale} onSelect={() => openEvent(feature.properties.id)} />)}</ol> : <p className="empty-copy">{loadState === "loading" ? copy.loadingEvents : copy.noHighlights}</p>}
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
              {eraFigures.length ? <ul className="content-list">{eraFigures.map((figure) => <FigureRow key={figure.id} figure={figure} locale={locale} onSelect={() => openFigure(figure.id)} />)}</ul>
                : <p className="empty-copy">{copy.noFigures}</p>}
            </section>
          </>}
        </>}
        <div className="panel-footnote">
          <p>{copy.baseMapCredit}</p>
          {territorySource && <p>{copy.historicalPolygons} <a href={territorySource.url} target="_blank" rel="noopener noreferrer">{sourceTitle(territorySource.id, territorySource.title, locale)}</a>. {copy.license} <a href={territorySource.licenseUrl} target="_blank" rel="noopener noreferrer">{territorySource.license}</a>. {copy.coordinatesUnchanged} {formatAccessDate(locale, territorySource.accessedOn)}.</p>}
          <p>{copy.originalSourceTitles}</p>
          {locale !== "ru" && <p>{copy.translationReview}</p>}
        </div>
        </div>
        <GuidePanel key={`${selectedId}:${selectedEventId ?? ""}:${selectedFigureId ?? ""}:${locale}`}
          open={guideOpen} onClose={closeGuide} era={selectedEra} event={activeEvent} figure={activeFigure} loadState={loadState} locale={locale} />
        <LearningPanel key={`${selectedId}:${selectedFigureId ?? ""}`} open={learningOpen} onClose={closeLearning}
          era={selectedEra} figure={activeFigure} locale={locale} />
      </aside>
    </div>
  </main>;
}
