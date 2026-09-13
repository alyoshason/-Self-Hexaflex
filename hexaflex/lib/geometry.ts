export const spatialOrder = ["MP", "VA", "CO", "SC", "DF", "AC"] as const;
export function vertex(index: number, scale = 1): [number, number] {
  const angle = ((-120 + index * 60) * Math.PI) / 180;
  return [
    360 + 210 * scale * Math.cos(angle),
    300 + 210 * scale * Math.sin(angle),
  ];
}
export function sectorPoints(index: number, score: number): string {
  return [[360, 300], vertex(index, score / 10), vertex(index + 1, score / 10)]
    .map((p) => p.join(","))
    .join(" ");
}
export function ringPoints(level: number): string {
  return Array.from({ length: 6 }, (_, i) =>
    vertex(i, level / 10).join(","),
  ).join(" ");
}
