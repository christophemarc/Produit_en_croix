import { useCallback, useReducer } from "react";

export type Op = "+" | "-" | "×" | "÷";

export type CalcState = {
  display: string;
  acc: number | null;
  op: Op | null;
  overwrite: boolean;
  memory: number;
  tape: string;
};

export type CalcAction = { type: "key"; key: string } | { type: "reset" };

export const initialState: CalcState = {
  display: "0",
  acc: null,
  op: null,
  overwrite: true,
  memory: 0,
  tape: "",
};

const OP_FROM_KEY: Record<string, Op> = { add: "+", sub: "-", mul: "×", div: "÷" };

function fmt(v: number): string {
  if (!Number.isFinite(v)) return "Erreur";
  return String(Math.round(v * 1e10) / 1e10);
}

function compute(a: number, b: number, op: Op): number {
  switch (op) {
    case "+":
      return a + b;
    case "-":
      return a - b;
    case "×":
      return a * b;
    case "÷":
      return b === 0 ? NaN : a / b;
  }
}

export function calcReducer(state: CalcState, action: CalcAction): CalcState {
  if (action.type === "reset") return { ...initialState, memory: state.memory };

  const key = action.key;
  const errored = state.display === "Erreur";
  const cur = errored ? 0 : Number(state.display.replace(",", ".")) || 0;
  const show = (v: number, patch: Partial<CalcState> = {}): CalcState => ({
    ...state,
    display: fmt(v),
    overwrite: true,
    ...patch,
  });

  if (/^[0-9]$/.test(key)) {
    if (state.overwrite || errored) {
      return { ...state, display: key, overwrite: false };
    }
    if (state.display.replace("-", "").replace(".", "").length >= 12) return state;
    return { ...state, display: state.display === "0" ? key : state.display + key };
  }

  switch (key) {
    case "dot":
      if (state.overwrite || errored) return { ...state, display: "0.", overwrite: false };
      return state.display.includes(".") ? state : { ...state, display: state.display + "." };

    case "add":
    case "sub":
    case "mul":
    case "div": {
      const op = OP_FROM_KEY[key];
      if (errored) return { ...initialState, memory: state.memory, op, acc: 0, overwrite: true };
      if (state.op !== null && state.acc !== null && !state.overwrite) {
        const res = compute(state.acc, cur, state.op);
        return {
          ...state,
          display: fmt(res),
          acc: res,
          op,
          overwrite: true,
          tape: `${fmt(res)} ${op}`,
        };
      }
      return { ...state, acc: cur, op, overwrite: true, tape: `${fmt(cur)} ${op}` };
    }

    case "eq": {
      if (state.op !== null && state.acc !== null) {
        const res = compute(state.acc, cur, state.op);
        return {
          ...state,
          display: fmt(res),
          acc: null,
          op: null,
          overwrite: true,
          tape: `${fmt(state.acc)} ${state.op} ${fmt(cur)} =`,
        };
      }
      return { ...state, overwrite: true, tape: "" };
    }

    case "pct": {
      if (errored) return state;
      if (state.op !== null && state.acc !== null && !state.overwrite) {
        return { ...state, display: fmt((state.acc * cur) / 100) };
      }
      return { ...state, display: fmt(cur / 100), overwrite: true };
    }

    case "sign":
      if (errored) return state;
      return { ...state, display: fmt(-cur) };

    case "ce":
      return { ...state, display: "0", overwrite: true };

    case "c":
      return { ...initialState, memory: state.memory };

    case "back": {
      if (errored || state.overwrite) return { ...state, display: "0", overwrite: true };
      const next = state.display.slice(0, -1);
      return {
        ...state,
        display: next === "" || next === "-" ? "0" : next,
        overwrite: next === "" || next === "-",
      };
    }

    case "mc":
      return { ...state, memory: 0 };
    case "mr":
      return show(state.memory, { overwrite: true });
    case "mplus":
      return show(cur, { memory: state.memory + cur, overwrite: true });
    case "mminus":
      return show(cur, { memory: state.memory - cur, overwrite: true });

    default:
      return state;
  }
}

export function useCalculator() {
  const [state, dispatch] = useReducer(calcReducer, initialState);
  const press = useCallback((key: string) => dispatch({ type: "key", key }), []);
  const reset = useCallback(() => dispatch({ type: "reset" }), []);
  return { state, press, reset };
}

export type CalculatorApi = ReturnType<typeof useCalculator>;

/** Renvoie la touche calculette correspondante à un événement clavier. */
export function keyFromEvent(e: KeyboardEvent): string | null {
  const k = e.key;
  if (/^[0-9]$/.test(k)) return k;
  if (k === "," || k === ".") return "dot";
  if (k === "+" || k === "Add") return "add";
  if (k === "-" || k === "Subtract") return "sub";
  if (k === "*" || k.toLowerCase() === "x" || k === "Multiply") return "mul";
  if (k === "/" || k === "Divide") return "div";
  if (k === "Enter" || k === "=") return "eq";
  if (k === "Backspace") return "back";
  if (k === "Escape") return "c";
  if (k === "Delete") return "ce";
  if (k === "%") return "pct";
  return null;
}
