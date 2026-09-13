"use client";
import styles from "./page.module.css";
import { useLayoutEffect, useRef, useState } from "react";
import { copy, processes, author, families, reportCopy } from "../lib/content";
import { type Answers, mean, formatScore, pairMean } from "../lib/scoring";
import { spatialOrder } from "../lib/geometry";
import { Hexaflex } from "../components/Hexaflex";
import { ResponseReport } from "../components/ResponseReport";

export default function Home() {
  const [step, setStep] = useState(-2);
  const [answers, setAnswers] = useState<Answers>({});
  const [hide, setHide] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [family, setFamily] = useState<string | null>(null);
  const [reflection, setReflection] = useState("");
  const [error, setError] = useState("");
  const heading = useRef<HTMLHeadingElement>(null);
  const detailHeading = useRef<HTMLHeadingElement>(null);
  const mapHeading = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (selected) {
      detailHeading.current?.focus({ preventScroll: true });
      if (window.matchMedia("(max-width: 760px)").matches) {
        detailHeading.current?.scrollIntoView({
          block: "start",
          behavior: "instant",
        });
      }
    }
  }, [selected]);
  function selectProcess(id: string) {
    setSelected(selected === id ? null : id);
    setFamily(null);
    if (selected === id) mapHeading.current?.focus({ preventScroll: true });
  }
  const p = processes[step];
  const scores = Object.fromEntries(
    processes.map((p) => [p.id, mean(p.items.map((i) => answers[i.id]))]),
  );
  const detail = processes.find((p) => p.id === selected);
  const styleScores = Object.fromEntries(
    families.map((f) => [
      f.name,
      pairMean(f.processIds.map((id) => scores[id])),
    ]),
  );
  useLayoutEffect(() => {
    heading.current?.focus();
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [step]);
  function go(next: number) {
    setStep(next);
    setError("");
  }
  function save() {
    const chart = document
      .getElementById("export-hexaflex")!
      .cloneNode(true) as SVGSVGElement;
    chart.removeAttribute("id");
    chart.setAttribute("x", "30");
    chart.setAttribute("y", "100");
    chart.setAttribute("width", "840");
    chart.setAttribute("height", "694");
    chart.querySelectorAll('[role="button"]').forEach((el) => {
      el.removeAttribute("role");
      el.removeAttribute("tabindex");
      el.removeAttribute("aria-pressed");
      el.removeAttribute("aria-label");
      el.setAttribute("stroke", "transparent");
    });
    const escape = (s: string) =>
      s
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;");
    const rows = processes
      .map(
        (p, i) =>
          `<text x="60" y="${820 + i * 32}">${escape(p.name)}: ${formatScore(scores[p.id])}</text>`,
      )
      .join("");
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="1140" viewBox="0 0 900 1140"><rect width="900" height="1140" fill="#f8f9fc"/><g font-family="Arial, sans-serif" fill="#263248"><text x="60" y="52" font-size="25">Mapa de Flexibilidade Psicológica — Hexaflex</text><text x="60" y="83" font-size="16">${new Date().toLocaleDateString("pt-BR")}</text></g>${new XMLSerializer().serializeToString(chart)}<g font-family="Arial, sans-serif" font-size="18" fill="#263248">${rows}</g><g font-family="Arial, sans-serif" font-size="16" fill="#263248"><text x="60" y="1060">Ferramenta de autorreflexão adaptada do modelo Hexaflex de Hayes,</text><text x="60" y="1084">Strosahl &amp; Wilson. Não é uma escala psicométrica validada.</text></g></svg>`;
    const url = URL.createObjectURL(
      new Blob([svg], { type: "image/svg+xml;charset=utf-8" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "meu-mapa-hexaflex.svg";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <div className={styles.surface}>
      <div className={styles.shell}>
        <a className={styles.skip} href="#main">
          Ir para o conteúdo
        </a>
        <header>
          <a className={styles.brand} href="#main">
            HEXAFLEX <span>/ AUTORREFLEXÃO</span>
          </a>
        </header>
        <main id="main">
          {step === -2 ? (
            <section className={styles.welcome}>
              <h1 ref={heading} tabIndex={-1}>
                Mapa de Flexibilidade Psicológica <span>— Hexaflex</span>
              </h1>
              <p className={styles.lead}>{copy.subtitle}</p>
              <p className={styles.intro}>{copy.intro}</p>
              <button className={styles.startButton} onClick={() => go(-1)}>
                Começar
                <span className={styles.startArrow} aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M5 12h14m-6-6 6 6-6 6"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </button>
              <aside className={styles.notice}>{copy.notice}</aside>
              <p className={styles.privacy}>{copy.privacy}</p>
              <a
                className={styles.authorLink}
                href={author.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {author.name}
                <span>{author.title}</span>
                <span>{author.credentials}</span>
              </a>
            </section>
          ) : step === -1 ? (
            <section className={styles.instructions}>
              <p className={styles.eyebrow}>ANTES DE COMEÇAR</p>
              <h1 ref={heading} tabIndex={-1}>
                Como responder
              </h1>
              {copy.instructions.map((text, i) => (
                <p
                  className={i >= 2 && i <= 4 ? styles.anchorBlock : ""}
                  key={text}
                >
                  {text}
                </p>
              ))}
              <nav className={styles.navigation}>
                <button onClick={() => go(-2)}>Voltar</button>
                <button className={styles.primary} onClick={() => go(0)}>
                  Iniciar preenchimento →
                </button>
              </nav>
            </section>
          ) : step < 6 ? (
            <section>
              <div className={styles.progressMeta}>
                <span>Processo {step + 1} de 6</span>
                <span>{p.items.length} itens</span>
              </div>
              <progress
                value={step + 1}
                max={6}
                aria-label={`Processo ${step + 1} de 6`}
              />
              <h1 ref={heading} tabIndex={-1}>
                {p.name}
              </h1>
              <p className={styles.description}>{p.description}</p>
              <p className={styles.period}>
                Considere as últimas duas semanas.
              </p>
              <div className={styles.items}>
                {p.items.map((item) => {
                  const answer = answers[item.id];
                  const numeric = typeof answer === "number";
                  return (
                    <div className={styles.item} key={item.id}>
                      <label id={`${item.id}-label`} htmlFor={item.id}>
                        <span className={styles.itemCode}>{item.id}</span>
                        {item.text}
                      </label>
                      <div className={styles.response} aria-live="polite">
                        {numeric ? (
                          <>
                            <strong>{answer}</strong>
                            <span> / 10</span>
                          </>
                        ) : answer === "na" ? (
                          "Não consigo avaliar / não se aplica"
                        ) : (
                          "Sem resposta"
                        )}
                      </div>
                      {answer === undefined && (
                        <p id={`${item.id}-hint`} className={styles.sliderHint}>
                          Toque na escala ou use as setas para responder.
                        </p>
                      )}
                      <div className={styles.sliderScale}>
                        <div className={styles.sliderTicks} aria-hidden="true">
                          {Array.from({ length: 11 }, (_, i) => (
                            <span key={i} data-anchor={i % 5 === 0} />
                          ))}
                        </div>
                        <input
                          aria-describedby={
                            answer === undefined ? `${item.id}-hint` : undefined
                          }
                          id={item.id}
                          type="range"
                          min={0}
                          max={10}
                          step={1}
                          value={numeric ? answer : 5}
                          className={numeric ? "" : styles.unanswered}
                          aria-valuetext={
                            numeric
                              ? `${answer} de 10`
                              : answer === "na"
                                ? "Não consigo avaliar / não se aplica"
                                : "Sem resposta. Use as setas para escolher um valor."
                          }
                          onChange={(e) =>
                            setAnswers((a) => ({
                              ...a,
                              [item.id]: Number(e.target.value),
                            }))
                          }
                          onPointerUp={(e) => {
                            const value = Number(e.currentTarget.value);
                            setAnswers((a) => ({ ...a, [item.id]: value }));
                          }}
                          onKeyDown={(e) => {
                            if (
                              !numeric &&
                              (e.key === "Enter" || e.key === " ")
                            ) {
                              e.preventDefault();
                              setAnswers((a) => ({ ...a, [item.id]: 5 }));
                            }
                          }}
                        />
                      </div>
                      <div className={styles.anchors}>
                        <span>Muito raramente</span>
                        <span>Às vezes</span>
                        <span>Fluente e flexível</span>
                      </div>
                      <label className={styles.na}>
                        <input
                          type="checkbox"
                          checked={answer === "na"}
                          onChange={(e) =>
                            setAnswers((a) => ({
                              ...a,
                              [item.id]: e.target.checked ? "na" : undefined,
                            }))
                          }
                        />
                        Não consigo avaliar / não se aplica
                      </label>
                    </div>
                  );
                })}
              </div>
              {error && p.items.some((i) => answers[i.id] === undefined) && (
                <p role="alert" className={styles.error}>
                  {error}
                </p>
              )}
              <nav
                className={`${styles.navigation} ${styles.questionNav}`}
                aria-label="Navegação do questionário"
              >
                <button onClick={() => go(step - 1)}>← Voltar</button>
                <button
                  className={styles.primary}
                  onClick={() => {
                    if (p.items.some((i) => answers[i.id] === undefined)) {
                      setError(
                        "Responda a todos os itens ou marque “Não consigo avaliar / não se aplica” para continuar.",
                      );
                      document
                        .getElementById(
                          p.items.find((i) => answers[i.id] === undefined)!.id,
                        )
                        ?.focus();
                    } else go(step + 1);
                  }}
                >
                  {step === 5 ? "Ver meu mapa" : "Continuar"} →
                </button>
              </nav>
            </section>
          ) : (
            <section className={styles.result}>
              <p className={styles.eyebrow}>
                UM RETRATO DAS ÚLTIMAS DUAS SEMANAS
              </p>
              <h1 ref={heading} tabIndex={-1}>
                {copy.resultTitle}
              </h1>
              <p className={styles.description}>{copy.resultText}</p>
              <div className={styles.resultControls}>
                <label className={styles.na}>
                  <input
                    type="checkbox"
                    checked={hide}
                    onChange={(e) => setHide(e.target.checked)}
                  />
                  Ocultar números
                </label>
                <div
                  className={styles.families}
                  aria-label="Realçar pares de processos"
                >
                  {families.map(({ name: f, description }) => (
                    <button
                      key={f}
                      aria-pressed={family === f}
                      onClick={() => {
                        setFamily(family === f ? null : f);
                        setSelected(null);
                      }}
                    >
                      <strong>{f}</strong>
                      <b
                        className={styles.styleScore}
                        data-insufficient={styleScores[f] === null || hide}
                      >
                        {styleScores[f] === null
                          ? "Dados insuficientes"
                          : hide
                            ? "Nota oculta"
                            : formatScore(styleScores[f])}
                      </b>
                      <span>{description}</span>
                    </button>
                  ))}
                </div>
                <p className={styles.reportMethod}>{reportCopy.method}</p>
              </div>
              <div className={styles.resultLayout}>
                <div className={styles.mapPanel}>
                  <div
                    className={styles.chart}
                    ref={mapHeading}
                    tabIndex={-1}
                    aria-label="Visão geral do mapa"
                  >
                    <div className={styles.diagram}>
                      <Hexaflex
                        scores={scores}
                        hide={hide}
                        selected={selected}
                        family={family}
                        onSelect={selectProcess}
                        compact
                      />
                      {spatialOrder.map((id, index) => {
                        const process = processes.find((p) => p.id === id)!;
                        return (
                          <button
                            key={id}
                            className={styles.mapLabel}
                            data-position={index}
                            aria-pressed={
                              selected === id || family === process.family
                            }
                            onClick={() => selectProcess(id)}
                          >
                            <span>{process.name}</span>
                            <strong data-insufficient={scores[id] === null}>
                              {scores[id] === null
                                ? "Dados insuficientes"
                                : hide
                                  ? "Explorar"
                                  : formatScore(scores[id])}
                            </strong>
                          </button>
                        );
                      })}
                    </div>
                    <p className={styles.chartHelp}>
                      Selecione um processo para explorar suas respostas.
                      Selecione-o novamente para fechar. Hachuras indicam dados
                      insuficientes.
                    </p>
                  </div>
                </div>
                {detail ? (
                  <section
                    className={styles.detail}
                    aria-labelledby="detail-heading"
                  >
                    <p className={styles.eyebrow}>EXPLORAR SUAS RESPOSTAS</p>
                    <button
                      className={styles.closeDetail}
                      onClick={() => {
                        setSelected(null);
                        mapHeading.current?.focus({ preventScroll: true });
                        mapHeading.current?.scrollIntoView({
                          block: "start",
                          behavior: "instant",
                        });
                      }}
                    >
                      Voltar ao mapa ↑
                    </button>
                    <h2 id="detail-heading" ref={detailHeading} tabIndex={-1}>
                      {detail.name}
                    </h2>
                    <p>{detail.description}</p>
                    <ul>
                      {detail.items.map((i) => (
                        <li key={i.id}>
                          <span>{i.text}</span>
                          <strong>
                            {answers[i.id] === "na"
                              ? "Não consigo avaliar / não se aplica"
                              : hide
                                ? "Número oculto"
                                : `${answers[i.id]} / 10`}
                          </strong>
                        </li>
                      ))}
                    </ul>
                  </section>
                ) : null}
              </div>
              <ResponseReport scores={scores} hide={hide} />
              <div hidden aria-hidden="true">
                <Hexaflex id="export-hexaflex" scores={scores} />
              </div>
              <div className={styles.reflection}>
                <label htmlFor="reflection">{copy.reflection}</label>
                <p>Opcional. Este texto não será incluído na imagem.</p>
                <textarea
                  id="reflection"
                  rows={4}
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
                />
              </div>
              <p className={styles.exportHelp}>
                A imagem SVG inclui a data e os seis escores, mesmo com os
                números ocultos na tela.
              </p>
              <nav className={styles.navigation}>
                <button
                  onClick={() => {
                    setAnswers({});
                    setReflection("");
                    setSelected(null);
                    setFamily(null);
                    setHide(false);
                    go(-2);
                  }}
                >
                  Refazer
                </button>
                <button className={styles.primary} onClick={save}>
                  Salvar meu mapa ↓
                </button>
              </nav>
            </section>
          )}
        </main>
        <footer>
          <a
            className={styles.footerAuthor}
            href={author.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <strong>{author.name}</strong>
            <span>{author.title}</span>
            <span>{author.credentials}</span>
            <span>{author.displayUrl} ↗</span>
          </a>
          <p>
            {copy.privacy}
            <br />
            Ao recarregar ou refazer, as respostas são apagadas.
          </p>
        </footer>
      </div>
    </div>
  );
}
