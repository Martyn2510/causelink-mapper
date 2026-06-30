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
    <header className="bg-[#0E2F33] text-white py-5 print:py-3 relative">
      <div className="max-w-[1600px] mx-auto px-6 flex flex-col gap-4">
        <div className="flex items-center justify-between gap-5 relative">
          <h1 className="font-heading text-3xl font-semibold text-white absolute left-1/2 -translate-x-1/2">Causal Mapper</h1>
          <img
            src="https://media.base44.com/images/public/6a3669c0131fc5acf62aa717/50dc16eb0_MCC_Logo_ConsideredCalm_Investigations_6.png"
            alt="Martyn Campbell Consulting"
            className="h-28 w-auto rounded-lg bg-white p-2 flex-shrink-0 ml-auto self-center print:h-20"
          />
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