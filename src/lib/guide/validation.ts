export type GuideLanguage = "ru" | "kk" | "en";
export type GuideTurn = { role: "user" | "assistant"; text: string };
export type GuideInput = {
  eraId: string;
  eventId: string | null;
  figureId: string | null;
  language: GuideLanguage;
  question: string;
  history: GuideTurn[];
};

export const MAX_BODY_BYTES = 12_000;
export const MAX_QUESTION_LENGTH = 600;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function validId(value: unknown): value is string {
  return typeof value === "string" && /^[a-z0-9-]{1,80}$/.test(value);
}

export function parseGuideInput(value: unknown): GuideInput | null {
  if (!isRecord(value) || !validId(value.eraId)
    || (value.eventId != null && !validId(value.eventId))
    || (value.figureId != null && !validId(value.figureId))
    || (value.eventId != null && value.figureId != null)
    || (value.language !== "ru" && value.language !== "kk" && value.language !== "en")
    || typeof value.question !== "string"
    || value.question.trim().length < 3
    || value.question.length > MAX_QUESTION_LENGTH) return null;

  const history = value.history ?? [];
  if (!Array.isArray(history) || history.length > 4 || history.length % 2 !== 0) return null;
  for (const [index, turn] of history.entries()) {
    if (!isRecord(turn) || turn.role !== (index % 2 === 0 ? "user" : "assistant")
      || typeof turn.text !== "string" || !turn.text.trim() || turn.text.length > 1_800) return null;
  }

  return {
    eraId: value.eraId as string,
    eventId: (value.eventId ?? null) as string | null,
    figureId: (value.figureId ?? null) as string | null,
    language: value.language as GuideLanguage,
    question: (value.question as string).trim(),
    history: history as GuideTurn[],
  };
}

export type ModelAnswer = { supported: boolean; answer: string; sourceIds: string[] };

export function parseModelAnswer(value: unknown, allowedSourceIds: ReadonlySet<string>): ModelAnswer | null {
  if (!isRecord(value) || typeof value.supported !== "boolean"
    || typeof value.answer !== "string" || value.answer.length > 1_800
    || !Array.isArray(value.sourceIds) || value.sourceIds.length > 6
    || value.sourceIds.some((id) => typeof id !== "string" || !allowedSourceIds.has(id))
    || new Set(value.sourceIds).size !== value.sourceIds.length) return null;

  if (!value.supported) return { supported: false, answer: "", sourceIds: [] };
  const answer = value.answer.trim();
  if (!answer || value.sourceIds.length === 0 || /https?:\/\/|www\.|\[[^\]]+\]\(/i.test(answer)) return null;
  return { supported: true, answer, sourceIds: value.sourceIds as string[] };
}
