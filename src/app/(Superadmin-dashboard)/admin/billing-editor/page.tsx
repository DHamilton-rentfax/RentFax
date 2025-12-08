"use client";

import { useEffect, useState } from "react";
import { fetchPricing, updatePricing } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

function Field({ label, value, onChange }: { label: string; value: any; onChange: (v: any) => void }) {
  return (
    <div>
      <label className="text-sm font-medium mb-1 block">{label}</label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function PlanEditor({ title, path, obj, update }: { title: string; path: string; obj: any; update: (path: string, value: any) => void }) {
  return (
    <div className="border rounded-lg p-5 mb-6">
      <h3 className="font-semibold mb-3">{title}</h3>
      <div className="grid grid-cols-3 gap-4">
        <Field
          label="Price ($)"
          value={obj.price}
          onChange={(v) => update(`${path}.price`, Number(v))}
        />
        <Field
          label="Included Reports"
          value={obj.includedReports ?? obj.monthlyReports}
          onChange={(v) =>
            update(
              `${path}.${obj.includedReports != null ? "includedReports" : "monthlyReports"}`,
              Number(v)
            )
          }
        />
        <Field
          label="Overage ($)"
          value={obj.overage ?? ""}
          onChange={(v) => update(`${path}.overage`, Number(v))}
        />
      </div>
    </div>
  );
}


export default function BillingEditorPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchPricing().then((data) => {
      setForm(data);
      setLoading(false);
    });
  }, []);

  const handleUpdate = (path: string, value: any) => {
    setForm((prev: any) => {
      const clone = structuredClone(prev);
      const layers = path.split(".");
      let obj = clone;

      for (let i = 0; i < layers.length - 1; i++) {
        obj = obj[layers[i]];
      }

      obj[layers[layers.length - 1]] = value;
      return clone;
    });
  };

  const save = async () => {
    setSaving(true);
    try {
      await updatePricing(form);
      toast({
        title: "Success",
        description: "Pricing configuration has been updated."
      })
    } catch(err) {
      toast({
        title: "Error",
        description: "Failed to save pricing.",
        variant: "destructive"
      })
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin w-6 h-6" />
      </div>
    );
  }

  return (
    <div className="p-10 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">RentFAX Pricing Editor</h1>

      {form && (
        <>
          <section className="mb-10 p-6 border rounded-xl bg-white">
            <h2 className="text-xl font-semibold mb-4">Pay-As-You-Go Pricing</h2>

            <div className="grid grid-cols-2 gap-6">
              <Field
                label="Identity Check ($)"
                value={form.identityCheck}
                onChange={(v) => handleUpdate("identityCheck", Number(v))}
              />

              <Field
                label="Full Report ($)"
                value={form.fullReport}
                onChange={(v) => handleUpdate("fullReport", Number(v))}
              />
            </div>
          </section>

          <section className="mb-10 p-6 border rounded-xl bg-white">
            <h2 className="text-xl font-semibold mb-4">Subscription Plans</h2>

            <PlanEditor
              title="Landlord Premium"
              path="plans.landlordPremium"
              obj={form.plans.landlordPremium}
              update={handleUpdate}
            />

            <PlanEditor
              title="Company Basic"
              path="plans.companyBasic"
              obj={form.plans.companyBasic}
              update={handleUpdate}
            />

            <PlanEditor
              title="Company Pro"
              path="plans.companyPro"
              obj={form.plans.companyPro}
              update={handleUpdate}
            />
          </section>

          <Button
            onClick={save}
            disabled={saving}
            className="w-full bg-[#1A2540] hover:bg-[#2A3660] text-white flex items-center gap-2 justify-center py-4"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save />}
            Save Pricing
          </Button>
        </>
      )}
    </div>
  );
}
