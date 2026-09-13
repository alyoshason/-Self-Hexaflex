export type Answer = number | "na" | undefined;
export type Answers = Record<string, Answer>;
export function pairMean(
  values: readonly (number | null | undefined)[],
): number | null {
  if (
    values.length !== 2 ||
    values.some(
      (v) => typeof v !== "number" || !Number.isFinite(v) || v < 0 || v > 10,
    )
  )
    return null;
  return ((values[0] as number) + (values[1] as number)) / 2;
}

export type ProcessScore = { id: string; name: string; score: number | null };
export function rankProcesses(entries: readonly ProcessScore[]) {
  const valid = entries.filter(
    (entry): entry is ProcessScore & { score: number } =>
      typeof entry.score === "number" && Number.isFinite(entry.score),
  );
  const groups: { score: number; processes: ProcessScore[] }[] = [];
  for (const entry of valid
    .map((e) => ({
      ...e,
      score: Math.round((e.score + Number.EPSILON) * 10) / 10,
    }))
    .sort((a, b) => b.score - a.score)) {
    const previous = groups.at(-1);
    if (previous?.score === entry.score) previous.processes.push(entry);
    else groups.push({ score: entry.score, processes: [entry] });
  }
  return groups;
}
export function mean(values: readonly Answer[]): number | null {
  const valid = values.filter(
    (v): v is number =>
      typeof v === "number" && Number.isInteger(v) && v >= 0 && v <= 10,
  );
  const minimum = values.length === 3 ? 2 : 3;
  return valid.length >= minimum
    ? valid.reduce((a, b) => a + b, 0) / valid.length
    : null;
}
export function formatScore(score: number | null) {
  return score === null
    ? "Dados insuficientes"
    : score.toLocaleString("pt-BR", {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      });
}
