export default function Hero3DFallback() {
  return (
    <div
      className="relative w-full h-[320px] md:h-[400px] flex items-center justify-center pointer-events-none select-none"
      aria-hidden="true"
    >
      <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
        {/* Outer subtle concentric rings */}
        <div className="absolute inset-0 rounded-full border border-[#292D39] opacity-40" />
        <div className="absolute inset-8 rounded-full border border-[#7790FF]/20" />
        <div className="absolute inset-16 rounded-full border border-dashed border-[#7790FF]/30" />

        {/* Inner geometric core */}
        <div className="w-28 h-28 md:w-36 md:h-36 rounded-2xl bg-gradient-to-tr from-[#0B0D12] via-[#171A24] to-[#1F2330] border border-[#7790FF]/40 shadow-2xl shadow-[#7790FF]/10 rotate-12 flex items-center justify-center">
          <div className="w-16 h-16 rounded-xl border border-[#96A9FF]/45 rotate-45 flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-[#7790FF]" />
          </div>
        </div>
      </div>
    </div>
  );
}
