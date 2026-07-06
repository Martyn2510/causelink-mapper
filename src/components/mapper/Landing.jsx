import React from "react";

export default function Landing({ onOpen }) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="max-w-2xl text-center">
        <img
          src="https://media.base44.com/images/public/6a3669c0131fc5acf62aa717/31a306fb5_MynewMCCLogo.jpg"
          alt="Martyn Campbell Consulting"
          className="mx-auto mb-8 w-full max-w-sm"
        />
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