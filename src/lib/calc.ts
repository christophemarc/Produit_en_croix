export type RoundMode = "near" | "up" | "down";

/** Parse un nombre saisi à la française ("13,5", "13.5", "1 200"). */
export function parseNumber(input: string): number {
  if (!input) return NaN;
  const cleaned = input.replace(/\s|\u202f|\u00a0/g, "").replace(",", ".");
  if (cleaned === "" || cleaned === "." || cleaned === "-") return NaN;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : NaN;
}

/** 13.5 -> "13,5" · 8 -> "8" · 16.1904 -> "16,19" */
export function formatNumber(value: number, maxDecimals = 2): string {
  if (!Number.isFinite(value)) return "—";
  const fixed = value.toFixed(maxDecimals);
  const trimmed = fixed.replace(/\.?0+$/, "");
  return trimmed.replace(".", ",");
}

/** Arrondi à un pas donné (0,5 par défaut) dans le mode demandé. */
export function roundTo(value: number, step: number, mode: RoundMode): number {
  if (!Number.isFinite(value)) return NaN;
  if (!step || step <= 0) return value;
  const n = value / step;
  const eps = 1e-9;
  const factor =
    mode === "up" ? Math.ceil(n - eps) : mode === "down" ? Math.floor(n + eps) : Math.round(n);
  return Math.round(factor * step * 1e6) / 1e6;
}

export function stepLabel(step: number): string {
  if (!step) return "aucun arrondi";
  if (step === 1) return "à l'unité";
  return `au ${formatNumber(step, 2)}`;
}

export function modeLabel(mode: RoundMode): string {
  return mode === "up" ? "au-dessus" : mode === "down" ? "en dessous" : "le plus proche";
}

/** Garde uniquement les caractères autorisés dans une case à remplir. */
export function sanitizeNumberInput(raw: string): string {
  return raw.replace(/[^0-9.,\s-]/g, "").slice(0, 12);
}

/** Affiche une valeur de calculette avec séparateur de milliers français. */
export function formatCalcDisplay(raw: string): string {
  if (raw === "Erreur") return raw;
  const negative = raw.startsWith("-");
  const body = negative ? raw.slice(1) : raw;
  const [intPart, decPart] = body.split(".");
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, "\u202f");
  const sign = negative ? "−" : "";
  return `${sign}${grouped}${decPart !== undefined ? "," + decPart : ""}`;
}
