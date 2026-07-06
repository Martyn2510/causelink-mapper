import React from "react";

export default function Landing({ onOpen }) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="max-w-2xl text-center">
        <h1 className="font-heading text-5xl font-bold text-[#0E2F33] mb-4">
          Causal Link Mapper
        </h1>
        <p className="font-body text-muted-foreground text-lg mb-8">
          Visualise, map, and analyse cause-and-effect relationships and failure
          layers using the Swiss Cheese Model.
        </p>
        <button
          onClick={onOpen}
          className="bg-[#0F766E] text-white rounded-[10px] py-3 px-10 font-heading font-semibold text-[16px] hover:brightness-110 cursor-pointer border-none"
        >
          Open
        </button>
      </div>
    </div>
  );
}