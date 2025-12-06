"use client";
import React, { useState, useCallback } from "react";
import "./Slider.css";

type Props = {
  min?: number;
  max?: number;
  isDual?: boolean;
};

export default function Slider({
  min = 0,
  max = 1000,
  isDual = false,
}: Props) {
  const MIN = min;
  const MAX = max;

  const [value, setValue] = useState(MIN);
  const [minVal, setMinVal] = useState(MIN);
  const [maxVal, setMaxVal] = useState(MAX);

  const getPercent = useCallback(
    (v: number) => Math.round(((v - MIN) / (MAX - MIN)) * 100),
    [MIN, MAX]
  );

  return (
    <div className="relative w-full select-none pb-4 py-3">
      {/* VALUE LABELS */}
      <div className="flex text-sm justify-between mb-2.5 ml-[7px] text-gray-500">
        {!isDual ? (
          <span>{value}</span>
        ) : (
          <>
            <span>{minVal}</span>
            <span>+{maxVal}</span>
          </>
        )}
      </div>

      {/* TRACK */}
      <div className="relative h-1.5 bg-gray-200 rounded-full">
        {/* 🔵 HIGHLIGHT BAR */}
        <div
          className="absolute h-1.5 bg-blue-500 rounded-full"
          style={
            !isDual
              ? {
                  left: `0%`,
                  right: `${100 - getPercent(value)}%`,
                }
              : {
                  left: `${getPercent(minVal)}%`,
                  right: `${100 - getPercent(maxVal)}%`,
                }
          }
        />

        {/* 🟦 SINGLE MODE INPUT */}
        {!isDual && (
          <input
            type="range"
            min={MIN}
            max={MAX}
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
            className="absolute w-full appearance-none bg-transparent -translate-y-2 range-thumb"
          />
        )}

        {/* ⬅ LEFT THUMB */}
        {isDual && (
          <input
            type="range"
            min={MIN}
            max={MAX}
            value={minVal}
            onChange={(e) => {
              const val = Math.min(
                Number(e.target.value),
                maxVal - 1
              );
              setMinVal(val);
            }}
            className="absolute w-full pointer-events-none appearance-none bg-transparent -translate-y-2 range-thumb"
            style={{ zIndex: minVal > MAX - 100 ? 5 : 3 }}
          />
        )}

        {/* ➡ RIGHT THUMB */}
        {isDual && (
          <input
            type="range"
            min={MIN}
            max={MAX}
            value={maxVal}
            onChange={(e) => {
              const val = Math.max(
                Number(e.target.value),
                minVal + 1
              );
              setMaxVal(val);
            }}
            className="absolute w-full pointer-events-none appearance-none bg-transparent -translate-y-2 range-thumb"
            style={{ zIndex: 4 }}
          />
        )}
      </div>
    </div>
  );
}
