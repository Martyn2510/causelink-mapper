import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function MetaPanel({ meta, onChange }) {
  const update = (field, value) => {
    onChange({ ...meta, [field]: value });
  };

  return (
    <div className="bg-[#FBFCFC] border border-[#D5E0DE] rounded-xl p-5 my-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
      <div>
        <label className="block text-[11px] font-bold tracking-wider uppercase text-[#0F766E] mb-1.5">
          Investigation / Event Ref
        </label>
        <Input
          value={meta.ref || ""}
          onChange={(e) => update("ref", e.target.value)}
          placeholder="e.g. INV-2026-014"
          className="text-sm"
        />
      </div>
      <div>
        <label className="block text-[11px] font-bold tracking-wider uppercase text-[#0F766E] mb-1.5">
          Event Title
        </label>
        <Input
          value={meta.title || ""}
          onChange={(e) => update("title", e.target.value)}
          placeholder="e.g. Loss of control — haul truck, ramp 3"
          className="text-sm"
        />
      </div>
      <div>
        <label className="block text-[11px] font-bold tracking-wider uppercase text-[#0F766E] mb-1.5">
          Date of Event
        </label>
        <Input
          type="date"
          value={meta.event_date || ""}
          onChange={(e) => update("event_date", e.target.value)}
          className="text-sm"
        />
      </div>
      <div>
        <label className="block text-[11px] font-bold tracking-wider uppercase text-[#0F766E] mb-1.5">
          Lead Investigator
        </label>
        <Input
          value={meta.investigator || ""}
          onChange={(e) => update("investigator", e.target.value)}
          placeholder="Name"
          className="text-sm"
        />
      </div>
      <div className="sm:col-span-2 lg:col-span-4">
        <label className="block text-[11px] font-bold tracking-wider uppercase text-[#0F766E] mb-1.5">
          The Outcome (loss event / harm)
        </label>
        <Textarea
          value={meta.outcome || ""}
          onChange={(e) => update("outcome", e.target.value)}
          placeholder="Describe the realised loss — the hazard that reached the target after all barriers were breached."
          rows={2}
          className="text-sm resize-none"
        />
      </div>
    </div>
  );
}