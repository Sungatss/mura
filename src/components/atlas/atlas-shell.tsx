"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { eras, sources } from "@/data/atlas";
import { figures } from "@/data/figures";
import type { EraDataset, EventFeature, HistoricalFigure } from "@/lib/atlas/types";
import { validateEraData } from "@/lib/atlas/validate";

const MapCanvas = dynamic(
  () => import("./map-canvas").then((module) => module.MapCanvas),
  { ssr: false, loading: () => <div className="map-state" role="status">Загрузка карты…</div> },
);

type LoadState = "loading" | "ready" | "empty" | "error";

function formatDisplayText(value: string) {
  return value.replaceAll(" — ", ": ");
}

function SourceLinks({ ids }: { ids: string[] }) {
  return <ul className="source-list">{ids.map((id) => {
    const source = sources.find((item) => item.id === id);
    if (!source) return null;
    return <li key={id}>
      <a href={source.url} target="_blank" rel="noopener noreferrer">{formatDisplayText(source.title)} <span aria-hidden="true">↗</span></a>
      <span>{source.license}{source.note ? ` · ${source.note}` : ""}</span>
    </li>;
  })}</ul>;
}

function EventRow({ feature, onSelect }: { feature: EventFeature; onSelect: () => void }) {
  const event = feature.properties;
  return <li>
    <button type="button" className="content-row" onClick={onSelect}>
      <span className="content-row-date">{event.dateLabel?.ru}</span>
      <span className="content-row-main">{event.name.ru}</span>
      <span className="content-row-meta">{event.coordinateStatus === "technical-fixture" ? "Условная точка" : feature.geometry ? "На карте · приблизительно" : "Без точной точки"}</span>
    </button>
  </li>;
}

function FigureRow({ figure, onSelect }: { figure: HistoricalFigure; onSelect: () => void }) {
  const count = figure.eventIds.length;
  const eventWord = count === 1 ? "связанное событие" : count < 5 ? "связанных события" : "связанных событий";
  return <li><button type="button" className="content-row figure-row" onClick={onSelect}>
    <span className="content-row-main">{figure.name.ru}</span>
    <span className="content-row-meta">{count} {eventWord}</span>
  </button></li>;
}

export function AtlasShell() {
  const [selectedId, setSelectedId] = useState(eras[0].id);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [selectedFigureId, setSelectedFigureId] = useState<string | null>(null);
  const [data, setData] = useState<EraDataset | null>(null);
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [retry, setRetry] = useState(0);
  const selectedEra = eras.find((era) => era.id === selectedId) ?? eras[0];
  const territorySource = sources.find((item) => item.id === "cliopatria-v021");
  const events = data?.events.features ?? [];
  const activeEvent = events.find((feature) => feature.properties.id === selectedEventId);
  const eraFigures = figures.filter((figure) => figure.eraIds.includes(selectedId));
  const activeFigure = eraFigures.find((figure) => figure.id === selectedFigureId);
  const highlights = events.filter((feature) => feature.properties.highlightRank !== null && feature.properties.highlightRank !== undefined)
    .sort((a, b) => (a.properties.highlightRank ?? 0) - (b.properties.highlightRank ?? 0));

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
      <div className="brand-lockup" aria-label="MURA, исторический атлас Казахстана">
        <span className="brand-mark" aria-hidden="true">M</span>
        <div className="brand-text"><strong>MURA</strong><span>Исторический атлас Казахстана</span></div>
      </div>
      <span className="header-status">Исторические реконструкции</span>
    </header>
    <div className="atlas-workspace">
      <nav className="timeline-region" aria-label="Временная шкала">
        <div className="section-heading"><h2>Периоды</h2><span>3 среза</span></div>
        <div className="timeline" role="group" aria-label="Временные срезы">
          {eras.filter((era) => era.kind === "historical-reconstruction").map((era) => <button
            key={era.id} type="button" className={`timeline-option${selectedId === era.id ? " is-active" : ""}`}
            aria-pressed={selectedId === era.id} onClick={() => selectEra(era.id)}>
            <span className="timeline-dot" aria-hidden="true" /><span>{era.label.ru}</span>
          </button>)}
        </div>
        <button type="button" className={`fixture-option${selectedId === "technical-fixture" ? " is-active" : ""}`}
          aria-pressed={selectedId === "technical-fixture"} onClick={() => selectEra("technical-fixture")}>
          Проверить слои и маркер <span aria-hidden="true">↗</span>
        </button>
      </nav>
      <section className="map-region" aria-label="Карта Казахстана">
        <MapCanvas data={data} eraId={selectedId} onSelectEvent={openEvent} />
        <div className="map-caption"><span className="caption-rule" aria-hidden="true" />Казахстан и Центральная Азия</div>
        {selectedEra.kind === "historical-reconstruction" && <div className="map-legend">
          <span className="legend-line" aria-hidden="true" />Приблизительная реконструкция · Seshat
          {events.some((feature) => feature.geometry) && <span className="legend-marker">Маркер: приблизительное место</span>}
        </div>}
        {selectedEra.kind === "technical-fixture" && <div className="map-fixture-label">Технический слой · Не исторические данные</div>}
      </section>
      <aside className="atlas-panel" aria-labelledby="panel-title">
        <div className="panel-overline">{activeEvent ? "02 / Событие" : activeFigure ? "03 / Персона" : "01 / Время и территория"}</div>
        {activeEvent ? <>
          <button className="back-link" type="button" onClick={() => setSelectedEventId(null)}>← К периоду {selectedEra.label.ru}</button>
          <h1 id="panel-title">{activeEvent.properties.name.ru}</h1>
          <p className="detail-date">{activeEvent.properties.dateLabel?.ru}</p>
          <p className="detail-copy">{activeEvent.properties.description?.ru}</p>
          {activeEvent.properties.placeLabel && <p className="detail-fact"><strong>Место</strong>{activeEvent.properties.placeLabel.ru}</p>}
          {activeEvent.properties.uncertaintyNote && <p className="detail-note"><strong>Точность датировки</strong>{formatDisplayText(activeEvent.properties.uncertaintyNote.ru)}</p>}
          <p className="detail-note"><strong>На карте</strong>{activeEvent.properties.coordinateNote?.ru ?? "Надёжной координаты нет; маркер не показан."}</p>
          <div className="panel-divider" />
          <section className="panel-section" aria-labelledby="related-figures-title">
            <div className="section-heading"><h2 id="related-figures-title">Связанные персоны</h2></div>
            {activeEvent.properties.figureIds?.length
              ? <ul className="content-list">{activeEvent.properties.figureIds.map((id) => {
                const figure = eraFigures.find((item) => item.id === id);
                return figure ? <FigureRow key={id} figure={figure} onSelect={() => openFigure(id)} /> : null;
              })}</ul>
              : <p className="empty-copy">Персоны для этого события не указаны.</p>}
          </section>
          <div className="panel-divider" />
          {selectedEra.kind === "historical-reconstruction" && <section className="panel-section" aria-labelledby="event-sources-title">
            <div className="section-heading"><h2 id="event-sources-title">Источники</h2></div>
            <SourceLinks ids={[...new Set([...activeEvent.properties.sourceIds, ...(activeEvent.properties.coordinateSourceIds ?? [])])]} />
          </section>}
        </> : activeFigure ? <>
          <button className="back-link" type="button" onClick={() => setSelectedFigureId(null)}>← К периоду {selectedEra.label.ru}</button>
          <h1 id="panel-title">{activeFigure.name.ru}</h1>
          <p className="detail-copy">{activeFigure.description.ru}</p>
          <div className="panel-divider" />
          <section className="panel-section" aria-labelledby="related-events-title">
            <div className="section-heading"><h2 id="related-events-title">Связанные события</h2></div>
            <ul className="content-list">{events.filter((feature) => activeFigure.eventIds.includes(feature.properties.id))
              .map((feature) => <EventRow key={feature.properties.id} feature={feature} onSelect={() => openEvent(feature.properties.id)} />)}</ul>
          </section>
          <div className="panel-divider" />
          <section className="panel-section" aria-labelledby="figure-sources-title">
            <div className="section-heading"><h2 id="figure-sources-title">Источники</h2></div>
            <SourceLinks ids={activeFigure.sourceIds} />
          </section>
        </> : <>
          <h1 id="panel-title">История на карте</h1>
          <p className="panel-intro">Выберите временной срез, чтобы изучить территорию, события и людей этой эпохи.</p>
          <div className="panel-divider" />
          <section className="panel-section data-section" aria-labelledby="territory-title" aria-live="polite">
            <div className="section-heading"><h2 id="territory-title">{selectedEra.label.ru}</h2><span>{selectedEra.kind === "technical-fixture" ? "Тест" : "Реконструкция"}</span></div>
            <p className="era-description">{selectedEra.description.ru}</p>
            {loadState === "loading" && <p className="data-message" role="status">Загрузка слоя и событий…</p>}
            {loadState === "error" && <div className="data-message" role="alert"><p>Не удалось загрузить или проверить данные.</p><button type="button" className="retry-button" onClick={() => setRetry((value) => value + 1)}>Повторить</button></div>}
            {loadState === "empty" && <p className="data-message">Для этого периода нет доступных данных.</p>}
            {loadState === "ready" && data && <>
              <p className="territory-count">{data.territories.features.length === 0 ? "Территории не представлены" : data.territories.features.map((feature) => feature.properties.name.ru).join(", ")}</p>
              <p className="certainty-note">{selectedEra.kind === "technical-fixture" ? "Условные координаты служат только для проверки интерфейса." : "Границы приблизительны и отражают одну исследовательскую реконструкцию."}</p>
            </>}
          </section>
          {selectedEra.kind === "historical-reconstruction" && <>
            <div className="panel-divider" />
            <section className="panel-section" aria-labelledby="highlights-title">
              <div className="section-heading"><h2 id="highlights-title">Главное в эпохе</h2>{loadState === "ready" && <span>{highlights.length} акцента</span>}</div>
              {loadState === "ready" && highlights.length ? <ol className="content-list highlight-list">{highlights.map((feature) => <EventRow key={feature.properties.id} feature={feature} onSelect={() => openEvent(feature.properties.id)} />)}</ol> : <p className="empty-copy">{loadState === "loading" ? "Загрузка событий…" : "Для периода нет выделенных событий."}</p>}
            </section>
          </>}
          <div className="panel-divider" />
          <section className="panel-section" aria-labelledby="event-title">
            <div className="section-heading"><h2 id="event-title">События</h2>{loadState === "ready" && <span>{events.length}</span>}</div>
            {loadState === "ready" && events.length ? <ul className="content-list">{events.map((feature) => <EventRow key={feature.properties.id} feature={feature} onSelect={() => openEvent(feature.properties.id)} />)}</ul>
              : <p className="empty-copy">{loadState === "loading" ? "Загрузка событий…"
                : loadState === "error" ? "События не загрузились. Используйте кнопку повтора выше."
                  : selectedEra.kind === "technical-fixture" ? "В тестовом наборе нет событий." : "Для этого периода нет доступных событий."}</p>}
          </section>
          {selectedEra.kind === "historical-reconstruction" && <>
            <div className="panel-divider" />
            <section className="panel-section" aria-labelledby="figures-title">
              <div className="section-heading"><h2 id="figures-title">Персоны</h2><span>{eraFigures.length}</span></div>
              {eraFigures.length ? <ul className="content-list">{eraFigures.map((figure) => <FigureRow key={figure.id} figure={figure} onSelect={() => openFigure(figure.id)} />)}</ul>
                : <p className="empty-copy">Связанные персоны не добавлены.</p>}
            </section>
          </>}
        </>}
        <div className="panel-footnote">
          <p>Современная картографическая основа: OpenFreeMap, атрибуция указана на карте.</p>
          {territorySource && <p>Исторические полигоны: <a href={territorySource.url} target="_blank" rel="noopener noreferrer">{territorySource.title}</a>. Лицензия <a href={territorySource.licenseUrl} target="_blank" rel="noopener noreferrer">{territorySource.license}</a>. Координаты не изменены при извлечении; доступ {territorySource.accessedOn}.</p>}
        </div>
      </aside>
    </div>
  </main>;
}
