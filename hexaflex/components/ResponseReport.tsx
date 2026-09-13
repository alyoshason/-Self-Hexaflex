import { processes, reportCopy } from "../lib/content";
import { formatScore, rankProcesses } from "../lib/scoring";
import styles from "../app/page.module.css";

export function ResponseReport({
  scores,
  hide,
}: {
  scores: Record<string, number | null>;
  hide: boolean;
}) {
  const groups = rankProcesses(
    processes.map((p) => ({ id: p.id, name: p.name, score: scores[p.id] })),
  );
  const missing = processes.filter((p) => scores[p.id] === null);
  const validCount = groups.reduce((n, g) => n + g.processes.length, 0);
  const joinNames = (items: { name: string }[]) =>
    new Intl.ListFormat("pt-BR", { style: "long", type: "conjunction" }).format(
      items.map((p) => p.name),
    );
  return (
    <section className={styles.report} aria-labelledby="report-heading">
      <h2 id="report-heading">{reportCopy.title}</h2>
      <p>{reportCopy.intro}</p>
      {validCount === 0 ? (
        <p>{reportCopy.empty}</p>
      ) : validCount === 1 ? (
        <p>{reportCopy.single}</p>
      ) : groups.length === 1 ? (
        <p>{reportCopy.equal}</p>
      ) : (
        <p className={styles.reportSummary}>
          A maior disponibilidade relatada aparece em{" "}
          <strong>{joinNames(groups[0].processes)}</strong>
          {hide ? "" : ` (${formatScore(groups[0].score)})`}; a menor, em{" "}
          <strong>{joinNames(groups[groups.length - 1].processes)}</strong>
          {hide ? "" : ` (${formatScore(groups[groups.length - 1].score)})`}.
          Essas diferenças se referem ao período avaliado e podem variar
          conforme a situação.
        </p>
      )}
      {groups.length > 0 && (
        <ul
          className={styles.ranking}
          aria-label="Processos por disponibilidade relatada"
        >
          {groups.map((group) => (
            <li key={group.score}>
              <span>
                {joinNames(group.processes)}
                {group.processes.length > 1 && <small>Mesma nota</small>}
              </span>
              {!hide && <strong>{formatScore(group.score)}</strong>}
            </li>
          ))}
        </ul>
      )}
      {missing.length > 0 && <p>Dados insuficientes: {joinNames(missing)}.</p>}
      {validCount > 0 && (
        <>
          <p className={styles.reportMethod}>{reportCopy.precision}</p>
          <p className={styles.reportQuestion}>{reportCopy.question}</p>
        </>
      )}
    </section>
  );
}
