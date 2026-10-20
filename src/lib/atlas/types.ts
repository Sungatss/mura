export type LocalizedText = { ru: string; kk?: string; en?: string };

export type Era = {
  id: string;
  label: LocalizedText;
  description: LocalizedText;
  startYear: number | null;
  endYear: number | null;
  kind: "historical-reconstruction" | "technical-fixture";
  territoryUrl: string;
  eventUrl: string;
  sourceIds: string[];
};

export type SourceReference = {
  id: string;
  title: string;
  url: string;
  license: string;
  licenseUrl?: string;
  accessedOn: string;
  note: string;
  archiveSha256?: string;
};

export type Position = [number, number];
export type PolygonGeometry = { type: "Polygon"; coordinates: Position[][] };
export type MultiPolygonGeometry = { type: "MultiPolygon"; coordinates: Position[][][] };
export type PointGeometry = { type: "Point"; coordinates: Position };

export type HistoricalTerritory = {
  id: string;
  eraId: string;
  kind: "territory";
  name: LocalizedText;
  startYear: number | null;
  endYear: number | null;
  certainty: "approximate" | "technical-fixture";
  sourceIds: string[];
  sourceName?: string;
};

export type HistoricalEvent = {
  id: string;
  eraId: string;
  kind: "event";
  name: LocalizedText;
  dateLabel?: LocalizedText;
  description?: LocalizedText;
  uncertaintyNote?: LocalizedText;
  placeLabel?: LocalizedText;
  startYear: number | null;
  endYear: number | null;
  certainty: "verified" | "approximate" | "technical-fixture";
  coordinateStatus?: "not-mapped" | "approximate" | "verified" | "technical-fixture";
  coordinateNote?: LocalizedText;
  coordinateSourceIds?: string[];
  figureIds?: string[];
  highlightRank?: number | null;
  sourceIds: string[];
};

export type HistoricalFigure = {
  id: string;
  name: LocalizedText;
  description: LocalizedText;
  eraIds: string[];
  eventIds: string[];
  sourceIds: string[];
};

export type GeoFeature<P, G> = { type: "Feature"; properties: P; geometry: G };
export type FeatureCollection<F> = { type: "FeatureCollection"; features: F[] };
export type TerritoryFeature = GeoFeature<HistoricalTerritory, PolygonGeometry | MultiPolygonGeometry>;
export type EventFeature = GeoFeature<HistoricalEvent, PointGeometry | null>;
export type EraDataset = {
  territories: FeatureCollection<TerritoryFeature>;
  events: FeatureCollection<EventFeature>;
};
