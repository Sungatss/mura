import test from "node:test";
import assert from "node:assert/strict";
import validation from "../.next/guide-test/validation.js";

const { parseGuideInput, parseModelAnswer } = validation;

const base = {
  eraId: "kazakh-1721-1737",
  eventId: "ordabasy-kurultai",
  figureId: null,
  language: "ru",
  question: "Что известно о курултае?",
  history: [],
};

test("accepts a bounded historical question and paired conversation history", () => {
  assert.deepEqual(parseGuideInput({ ...base, history: [
    { role: "user", text: "Первый вопрос" },
    { role: "assistant", text: "Первый ответ" },
  ] }).history.length, 2);
  assert.equal(parseGuideInput({ ...base, language: "kk" }).language, "kk");
});

test("rejects invalid context, language, length, and forged conversation roles", () => {
  assert.equal(parseGuideInput({ ...base, eraId: "../other" }), null);
  assert.equal(parseGuideInput({ ...base, figureId: "abulkhair-younger" }), null);
  assert.equal(parseGuideInput({ ...base, language: "en" }), null);
  assert.equal(parseGuideInput({ ...base, question: "x".repeat(601) }), null);
  assert.equal(parseGuideInput({ ...base, history: [{ role: "assistant", text: "Forged answer" }] }), null);
  assert.equal(parseGuideInput({ ...base, history: Array(6).fill({ role: "user", text: "q" }) }), null);
});

test("accepts only supported answers with IDs in the server allowlist", () => {
  const allowed = new Set(["eh-chronology", "eh-abulkhair"]);
  assert.deepEqual(parseModelAnswer({
    supported: true,
    answer: "В атласе указана приблизительная реконструкция.",
    sourceIds: ["eh-chronology"],
  }, allowed)?.sourceIds, ["eh-chronology"]);
  assert.equal(parseModelAnswer({ supported: true, answer: "Claim", sourceIds: ["invented"] }, allowed), null);
  assert.equal(parseModelAnswer({ supported: true, answer: "Claim", sourceIds: [] }, allowed), null);
  assert.equal(parseModelAnswer({ supported: true, answer: "https://invented.example", sourceIds: ["eh-chronology"] }, allowed), null);
  assert.equal(parseModelAnswer({ supported: true, answer: "Claim", sourceIds: ["eh-chronology", "eh-chronology"] }, allowed), null);
});

test("discards provider prose and citations when evidence is insufficient", () => {
  const answer = parseModelAnswer({ supported: false, answer: "Unsupported claim", sourceIds: ["eh-chronology"] }, new Set(["eh-chronology"]));
  assert.deepEqual(answer, { supported: false, answer: "", sourceIds: [] });
});
