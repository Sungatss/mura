"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/components/theme-provider";
import { ui } from "@/data/ui-translations";
import type { EraDataset, EventFeature, PointGeometry } from "@/lib/atlas/types";
import type { Locale } from "@/lib/i18n";

const BASEMAP_STYLES = { light: "https://tiles.openfreemap.org/styles/liberty", dark: "https://tiles.openfreemap.org/styles/dark" };
const EMPTY = { type: "FeatureCollection" as const, features: [] };

type MapCanvasProps = { data: EraDataset | null; eraId: string; locale: Locale; onSelectEvent?: (id: string) => void };

export function MapCanvas({ data, eraId, locale, onSelectEvent }: MapCanvasProps) {
  const { theme } = useTheme();
  const themeRef = useRef(theme);
  const lastFitData = useRef<EraDataset | null>(null);
  const lastFitSize = useRef("");
  const [mapRevision, setMapRevision] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("maplibre-gl").Map | null>(null);
  const onSelectEventRef = useRef(onSelectEvent);
  const [mapState, setMapState] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    themeRef.current = theme;
    const map = mapRef.current;
    if (map) {
      if (containerRef.current) delete containerRef.current.dataset.loadedTheme;
      map.setStyle(BASEMAP_STYLES[theme]);
    }
  }, [theme]);

  useEffect(() => { onSelectEventRef.current = onSelectEvent; }, [onSelectEvent]);

  useEffect(() => {
    function localizeControls() {
      const copy = ui[locale];
      const container = containerRef.current;
      container?.setAttribute("aria-label", copy.mapInteractive);
      const canvas = mapRef.current?.getCanvas();
      canvas?.setAttribute("aria-label", copy.mapInteractive);
      for (const [selector, label] of [
        [".maplibregl-ctrl-zoom-in", copy.mapZoomIn],
        [".maplibregl-ctrl-zoom-out", copy.mapZoomOut],
        [".maplibregl-ctrl-attrib-button", copy.mapAttributionToggle],
      ]) {
        const control = container?.querySelector<HTMLElement>(selector);
        control?.setAttribute("aria-label", label);
        control?.setAttribute("title", label);
      }
      // Translate only the connector text inserted by the basemap, preserving provider links.
      const attribution = container?.querySelector(".maplibregl-ctrl-attrib-inner");
      for (const node of attribution?.childNodes ?? []) {
        if (node.nodeType === Node.TEXT_NODE && node.textContent) {
          node.textContent = node.textContent.replace(/Data from|Данные:|Деректер:/g, copy.mapDataFrom);
        }
      }
    }
    localizeControls();
    const map = mapRef.current;
    map?.on("idle", localizeControls);
    return () => { map?.off("idle", localizeControls); };
  }, [locale, mapState]);

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
          style: BASEMAP_STYLES[themeRef.current],
          center: [67.5, 48.2],
          zoom: 4,
          minZoom: 2,
        });
        mapRef.current = map;
        map.on("resize", () => setMapRevision((value) => value + 1));

        map.addControl(
          new maplibregl.NavigationControl({ showCompass: false }),
          "top-right",
        );

        map.on("style.load", () => {
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
            paint: { "line-color": themeRef.current === "dark" ? "#d4b67e" : "#745629", "line-width": 2 },
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
          setMapRevision((value) => value + 1);
          setMapState("ready");
        });
        map.on("click", (event) => {
          if (!map?.getLayer("atlas-event-points")) return;
          const { x, y } = event.point;
          const [feature] = map.queryRenderedFeatures(
            [[x - 12, y - 12], [x + 12, y + 12]],
            { layers: ["atlas-event-points"] },
          );
          const id = feature?.properties?.id;
          if (typeof id === "string") onSelectEventRef.current?.(id);
        });
        map.on("mouseenter", "atlas-event-points", () => { if (map) map.getCanvas().style.cursor = "pointer"; });
        map.on("mouseleave", "atlas-event-points", () => { if (map) map.getCanvas().style.cursor = ""; });
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
    if (mapState !== "ready" || !map?.getSource("atlas-territories") || !map.getSource("atlas-events")) return;
    let cancelled = false;
    const loadedTheme = themeRef.current;
    const viewportSize = `${containerRef.current?.clientWidth}:${containerRef.current?.clientHeight}`;
    const territories = map.getSource("atlas-territories") as import("maplibre-gl").GeoJSONSource;
    const events = map.getSource("atlas-events") as import("maplibre-gl").GeoJSONSource;
    const mappedEvents = {
      type: "FeatureCollection" as const,
      features: data?.events.features.filter(
        (feature): feature is EventFeature & { geometry: PointGeometry } => feature.geometry !== null,
      ) ?? [],
    };
    if (containerRef.current) delete containerRef.current.dataset.loadedEra;
    void Promise.all([
      territories.setData(data?.territories ?? EMPTY),
      events.setData(mappedEvents),
    ]).then(() => {
      if (!cancelled && data && containerRef.current) {
        containerRef.current.dataset.loadedEra = eraId;
        containerRef.current.dataset.loadedTheme = loadedTheme;
      }
    }).catch((error) => {
      if (!cancelled) {
        console.error("Atlas layers could not update", error);
        setMapState("error");
      }
    });
    if (data && (data !== lastFitData.current || viewportSize !== lastFitSize.current) && (data.territories.features.length || data.events.features.some((feature) => feature.geometry))) {
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
      for (const feature of data.events.features) {
        if (feature.geometry) {
          const [lng, lat] = feature.geometry.coordinates;
          bounds.west = Math.min(bounds.west, lng);
          bounds.south = Math.min(bounds.south, lat);
          bounds.east = Math.max(bounds.east, lng);
          bounds.north = Math.max(bounds.north, lat);
        }
      }
      lastFitData.current = data;
      lastFitSize.current = viewportSize;
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
  }, [data, eraId, mapState, mapRevision]);

  return (
    <div className="map-frame">
      <div ref={containerRef} className="map-canvas" aria-label={ui[locale].mapInteractive} />
      {mapState === "loading" && <div className="map-state" role="status">{ui[locale].mapLoading}</div>}
      {mapState === "error" && (
        <div className="map-state map-state-error" role="alert">
          {ui[locale].mapError}
        </div>
      )}
    </div>
  );
}
