"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ShieldOff, ArrowLeft, Home } from "lucide-react";

export default function UnauthorizedPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] overflow-hidden flex items-center justify-center">

      {/* Ambient background grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(#fff 1px, transparent 1px),
            linear-gradient(90deg, #fff 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
        }}
      />

      {/* Radial glow — red tint */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10"
        style={{
          background:
            "radial-gradient(circle, rgba(220,38,38,0.6) 0%, transparent 70%)",
        }}
      />

      {/* Scanline overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 4px)",
        }}
      />

      {/* Main card */}
      <div
        className={`relative z-10 flex flex-col items-center text-center max-w-lg px-8 transition-all duration-700 ease-out ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        {/* Icon block */}
        <div className="relative mb-8">
          <div className="w-20 h-20 rounded-2xl bg-red-950/40 border border-red-800/50 flex items-center justify-center shadow-[0_0_40px_rgba(220,38,38,0.15)]">
            <ShieldOff className="w-9 h-9 text-red-500" strokeWidth={1.5} />
          </div>
          {/* Pulse ring */}
          <div className="absolute inset-0 rounded-2xl border border-red-600/20 animate-ping" />
        </div>

        {/* Error code */}
        <p
          className="text-xs tracking-[0.3em] uppercase text-red-500/70 font-mono mb-3"
          style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}
        >
          Error 403 &nbsp;·&nbsp; Forbidden
        </p>

        {/* Headline */}
        <h1
          className="text-4xl font-semibold text-white mb-4 leading-tight tracking-tight"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Access Denied
        </h1>

        {/* Divider */}
        <div className="w-12 h-px bg-red-600/50 mb-6" />

        {/* Body */}
        <p
          className="text-sm text-zinc-400 leading-relaxed mb-10 max-w-sm"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          You don&apos;t have permission to view this page. If you believe this
          is a mistake, contact your system administrator or return to a page
          you have access to.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
          <Button
            variant="outline"
            className="flex-1 border-zinc-700 bg-transparent text-zinc-300 hover:bg-zinc-800 hover:text-white text-sm h-10 gap-2"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Button>
          <Button
            className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm h-10 gap-2 shadow-[0_0_20px_rgba(220,38,38,0.25)]"
            onClick={() => router.push("/")}
          >
            <Home className="w-4 h-4" />
            Home
          </Button>
        </div>

        {/* Footer note */}
        <p
          className="mt-12 text-[11px] text-zinc-600 font-mono tracking-wide"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          KAFU Clearance System &nbsp;·&nbsp; Unauthorized Access Attempt Logged
        </p>
      </div>
    </div>
  );
}