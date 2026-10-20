"use client";

import { useEffect, useRef, useState } from "react";

const BASEMAP_STYLE = "https://tiles.openfreemap.org/styles/liberty";

export function MapCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mapState, setMapState] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let map: import("maplibre-gl").Map | undefined;
    let cancelled = false;

    async function initializeMap() {
      try {
        const maplibregl = await import("maplibre-gl");
        if (cancelled || !containerRef.current) return;

        maplibregl.setWorkerUrl(
          new URL("maplibre-gl/dist/maplibre-gl-worker.mjs", import.meta.url).toString(),
        );

        map = new maplibregl.Map({
          container: containerRef.current,
          style: BASEMAP_STYLE,
          center: [67.5, 48.2],
          zoom: 4,
          minZoom: 2,
        });

        map.addControl(
          new maplibregl.NavigationControl({ showCompass: false }),
          "top-right",
        );

        map.on("load", () => {
          if (!cancelled) setMapState("ready");
        });
        map.on("error", (event) => {
          if (!cancelled && !map?.isStyleLoaded()) {
            console.error("Basemap could not load", event.error);
            setMapState("error");
          }
        });
      } catch (error) {
        if (!cancelled) {
          console.error("MapLibre could not initialize", error);
          setMapState("error");
        }
      }
    }

    void initializeMap();

    return () => {
      cancelled = true;
      map?.remove();
    };
  }, []);

  return (
    <div className="map-frame">
      <div ref={containerRef} className="map-canvas" aria-label="Интерактивная карта Казахстана" />
      {mapState === "loading" && (
        <div className="map-state" role="status">Загрузка карты…</div>
      )}
      {mapState === "error" && (
        <div className="map-state map-state-error" role="alert">
          Карта сейчас недоступна. Проверьте подключение и обновите страницу.
        </div>
      )}
    </div>
  );
}
