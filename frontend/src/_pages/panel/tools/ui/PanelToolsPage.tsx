import React from "react";
import { ExportJsonClient } from "@/features/export-json";

export default function PanelToolsPage() {
  return (
    <div lang="fa" dir="rtl">
      <h1 className="text-2xl font-bold">ابزارها</h1>
      <p className="text-sm text-gray-600 mt-1">ابزارهای مدیریت و خروجی‌گیری</p>
      <ExportJsonClient />
    </div>
  );
}
