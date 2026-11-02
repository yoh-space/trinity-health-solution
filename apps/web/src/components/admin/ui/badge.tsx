import * as React from "react";

export type BadgeVariant =
  | "default"
  | "secondary"
  | "outline"
  | "success"
  | "warning"
  | "info"
  | "destructive"
  | "emerald"
  | "terracotta";

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-[#1c573e] text-white hover:bg-[#154631]",
  secondary: "bg-[#edf2ea] text-[#34513f] hover:bg-[#e2ebe0]",
  outline: "border border-[#ccd8ca] text-[#2c4736] bg-transparent",
  success: "bg-[#dcfce7] text-[#15803d] border border-[#bbf7d0]",
  warning: "bg-[#fef3c7] text-[#b45309] border border-[#fde68a]",
  info: "bg-[#e0e7ff] text-[#4338ca] border border-[#c7d2fe]",
  destructive: "bg-[#fee2e2] text-[#b91c1c] border border-[#fecaca]",
  emerald: "bg-[#e6f4ea] text-[#1e613b] border border-[#bfe3c9]",
  terracotta: "bg-[#faeee5] text-[#b45d34] border border-[#f1d4c2]",
};

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BadgeVariant;
}

export function Badge({
  className = "",
  variant = "default",
  ...props
}: BadgeProps) {
  return (
    <div
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide transition-colors focus:outline-hidden ${variantClasses[variant]} ${className}`}
      {...props}
    />
  );
}
