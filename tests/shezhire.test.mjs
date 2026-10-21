import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";

function load(file) {
  const source = readFileSync(file, "utf8");
  const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const exports = {};
  vm.runInNewContext(code, { exports }, { filename: file });
  return exports;
}

const { shezhireSources, shezhireZhuzes } = load("src/data/shezhire.ts");
const { figures } = load("src/data/figures.ts");
const sourceIds = new Set(shezhireSources.map((item) => item.id));
assert.deepEqual([...shezhireZhuzes.map((item) => item.id)], ["uly", "orta", "kishi"]);
assert.equal(new Set(shezhireZhuzes.flatMap((item) => item.ru.map((group) => group.id))).size, 9);
for (const source of shezhireSources) assert.match(source.url, /^https:\/\/e-history\.kz\//);
for (const zhuz of shezhireZhuzes) {
  assert.equal(zhuz.ru.length, 3);
  assert.ok(zhuz.sourceIds.every((id) => sourceIds.has(id)));
  for (const locale of ["kk", "ru", "en"]) {
    assert.ok(zhuz.name[locale]?.trim());
    assert.ok(zhuz.overview[locale]?.trim());
  }
  for (const ru of zhuz.ru) {
    assert.ok(ru.sourceIds.length && ru.sourceIds.every((id) => sourceIds.has(id)));
    for (const locale of ["kk", "ru", "en"]) {
      assert.ok(ru.name[locale]?.trim());
      if (ru.overview) assert.ok(ru.overview[locale]?.trim());
      if (ru.association) assert.ok(ru.association[locale]?.trim());
    }
    assert.equal(Object.hasOwn(ru, "figureIds"), false, "ru must not imply a person's ancestry");
  }
  if (zhuz.contextualFigureId) assert.ok(figures.some((figure) => figure.id === zhuz.contextualFigureId));
}
assert.equal(shezhireZhuzes.find((item) => item.id === "kishi").ru.every((ru) => ru.association && !ru.overview), true);
console.log("Shezhire catalog valid: 3 zhuzes, 9 sourced ru, 3 locales, no personal ancestry links.");
