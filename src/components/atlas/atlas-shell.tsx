"use client";

import dynamic from "next/dynamic";

const MapCanvas = dynamic(
  () => import("./map-canvas").then((module) => module.MapCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="map-state" role="status">
        Загрузка карты…
      </div>
    ),
  },
);

export function AtlasShell() {
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
        <span className="header-status">Картографическая основа</span>
      </header>

      <div className="atlas-workspace">
        <section className="map-region" aria-label="Карта Казахстана">
          <MapCanvas />
          <div className="map-caption">
            <span className="caption-rule" aria-hidden="true" />
            Казахстан и Центральная Азия
          </div>
        </section>

        <aside className="atlas-panel" aria-labelledby="panel-title">
          <div className="panel-overline">01 / Атлас</div>
          <h1 id="panel-title">История на карте</h1>
          <p className="panel-intro">
            Географический контекст для проверенных исторических эпох и событий Казахстана.
          </p>

          <div className="panel-divider" />

          <section className="panel-section" aria-labelledby="era-title">
            <div className="section-heading">
              <h2 id="era-title">Эпохи</h2>
              <span>Данные готовятся</span>
            </div>
            <p className="empty-copy">
              Исторические границы появятся после проверки источников и геоданных.
            </p>
          </section>

          <div className="panel-divider" />

          <section className="panel-section" aria-labelledby="event-title">
            <div className="section-heading">
              <h2 id="event-title">События</h2>
            </div>
            <p className="empty-copy">
              Подтверждённые события будут отмечены на карте вместе со ссылками на источники.
            </p>
          </section>

          <p className="panel-footnote">
            Сейчас показана современная картографическая основа. Исторические границы ещё не опубликованы.
          </p>
        </aside>
      </div>
    </main>
  );
}
