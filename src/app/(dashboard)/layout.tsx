import React from "react";
import AppShell from "@/components/layout/AppShell";

/**
 * Dashboard Layout (Server Component)
 * 
 * Requirement 5: Pages and layouts stay Server Components.
 * This layout wraps all (dashboard) group pages with the interactive AppShell
 * containing the sidebar, navigation, top bar, and user avatar menu.
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
