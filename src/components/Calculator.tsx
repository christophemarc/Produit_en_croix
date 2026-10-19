import type { CalculatorApi } from "../lib/calculator";
import { formatCalcDisplay, formatNumber } from "../lib/calc";

type Props = {
  calc: CalculatorApi;
  flash: string | null;
  onSend: (value: number, target: "obtenus" | "total") => void;
};

type KeyDef = {
  id: string;
  label: string;
  kind: "digit" | "util" | "op" | "eq";
  aria: string;
  wide?: boolean;
};

const ROWS: KeyDef[][] = [
  [
    { id: "c", label: "C", kind: "util", aria: "Tout effacer" },
    { id: "ce", label: "CE", kind: "util", aria: "Effacer la saisie" },
    { id: "back", label: "⌫", kind: "util", aria: "Retour arrière" },
    { id: "div", label: "÷", kind: "op", aria: "Diviser" },
  ],
  [
    { id: "7", label: "7", kind: "digit", aria: "Sept" },
    { id: "8", label: "8", kind: "digit", aria: "Huit" },
    { id: "9", label: "9", kind: "digit", aria: "Neuf" },
    { id: "mul", label: "×", kind: "op", aria: "Multiplier" },
  ],
  [
    { id: "4", label: "4", kind: "digit", aria: "Quatre" },
    { id: "5", label: "5", kind: "digit", aria: "Cinq" },
    { id: "6", label: "6", kind: "digit", aria: "Six" },
    { id: "sub", label: "−", kind: "op", aria: "Soustraire" },
  ],
  [
    { id: "1", label: "1", kind: "digit", aria: "Un" },
    { id: "2", label: "2", kind: "digit", aria: "Deux" },
    { id: "3", label: "3", kind: "digit", aria: "Trois" },
    { id: "add", label: "+", kind: "op", aria: "Additionner" },
  ],
  [
    { id: "sign", label: "±", kind: "util", aria: "Changer de signe" },
    { id: "0", label: "0", kind: "digit", aria: "Zéro" },
    { id: "dot", label: ",", kind: "digit", aria: "Virgule décimale" },
    { id: "eq", label: "=", kind: "eq", aria: "Égal" },
  ],
];

const MEMORY_KEYS: { id: string; label: string; aria: string }[] = [
  { id: "mc", label: "MC", aria: "Effacer la mémoire" },
  { id: "mr", label: "MR", aria: "Rappeler la mémoire" },
  { id: "mplus", label: "M+", aria: "Ajouter à la mémoire" },
  { id: "mminus", label: "M−", aria: "Soustraire de la mémoire" },
];

const KIND_CLASS: Record<KeyDef["kind"], string> = {
  digit: "bg-[#F4ECDC] text-[#21293B]",
  util: "bg-[#4A5772] text-[#EDE4D2]",
  op: "bg-[#33405E] text-[#EDE4D2]",
  eq: "bg-vermillion text-[#FBEFE2]",
};

export default function Calculator({ calc, flash, onSend }: Props) {
  const { state, press } = calc;
  const entry = Number(state.display.replace(",", ".")) || 0;

  return (
    <div
      className="relative overflow-hidden rounded-[22px] border border-black/40 text-paper shadow-[0_36px_70px_-30px_rgba(24,20,12,0.75)]"
      style={{
        backgroundColor: "#21293B",
        backgroundImage: "url('images/desk.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-[#1B2334]/82" aria-hidden="true" />
      <div
        className="absolute inset-0 opacity-[0.35] mix-blend-soft-light"
        style={{
          backgroundImage:
            "radial-gradient(120% 90% at 15% 0%, rgba(198,154,78,0.55) 0%, rgba(198,154,78,0) 60%)",
        }}
        aria-hidden="true"
      />

      <div className="relative px-5 pt-5 pb-6 sm:px-6">
        {/* bandeau objet */}
        <div className="flex items-baseline justify-between gap-3 pb-4">
          <div className="flex items-center gap-2.5">
            <span
              className="inline-block h-2 w-2 rounded-full bg-brass pulse-dot"
              aria-hidden="true"
            />
            <span className="label text-brass/90">Calculette</span>
          </div>
          <span className="label text-paper/55">
            Clavier actif
          </span>
        </div>

        {/* afficheur */}
        <div className="lcd rounded-2xl px-4 py-3.5 sm:px-5">
          <div className="flex items-center justify-between gap-3">
            <span className="label text-[#6b6250]/80">
              {state.memory !== 0 ? `Mémoire ${formatNumber(state.memory, 4)}` : "Mémoire vide"}
            </span>
            <span className="num text-[11px] text-[#6b6250]/80">
              {state.op ? `opération ${state.op}` : state.tape}
            </span>
          </div>
          <div
            className="num mt-1 overflow-x-auto whitespace-nowrap text-right text-[2.15rem] leading-none font-medium text-[#1E2F55] sm:text-[2.55rem]"
            aria-live="polite"
          >
            {formatCalcDisplay(state.display)}
          </div>
        </div>

        {/* envoi vers les cases */}
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onSend(entry, "obtenus")}
            className="rounded-lg border border-brass/35 bg-white/5 px-2 py-2 text-[11px] font-semibold tracking-[0.12em] text-paper/80 uppercase transition hover:border-brass hover:bg-brass/15 hover:text-paper focus-visible:ring-2 focus-visible:ring-brass focus-visible:outline-none"
          >
            → Points obtenus
          </button>
          <button
            type="button"
            onClick={() => onSend(entry, "total")}
            className="rounded-lg border border-brass/35 bg-white/5 px-2 py-2 text-[11px] font-semibold tracking-[0.12em] text-paper/80 uppercase transition hover:border-brass hover:bg-brass/15 hover:text-paper focus-visible:ring-2 focus-visible:ring-brass focus-visible:outline-none"
          >
            → Total
          </button>
        </div>

        {/* mémoire : additionner les points des exercices */}
        <div className="mt-5 grid grid-cols-4 gap-2">
          {MEMORY_KEYS.map((k) => (
            <button
              key={k.id}
              type="button"
              aria-label={k.aria}
              data-active={flash === k.id}
              onClick={() => press(k.id)}
              className="key bg-[#2B344A] py-2 text-[11px] font-semibold tracking-[0.14em] text-paper/75"
            >
              {k.label}
            </button>
          ))}
        </div>

        {/* pavé */}
        <div className="mt-2 grid grid-cols-4 gap-2.5">
          {ROWS.flat().map((k) => (
            <button
              key={k.id}
              type="button"
              aria-label={k.aria}
              data-active={flash === k.id}
              onClick={() => press(k.id)}
              className={`key ${KIND_CLASS[k.kind]} py-3.5 text-[1.15rem]`}
            >
              {k.label}
            </button>
          ))}
        </div>

        <p className="mt-5 border-t border-white/10 pt-4 text-[11px] leading-relaxed text-paper/55">
          Tapez directement sur votre clavier : chiffres, virgule, <span className="num">+ − * /</span>,
          <span className="num"> Entrée</span> pour <span className="num">=</span>,
          <span className="num"> Échap</span> pour effacer. La frappe est captée dès l'ouverture de la
          page.
        </p>
      </div>
    </div>
  );
}
