import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Printer, Download, Upload, Trash2, BookOpen, FileType } from "lucide-react";

export default function Header({ onLoadDemo, onClear, onExport, onImport, onExportWord }) {
  const fileRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        onImport(data);
      } catch (err) {
        alert("Could not read file: " + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <header className="bg-[#0E2F33] text-white py-5 print:py-3">
      <div className="max-w-[1320px] mx-auto px-6 flex items-center justify-between gap-5 flex-wrap">
        <div className="flex items-center gap-3.5">
          <div>
            <h1 className="font-heading text-xl font-semibold text-white">Causal Link Mapper</h1>
            <p className="text-[12.5px] text-[#7FA88B] tracking-wide uppercase">
              Organisational Accident Model · Investigation Tool
            </p>
          </div>
        </div>
        <div className="flex gap-2.5 flex-wrap print:hidden">
          <Button
            variant="outline"
            size="sm"
            className="bg-transparent text-white border-white/35 hover:bg-white/12 font-semibold text-[13px]"
            onClick={onLoadDemo}
          >
            <BookOpen className="w-3.5 h-3.5 mr-1.5" />
            Load Example
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-transparent text-white border-white/35 hover:bg-white/12 font-semibold text-[13px]"
            onClick={onClear}
          >
            <Trash2 className="w-3.5 h-3.5 mr-1.5" />
            Clear
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-transparent text-white border-white/35 hover:bg-white/12 font-semibold text-[13px]"
            onClick={onExport}
          >
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Save
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-transparent text-white border-white/35 hover:bg-white/12 font-semibold text-[13px]"
            onClick={() => fileRef.current?.click()}
          >
            <Upload className="w-3.5 h-3.5 mr-1.5" />
            Open
          </Button>
          <input
            type="file"
            ref={fileRef}
            accept="application/json"
            className="hidden"
            onChange={handleFileChange}
          />
          {onExportWord && (
            <Button
              variant="outline"
              size="sm"
              className="bg-transparent text-white border-white/35 hover:bg-white/12 font-semibold text-[13px]"
              onClick={onExportWord}
            >
              <FileType className="w-3.5 h-3.5 mr-1.5" />
              Word
            </Button>
          )}
          <Button
            size="sm"
            className="bg-[#9FBF3B] text-[#0E2F33] hover:brightness-105 font-semibold text-[13px]"
            onClick={() => window.print()}
          >
            <Printer className="w-3.5 h-3.5 mr-1.5" />
            Print / PDF
          </Button>
        </div>
      </div>
    </header>
  );
}