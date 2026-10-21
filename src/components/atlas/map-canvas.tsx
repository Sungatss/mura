"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/components/theme-provider";
import { eventCategory, type EventCategory } from "@/data/event-categories";
import { eventText } from "@/data/historical-translations";
import { ui } from "@/data/ui-translations";
import { historicalPlaces, placeVisibleInEra, type HistoricalPlace } from "@/data/historical-places";
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
const PLACE_ICONS: Record<NonNullable<HistoricalPlace["kind"]>, string> = {
  center: '<path d="M3 20h18M5 20V9l7-5 7 5v11M9 20v-6h6v6M3 10l9-7 9 7"/>',
  settlement: '<path d="M3 20h18M5 20V8l4-3 4 3v12M13 20V10l3-2 3 2v10M8 11h2m-2 4h2m7-3h1"/>',
  cultural: '<path d="M3 20h18M6 20V8h12v12M4 8l8-5 8 5M10 20v-6h4v6M9 10h6"/>',
  assembly: '<circle cx="12" cy="6" r="3"/><path d="M4 20v-3a8 8 0 0 1 16 0v3M3 20h18"/>',
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
  selectedPlaceId: string | null;
  visiblePlaceKinds: NonNullable<HistoricalPlace["kind"]>[];
  showEventMarkers: boolean;
  compareEnabled: boolean;
  compareData: EraDataset | null;
  compareEraId: string;
  compareBalance: number;
  onSelectEvent?: (id: string) => void;
  onSelectPlace?: (id: string) => void;
};

export function MapCanvas({ data, eraId, locale, categoryFilter, selectedEventId, selectedPlaceId, visiblePlaceKinds, showEventMarkers, compareEnabled, compareData, compareEraId, compareBalance, onSelectEvent, onSelectPlace }: MapCanvasProps) {
  const { theme } = useTheme();
  const themeRef = useRef(theme);
  const lastFitData = useRef<EraDataset | null>(null);
  const lastFitCompareData = useRef<EraDataset | null>(null);
  const lastFitCompareEnabled = useRef(false);
  const lastAppliedSource = useRef<import("maplibre-gl").GeoJSONSource | null>(null);
  const lastAppliedData = useRef<EraDataset | null>(null);
  const lastAppliedCompareSource = useRef<import("maplibre-gl").GeoJSONSource | null>(null);
  const lastAppliedCompareData = useRef<EraDataset | null>(null);
  const markersRef = useRef(new Map<string, import("maplibre-gl").Marker>());
  const placeMarkersRef = useRef(new Map<string, import("maplibre-gl").Marker>());
  const clusterMarkersRef = useRef<import("maplibre-gl").Marker[]>([]);
  const maplibreRef = useRef<typeof import("maplibre-gl") | null>(null);
  const [mapRevision, setMapRevision] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("maplibre-gl").Map | null>(null);
  const onSelectEventRef = useRef(onSelectEvent);
  const onSelectPlaceRef = useRef(onSelectPlace);
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
  useEffect(() => { onSelectPlaceRef.current = onSelectPlace; }, [onSelectPlace]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let frame = 0;
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => mapRef.current?.resize());
    });
    observer.observe(container);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); };
  }, []);

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
    const placeMarkers = placeMarkersRef.current;
    const clusterMarkers = clusterMarkersRef.current;

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
          map.addSource("atlas-compare-territories", { type: "geojson", data: EMPTY });
          map.addLayer({
            id: "atlas-territory-fill",
            type: "fill",
            source: "atlas-territories",
            paint: { "fill-color": "#b3894d", "fill-opacity": 0.28, "fill-opacity-transition": { duration: 200 } },
          });
          map.addLayer({
            id: "atlas-compare-fill",
            type: "fill",
            source: "atlas-compare-territories",
            paint: { "fill-color": "#347f89", "fill-opacity": 0, "fill-opacity-transition": { duration: 200 } },
          });
          map.addLayer({
            id: "atlas-territory-outline",
            type: "line",
            source: "atlas-territories",
            paint: { "line-color": themeRef.current === "dark" ? "#d4b67e" : "#745629", "line-width": 2 },
          });
          map.addLayer({
            id: "atlas-compare-outline",
            type: "line",
            source: "atlas-compare-territories",
            paint: { "line-color": themeRef.current === "dark" ? "#7cc6c8" : "#176574", "line-width": 2.4, "line-opacity": 0 },
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
      for (const marker of placeMarkers.values()) marker.remove();
      placeMarkers.clear();
      for (const marker of clusterMarkers) marker.remove();
      clusterMarkers.length = 0;
      mapRef.current = null;
      maplibreRef.current = null;
      map?.remove();
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (mapState !== "ready" || !map?.getSource("atlas-territories")) return;
    const loadedTheme = themeRef.current;
    const territories = map.getSource("atlas-territories") as import("maplibre-gl").GeoJSONSource;
    const compareTerritories = map.getSource("atlas-compare-territories") as import("maplibre-gl").GeoJSONSource | undefined;
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
    if (compareTerritories && (compareTerritories !== lastAppliedCompareSource.current || (compareEnabled ? compareData : null) !== lastAppliedCompareData.current)) {
      lastAppliedCompareSource.current = compareTerritories;
      lastAppliedCompareData.current = compareEnabled ? compareData : null;
      if (containerRef.current) delete containerRef.current.dataset.loadedCompareEra;
      void compareTerritories.setData(compareEnabled ? compareData?.territories ?? EMPTY : EMPTY).then(() => {
        if (compareEnabled && compareData && mapRef.current?.getSource("atlas-compare-territories") === compareTerritories
          && lastAppliedCompareData.current === compareData && containerRef.current) {
          containerRef.current.dataset.loadedCompareEra = compareEraId;
        }
      }).catch((error) => {
        if (mapRef.current?.getSource("atlas-compare-territories") === compareTerritories) {
          console.error("Comparison layer could not update", error);
          setMapState("error");
        }
      });
    }
    if (data && (!compareEnabled || compareData) && !selectedEventId
      && (data !== lastFitData.current || (compareEnabled ? compareData : null) !== lastFitCompareData.current
        || compareEnabled !== lastFitCompareEnabled.current)
      && (data.territories.features.length || data.events.features.some((feature) => locatedEvent(feature, eraId)) || historicalPlaces.some((place) => place.eraId === eraId))) {
      const bounds = { west: 180, south: 90, east: -180, north: -90 };
      for (const feature of [...data.territories.features, ...(compareEnabled ? compareData?.territories.features ?? [] : [])]) {
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
      for (const feature of compareEnabled ? [] : data.events.features) {
        if (locatedEvent(feature, eraId)) {
          const [lng, lat] = feature.geometry.coordinates;
          bounds.west = Math.min(bounds.west, lng);
          bounds.south = Math.min(bounds.south, lat);
          bounds.east = Math.max(bounds.east, lng);
          bounds.north = Math.max(bounds.north, lat);
        }
      }
      for (const place of compareEnabled ? [] : historicalPlaces.filter((item) => item.eraId === eraId)) {
        const [lng, lat] = place.coordinates;
        bounds.west = Math.min(bounds.west, lng);
        bounds.south = Math.min(bounds.south, lat);
        bounds.east = Math.max(bounds.east, lng);
        bounds.north = Math.max(bounds.north, lat);
      }
      lastFitData.current = data;
      lastFitCompareData.current = compareEnabled ? compareData : null;
      lastFitCompareEnabled.current = compareEnabled;
      map.fitBounds(
        [[bounds.west, bounds.south], [bounds.east, bounds.north]],
        {
          padding: Math.min(60, Math.floor((containerRef.current?.clientWidth ?? 600) * 0.08)),
          maxZoom: 5.5,
          duration: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 450,
        },
      );
    }
  }, [data, eraId, mapState, mapRevision, selectedEventId, compareEnabled, compareData, compareEraId]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map?.getLayer("atlas-compare-fill")) return;
    const share = compareBalance / 100;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    map.setPaintProperty("atlas-territory-fill", "fill-color", compareEnabled ? "#bc873d" : "#b3894d");
    map.setPaintProperty("atlas-territory-fill", "fill-opacity-transition", { duration: reducedMotion ? 0 : 200 });
    map.setPaintProperty("atlas-territory-fill", "fill-opacity", compareEnabled ? 0.18 + 0.25 * (1 - share) : selectedEventId ? 0.37 : 0.28);
    map.setPaintProperty("atlas-territory-outline", "line-color", compareEnabled ? (theme === "dark" ? "#e5ba73" : "#89591c") : (theme === "dark" ? "#d4b67e" : "#745629"));
    map.setPaintProperty("atlas-territory-outline", "line-width", compareEnabled ? 2.5 : selectedEventId ? 3.5 : 2);
    map.setPaintProperty("atlas-compare-fill", "fill-opacity-transition", { duration: reducedMotion ? 0 : 200 });
    map.setPaintProperty("atlas-compare-fill", "fill-opacity", compareEnabled ? 0.18 + 0.25 * share : 0);
    map.setPaintProperty("atlas-compare-outline", "line-opacity", compareEnabled ? 1 : 0);
  }, [compareEnabled, compareBalance, selectedEventId, theme, mapRevision]);

  useEffect(() => {
    const map = mapRef.current;
    const maplibregl = maplibreRef.current;
    if (mapState !== "ready" || !map || !maplibregl) return;
    const markers = markersRef.current;
    for (const marker of markers.values()) marker.remove();
    markers.clear();
    const copy = ui[locale];
    for (const feature of compareEnabled || !showEventMarkers ? [] : data?.events.features ?? []) {
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
  }, [data, eraId, locale, categoryFilter, mapState, compareEnabled, showEventMarkers]);

  useEffect(() => {
    const map = mapRef.current;
    const maplibregl = maplibreRef.current;
    if (mapState !== "ready" || !map || !maplibregl) return;
    const markers = placeMarkersRef.current;
    for (const marker of markers.values()) marker.remove();
    markers.clear();
    if (compareEnabled) return;
    const copy = ui[locale];
    for (const place of historicalPlaces.filter((item) => placeVisibleInEra(item, eraId) && visiblePlaceKinds.includes(item.kind ?? "settlement"))) {
      const kind = place.kind ?? "settlement";
      const button = document.createElement("button");
      button.type = "button";
      button.className = `map-place-marker map-place-${kind}`;
      button.setAttribute("aria-label", `${copy.placeLabel}: ${place.name[locale]}`);
      button.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${PLACE_ICONS[kind]}</svg>`;
      const mapName = document.createElement("span");
      mapName.className = "map-place-name";
      mapName.textContent = place.name[locale];
      button.appendChild(mapName);
      const preview = document.createElement("span");
      preview.className = "map-marker-preview";
      const title = document.createElement("strong");
      title.textContent = place.name[locale];
      const note = document.createElement("span");
      note.textContent = place.locationNote[locale];
      preview.append(title, note);
      if (place.politicalStatus) {
        const status = document.createElement("span");
        status.textContent = place.politicalStatus[locale];
        preview.appendChild(status);
      }
      button.appendChild(preview);
      button.addEventListener("click", () => onSelectPlaceRef.current?.(place.id));
      markers.set(place.id, new maplibregl.Marker({ element: button, anchor: "bottom" }).setLngLat(place.coordinates).addTo(map));
    }
    return () => { for (const marker of markers.values()) marker.remove(); markers.clear(); };
  }, [eraId, locale, mapState, compareEnabled, visiblePlaceKinds]);

  useEffect(() => {
    const map = mapRef.current;
    const maplibregl = maplibreRef.current;
    if (mapState !== "ready" || !map || !maplibregl || compareEnabled) return;
    const clusters = clusterMarkersRef.current;
    const eventMarkers = markersRef.current;
    const placeMarkers = placeMarkersRef.current;
    function updateClusters() {
      if (!map || !maplibregl) return;
      if (containerRef.current) containerRef.current.dataset.detailZoom = map.getZoom() >= 5.2 ? "true" : "false";
      for (const marker of clusters) marker.remove();
      clusters.length = 0;
      const entries = [...eventMarkers.values(), ...placeMarkers.values()];
      for (const marker of entries) marker.getElement().style.display = "";
      if (map.getZoom() >= 5.2 || entries.length < 2) return;
      const groups: typeof entries[] = [];
      for (const marker of entries) {
        const point = map.project(marker.getLngLat());
        const group = groups.find((items) => {
          const center = map.project(items[0].getLngLat());
          return Math.hypot(point.x - center.x, point.y - center.y) < 54;
        });
        if (group) group.push(marker);
        else groups.push([marker]);
      }
      for (const group of groups.filter((items) => items.length > 1)) {
        for (const marker of group) marker.getElement().style.display = "none";
        const [lng, lat] = group.reduce(([x, y], marker) => [x + marker.getLngLat().lng, y + marker.getLngLat().lat], [0, 0]);
        const center: [number, number] = [lng / group.length, lat / group.length];
        const button = document.createElement("button");
        button.type = "button";
        button.className = "map-location-cluster";
        button.setAttribute("aria-label", `${ui[locale].mapCluster}: ${group.length}`);
        button.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/></svg><span>${group.length}</span>`;
        button.addEventListener("click", () => map.easeTo({ center, zoom: Math.min(map.getZoom() + 2, 8), duration: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 500 }));
        clusters.push(new maplibregl.Marker({ element: button, anchor: "center" }).setLngLat(center).addTo(map));
      }
    }
    updateClusters();
    map.on("zoomend", updateClusters);
    return () => {
      map.off("zoomend", updateClusters);
      for (const marker of clusters) marker.remove();
      clusters.length = 0;
      for (const marker of [...eventMarkers.values(), ...placeMarkers.values()]) marker.getElement().style.display = "";
    };
  }, [data, eraId, locale, categoryFilter, mapState, compareEnabled, mapRevision, visiblePlaceKinds, showEventMarkers]);

  useEffect(() => {
    for (const [id, marker] of markersRef.current) {
      marker.getElement().classList.toggle("is-selected", id === selectedEventId);
    }
  }, [selectedEventId, mapRevision, data, categoryFilter, locale]);

  useEffect(() => {
    for (const [id, marker] of placeMarkersRef.current) marker.getElement().classList.toggle("is-selected", id === selectedPlaceId);
  }, [selectedPlaceId, eraId, locale]);

  useEffect(() => {
    if (!selectedEventId || !data || mapState !== "ready" || compareEnabled) return;
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
  }, [selectedEventId, data, eraId, mapState, compareEnabled]);

  useEffect(() => {
    if (!selectedPlaceId || mapState !== "ready" || compareEnabled) return;
    const place = historicalPlaces.find((item) => item.id === selectedPlaceId);
    const map = mapRef.current;
    if (!place || !map) return;
    map.flyTo({ center: place.coordinates, zoom: Math.max(map.getZoom(), 6.2), duration: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 850, essential: false });
  }, [selectedPlaceId, mapState, compareEnabled]);

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
