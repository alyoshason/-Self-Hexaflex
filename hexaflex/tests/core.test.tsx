import assert from "node:assert/strict";
import { test } from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { mean, pairMean, rankProcesses } from "../lib/scoring";
import { processes } from "../lib/content";
import { vertex, sectorPoints, spatialOrder } from "../lib/geometry";
import { Hexaflex } from "../components/Hexaflex";
test("26 itens, identificadores únicos", () => {
  const items = processes.flatMap((p) => p.items.map((i) => i.id));
  assert.equal(items.length, 26);
  assert.equal(new Set(items).size, 26);
});
test("média normal sem arredondamento prematuro", () =>
  assert.equal(mean([1, 2, 2]), 5 / 3));
test("N/A não entra no denominador", () => assert.equal(mean([2, "na", 8]), 5));
test("mínimo de 2 em 3 e 3 em 5", () => {
  assert.equal(mean([0, 10, "na"]), 5);
  assert.equal(mean([4, "na", "na"]), null);
  assert.equal(mean([2, 4, 6, "na", "na"]), 4);
  assert.equal(mean([2, 4, "na", "na", "na"]), null);
});
test("zero, dez e ausência", () => {
  assert.equal(mean([0, 0, 0]), 0);
  assert.equal(mean([10, 10, 10]), 10);
  assert.equal(mean(["na", "na", "na"]), null);
  assert.equal(mean([undefined, undefined, undefined]), null);
});
test("estilos usam médias dos processos com pesos iguais e exigem ambos", () => {
  assert.equal(pairMean([2, 8]), 5);
  assert.equal(pairMean([5 / 3, 7]), 13 / 3);
  assert.equal(pairMean([0, 0]), 0);
  assert.equal(pairMean([10, 10]), 10);
  assert.equal(pairMean([7, null]), null);
  assert.equal(pairMean([undefined, 8]), null);
});
test("relatório ordena, preserva empates na precisão exibida e exclui dados insuficientes", () => {
  const entries = [
    { id: "A", name: "A", score: 4.02 },
    { id: "B", name: "B", score: 8 },
    { id: "C", name: "C", score: null },
    { id: "D", name: "D", score: 4.04 },
    { id: "E", name: "E", score: 0 },
  ];
  const groups = rankProcesses(entries);
  assert.deepEqual(
    groups.map((g) => g.score),
    [8, 4, 0],
  );
  assert.deepEqual(
    groups[1].processes.map((p) => p.id),
    ["A", "D"],
  );
  assert.equal(entries[0].score, 4.02);
  assert.deepEqual(rankProcesses([{ id: "A", name: "A", score: null }]), []);
});
for (const score of [0, 5, 10])
  test(`SVG com ${score} nos seis setores`, () => {
    const scores = Object.fromEntries(spatialOrder.map((id) => [id, score]));
    const svg = renderToStaticMarkup(<Hexaflex scores={scores} />);
    assert.equal((svg.match(/data-fill=/g) || []).length, 6);
    spatialOrder.forEach((id, i) => {
      assert.ok(
        svg.includes(`data-fill="${id}" points="${sectorPoints(i, score)}"`),
      );
      const v = vertex(i, score / 10);
      assert.ok(
        Math.abs(Math.hypot(v[0] - 360, v[1] - 300) - (210 * score) / 10) <
          1e-8,
      );
    });
  });
test("hexágono flat-top e dados insuficientes distintos de zero", () => {
  assert.ok(Math.abs(vertex(0)[1] - vertex(1)[1]) < 1e-8);
  const svg = renderToStaticMarkup(
    <Hexaflex
      scores={Object.fromEntries(spatialOrder.map((id) => [id, null]))}
    />,
  );
  assert.equal(
    (svg.match(/fill="url\(#hexaflex-insufficient\)"/g) || []).length,
    6,
  );
});
