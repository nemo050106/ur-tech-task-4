import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

export default function Card({
  children,
  className = "",
  hoverable = false,
  ...props
}: CardProps) {
  return (
    <div
      className={`rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition-all duration-200 ${
        hoverable ? "hover:border-slate-300 hover:shadow-md" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export { Card };
