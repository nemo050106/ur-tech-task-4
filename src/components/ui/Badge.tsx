import React from "react";

export type BadgeVariant = "success" | "warning" | "danger" | "info" | "neutral";

export interface BadgeProps {
  stock?: number;
  status?: string;
  variant?: BadgeVariant;
  children?: React.ReactNode;
  className?: string;
  showDot?: boolean;
}

export default function Badge({
  stock,
  status,
  variant,
  children,
  className = "",
  showDot = true,
}: BadgeProps) {
  let resolvedVariant: BadgeVariant = variant || "neutral";
  let label = children ? String(children) : status;

  if (stock !== undefined) {
    if (stock === 0) {
      resolvedVariant = "danger";
      label = "Out of Stock";
    } else if (stock <= 5) {
      resolvedVariant = "warning";
      label = `Low Stock (${stock})`;
    } else {
      resolvedVariant = "success";
      label = "In Stock";
    }
  } else if (status) {
    const s = status.toLowerCase();
    if (s.includes("out") || s.includes("danger") || s.includes("inactive")) {
      resolvedVariant = "danger";
    } else if (s.includes("low") || s.includes("warn")) {
      resolvedVariant = "warning";
    } else if (s.includes("in stock") || s.includes("active") || s.includes("success")) {
      resolvedVariant = "success";
    } else {
      resolvedVariant = "neutral";
    }
    label = status;
  }

  const variantStyles: Record<BadgeVariant, { bg: string; text: string; dot: string; ring: string }> = {
    success: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      dot: "bg-emerald-500",
      ring: "ring-emerald-600/20",
    },
    warning: {
      bg: "bg-amber-50",
      text: "text-amber-800",
      dot: "bg-amber-500",
      ring: "ring-amber-600/20",
    },
    danger: {
      bg: "bg-rose-50",
      text: "text-rose-700",
      dot: "bg-rose-500",
      ring: "ring-rose-600/20",
    },
    info: {
      bg: "bg-sky-50",
      text: "text-sky-700",
      dot: "bg-sky-500",
      ring: "ring-sky-600/20",
    },
    neutral: {
      bg: "bg-slate-100",
      text: "text-slate-700",
      dot: "bg-slate-400",
      ring: "ring-slate-500/20",
    },
  };

  const style = variantStyles[resolvedVariant];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ring-1 ring-inset ${style.bg} ${style.text} ${style.ring} ${className}`}
    >
      {showDot && (
        <span
          className={`h-1.5 w-1.5 rounded-full ${style.dot} ${
            resolvedVariant === "danger" || resolvedVariant === "warning" ? "animate-pulse" : ""
          }`}
          aria-hidden="true"
        />
      )}
      <span>{children ?? label ?? "Active"}</span>
    </span>
  );
}

export { Badge };
