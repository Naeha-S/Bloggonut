"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

const FLAP_CHARS = " ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$()-+&=;:'\"%,./?°";

const BOARD_ROWS = 6;
const BOARD_COLS = 22;

const BASE_COL_DELAY = 30;
const BASE_ROW_DELAY = 20;
const BASE_STEP_MS = 55;
const BASE_FLIP_S = 0.35;
const BASE_TOTAL_S =
  ((BOARD_COLS - 1) * BASE_COL_DELAY +
    (BOARD_ROWS - 1) * BASE_ROW_DELAY +
    8 * BASE_STEP_MS) /
  1000;

const ACCENT_COLORS = [
  { top: "bg-red-600", bottom: "bg-red-700", text: "text-white" },
  { top: "bg-orange-500", bottom: "bg-orange-600", text: "text-white" },
  { top: "bg-yellow-400", bottom: "bg-yellow-500", text: "text-neutral-900" },
  { top: "bg-green-600", bottom: "bg-green-700", text: "text-white" },
  { top: "bg-blue-600", bottom: "bg-blue-700", text: "text-white" },
  { top: "bg-violet-600", bottom: "bg-violet-700", text: "text-white" },
  { top: "bg-white", bottom: "bg-neutral-100", text: "text-neutral-900" },
];

const NEWSPRINT_ACCENTS = [
  { top: "bg-neutral-100", bottom: "bg-neutral-200", text: "text-neutral-900" },
  { top: "bg-zinc-700", bottom: "bg-zinc-800", text: "text-white" },
  { top: "bg-stone-300", bottom: "bg-stone-400", text: "text-neutral-900" },
];

const THEMES = {
  default: {
    wrapper: "bg-neutral-100 shadow-xl",
    frame: "border-neutral-300",
    topBg: "bg-neutral-200",
    bottomBg: "bg-neutral-200",
    text: "text-neutral-800",
    flapTopBg: "bg-neutral-100",
    flapText: "text-neutral-800",
    split: "bg-neutral-400/50",
    sheenTop: "bg-[linear-gradient(to_bottom,rgba(255,255,255,0.8),transparent_60%)]",
    sheenFlip: "bg-[linear-gradient(to_bottom,rgba(255,255,255,0),rgba(255,255,255,1))]",
    sheenBottom: "bg-[linear-gradient(to_top,rgba(255,255,255,0),rgba(255,255,255,0.6))]",
    stripe: "text-neutral-400 opacity-20",
    colorFrame: "border-neutral-300",
    accents: ACCENT_COLORS,
  },
  newsprint: {
    wrapper: "bg-[#F9F9F7] shadow-none border border-[#111111]",
    frame: "border-[#111111]",
    topBg: "bg-[#1b1b1b]",
    bottomBg: "bg-[#111111]",
    text: "text-[#F9F9F7]",
    flapTopBg: "bg-[#2a2a2a]",
    flapText: "text-[#F9F9F7]",
    split: "bg-[#F9F9F7]/20",
    sheenTop: "bg-[linear-gradient(to_bottom,rgba(255,255,255,0.08),transparent_60%)]",
    sheenFlip: "bg-[linear-gradient(to_bottom,rgba(255,255,255,0),rgba(255,255,255,0.16))]",
    sheenBottom: "bg-[linear-gradient(to_top,rgba(255,255,255,0),rgba(255,255,255,0.12))]",
    stripe: "text-[#111111] opacity-12",
    colorFrame: "border-[#111111]",
    accents: NEWSPRINT_ACCENTS,
  },
};

const CELL_TEXT_STYLE = {
  fontSize: "clamp(6px, 2vw, 22px)",
  lineHeight: 1,
};

const FlapCell = React.memo(
  function FlapCell({
    target,
    delay,
    stepMs,
    flipDuration,
    theme = THEMES.default,
  }) {
    const [current, setCurrent] = useState(" ");
    const [prev, setPrev] = useState(" ");
    const [flipId, setFlipId] = useState(0);
    const [accent, setAccent] = useState(null);
    const [prevAccent, setPrevAccent] = useState(null);
    const curRef = useRef(" ");
    const tgtRef = useRef(null);
    const accentRef = useRef(null);
    const startTimer = useRef(null);
    const stepTimer = useRef(null);

    useEffect(() => {
      if (startTimer.current) clearTimeout(startTimer.current);
      if (stepTimer.current) clearTimeout(stepTimer.current);
      startTimer.current = null;
      stepTimer.current = null;

      const normalized = FLAP_CHARS.includes(target.toUpperCase()) ? target.toUpperCase() : " ";
      if (normalized === tgtRef.current) return undefined;
      tgtRef.current = normalized;

      if (normalized === " " && curRef.current === " ") return undefined;

      const scrambleCount =
        normalized === " "
          ? 8 + Math.floor(Math.random() * 8)
          : 25 + Math.floor(Math.random() * 15);

      const runStep = (index) => {
        const isLast = index === scrambleCount;
        const ch = isLast
          ? normalized
          : FLAP_CHARS[1 + Math.floor(Math.random() * (FLAP_CHARS.length - 1))];

        const newAccent = isLast
          ? null
          : Math.random() < 0.2
            ? theme.accents[Math.floor(Math.random() * theme.accents.length)]
            : null;

        setPrev(curRef.current);
        setPrevAccent(accentRef.current);
        curRef.current = ch;
        accentRef.current = newAccent;
        setCurrent(ch);
        setAccent(newAccent);
        setFlipId((value) => value + 1);

        if (!isLast) {
          stepTimer.current = setTimeout(() => runStep(index + 1), stepMs);
        }
      };

      startTimer.current = setTimeout(() => runStep(1), delay);

      return () => {
        if (startTimer.current) clearTimeout(startTimer.current);
        if (stepTimer.current) clearTimeout(stepTimer.current);
        startTimer.current = null;
        stepTimer.current = null;
        tgtRef.current = null;
      };
    }, [target, delay, stepMs, theme]);

    const show = current === " " ? "\u00A0" : current;
    const showPrev = prev === " " ? "\u00A0" : prev;

    const textCx =
      "absolute inset-x-0 flex select-none items-center justify-center font-mono font-bold tracking-wide";
    const topBg = accent?.top ?? theme.topBg;
    const bottomBg = accent?.bottom ?? theme.bottomBg;
    const textColor = accent?.text ?? theme.text;
    const flapTopBg = prevAccent?.top ?? theme.flapTopBg;
    const flapTextColor = prevAccent?.text ?? theme.flapText;
    const bottomDelay = flipDuration * 0.5;

    return (
      <div className={cn("flex aspect-[3/6] flex-col overflow-hidden rounded-[2px] border md:rounded-[3px] md:border-2", theme.frame)}>
        <div className="relative flex-1 [perspective:900px] [transform-style:preserve-3d]">
          <div className="absolute inset-x-0 top-0 h-[calc(50%-0.5px)] overflow-hidden rounded-t-[3px]">
            <div className={cn(textCx, textColor, "top-0 h-[200%]", topBg)} style={CELL_TEXT_STYLE}>
              {show}
            </div>
          </div>

          <div className={cn("absolute inset-x-0 bottom-0 h-[calc(50%-0.5px)] overflow-hidden rounded-b-[3px]", bottomBg)}>
            <div className={cn(textCx, textColor, "bottom-0 h-[200%]")} style={CELL_TEXT_STYLE}>
              {show}
            </div>
            {flipId > 0 ? (
              <motion.div
                key={`s${flipId}`}
                className={cn("pointer-events-none absolute inset-0", theme.sheenTop)}
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 0 }}
                transition={{ duration: flipDuration * 1.3, ease: "easeOut" }}
              />
            ) : null}
          </div>

          {flipId > 0 ? (
            <motion.div
              key={flipId}
              className={cn(
                "absolute inset-x-0 top-0 z-10 h-[calc(50%-0.5px)] origin-bottom overflow-hidden rounded-t-[3px] [backface-visibility:hidden] [transform-style:preserve-3d]",
                flapTopBg,
              )}
              initial={{ rotateX: 0 }}
              animate={{ rotateX: -100 }}
              transition={{ duration: flipDuration, ease: [0.55, 0.055, 0.675, 0.19] }}
            >
              <div className={cn(textCx, flapTextColor, "top-0 h-[200%]")} style={CELL_TEXT_STYLE}>
                {showPrev}
              </div>
              <motion.div
                className={cn("pointer-events-none absolute inset-0", theme.sheenFlip)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                transition={{ duration: flipDuration }}
              />
            </motion.div>
          ) : null}

          {flipId > 0 ? (
            <motion.div
              key={`b${flipId}`}
              className={cn(
                "absolute inset-x-0 bottom-0 z-10 h-[calc(50%-0.5px)] origin-top overflow-hidden rounded-b-[3px] [backface-visibility:hidden] [transform-style:preserve-3d]",
                bottomBg,
              )}
              initial={{ rotateX: 90 }}
              animate={{ rotateX: 0 }}
              transition={{
                duration: flipDuration * 0.85,
                delay: bottomDelay,
                ease: [0.33, 1.55, 0.64, 1],
              }}
            >
              <div className={cn(textCx, textColor, "bottom-0 h-[200%]")} style={CELL_TEXT_STYLE}>
                {show}
              </div>
              <motion.div
                className={cn("pointer-events-none absolute inset-0", theme.sheenBottom)}
                initial={{ opacity: 0.4 }}
                animate={{ opacity: 0 }}
                transition={{ duration: flipDuration * 0.85, delay: bottomDelay }}
              />
            </motion.div>
          ) : null}

          <div className={cn("pointer-events-none absolute inset-x-0 top-1/2 z-20 h-px -translate-y-[0.5px]", theme.split)} />
        </div>

        <div className={cn("h-2 w-full bg-[repeating-linear-gradient(to_bottom,currentColor_0,currentColor_1px,transparent_1px,transparent_0.15rem)] md:h-4 md:bg-[repeating-linear-gradient(to_bottom,currentColor_0,currentColor_1px,transparent_1px,transparent_0.2rem)]", theme.stripe)} />
      </div>
    );
  },
  (prevProps, nextProps) =>
    prevProps.target === nextProps.target &&
    prevProps.delay === nextProps.delay &&
    prevProps.stepMs === nextProps.stepMs &&
    prevProps.flipDuration === nextProps.flipDuration &&
    prevProps.theme === nextProps.theme,
);

const COLOR_MAP = {
  "{R}": "#D32F2F",
  "{O}": "#F57C00",
  "{Y}": "#FBC02D",
  "{G}": "#43A047",
  "{B}": "#1E88E5",
  "{V}": "#8E24AA",
  "{W}": "#FAFAFA",
};

const ColorCell = React.memo(function ColorCell({ color, theme = THEMES.default }) {
  return (
    <div
      className={cn("aspect-[3/5] rounded-[3px] border-2", theme.colorFrame)}
      style={{ backgroundColor: color }}
    />
  );
});

function parseRow(row) {
  const cells = [];
  let index = 0;
  while (index < row.length) {
    if (row[index] === "{" && index + 2 < row.length && row[index + 2] === "}") {
      const code = row.substring(index, index + 3);
      if (COLOR_MAP[code]) {
        cells.push({ type: "color", hex: COLOR_MAP[code] });
        index += 3;
        continue;
      }
    }
    cells.push({ type: "char", value: row[index] });
    index += 1;
  }
  return cells;
}

function wrapParagraph(paragraph, maxCols) {
  const lines = [];
  const words = paragraph.split(/[ \t]+/).filter(Boolean);
  let currentLine = "";

  for (const word of words) {
    if (word.length > maxCols) {
      if (currentLine) {
        lines.push(currentLine);
        currentLine = "";
      }
      lines.push(word.slice(0, maxCols));
      continue;
    }

    if (!currentLine) {
      currentLine = word;
    } else if (currentLine.length + 1 + word.length <= maxCols) {
      currentLine += ` ${word}`;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }

  if (currentLine) lines.push(currentLine);
  return lines;
}

function wrapText(input, maxCols) {
  return input
    .split("\n")
    .flatMap((paragraph) => (paragraph.trim() === "" ? [""] : wrapParagraph(paragraph, maxCols)));
}

export function TextFlippingBoard({
  rows,
  text,
  className,
  duration = BASE_TOTAL_S,
  theme = "default",
}) {
  const selectedTheme = THEMES[theme] || THEMES.default;
  const scale = duration / BASE_TOTAL_S;
  const colDelay = BASE_COL_DELAY * scale;
  const rowDelay = BASE_ROW_DELAY * scale;
  const stepMs = BASE_STEP_MS * scale;
  const flipDur = Math.min(0.6, Math.max(0.15, BASE_FLIP_S * scale));

  const board = useMemo(() => {
    const grid = Array.from({ length: BOARD_ROWS }, () =>
      Array.from({ length: BOARD_COLS }, () => ({ type: "char", value: " " })),
    );

    if (text) {
      const lines = wrapText(text, BOARD_COLS).slice(0, BOARD_ROWS);
      const startRow = Math.max(0, Math.floor((BOARD_ROWS - lines.length) / 2));
      lines.forEach((line, rowIndex) => {
        const row = startRow + rowIndex;
        if (row >= BOARD_ROWS) return;
        const parsed = parseRow(line);
        const startCol = Math.max(0, Math.floor((BOARD_COLS - parsed.length) / 2));
        parsed.forEach((cell, colIndex) => {
          if (startCol + colIndex < BOARD_COLS) {
            grid[row][startCol + colIndex] = cell;
          }
        });
      });
    } else if (rows) {
      rows.forEach((row, rowIndex) => {
        if (rowIndex >= BOARD_ROWS) return;
        const parsed = parseRow(row);
        parsed.forEach((cell, colIndex) => {
          if (colIndex < BOARD_COLS) {
            grid[rowIndex][colIndex] = cell;
          }
        });
      });
    }

    return grid;
  }, [rows, text]);

  return (
    <div
      className={cn(
        "relative mx-auto w-full max-w-3xl rounded-xl p-2 md:rounded-2xl md:p-4",
        selectedTheme.wrapper,
        className,
      )}
    >
      <div
        className="grid gap-px md:gap-[3px]"
        style={{ gridTemplateColumns: `repeat(${BOARD_COLS}, 1fr)` }}
      >
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) =>
            cell.type === "color" ? (
              <ColorCell key={`${rowIndex}-${colIndex}`} color={cell.hex} theme={selectedTheme} />
            ) : (
              <FlapCell
                key={`${rowIndex}-${colIndex}`}
                target={cell.value}
                delay={colIndex * colDelay + rowIndex * rowDelay}
                stepMs={stepMs}
                flipDuration={flipDur}
                theme={selectedTheme}
              />
            ),
          ),
        )}
      </div>
    </div>
  );
}
