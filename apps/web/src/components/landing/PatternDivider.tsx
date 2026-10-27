import React from "react";

interface PatternDividerProps {
  variant?: "clay" | "gold" | "subtle";
  className?: string;
}

export function PatternDivider({
  variant = "subtle",
  className = "",
}: PatternDividerProps) {
  const primaryColor = variant === "gold" ? "#7DC21E" : "#0E7A33";
  const secondaryColor = variant === "gold" ? "#0E7A33" : "#7DC21E";
  const fillOpacity = variant === "subtle" ? "0.65" : "0.88";

  return (
    <div
      className={`w-full overflow-hidden select-none pointer-events-none py-1.5 ${className}`}
      aria-hidden="true"
    >
      <svg
        width="100%"
        height="7"
        viewBox="0 0 360 7"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full block"
      >
        <line
          x1="0"
          y1="0.75"
          x2="360"
          y2="0.75"
          stroke="#D5E6D3"
          strokeWidth="1"
          strokeDasharray="2 2"
        />
        {Array.from({ length: 18 }).map((_, i) => {
          const a = i * 20;
          return (
            <g key={i}>
              <polygon
                points={`${a + 4},3.5 ${a + 8},1.2 ${a + 12},3.5 ${a + 8},5.8`}
                fill={i % 2 === 0 ? primaryColor : secondaryColor}
                fillOpacity={fillOpacity}
              />
              <circle
                cx={a + 18}
                cy="3.5"
                r="1.2"
                fill="#2F8F4E"
                fillOpacity="0.7"
              />
            </g>
          );
        })}
        <line
          x1="0"
          y1="6.25"
          x2="360"
          y2="6.25"
          stroke="#D5E6D3"
          strokeWidth="1"
          strokeDasharray="2 2"
        />
      </svg>
    </div>
  );
}
