import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";

function load(file) {
  const code = ts.transpileModule(readFileSync(file, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 }, fileName: file,
  }).outputText;
  const exports = {};
  vm.runInNewContext(code, { exports }, { filename: file });
  return exports;
}

const { learningQuestions } = load("src/data/learning.ts");
const { questionsForScope, scoreAnswers, activityId } = load("src/lib/learning/quiz.ts");
const all = questionsForScope(learningQuestions, { kind: "all" });
assert.equal(all.length, 10);
assert.equal(questionsForScope(all, { kind: "era", id: "kazakh-1468-1474" }).length, 3);
assert.equal(questionsForScope(all, { kind: "era", id: "kazakh-1529-1555" }).length, 4);
assert.equal(questionsForScope(all, { kind: "era", id: "kazakh-1721-1737" }).length, 3);
assert.equal(questionsForScope(all, { kind: "figure", id: "kerei" }).length, 2);
assert.equal(questionsForScope(all, { kind: "figure", id: "abulkhair-younger" }).length, 2);
assert.equal(scoreAnswers(all, all.map((question) => question.correctIndex)), 10);
assert.equal(scoreAnswers(all, all.map((question) => (question.correctIndex + 1) % 3)), 0);
assert.equal(scoreAnswers(all, all.map((question, index) => index % 2 ? null : question.correctIndex)), 5);
assert.equal(activityId("cards", { kind: "figure", id: "kerei" }), "cards:figure:kerei");
console.log("Learning logic tests passed: scope filtering, figure links, scoring, activity IDs.");
