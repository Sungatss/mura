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
const { achievements, levelProgress, unlockedAchievements } = load("src/lib/learning/milestones.ts");
const all = questionsForScope(learningQuestions, { kind: "all" });
assert.ok(all.length >= 10);
assert.equal(questionsForScope(all, { kind: "era", id: "kazakh-1468-1474" }).length, 3);
assert.equal(questionsForScope(all, { kind: "era", id: "kazakh-1529-1555" }).length, 4);
assert.equal(questionsForScope(all, { kind: "era", id: "kazakh-1721-1737" }).length, 3);
assert.ok(questionsForScope(all, { kind: "figure", id: "kerei" }).length >= 2);
assert.equal(questionsForScope(all, { kind: "figure", id: "abulkhair-younger" }).length, 2);
assert.ok(questionsForScope(all, { kind: "era", id: "kazakh-1837-1847" }).length > 0);
assert.equal(scoreAnswers(all, all.map((question) => question.correctIndex)), all.length);
assert.equal(scoreAnswers(all, all.map((question) => (question.correctIndex + 1) % 3)), 0);
assert.equal(scoreAnswers(all, all.map((question, index) => index % 2 ? null : question.correctIndex)), Math.ceil(all.length / 2));
assert.equal(activityId("cards", { kind: "figure", id: "kerei" }), "cards:figure:kerei");
assert.equal(achievements.length, 6);
assert.deepEqual(Array.from(unlockedAchievements([])), []);
assert.deepEqual(Array.from(unlockedAchievements(["quiz:all", "quiz:all", "cards:figure:kerei"])), ["first-quiz", "first-cards", "atlas-quiz"]);
assert.ok(unlockedAchievements([
  "quiz:era:kazakh-1468-1474", "quiz:era:kazakh-1529-1555", "quiz:era:kazakh-1721-1737",
  "cards:era:kazakh-1468-1474", "cards:era:kazakh-1529-1555", "cards:era:kazakh-1721-1737",
  "quiz:figure:kerei", "quiz:figure:tahir", "quiz:figure:abulkhair-younger",
]).includes("three-figures"));
assert.equal(levelProgress(0, 200).level, 1);
assert.equal(levelProgress(50, 200).level, 2);
assert.equal(levelProgress(75, 200).current, 25);
assert.deepEqual({ ...levelProgress(200, 200) }, { level: 5, current: 50, target: 50, complete: true });
console.log("Learning logic tests passed: scopes, scoring, milestones, levels.");
