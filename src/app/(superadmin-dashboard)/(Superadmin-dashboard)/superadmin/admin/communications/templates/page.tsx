'use client';

import { useEffect, useState } from "react";

export default function TemplateManager() {
  const [templates, setTemplates] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/admin/templates")
      .then(r => r.json())
      .then(d => setTemplates(d.templates));
  }, []);

  return (
    <div className="max-w-6xl mx-auto py-10 space-y-6">
      <h1 className="text-3xl font-semibold">Message Templates</h1>

      <div className="border rounded-xl divide-y">
        {templates.map(t => (
          <div key={t.id} className="p-4">
            <div className="font-semibold">
              {t.type} ({t.channel})
            </div>
            <div className="text-sm text-gray-600">
              Variables: {t.variables.join(", ")}
            </div>
            <div className="flex gap-3 mt-2">
              <a
                href={`/admin/communications/templates/${t.id}`}
                className="text-blue-600 underline text-sm"
              >
                Edit
              </a>
              {!t.isActive && (
                <span className="text-xs text-red-600">Inactive</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}