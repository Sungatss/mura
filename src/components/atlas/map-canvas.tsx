"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/components/theme-provider";
import { eventCategory, type EventCategory } from "@/data/event-categories";
import { eventText } from "@/data/historical-translations";
import { ui } from "@/data/ui-translations";
import type { EraDataset, EventFeature, PointGeometry } from "@/lib/atlas/types";
import type { Locale } from "@/lib/i18n";

const BASEMAP_STYLES = { light: "https://tiles.openfreemap.org/styles/liberty", dark: "https://tiles.openfreemap.org/styles/dark" };
const EMPTY = { type: "FeatureCollection" as const, features: [] };
const MARKER_ICONS: Record<EventCategory, string> = {
  politics: '<path d="M3 9 12 4l9 5M5 9v10m4-10v10m6-10v10m4-10v10M3 20h18M3 9h18"/>',
  conflict: '<path d="m4 4 16 16M20 4 4 20M4 4l4 1-3 3m15-4-4 1 3 3M2 22l5-2m15 2-5-2"/>',
  records: '<path d="M6 3h10l3 3v14H6a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3Zm10 0v4h4M7 11h9M7 15h9"/>',
  diplomacy: '<path d="M3 8h5l4 4 4-4h5M3 16h5l4-4 4 4h5M8 8l4-3 4 3M8 16l4 3 4-3"/>',
  other: '<circle cx="12" cy="12" r="7"/><path d="M12 8v8m-4-4h8"/>',
};

function locatedEvent(feature: EventFeature, eraId: string): feature is EventFeature & { geometry: PointGeometry } {
  const { coordinateStatus, coordinateSourceIds } = feature.properties;
  return feature.geometry?.type === "Point" && (
    ((coordinateStatus === "verified" || coordinateStatus === "approximate") && !!coordinateSourceIds?.length)
    || (eraId === "technical-fixture" && coordinateStatus === "technical-fixture")
  );
}

type MapCanvasProps = {
  data: EraDataset | null;
  eraId: string;
  locale: Locale;
  categoryFilter: EventCategory | "all";
  selectedEventId: string | null;
  onSelectEvent?: (id: string) => void;
};

export function MapCanvas({ data, eraId, locale, categoryFilter, selectedEventId, onSelectEvent }: MapCanvasProps) {
  const { theme } = useTheme();
  const themeRef = useRef(theme);
  const lastFitData = useRef<EraDataset | null>(null);
  const lastFitSize = useRef("");
  const lastAppliedSource = useRef<import("maplibre-gl").GeoJSONSource | null>(null);
  const lastAppliedData = useRef<EraDataset | null>(null);
  const markersRef = useRef(new Map<string, import("maplibre-gl").Marker>());
  const maplibreRef = useRef<typeof import("maplibre-gl") | null>(null);
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
    const markers = markersRef.current;

    async function initializeMap() {
      try {
        const maplibregl = await import("maplibre-gl");
        if (cancelled || !containerRef.current) return;
        maplibreRef.current = maplibregl;

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
          setMapRevision((value) => value + 1);
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
      for (const marker of markers.values()) marker.remove();
      markers.clear();
      mapRef.current = null;
      maplibreRef.current = null;
      map?.remove();
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (mapState !== "ready" || !map?.getSource("atlas-territories")) return;
    const loadedTheme = themeRef.current;
    const viewportSize = `${containerRef.current?.clientWidth}:${containerRef.current?.clientHeight}`;
    const territories = map.getSource("atlas-territories") as import("maplibre-gl").GeoJSONSource;
    if (territories !== lastAppliedSource.current || data !== lastAppliedData.current) {
      lastAppliedSource.current = territories;
      lastAppliedData.current = data;
      if (containerRef.current) delete containerRef.current.dataset.loadedEra;
      void territories.setData(data?.territories ?? EMPTY).then(() => {
        if (data && mapRef.current?.getSource("atlas-territories") === territories
          && lastAppliedData.current === data && containerRef.current) {
          containerRef.current.dataset.loadedEra = eraId;
          containerRef.current.dataset.loadedTheme = loadedTheme;
        }
      }).catch((error) => {
        if (mapRef.current?.getSource("atlas-territories") === territories) {
          console.error("Atlas layers could not update", error);
          setMapState("error");
        }
      });
    }
    if (data && !selectedEventId && (data !== lastFitData.current || viewportSize !== lastFitSize.current)
      && (data.territories.features.length || data.events.features.some((feature) => locatedEvent(feature, eraId)))) {
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
        if (locatedEvent(feature, eraId)) {
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
  }, [data, eraId, mapState, mapRevision, selectedEventId]);

  useEffect(() => {
    const map = mapRef.current;
    const maplibregl = maplibreRef.current;
    if (mapState !== "ready" || !map || !maplibregl) return;
    const markers = markersRef.current;
    for (const marker of markers.values()) marker.remove();
    markers.clear();
    const copy = ui[locale];
    for (const feature of data?.events.features ?? []) {
      if (!locatedEvent(feature, eraId)) continue;
      const category = eventCategory(feature.properties.id);
      if (categoryFilter !== "all" && category !== categoryFilter) continue;
      const name = eventText(feature.properties, "name", locale) ?? "";
      const approximate = feature.properties.coordinateStatus === "approximate";
      const button = document.createElement("button");
      button.type = "button";
      button.className = `map-event-marker map-event-marker-${category}`;
      button.setAttribute("aria-label", `${copy.mapMarkerAction}: ${name}${approximate ? `, ${copy.mapApproxLocation}` : ""}`);
      button.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.55" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${MARKER_ICONS[category]}</svg>`;
      const preview = document.createElement("span");
      preview.className = "map-marker-preview";
      preview.setAttribute("aria-hidden", "true");
      for (const [className, value] of [
        ["map-marker-date", eventText(feature.properties, "dateLabel", locale) ?? ""],
        ["map-marker-title", name],
        ["map-marker-location", approximate ? copy.mapApproxLocation : (eventText(feature.properties, "placeLabel", locale) ?? "")],
      ]) {
        if (!value) continue;
        const line = document.createElement("span");
        line.className = className;
        line.textContent = value;
        preview.appendChild(line);
      }
      button.appendChild(preview);
      button.addEventListener("click", () => onSelectEventRef.current?.(feature.properties.id));
      markers.set(feature.properties.id, new maplibregl.Marker({ element: button, anchor: "center" })
        .setLngLat(feature.geometry.coordinates).addTo(map));
    }
    return () => {
      for (const marker of markers.values()) marker.remove();
      markers.clear();
    };
  }, [data, eraId, locale, categoryFilter, mapState]);

  useEffect(() => {
    for (const [id, marker] of markersRef.current) {
      marker.getElement().classList.toggle("is-selected", id === selectedEventId);
    }
    const map = mapRef.current;
    if (map?.getLayer("atlas-territory-fill")) {
      map.setPaintProperty("atlas-territory-fill", "fill-opacity", selectedEventId ? 0.37 : 0.28);
    }
    if (map?.getLayer("atlas-territory-outline")) {
      map.setPaintProperty("atlas-territory-outline", "line-width", selectedEventId ? 3.5 : 2);
    }
  }, [selectedEventId, mapRevision, data, categoryFilter, locale]);

  useEffect(() => {
    if (!selectedEventId || !data || mapState !== "ready") return;
    const feature = data.events.features.find((item) => item.properties.id === selectedEventId);
    if (!feature || !locatedEvent(feature, eraId)) return;
    const map = mapRef.current;
    if (!map) return;
    map.flyTo({
      center: feature.geometry.coordinates,
      zoom: Math.max(map.getZoom(), 6.2),
      duration: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 850,
      essential: false,
    });
  }, [selectedEventId, data, eraId, mapState]);

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
