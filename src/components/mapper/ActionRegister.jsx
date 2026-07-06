import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X, Link2, Trash2, Calendar, User, Mail, Loader2, Check } from "lucide-react";
import { LAYERS } from "@/lib/layers";
import { base44 } from "@/api/base44Client";

const PRIORITIES = [
  { value: "high", label: "High", cls: "bg-[#C5563D]/10 text-[#C5563D] border-[#C5563D]/30" },
  { value: "medium", label: "Medium", cls: "bg-[#D9923A]/10 text-[#D9923A] border-[#D9923A]/30" },
  { value: "low", label: "Low", cls: "bg-[#7FA88B]/15 text-[#1C4448] border-[#7FA88B]/30" },
];

const STATUSES = [
  { value: "open", label: "Open", cls: "bg-[#C5563D]/10 text-[#C5563D] border-[#C5563D]/30" },
  { value: "in_progress", label: "In Progress", cls: "bg-[#D9923A]/10 text-[#D9923A] border-[#D9923A]/30" },
  { value: "complete", label: "Complete", cls: "bg-[#9FBF3B]/15 text-[#1C4448] border-[#9FBF3B]/30" },
];

function genId() {
  return "act_" + Date.now().toString(36) + Math.random().toString(36).substring(2, 7);
}

function priorityMeta(val) {
  return PRIORITIES.find((p) => p.value === val) || PRIORITIES[1];
}

function statusMeta(val) {
  return STATUSES.find((s) => s.value === val) || STATUSES[0];
}

function layerMeta(id) {
  return LAYERS.find((l) => l.id === id);
}

function buildCauseOptions(holes) {
  const options = [];
  LAYERS.forEach((layer) => {
    const arr = holes[layer.id] || [];
    arr.forEach((hole, idx) => {
      const text = hole.text || "(undescribed error)";
      const preview = text.slice(0, 90);
      options.push({
        value: `${layer.id}:${idx}`,
        label: `${layer.name} — ${preview}${text.length > 90 ? "…" : ""}`,
        layer_id: layer.id,
        hole_idx: idx,
      });
    });
  });
  return options;
}

function lookupCause(holes, layer_id, hole_idx) {
  const arr = holes[layer_id];
  if (!arr || hole_idx == null || hole_idx >= arr.length) return null;
  return arr[hole_idx];
}

function ActionCard({ action, holes, onUpdate, onDelete }) {
  const layer = layerMeta(action.layer_id);
  const cause = lookupCause(holes, action.layer_id, action.hole_idx);
  const pm = priorityMeta(action.priority);
  const sm = statusMeta(action.status);
  const [emailMode, setEmailMode] = useState(false);
  const [emailAddr, setEmailAddr] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [emailErr, setEmailErr] = useState(null);

  const handleEmail = async () => {
    setSending(true);
    setEmailErr(null);
    try {
      await base44.functions.invoke("emailAction", {
        email: emailAddr,
        action: {
          cause: cause?.text || null,
          action: action.action,
          owner: action.owner,
          priority: action.priority,
          due_date: action.due_date,
          status: action.status,
        },
      });
      setSent(true);
    } catch (err) {
      setEmailErr(err.message || "Failed to send email.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-white border border-[#D5E0DE] rounded-[10px] p-3.5 pr-10 relative">
      <div className="flex items-center gap-2 flex-wrap mb-2">
        {layer && (
          <span className={`text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded text-white ${layer.labelBg}`}>
            {layer.name}
          </span>
        )}
        <span className={`text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded border ${pm.cls}`}>
          {pm.label}
        </span>
        <Select value={action.status} onValueChange={(v) => onUpdate(action.id, { status: v })}>
          <SelectTrigger className={`h-6 w-auto text-[10px] font-bold tracking-wider uppercase rounded border px-2 py-0 ${sm.cls} hover:opacity-80`}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUSES.map((s) => (
              <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {cause ? (
        <div className="flex items-start gap-1.5 mb-1.5">
          <Link2 className="w-3.5 h-3.5 text-[#0F766E] flex-shrink-0 mt-0.5" />
          <p className="text-[12px] text-[#1C4448] italic">{cause.text}</p>
        </div>
      ) : action.layer_id ? (
        <p className="text-[11px] text-[#C5563D] italic mb-1.5">⚠ Linked cause has been removed from the barrier map.</p>
      ) : null}

      <p className="text-[13.5px] font-semibold text-[#0E2F33] mb-2">{action.action}</p>

      <div className="flex items-center gap-4 flex-wrap text-[11.5px] text-[#1C4448]">
        {action.owner && (
          <span className="flex items-center gap-1">
            <User className="w-3 h-3 text-[#7FA88B]" />
            {action.owner}
          </span>
        )}
        {action.due_date && (
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-[#7FA88B]" />
            {action.due_date}
          </span>
        )}
        <button
          onClick={() => { setEmailMode(!emailMode); setSent(false); setEmailErr(null); }}
          className="flex items-center gap-1 text-[#0F766E] hover:underline cursor-pointer print:hidden"
        >
          <Mail className="w-3 h-3" />
          Email
        </button>
      </div>

      {emailMode && !sent && (
        <div className="mt-2.5 flex gap-2 print:hidden">
          <input
            type="email"
            value={emailAddr}
            onChange={(e) => setEmailAddr(e.target.value)}
            placeholder="recipient@example.com"
            disabled={sending}
            className="flex-1 h-8 text-[12px] rounded-[6px] border border-[#D5E0DE] px-2.5 focus:outline-none focus:border-[#0F766E]"
          />
          <button
            onClick={handleEmail}
            disabled={sending || !emailAddr}
            className="flex items-center gap-1 bg-[#0F766E] text-white rounded-[6px] px-3 text-[12px] font-semibold hover:brightness-110 disabled:opacity-60 cursor-pointer border-none"
          >
            {sending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Mail className="w-3 h-3" />}
            Send
          </button>
          {emailErr && <span className="text-[11px] text-[#C5563D] self-center">{emailErr}</span>}
        </div>
      )}
      {emailMode && sent && (
        <div className="mt-2.5 flex items-center gap-1.5 text-[12px] text-[#0F766E] print:hidden">
          <Check className="w-3.5 h-3.5" />
          Sent to {emailAddr}
        </div>
      )}

      <button
        onClick={() => onDelete(action.id)}
        className="absolute top-2.5 right-2.5 w-[18px] h-[18px] rounded flex items-center justify-center bg-[#0E2F33]/5 text-[#1C4448] hover:bg-[#C5563D] hover:text-white cursor-pointer border-none print:hidden"
      >
        <Trash2 className="w-3 h-3" />
      </button>
    </div>
  );
}

export default function ActionRegister({ actions, holes, onAdd, onUpdate, onDelete }) {
  const [showForm, setShowForm] = useState(false);
  const [causeKey, setCauseKey] = useState("");
  const [actionText, setActionText] = useState("");
  const [owner, setOwner] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState("open");

  const causeOptions = buildCauseOptions(holes);
  const hasCauses = causeOptions.length > 0;

  const handleAdd = () => {
    if (!actionText.trim()) return;
    let layer_id = null;
    let hole_idx = null;
    if (causeKey) {
      const [lid, hidx] = causeKey.split(":");
      layer_id = lid;
      hole_idx = parseInt(hidx, 10);
    }
    onAdd({
      id: genId(),
      layer_id,
      hole_idx,
      action: actionText.trim(),
      owner: owner.trim(),
      priority,
      due_date: dueDate,
      status,
    });
    setCauseKey("");
    setActionText("");
    setOwner("");
    setPriority("medium");
    setDueDate("");
    setStatus("open");
    setShowForm(false);
  };

  const handleCancel = () => {
    setCauseKey("");
    setActionText("");
    setOwner("");
    setPriority("medium");
    setDueDate("");
    setStatus("open");
    setShowForm(false);
  };

  const openCount = actions.filter((a) => a.status === "open").length;
  const progressCount = actions.filter((a) => a.status === "in_progress").length;
  const doneCount = actions.filter((a) => a.status === "complete").length;

  return (
    <div className="bg-[#FBFCFC] border border-[#D5E0DE] rounded-[14px] p-6 my-6">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div>
          <h2 className="font-heading text-xl font-semibold text-[#0E2F33]">Action Register</h2>
          <p className="text-[12px] text-[#1C4448] mt-0.5">
            {actions.length} action{actions.length !== 1 ? "s" : ""} — each linked to a cause or contributing factor from the barrier map.
          </p>
        </div>
        {!showForm && (
          <Button
            onClick={() => setShowForm(true)}
            className="bg-[#9FBF3B] text-[#0E2F33] hover:brightness-105 font-semibold text-[13px]"
            size="sm"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            Add action
          </Button>
        )}
      </div>

      {actions.length > 0 && (
        <div className="flex gap-3 mb-4 flex-wrap">
          <div className="bg-white border border-[#D5E0DE] rounded-[8px] px-3 py-1.5 text-center">
            <span className="font-heading text-lg font-bold text-[#C5563D]">{openCount}</span>
            <span className="text-[10px] font-semibold tracking-wide uppercase text-[#1C4448] ml-1.5">Open</span>
          </div>
          <div className="bg-white border border-[#D5E0DE] rounded-[8px] px-3 py-1.5 text-center">
            <span className="font-heading text-lg font-bold text-[#D9923A]">{progressCount}</span>
            <span className="text-[10px] font-semibold tracking-wide uppercase text-[#1C4448] ml-1.5">In Progress</span>
          </div>
          <div className="bg-white border border-[#D5E0DE] rounded-[8px] px-3 py-1.5 text-center">
            <span className="font-heading text-lg font-bold text-[#0F766E]">{doneCount}</span>
            <span className="text-[10px] font-semibold tracking-wide uppercase text-[#1C4448] ml-1.5">Complete</span>
          </div>
        </div>
      )}

      {showForm && (
        <div className="bg-white border border-[#D5E0DE] rounded-[10px] p-4 mb-4 space-y-3">
          <div>
            <label className="block text-[11px] font-bold tracking-wider uppercase text-[#0F766E] mb-1.5">
              Linked cause / contributing factor {hasCauses ? "" : "(optional — no barrier errors mapped yet)"}
            </label>
            {hasCauses ? (
              <Select value={causeKey} onValueChange={setCauseKey}>
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="Select a barrier error from the map…" />
                </SelectTrigger>
                <SelectContent>
                  {causeOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <p className="text-[12px] text-[#7FA88B] italic py-2">
                No barrier errors have been mapped yet. You can still add an action — link it to a cause later once errors are mapped in the barrier section above.
              </p>
            )}
          </div>
          <div>
            <label className="block text-[11px] font-bold tracking-wider uppercase text-[#0F766E] mb-1.5">
              Corrective action
            </label>
            <Textarea
              value={actionText}
              onChange={(e) => setActionText(e.target.value)}
              placeholder="Describe the corrective or preventive action that addresses this cause…"
              rows={2}
              className="text-sm resize-none"
              autoFocus
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] font-bold tracking-wider uppercase text-[#0F766E] mb-1.5">Owner</label>
              <Input value={owner} onChange={(e) => setOwner(e.target.value)} placeholder="Responsible person" className="text-sm" />
            </div>
            <div>
              <label className="block text-[11px] font-bold tracking-wider uppercase text-[#0F766E] mb-1.5">Priority</label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger className="text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PRIORITIES.map((p) => (<SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-[11px] font-bold tracking-wider uppercase text-[#0F766E] mb-1.5">Due date</label>
              <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="text-sm" />
            </div>
            <div>
              <label className="block text-[11px] font-bold tracking-wider uppercase text-[#0F766E] mb-1.5">Status</label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {STATUSES.map((s) => (<SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={handleCancel} className="text-[#1C4448]">Cancel</Button>
            <Button onClick={handleAdd} disabled={!actionText.trim()} className="bg-[#9FBF3B] text-[#0E2F33] hover:brightness-105 font-semibold">
              Add action
            </Button>
          </div>
        </div>
      )}

      {actions.length === 0 && !showForm ? (
        <p className="text-[13.5px] text-[#1C4448] italic py-2">
          {hasCauses
            ? "No actions yet. Click \"Add action\" to create a corrective action linked to a barrier error."
            : "No actions yet. Click \"Add action\" to create a corrective action — you can link it to a barrier error once errors are mapped above."}
        </p>
      ) : (
        <div className="space-y-2.5">
          {actions.map((action) => (
            <ActionCard key={action.id} action={action} holes={holes} onUpdate={onUpdate} onDelete={onDelete} />
          ))}
        </div>
      )}
    </div>
  );
}