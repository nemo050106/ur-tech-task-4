"use client";

import React, { useState } from "react";
import AppShell from "@/components/layout/AppShell";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";

export default function SettingsPage() {
  const [storeName, setStoreName] = useState("ShopDesk Retail");
  const [adminEmail, setAdminEmail] = useState("neyamul@shopdesk.io");
  const [currency, setCurrency] = useState("INR");
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }, 600);
  };

  return (
    <AppShell title="Settings">
      <div className="max-w-3xl space-y-6">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Store Settings
          </h2>
          <p className="text-xs text-slate-500 sm:text-sm">
            Configure store preferences, currency display, and administrator profile.
          </p>
        </div>

        {isSaved && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-800">
            ✓ Settings saved successfully.
          </div>
        )}

        <Card className="space-y-5 p-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
            General Preferences
          </h3>

          <div className="space-y-4">
            <Input
              label="Store Name"
              value={storeName}
              onChange={setStoreName}
              placeholder="Store Name"
            />

            <Input
              label="Admin Email"
              type="email"
              value={adminEmail}
              onChange={setAdminEmail}
              placeholder="admin@example.com"
            />

            <Select
              label="Default Currency"
              value={currency}
              onChange={setCurrency}
              options={[
                { label: "Indian Rupee (INR - ₹)", value: "INR" },
                { label: "US Dollar (USD - $)", value: "USD" },
                { label: "Euro (EUR - €)", value: "EUR" },
              ]}
            />
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-5">
            <Button variant="secondary" size="md">
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              loading={saving}
              onClick={handleSave}
            >
              Save Changes
            </Button>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
