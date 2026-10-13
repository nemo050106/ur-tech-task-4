import React from "react";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";

/**
 * Route metadata
 * Requirement 4: Each page sets its own title with metadata / generateMetadata.
 */
export const metadata = {
  title: "Settings | ShopDesk",
  description: "Configure store preferences, currency formats, and administrator profile.",
};

/**
 * Settings Page (Server Component placeholder)
 * 
 * Requirement 5: Pages and layouts stay Server Components.
 */
export default function SettingsPage() {
  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
          Store Settings
        </h2>
        <p className="text-xs text-slate-500 sm:text-sm">
          Configure general store preferences, regional currencies, and admin details.
        </p>
      </div>

      <Card className="space-y-6 p-6 sm:p-8 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
          General Store Configuration
        </h3>

        <div className="space-y-4">
          <Input
            label="Store Business Name"
            defaultValue="ShopDesk Retail Ltd."
            placeholder="Store Name"
          />

          <Input
            label="Administrator Contact Email"
            type="email"
            defaultValue="neyamul@shopdesk.io"
            placeholder="admin@example.com"
          />

          <Select
            label="Default Display Currency"
            defaultValue="INR"
            options={[
              { label: "Indian Rupee (INR - ₹)", value: "INR" },
              { label: "US Dollar (USD - $)", value: "USD" },
              { label: "Euro (EUR - €)", value: "EUR" },
            ]}
          />
        </div>

        <div className="border-t border-slate-100 pt-5">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-600 mb-3">
            Inventory Alert Thresholds
          </h4>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Low Stock Warning Limit"
              type="number"
              defaultValue="5"
            />
            <Input
              label="Out-of-Stock Alert Email"
              type="email"
              defaultValue="alerts@shopdesk.io"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-5">
          <Button variant="secondary" size="md">
            Discard Changes
          </Button>
          <Button variant="primary" size="md">
            Save Preferences
          </Button>
        </div>
      </Card>
    </div>
  );
}
