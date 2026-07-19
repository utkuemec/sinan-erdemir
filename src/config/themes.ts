import type {
  AccentId,
  FontPairingId,
  HeroLayoutId,
  LabelStyleId,
  PaletteId,
  PillarStyleId,
  ShapeId,
} from "./types";

/**
 * Display metadata for the theme presets and design levers — used by the
 * demo theme switcher UI only. The actual values live in CSS
 * (src/styles/themes.css + the THEME LEVERS section of styles.css).
 */

export interface PaletteMeta {
  id: PaletteId;
  label: string;
  /** Two representative swatch colours shown in the switcher. */
  swatches: [string, string];
}

export interface LeverOptionMeta<Id extends string> {
  id: Id;
  label: string;
}

// "sunrise" (the mustard/turquoise :root fallback) is deliberately NOT
// listed: it is the source campaign's palette and stays out of the demo.
// Client builds may still select it in candidate.ts.
export const PALETTES: PaletteMeta[] = [
  { id: "victory-red", label: "Victory Red", swatches: ["#9D0202", "#000000"] },
  { id: "heritage-red", label: "Heritage Red", swatches: ["#9E1B32", "#E8B04B"] },
  { id: "civic-blue", label: "Civic Blue", swatches: ["#1E5FA8", "#8FC3EA"] },
  { id: "grassroots-green", label: "Grassroots Green", swatches: ["#3E8E52", "#A6D786"] },
  { id: "midnight-violet", label: "Midnight Violet", swatches: ["#5B2D86", "#B79CDB"] },
];

export const FONT_PAIRINGS: LeverOptionMeta<FontPairingId>[] = [
  { id: "archivo", label: "Archivo" },
  { id: "bold-poster", label: "Bold Poster" },
  { id: "civic-serif", label: "Civic Serif" },
  { id: "friendly-rounded", label: "Friendly Rounded" },
];

export const HERO_LAYOUTS: LeverOptionMeta<HeroLayoutId>[] = [
  { id: "split", label: "Split" },
  { id: "overlay", label: "Photo overlay" },
];

export const ACCENTS: LeverOptionMeta<AccentId>[] = [
  { id: "highlight", label: "Highlight" },
  { id: "underline", label: "Underline" },
  { id: "minimal", label: "Minimal" },
];

export const SHAPES: LeverOptionMeta<ShapeId>[] = [
  { id: "sharp", label: "Sharp" },
  { id: "soft", label: "Soft" },
  { id: "pill", label: "Pill" },
];

export const PILLAR_STYLES: LeverOptionMeta<PillarStyleId>[] = [
  { id: "cards", label: "Cards" },
  { id: "band", label: "Colour band" },
];

export const LABEL_STYLES: LeverOptionMeta<LabelStyleId>[] = [
  { id: "badge", label: "Badge" },
  { id: "caps", label: "Caps" },
];
