import { processes } from "../lib/content";
import { formatScore } from "../lib/scoring";
import {
  spatialOrder,
  sectorPoints,
  ringPoints,
  vertex,
} from "../lib/geometry";
export const colors: Record<string, string> = {
  Aberto: "#a3b9bb",
  Centrado: "#b1b4d5",
  Engajado: "#d5b590",
};
const positions = [
  [360, 80],
  [577, 182],
  [577, 423],
  [360, 533],
  [143, 423],
  [143, 182],
];
export function Hexaflex({
  scores,
  hide = false,
  selected,
  family,
  onSelect,
  compact = false,
  id = "hexaflex",
}: {
  scores: Record<string, number | null>;
  hide?: boolean;
  compact?: boolean;
  id?: string;
  selected?: string | null;
  family?: string | null;
  onSelect?: (id: string) => void;
}) {
  const patternId = `${id}-insufficient`;
  return (
    <svg
      id={id}
      viewBox={compact ? "140 108 440 384" : "0 0 720 595"}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Hexaflex dos seis processos de flexibilidade psicológica"
      role={onSelect ? "group" : "img"}
    >
      <title>Mapa de flexibilidade psicológica</title>
      <defs>
        <pattern
          id={patternId}
          width="8"
          height="8"
          patternUnits="userSpaceOnUse"
        >
          <path d="M0 8L8 0" stroke="#9b9da8" strokeWidth="1" />
        </pattern>
      </defs>
      <polygon points={ringPoints(10)} fill="#fafafa" />
      {spatialOrder.map((id, i) => {
        const p = processes.find((p) => p.id === id)!;
        return (
          <polygon
            key={id}
            data-fill={id}
            points={sectorPoints(i, scores[id] ?? 10)}
            fill={scores[id] === null ? `url(#${patternId})` : colors[p.family]}
          />
        );
      })}
      {Array.from({ length: 10 }, (_, i) => (
        <polygon
          key={i}
          points={ringPoints(i + 1)}
          fill="none"
          stroke="#475569"
          strokeOpacity=".28"
          strokeWidth={i === 9 ? 1.5 : 1}
        />
      ))}
      {spatialOrder.map((id, i) => {
        const p = processes.find((p) => p.id === id)!;
        const active = selected === id || family === p.family;
        const pos = positions[i];
        return (
          <g key={id}>
            <line
              x1="360"
              y1="300"
              x2={vertex(i)[0]}
              y2={vertex(i)[1]}
              stroke="#657181"
              strokeWidth="1"
            />
            <polygon
              className={onSelect ? "sector" : ""}
              points={sectorPoints(i, 10)}
              fill="transparent"
              stroke={active ? "#28354b" : "transparent"}
              strokeWidth="4"
              strokeDasharray={active ? "7 4" : undefined}
              role={onSelect ? "button" : undefined}
              tabIndex={onSelect ? 0 : undefined}
              aria-pressed={onSelect ? active : undefined}
              aria-label={`${p.name}: ${scores[id] === null ? "Dados insuficientes" : hide ? "número oculto" : formatScore(scores[id])}`}
              onClick={() => onSelect?.(id)}
              onKeyDown={(e) => {
                if (onSelect && (e.key === "Enter" || e.key === " ")) {
                  e.preventDefault();
                  onSelect(id);
                }
              }}
            />
            <g display={compact ? "none" : undefined}>
              <text
                x={pos[0]}
                y={pos[1]}
                textAnchor="middle"
                fill="#263248"
                fontFamily="Arial, sans-serif"
                fontSize="16"
              >
                {p.name === "Ação de compromisso" ? (
                  <>
                    <tspan x={pos[0]}>Ação de</tspan>
                    <tspan x={pos[0]} dy="20">
                      compromisso
                    </tspan>
                  </>
                ) : (
                  p.name
                )}
              </text>
              <text
                x={pos[0]}
                y={pos[1] + (id === "CO" ? 48 : 28)}
                textAnchor="middle"
                fill="#263248"
                fontFamily="Arial, sans-serif"
                fontSize={scores[id] === null ? 13 : 22}
                fontWeight="600"
              >
                {scores[id] === null
                  ? "Dados insuficientes"
                  : hide
                    ? ""
                    : formatScore(scores[id])}
              </text>
            </g>
          </g>
        );
      })}
    </svg>
  );
}
