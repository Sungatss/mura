"use client";

import { useEffect, useRef, useState } from "react";
import type { EraDataset } from "@/lib/atlas/types";

const BASEMAP_STYLE = "https://tiles.openfreemap.org/styles/liberty";
const EMPTY = { type: "FeatureCollection" as const, features: [] };

type MapCanvasProps = { data: EraDataset | null; eraId: string };

export function MapCanvas({ data, eraId }: MapCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("maplibre-gl").Map | null>(null);
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
        mapRef.current = map;

        map.addControl(
          new maplibregl.NavigationControl({ showCompass: false }),
          "top-right",
        );

        map.on("load", () => {
          if (cancelled || !map) return;
          map.addSource("atlas-territories", { type: "geojson", data: EMPTY });
          map.addLayer({
            id: "atlas-territory-fill",
            type: "fill",
            source: "atlas-territories",
            paint: { "fill-color": "#b3894d", "fill-opacity": 0.28 },
          });
          map.addLayer({
            id: "atlas-territory-outline",
            type: "line",
            source: "atlas-territories",
            paint: { "line-color": "#745629", "line-width": 2 },
          });
          map.addSource("atlas-events", { type: "geojson", data: EMPTY });
          map.addLayer({
            id: "atlas-event-points",
            type: "circle",
            source: "atlas-events",
            paint: {
              "circle-radius": 7,
              "circle-color": "#a44f3d",
              "circle-stroke-color": "#faf8f2",
              "circle-stroke-width": 2,
            },
          });
          setMapState("ready");
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
      mapRef.current = null;
      map?.remove();
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (mapState !== "ready" || !map) return;
    let cancelled = false;
    const territories = map.getSource("atlas-territories") as import("maplibre-gl").GeoJSONSource;
    const events = map.getSource("atlas-events") as import("maplibre-gl").GeoJSONSource;
    if (containerRef.current) delete containerRef.current.dataset.loadedEra;
    void Promise.all([
      territories.setData(data?.territories ?? EMPTY),
      events.setData(data?.events ?? EMPTY),
    ]).then(() => {
      if (!cancelled && data && containerRef.current) containerRef.current.dataset.loadedEra = eraId;
    }).catch((error) => {
      if (!cancelled) {
        console.error("Atlas layers could not update", error);
        setMapState("error");
      }
    });
    if (data?.territories.features.length) {
      const bounds = { west: 180, south: 90, east: -180, north: -90 };
      for (const feature of data.territories.features) {
        const polygons = feature.geometry.type === "Polygon"
          ? [feature.geometry.coordinates] : feature.geometry.coordinates;
        for (const polygon of polygons) {
          for (const ring of polygon) {
            for (const [lng, lat] of ring) {
              bounds.west = Math.min(bounds.west, lng);
              bounds.south = Math.min(bounds.south, lat);
              bounds.east = Math.max(bounds.east, lng);
              bounds.north = Math.max(bounds.north, lat);
            }
          }
        }
      }
      map.fitBounds(
        [[bounds.west, bounds.south], [bounds.east, bounds.north]],
        {
          padding: Math.min(60, Math.floor((containerRef.current?.clientWidth ?? 600) * 0.08)),
          maxZoom: 5.5,
          duration: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 450,
        },
      );
    }
    return () => { cancelled = true; };
  }, [data, eraId, mapState]);

  return (
    <div className="map-frame">
      <div ref={containerRef} className="map-canvas" aria-label="Интерактивная карта Казахстана" />
      {mapState === "loading" && <div className="map-state" role="status">Загрузка карты…</div>}
      {mapState === "error" && (
        <div className="map-state map-state-error" role="alert">
          Карта сейчас недоступна. Проверьте подключение и обновите страницу.
        </div>
      )}
    </div>
  );
}
