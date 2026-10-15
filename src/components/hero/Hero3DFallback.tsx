export default function Hero3DFallback() {
  return (
    <div
      className="relative w-full h-[320px] md:h-[380px] flex items-center justify-center pointer-events-none select-none"
      aria-hidden="true"
    >
      <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
        {/* Outer subtle concentric rings */}
        <div className="absolute inset-0 rounded-full border border-[#2B2D34] opacity-50" />
        <div className="absolute inset-8 rounded-full border border-[#6D8DFF]/20" />
        <div className="absolute inset-16 rounded-full border border-dashed border-[#6D8DFF]/30 animate-spin-slow" />
        
        {/* Inner geometric core */}
        <div className="w-28 h-28 md:w-36 md:h-36 rounded-2xl bg-gradient-to-tr from-[#15171C] via-[#1B1D23] to-[#202430] border border-[#6D8DFF]/40 shadow-2xl shadow-[#6D8DFF]/10 rotate-12 flex items-center justify-center">
          <div className="w-16 h-16 rounded-xl border border-[#8B9CFF]/50 rotate-45 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-[#6D8DFF]" />
          </div>
        </div>
      </div>
    </div>
  );
}
