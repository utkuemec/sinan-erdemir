/*
 * DEMO ONLY — floating design switcher for the template demo site, so
 * prospects can flip palettes, fonts, and structural design levers live.
 * For a real candidate build set `theme.showDemoThemeSwitcher: false` in
 * src/config/candidate.ts (or delete this file and its single mount point
 * in src/routes/__root.tsx).
 *
 * Styles are intentionally inline so removing the component leaves no
 * traces in the shared stylesheet. Choices are not persisted — the static
 * data-* attributes from the config are the source of truth on every load.
 */
import { useEffect, useRef, useState } from "react";
import { Palette, X } from "lucide-react";
import type { CSSProperties } from "react";
import { candidate } from "@/config/candidate";
import {
  ACCENTS,
  FONT_PAIRINGS,
  HERO_LAYOUTS,
  LABEL_STYLES,
  PALETTES,
  PILLAR_STYLES,
  SHAPES,
} from "@/config/themes";

const panelStyle: CSSProperties = {
  position: "absolute",
  bottom: "calc(100% + 12px)",
  left: 0,
  width: 272,
  maxHeight: "min(70vh, 560px)",
  overflowY: "auto",
  padding: 16,
  background: "#FFFFFF",
  color: "#1A1A1A",
  borderRadius: 10,
  boxShadow: "0 12px 32px rgba(26, 26, 26, 0.25)",
  border: "1px solid rgba(26, 26, 26, 0.1)",
};

const headingStyle: CSSProperties = {
  margin: "0 0 6px",
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  opacity: 0.6,
};

const paletteOptionStyle = (active: boolean): CSSProperties => ({
  display: "flex",
  alignItems: "center",
  gap: 8,
  width: "100%",
  padding: "7px 10px",
  marginBottom: 4,
  borderRadius: 6,
  fontSize: 13,
  fontWeight: 600,
  textAlign: "left",
  background: active ? "rgba(26, 26, 26, 0.08)" : "transparent",
  border: active ? "1px solid rgba(26, 26, 26, 0.35)" : "1px solid rgba(26, 26, 26, 0.12)",
  cursor: "pointer",
});

const segmentRowStyle: CSSProperties = {
  display: "flex",
  gap: 4,
  marginBottom: 12,
};

const segmentStyle = (active: boolean): CSSProperties => ({
  flex: 1,
  padding: "6px 4px",
  borderRadius: 6,
  fontSize: 12,
  fontWeight: 600,
  textAlign: "center",
  background: active ? "rgba(26, 26, 26, 0.08)" : "transparent",
  border: active ? "1px solid rgba(26, 26, 26, 0.35)" : "1px solid rgba(26, 26, 26, 0.12)",
  cursor: "pointer",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
});

const swatchStyle = (color: string): CSSProperties => ({
  width: 14,
  height: 14,
  borderRadius: "50%",
  background: color,
  border: "1px solid rgba(26, 26, 26, 0.15)",
  flexShrink: 0,
});

function LeverRow<Id extends string>({
  title,
  options,
  value,
  onChange,
}: {
  title: string;
  options: { id: Id; label: string }[];
  value: Id;
  onChange: (id: Id) => void;
}) {
  return (
    <>
      <p style={headingStyle}>{title}</p>
      <div style={segmentRowStyle} role="group" aria-label={title}>
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            style={segmentStyle(value === o.id)}
            aria-pressed={value === o.id}
            onClick={() => onChange(o.id)}
          >
            {o.label}
          </button>
        ))}
      </div>
    </>
  );
}

export function DemoThemeSwitcher() {
  const [open, setOpen] = useState(false);
  const [palette, setPalette] = useState(candidate.theme.palette);
  const [fonts, setFonts] = useState(candidate.theme.fonts);
  const [hero, setHero] = useState(candidate.theme.hero);
  const [accent, setAccent] = useState(candidate.theme.accent);
  const [shape, setShape] = useState(candidate.theme.shape);
  const [pillars, setPillars] = useState(candidate.theme.pillars);
  const [labels, setLabels] = useState(candidate.theme.labels);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.dataset.theme = palette;
  }, [palette]);
  useEffect(() => {
    document.documentElement.dataset.fonts = fonts;
  }, [fonts]);
  useEffect(() => {
    document.documentElement.dataset.hero = hero;
  }, [hero]);
  useEffect(() => {
    document.documentElement.dataset.accent = accent;
  }, [accent]);
  useEffect(() => {
    document.documentElement.dataset.shape = shape;
  }, [shape]);
  useEffect(() => {
    document.documentElement.dataset.pillars = pillars;
  }, [pillars]);
  useEffect(() => {
    document.documentElement.dataset.labels = labels;
  }, [labels]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  return (
    <div
      ref={rootRef}
      style={{ position: "fixed", bottom: 20, left: 20, zIndex: 90 }}
      data-demo-only
    >
      {open && (
        <div style={panelStyle} role="group" aria-label="Demo theme switcher">
          <p style={headingStyle}>Colour palette</p>
          <div style={{ marginBottom: 12 }}>
            {PALETTES.map((p) => (
              <button
                key={p.id}
                type="button"
                style={paletteOptionStyle(palette === p.id)}
                aria-pressed={palette === p.id}
                onClick={() => setPalette(p.id)}
              >
                <span style={swatchStyle(p.swatches[0])} aria-hidden="true" />
                <span style={swatchStyle(p.swatches[1])} aria-hidden="true" />
                {p.label}
              </button>
            ))}
          </div>

          <LeverRow title="Fonts" options={FONT_PAIRINGS} value={fonts} onChange={setFonts} />
          <LeverRow title="Hero layout" options={HERO_LAYOUTS} value={hero} onChange={setHero} />
          <LeverRow title="Accents" options={ACCENTS} value={accent} onChange={setAccent} />
          <LeverRow title="Shape" options={SHAPES} value={shape} onChange={setShape} />
          <LeverRow title="Pillars" options={PILLAR_STYLES} value={pillars} onChange={setPillars} />
          <LeverRow title="Labels" options={LABEL_STYLES} value={labels} onChange={setLabels} />

          <p style={{ margin: "2px 0 0", fontSize: 11, opacity: 0.55 }}>
            Demo widget — not part of candidate sites.
          </p>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-label={open ? "Close theme switcher" : "Open demo theme switcher"}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "12px 16px",
          borderRadius: 999,
          background: "#1A1A1A",
          color: "#FFFFFF",
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: "0.04em",
          boxShadow: "0 8px 24px rgba(26, 26, 26, 0.35)",
          cursor: "pointer",
        }}
      >
        {open ? <X size={16} /> : <Palette size={16} />}
        Try a style
      </button>
    </div>
  );
}
