import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LAYERS } from "@/lib/layers";

export default function BreachModal({ open, layerId, onClose, onSave }) {
  const [failureType, setFailureType] = useState("latent");
  const [text, setText] = useState("");
  const [ctrl, setCtrl] = useState("");
  const [ev, setEv] = useState("");
  const textRef = useRef(null);

  const layer = LAYERS.find((l) => l.id === layerId);

  useEffect(() => {
    if (open && layer) {
      setFailureType(layer.defaultType);
      setText("");
      setCtrl("");
      setEv("");
      setTimeout(() => textRef.current?.focus(), 100);
    }
  }, [open, layerId]);

  if (!open || !layer) return null;

  const handleSave = () => {
    if (!text.trim()) {
      textRef.current?.focus();
      return;
    }
    onSave({
      type: failureType,
      text: text.trim(),
      ctrl: ctrl.trim(),
      ev: ev.trim(),
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-[#0E2F33]/55 flex items-center justify-center p-5 z-50"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-[14px] max-w-[560px] w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="bg-[#0E2F33] text-white py-4 px-5 rounded-t-[14px]">
          <h3 className="font-heading text-lg font-semibold">Add breach — {layer.name}</h3>
          <p className="text-[12.5px] text-[#7FA88B] mt-0.5">{layer.desc}</p>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-[11px] font-bold tracking-wider uppercase text-[#0F766E] mb-1.5">
              Failure type
            </label>
            <Select value={failureType} onValueChange={setFailureType}>
              <SelectTrigger className="text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latent">Latent condition — dormant system/management weakness</SelectItem>
                <SelectItem value="active">Active failure — error or violation at point of operation</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-[11px] font-bold tracking-wider uppercase text-[#0F766E] mb-1.5">
              The breach / weakness
            </label>
            <Textarea
              ref={textRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="What weakness existed in this layer? Describe factually."
              className="text-sm min-h-[74px]"
            />
            <p className="text-[11.5px] text-[#1C4448] mt-1.5 italic">{layer.hint}</p>
          </div>

          <div>
            <label className="block text-[11px] font-bold tracking-wider uppercase text-[#0F766E] mb-1.5">
              Control that failed or was absent
            </label>
            <Textarea
              value={ctrl}
              onChange={(e) => setCtrl(e.target.value)}
              placeholder="Which control should have caught this? Was it absent, inadequate, or defeated?"
              className="text-sm min-h-[74px]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold tracking-wider uppercase text-[#0F766E] mb-1.5">
              Evidence reference (optional)
            </label>
            <Input
              value={ev}
              onChange={(e) => setEv(e.target.value)}
              placeholder="e.g. Interview W3, SWMS rev 4, CCTV 14:22"
              className="text-sm"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 pb-5 flex gap-2.5 justify-end">
          <Button variant="outline" onClick={onClose} className="text-[#1C4448]">
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-[#9FBF3B] text-[#0E2F33] hover:brightness-105 font-semibold">
            Add to map
          </Button>
        </div>
      </div>
    </div>
  );
}