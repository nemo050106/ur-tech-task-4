import React from "react";
import Card from "@/components/ui/Card";

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  variant?: "primary" | "success" | "danger" | "default";
  trend?: string;
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon,
  variant = "default",
  trend,
}: StatCardProps) {
  const iconBgStyles = {
    primary: "bg-indigo-50 text-indigo-600 border border-indigo-100",
    success: "bg-emerald-50 text-emerald-600 border border-emerald-100",
    danger: "bg-rose-50 text-rose-600 border border-rose-100",
    default: "bg-slate-50 text-slate-600 border border-slate-200",
  };

  const valueStyles = {
    primary: "text-indigo-600",
    success: "text-emerald-600",
    danger: "text-rose-600",
    default: "text-slate-900",
  };

  return (
    <Card hoverable className="relative overflow-hidden p-6 transition-all duration-200">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {title}
        </p>
        {icon && (
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconBgStyles[variant]}`}>
            {icon}
          </div>
        )}
      </div>

      <div className="mt-4 flex items-baseline gap-2">
        <h2 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${valueStyles[variant]}`}>
          {value}
        </h2>
        {trend && (
          <span className="text-xs font-medium text-slate-500">
            {trend}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="mt-2 text-xs text-slate-500">
          {subtitle}
        </p>
      )}
    </Card>
  );
}
