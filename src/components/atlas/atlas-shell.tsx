"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { eras, sources } from "@/data/atlas";
import type { EraDataset } from "@/lib/atlas/types";
import { validateEraData } from "@/lib/atlas/validate";

const MapCanvas = dynamic(
  () => import("./map-canvas").then((module) => module.MapCanvas),
  {
    ssr: false,
    loading: () => <div className="map-state" role="status">Загрузка карты…</div>,
  },
);

type LoadState = "loading" | "ready" | "empty" | "error";

export function AtlasShell() {
  const [selectedId, setSelectedId] = useState(eras[0].id);
  const [data, setData] = useState<EraDataset | null>(null);
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [retry, setRetry] = useState(0);
  const selectedEra = eras.find((era) => era.id === selectedId) ?? eras[0];
  const source = sources.find((item) => selectedEra.sourceIds.includes(item.id));

  function selectEra(id: string) {
    setData(null);
    setLoadState("loading");
    setSelectedId(id);
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
        const [territories, events] = await Promise.all([
          territoryResponse.json(), eventResponse.json(),
        ]);
        const validated = validateEraData(era, territories, events, knownSources);
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

  return (
    <main className="atlas-shell">
      <header className="atlas-header">
        <div className="brand-lockup" aria-label="TARIQ, исторический атлас Казахстана">
          <span className="brand-mark" aria-hidden="true">T</span>
          <div className="brand-text">
            <strong>TARIQ</strong>
            <span>Исторический атлас Казахстана</span>
          </div>
        </div>
        <span className="header-status">Исторические реконструкции</span>
      </header>

      <div className="atlas-workspace">
          <nav className="timeline-region" aria-label="Временная шкала">
            <div className="section-heading">
              <h2>Периоды</h2>
              <span>3 среза</span>
            </div>
            <div className="timeline" role="group" aria-label="Временные срезы">
              {eras.filter((era) => era.kind === "historical-reconstruction").map((era) => (
                <button
                  key={era.id}
                  type="button"
                  className={`timeline-option${selectedId === era.id ? " is-active" : ""}`}
                  aria-pressed={selectedId === era.id}
                  onClick={() => selectEra(era.id)}
                >
                  <span className="timeline-dot" aria-hidden="true" />
                  <span>{era.label.ru}</span>
                </button>
              ))}
            </div>
            <button
              type="button"
              className={`fixture-option${selectedId === "technical-fixture" ? " is-active" : ""}`}
              aria-pressed={selectedId === "technical-fixture"}
              onClick={() => selectEra("technical-fixture")}
            >
              Проверить слои и маркер <span aria-hidden="true">↗</span>
            </button>
          </nav>


        <section className="map-region" aria-label="Карта Казахстана">
          <MapCanvas data={data} eraId={selectedId} />
          <div className="map-caption">
            <span className="caption-rule" aria-hidden="true" />
            Казахстан и Центральная Азия
          </div>
          {selectedEra.kind === "historical-reconstruction" && (
            <div className="map-legend">
              <span className="legend-line" aria-hidden="true" />
              Приблизительная реконструкция · Seshat
            </div>
          )}
          {selectedEra.kind === "technical-fixture" && (
            <div className="map-fixture-label">Технический слой · Не исторические данные</div>
          )}
        </section>

        <aside className="atlas-panel" aria-labelledby="panel-title">
          <div className="panel-overline">01 / Время и территория</div>
          <h1 id="panel-title">История на карте</h1>
          <p className="panel-intro">
            Выберите временной срез, чтобы увидеть реконструкцию территории Казахского ханства.
          </p>

          <div className="panel-divider" />

          <div className="panel-divider" />

          <section className="panel-section data-section" aria-labelledby="territory-title" aria-live="polite">
            <div className="section-heading">
              <h2 id="territory-title">{selectedEra.label.ru}</h2>
              <span>{selectedEra.kind === "technical-fixture" ? "Тест" : "Реконструкция"}</span>
            </div>
            <p className="era-description">{selectedEra.description.ru}</p>
            {loadState === "loading" && <p className="data-message" role="status">Загрузка слоя…</p>}
            {loadState === "error" && (
              <div className="data-message" role="alert">
                <p>Не удалось загрузить или проверить геоданные.</p>
                <button type="button" className="retry-button" onClick={() => setRetry((value) => value + 1)}>Повторить</button>
              </div>
            )}
            {loadState === "empty" && <p className="data-message">Для этого периода нет доступных геоданных.</p>}
            {loadState === "ready" && data && (
              <>
                <p className="territory-count">
                  {data.territories.features.length === 0
                    ? "Территории не представлены"
                    : data.territories.features.map((feature) => feature.properties.name.ru).join(", ")}
                </p>
                <p className="certainty-note">
                  {selectedEra.kind === "technical-fixture"
                    ? "Условные координаты служат только для проверки интерфейса."
                    : "Границы приблизительны и отражают одну исследовательскую реконструкцию."}
                </p>
              </>
            )}
          </section>

          <div className="panel-divider" />

          <section className="panel-section" aria-labelledby="event-title">
            <div className="section-heading"><h2 id="event-title">События</h2></div>
            {loadState === "ready" && data?.events.features.length
              ? <ul className="event-list">{data.events.features.map((feature) => <li key={feature.properties.id}>{feature.properties.name.ru}</li>)}</ul>
              : <p className="empty-copy">{selectedEra.kind === "technical-fixture"
                ? "Тестовый маркер появится после загрузки слоя."
                : "События с проверенными координатами для этого среза пока не добавлены."}</p>}
          </section>

          <div className="panel-footnote">
            <p>Современная картографическая основа: OpenFreeMap, атрибуция указана на карте.</p>
            {source && <p>
              Исторические полигоны: <a href={source.url} target="_blank" rel="noreferrer">{source.title}</a>.
              {" "}Лицензия <a href={source.licenseUrl} target="_blank" rel="noreferrer">{source.license}</a>.
              {" "}Координаты не изменены при извлечении; доступ {source.accessedOn}.
            </p>}
          </div>
        </aside>
      </div>
    </main>
  );
}
