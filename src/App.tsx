import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Calculator from "./components/Calculator";
import { keyFromEvent, useCalculator } from "./lib/calculator";
import {
  formatNumber,
  modeLabel,
  parseNumber,
  roundTo,
  sanitizeNumberInput,
  stepLabel,
  type RoundMode,
} from "./lib/calc";

type NoteEntry = {
  id: number;
  obtenus: string;
  total: string;
  sur: string;
  note: number;
};

/* ————————————————————————————————————————————————
   Une case à remplir, façon feuille de copie
   ———————————————————————————————————————————————— */
function Blank({
  value,
  onChange,
  placeholder,
  ariaLabel,
  size = "big",
  onFocus,
  onBlur,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  ariaLabel: string;
  size?: "big" | "mid";
  onFocus?: () => void;
  onBlur?: () => void;
}) {
  const width = Math.max(placeholder.length + 1, value.length + 1);
  return (
    <input
      type="text"
      inputMode="decimal"
      autoComplete="off"
      spellCheck={false}
      aria-label={ariaLabel}
      placeholder={placeholder}
      value={value}
      onFocus={onFocus}
      onBlur={onBlur}
      onChange={(e) => onChange(sanitizeNumberInput(e.target.value))}
      className={`blank num inline-block text-center align-baseline ${
        size === "big"
          ? "min-w-[2.2ch] px-[0.12em] py-[0.02em] text-[0.82em]"
          : "min-w-[2.2ch] px-[0.18em] py-[0.02em] text-[0.82em]"
      }`}
      style={{ width: `${width}ch` }}
    />
  );
}

function Segmented({
  value,
  options,
  onChange,
  label,
}: {
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
  label: string;
}) {
  return (
    <div>
      <span className="label mb-2 block text-warm/90">{label}</span>
      <div className="inline-flex flex-wrap gap-1 rounded-full border border-ink/12 bg-white/45 p-1">
        {options.map((o) => {
          const active = o.value === value;
          return (
            <button
              key={o.value}
              type="button"
              onClick={() => onChange(o.value)}
              aria-pressed={active}
              className={`rounded-full px-3.5 py-1.5 text-[12px] font-semibold tracking-[0.06em] transition focus-visible:ring-2 focus-visible:ring-vermillion focus-visible:outline-none ${
                active
                  ? "bg-ink text-paper shadow-[0_6px_14px_-8px_rgba(30,47,85,0.8)]"
                  : "text-ink/65 hover:bg-ink/8 hover:text-ink"
              }`}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function App() {
  const calc = useCalculator();
  const [obtenus, setObtenus] = useState("");
  const [total, setTotal] = useState("");
  const [sur, setSur] = useState("20");
  const [step, setStep] = useState(0.5);
  const [mode, setMode] = useState<RoundMode>("near");
  const [cap, setCap] = useState(true);
  const [history, setHistory] = useState<NoteEntry[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [flash, setFlash] = useState<string | null>(null);
  const [focusField, setFocusField] = useState<string | null>(null);
  const toastTimer = useRef<number | null>(null);

  const nObtenus = useMemo(() => parseNumber(obtenus), [obtenus]);
  const nTotal = useMemo(() => parseNumber(total), [total]);
  const nSur = useMemo(() => parseNumber(sur), [sur]);

  const valid =
    Number.isFinite(nObtenus) &&
    Number.isFinite(nTotal) &&
    nTotal > 0 &&
    Number.isFinite(nSur) &&
    nSur > 0;

  const raw = valid ? (nObtenus / nTotal) * nSur : NaN;
  const rounded = valid ? roundTo(raw, step, mode) : NaN;
  const note = valid && cap ? Math.min(Math.max(rounded, 0), nSur) : rounded;
  const percent = valid ? (nObtenus / nTotal) * 100 : NaN;
  const capped = valid && cap && rounded !== note;

  const noteText = valid ? formatNumber(note, 2) : "—";
  const slashText = `${noteText} / ${valid ? formatNumber(nSur, 2) : "—"}`;

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 1900);
  }, []);

  const writeClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
      } catch {
        /* ignoré */
      }
      document.body.removeChild(ta);
    }
  }, []);

  const classer = useCallback(() => {
    if (!valid) return;
    setHistory((h) =>
      [
        {
          id: Date.now(),
          obtenus: formatNumber(nObtenus, 2),
          total: formatNumber(nTotal, 2),
          sur: formatNumber(nSur, 2),
          note: note,
        },
        ...h,
      ].slice(0, 6),
    );
  }, [valid, nObtenus, nTotal, nSur, note]);

  const copyNote = useCallback(async () => {
    if (!valid) {
      showToast("Renseignez d'abord les points obtenus et le total.");
      return;
    }
    await writeClipboard(slashText);
    classer();
    showToast(`Note copiée : ${slashText}`);
  }, [valid, slashText, writeClipboard, classer, showToast]);

  const resetAll = useCallback(() => {
    setObtenus("");
    setTotal("");
    setSur("20");
    calc.reset();
    showToast("Remise à zéro.");
  }, [calc, showToast]);

  const sendToField = useCallback(
    (value: number, target: "obtenus" | "total") => {
      const text = formatNumber(value, 4);
      if (target === "obtenus") setObtenus(text);
      else setTotal(text);
      showToast(
        `${text} envoyé${target === "obtenus" ? " dans « points obtenus »" : " dans « total »"}`,
      );
    },
    [showToast],
  );

  /* ——— le clavier pilote la calculette dès l'ouverture ——— */
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      const typing =
        !!t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable);

      if (typing) {
        if (e.key === "Escape") {
          (t as HTMLElement).blur();
          return;
        }
        if (e.key === "Enter") {
          e.preventDefault();
          (t as HTMLElement).blur();
          void copyNote();
        }
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "c") return;

      const k = keyFromEvent(e);
      if (!k) {
        if (e.key.toLowerCase() === "c") {
          e.preventDefault();
          void copyNote();
        } else if (e.key.toLowerCase() === "r") {
          e.preventDefault();
          resetAll();
        }
        return;
      }
      e.preventDefault();
      setFlash(k);
      calc.press(k);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [calc, copyNote, resetAll]);

  useEffect(() => {
    if (!flash) return;
    const id = window.setTimeout(() => setFlash(null), 130);
    return () => window.clearTimeout(id);
  }, [flash]);

  useEffect(() => {
    return () => {
      if (toastTimer.current) window.clearTimeout(toastTimer.current);
    };
  }, []);

  return (
    <div className="relative min-h-screen">
      {/* grain du papier */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.55] mix-blend-multiply"
        style={{
          backgroundImage: "url('images/paper.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        aria-hidden="true"
      />

      {/* marge de la page */}
      <div
        className="pointer-events-none fixed inset-y-0 left-0 z-20 hidden w-[58px] border-r-2 border-vermillion/35 lg:block"
        aria-hidden="true"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-180 [writing-mode:vertical-rl]">
          <span className="label text-vermillion/55">
            Barème · produit en croix · arrondi automatique au 0,5
          </span>
        </div>
      </div>

      <div className="relative z-10 lg:pl-[58px]">
        {/* ——— en-tête ——— */}
        <header className="border-b border-ink/10 bg-paper-deep/50">
          <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-x-6 gap-y-3 px-5 py-4 sm:px-8 lg:px-12">
            <div className="flex items-baseline gap-3">
              <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true" className="shrink-0">
                <path
                  d="M4 4 L22 22 M22 4 L4 22"
                  stroke="#C8412B"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                />
                <path d="M2 22 C 8 24, 18 24, 24 22" stroke="#1E2F55" strokeWidth="1.6" fill="none" strokeLinecap="round" />
              </svg>
              <div>
                <p className="font-display text-[1.05rem] leading-none font-semibold text-ink">
                  Produit en croix
                </p>
                <p className="label mt-1 text-warm/85">Calcul de note pour enseignants</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-2 rounded-full border border-forest/25 bg-forest/8 px-3 py-1.5">
                <span className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-forest" />
                <span className="label text-forest">
                  {focusField ? "Saisie dans le champ" : "Clavier capté"}
                </span>
              </span>
              <button
                type="button"
                onClick={resetAll}
                className="rounded-full border border-ink/15 px-3.5 py-1.5 text-[12px] font-semibold tracking-[0.08em] text-ink/70 uppercase transition hover:border-vermillion/50 hover:text-vermillion focus-visible:ring-2 focus-visible:ring-vermillion focus-visible:outline-none"
              >
                Réinitialiser
              </button>
            </div>
          </div>
        </header>

        <main className="mx-auto grid max-w-[1440px] gap-10 px-4 pt-8 pb-14 sm:px-8 lg:grid-cols-[minmax(0,1fr)_390px] lg:gap-12 lg:px-12 lg:pt-12">
          {/* ——————————— la feuille ——————————— */}
          <section>
            <div className="seyes relative overflow-hidden rounded-[10px] border border-paper-edge/70 bg-[#FBF6EA]/55 shadow-[0_40px_80px_-52px_rgba(52,36,14,0.65)]">
              <div className="absolute inset-y-0 left-[46px] w-[2px] bg-vermillion/40 sm:left-[74px]" aria-hidden="true" />
              <div className="absolute inset-y-0 left-[52px] w-px bg-vermillion/20 sm:left-[80px]" aria-hidden="true" />

              <div className="relative py-9 pr-5 pl-[62px] sm:py-14 sm:pr-10 sm:pl-[100px]">
                {/* sur-titre */}
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <span className="label text-vermillion">Barème</span>
                    <p className="mt-2 max-w-[34ch] text-[0.92rem] leading-relaxed text-warm">
                      Saisissez les points obtenus puis le total de l'épreuve. La note sur 20 se
                      calcule seule et s'arrondit au demi-point.
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="label text-warm/85">Pourcentage</span>
                    <p className="num mt-1 text-[1.65rem] leading-none font-medium text-vermillion">
                      {valid ? `${formatNumber(percent, 1)} %` : "—"}
                    </p>
                  </div>
                </div>

                {/* la ligne géante */}
                <h1 className="mt-9">
                  <span className="font-display flex flex-wrap items-baseline gap-x-[0.22em] gap-y-3 text-[clamp(2.05rem,5.9vw,4.35rem)] leading-[1.1] text-ink">
                    <span className="text-warm/80">Note&nbsp;:</span>
                    <Blank
                      value={obtenus}
                      onChange={setObtenus}
                      placeholder="34"
                      ariaLabel="Points obtenus"
                      onFocus={() => setFocusField("obtenus")}
                      onBlur={() => setFocusField(null)}
                    />
                    <span className="text-ink/85">sur un total de</span>
                    <span className="text-vermillion">/</span>
                    <Blank
                      value={total}
                      onChange={setTotal}
                      placeholder="42"
                      ariaLabel="Total de points de l'épreuve"
                      onFocus={() => setFocusField("total")}
                      onBlur={() => setFocusField(null)}
                    />
                    <span className="text-ink/85">points</span>
                  </span>
                </h1>

                {/* le résultat */}
                <div className="mt-11">
                  <p className="font-display flex flex-wrap items-baseline gap-x-[0.28em] gap-y-2 text-[clamp(1.35rem,3.1vw,2.15rem)] leading-tight text-ink/90">
                    <span>La note sur</span>
                    <Blank
                      value={sur}
                      onChange={setSur}
                      placeholder="20"
                      ariaLabel="Barème de la note finale"
                      size="mid"
                      onFocus={() => setFocusField("sur")}
                      onBlur={() => setFocusField(null)}
                    />
                    <span>est donc</span>
                  </p>

                  <div className="mt-3 flex flex-wrap items-end gap-x-10 gap-y-5">
                    <div key={noteText} className="relative inline-block">
                      <span
                        className="settle block font-display text-[clamp(3.9rem,12.5vw,8.8rem)] leading-[0.86] font-semibold tracking-[-0.035em] text-ink"
                        style={{ fontVariationSettings: '"opsz" 144' }}
                      >
                        {noteText}
                      </span>
                      <svg
                        className="pen-stroke mt-2 block h-[16px] w-full"
                        viewBox="0 0 300 16"
                        preserveAspectRatio="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M3 11 C 52 3, 96 14, 148 7 S 232 3, 297 9"
                          fill="none"
                          stroke="#C8412B"
                          strokeWidth="3"
                          strokeLinecap="round"
                          vectorEffect="non-scaling-stroke"
                        />
                        <path
                          d="M14 15 C 70 10, 132 16, 196 12"
                          fill="none"
                          stroke="#C8412B"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          opacity="0.45"
                          vectorEffect="non-scaling-stroke"
                        />
                      </svg>
                    </div>

                    <div className="pb-2">
                      <dl className="space-y-1.5">
                        <div className="flex items-baseline gap-2">
                          <dt className="label text-warm/90">Calcul exact</dt>
                          <dd className="num text-[0.95rem] text-ink/80">
                            {valid
                              ? `${formatNumber(raw, 2)} / ${formatNumber(nSur, 2)}`
                              : "—"}
                          </dd>
                        </div>
                        <div className="flex items-baseline gap-2">
                          <dt className="label text-warm/90">Arrondi</dt>
                          <dd className="text-[0.95rem] font-semibold text-vermillion">
                            {step ? `${stepLabel(step)} · ${modeLabel(mode)}` : "aucun — valeur exacte"}
                          </dd>
                        </div>
                        {capped && (
                          <div className="flex items-baseline gap-2">
                            <dt className="label text-warm/90">Plafond</dt>
                            <dd className="text-[0.95rem] font-semibold text-vermillion">
                              limité à {formatNumber(nSur, 2)}
                            </dd>
                          </div>
                        )}
                      </dl>

                      {!valid && (
                        <p className="mt-4 max-w-[30ch] border-l-2 border-vermillion/50 pl-3 text-[0.86rem] leading-relaxed text-warm">
                          Renseignez les points obtenus et le total de l'épreuve : la note s'écrit
                          ici toute seule.
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* actions rapides */}
                <div className="mt-10 flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => void copyNote()}
                    className="group inline-flex items-center gap-2.5 rounded-full bg-vermillion px-6 py-3 text-[12px] font-semibold tracking-[0.14em] text-[#FBEFE2] uppercase shadow-[0_16px_30px_-18px_rgba(200,65,43,0.95)] transition hover:bg-[#B23722] focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-paper focus-visible:outline-none"
                  >
                    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <rect x="5" y="2" width="9" height="11" rx="2" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M11 13.5V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    {valid ? `Copier ${slashText}` : "Copier la note"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      classer();
                      showToast("Note classée dans l'historique.");
                    }}
                    disabled={!valid}
                    className="inline-flex items-center gap-2 rounded-full border border-ink/18 px-5 py-3 text-[12px] font-semibold tracking-[0.14em] text-ink/75 uppercase transition hover:border-ink/45 hover:text-ink disabled:cursor-not-allowed disabled:opacity-40 focus-visible:ring-2 focus-visible:ring-vermillion focus-visible:outline-none"
                  >
                    Classer sans copier
                  </button>
                  <span className="label text-warm/90">
                    ou touche <span className="num text-vermillion">C</span>
                  </span>
                </div>

                {/* réglages d'arrondi */}
                <div className="mt-11 rounded-2xl border border-ink/12 bg-white/40 p-5 sm:p-6">
                  <div className="flex flex-wrap items-baseline justify-between gap-3">
                    <h3 className="label text-ink">Arrondi automatique</h3>
                    <p className="text-[0.82rem] text-warm">
                      Vous ne recalculez rien : {valid ? formatNumber(raw, 2) : "—"} devient{" "}
                      <span className="num font-semibold text-vermillion">{noteText}</span>
                    </p>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-x-8 gap-y-5">
                    <Segmented
                      label="Pas d'arrondi"
                      value={String(step)}
                      onChange={(v) => setStep(Number(v))}
                      options={[
                        { value: "0.5", label: "0,5" },
                        { value: "0.25", label: "0,25" },
                        { value: "0.2", label: "0,2" },
                        { value: "1", label: "entier" },
                        { value: "0", label: "aucun" },
                      ]}
                    />
                    <Segmented
                      label="Sens"
                      value={mode}
                      onChange={(v) => setMode(v as RoundMode)}
                      options={[
                        { value: "near", label: "au plus proche" },
                        { value: "up", label: "au-dessus" },
                        { value: "down", label: "en dessous" },
                      ]}
                    />
                    <div>
                      <span className="label mb-2 block text-warm/80">Sécurité</span>
                      <button
                        type="button"
                        onClick={() => setCap((c) => !c)}
                        aria-pressed={cap}
                        className={`inline-flex items-center gap-2.5 rounded-full border px-4 py-2 text-[12px] font-semibold tracking-[0.06em] transition focus-visible:ring-2 focus-visible:ring-vermillion focus-visible:outline-none ${
                          cap
                            ? "border-vermillion/45 bg-vermillion/10 text-vermillion"
                            : "border-ink/15 bg-white/40 text-ink/60 hover:border-ink/35"
                        }`}
                      >
                        <span
                          className={`inline-block h-2.5 w-2.5 rounded-full ${cap ? "bg-vermillion" : "bg-ink/25"}`}
                        />
                        Plafonner au barème
                      </button>
                    </div>
                  </div>
                </div>

                {/* historique */}
                <div className="mt-10">
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="label text-ink">Dernières notes classées</h3>
                    {history.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setHistory([])}
                        className="label text-warm/90 underline decoration-warm/40 underline-offset-4 transition hover:text-vermillion"
                      >
                        Vider
                      </button>
                    )}
                  </div>

                  {history.length === 0 ? (
                    <p className="mt-3 max-w-[52ch] text-[0.88rem] leading-relaxed text-warm/85">
                      Aucune note classée pour l'instant. Après un calcul, la touche{" "}
                      <span className="num text-vermillion">C</span> copie la note et la range ici —
                      de quoi relire une pile de copies sans jamais revenir en arrière.
                    </p>
                  ) : (
                    <ul className="mt-3 divide-y divide-ink/10 border-y border-ink/10">
                      {history.map((h) => (
                        <li
                          key={h.id}
                          className="flex flex-wrap items-center justify-between gap-x-5 gap-y-2 py-3"
                        >
                          <span className="num text-[0.95rem] text-ink/80">
                            {h.obtenus} <span className="text-warm/55">/</span> {h.total}
                            <span className="mx-2 text-warm/45">→</span>
                            <span className="font-semibold text-vermillion">
                              {formatNumber(h.note, 2)}
                            </span>
                            <span className="text-warm/55"> / {h.sur}</span>
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={async () => {
                                await writeClipboard(
                                  `${formatNumber(h.note, 2)} / ${h.sur}`,
                                );
                                showToast("Note recopiée.");
                              }}
                              className="rounded-full border border-ink/15 px-3.5 py-1.5 text-[11px] font-semibold tracking-[0.12em] text-ink/70 uppercase transition hover:border-vermillion/50 hover:text-vermillion focus-visible:ring-2 focus-visible:ring-vermillion focus-visible:outline-none"
                            >
                              Recopier
                            </button>
                            <button
                              type="button"
                              aria-label="Retirer cette note"
                              onClick={() => setHistory((list) => list.filter((x) => x.id !== h.id))}
                              className="rounded-full px-2.5 py-1.5 text-warm/80 transition hover:text-vermillion focus-visible:ring-2 focus-visible:ring-vermillion focus-visible:outline-none"
                            >
                              ✕
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* ——————————— la calculette ——————————— */}
          <aside className="lg:sticky lg:top-8 lg:self-start">
            <Calculator calc={calc} flash={flash} onSend={sendToField} />

            <div className="mt-6 rounded-2xl border border-ink/12 bg-white/35 p-5">
              <h3 className="label text-ink">Raccourcis clavier</h3>
              <dl className="mt-4 space-y-2.5">
                {[
                  ["0 – 9", "chiffres, directement sur la calculette"],
                  ["+  −  *  /", "opérations"],
                  ["Entrée", "égal ( = ) sur la calculette"],
                  ["Entrée ⏎", "dans une case : copier la note"],
                  ["Retour arrière", "effacer le dernier chiffre"],
                  ["Échap", "tout effacer"],
                  ["Suppr", "effacer la saisie"],
                  ["C", "copier la note et la classer"],
                  ["R", "remise à zéro"],
                ].map(([k, d]) => (
                  <div key={k} className="flex items-baseline gap-3">
                    <dt className="num min-w-[7.5ch] rounded-md border border-ink/12 bg-paper-deep/60 px-2 py-1 text-center text-[11px] text-ink/80">
                      {k}
                    </dt>
                    <dd className="text-[0.82rem] leading-snug text-warm">{d}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-5 border-t border-ink/10 pt-4 text-[0.8rem] leading-relaxed text-warm/85">
                Les touches sont captées dès l'ouverture de la page. Dès que vous cliquez dans une
                case, la frappe s'y rend — la calculette attend, et reprend la main dès que vous
                cliquez ailleurs.
              </p>
            </div>
          </aside>
        </main>

        <footer className="border-t border-ink/10 bg-paper-deep/40">
          <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-x-8 gap-y-3 px-5 py-6 sm:px-8 lg:px-12">
            <p className="label text-warm/90">
              Produit en croix · note finale préremplie sur 20 · arrondi au 0,5
            </p>
            <p className="text-[0.82rem] text-warm/80">
              13,42 devient 13,5 · 8,11 devient 8 — sans rien calculer.
            </p>
          </div>
        </footer>
      </div>

      {/* toast */}
      {toast && (
        <div
          role="status"
          className="toast-in fixed bottom-7 left-1/2 z-50 -translate-x-1/2 rounded-full bg-ink px-6 py-3 text-[13px] font-semibold tracking-[0.04em] text-paper shadow-[0_22px_44px_-20px_rgba(30,47,85,0.9)]"
        >
          {toast}
        </div>
      )}
    </div>
  );
}
