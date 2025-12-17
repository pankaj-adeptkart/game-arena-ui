import { useEffect, useState, useRef } from "react";
import { useLowPowerMode } from "../../config/useLowPowerMode"; // Adjust path if needed

const SPEEDS = [
    { label: "0.5x", value: 1200 },
    { label: "1x", value: 700 },
    { label: "2x", value: 300 },
];

export default function ReplayTimeline({
    history = [],
    onPreview,
    playerNames = { p1: "YOU", p2: "BOT" },
}) {
    const isLowPower = useLowPowerMode(); // PERFORMANCE HOOK
    const [active, setActive] = useState(null);
    const [playing, setPlaying] = useState(false);
    const [speed, setSpeed] = useState(SPEEDS[1]);

    const scrollContainerRef = useRef(null);

    /* RESET ACTIVE WHEN HISTORY CHANGES */
    useEffect(() => {
        setActive(null);
    }, [history]);

    /* AUTO PLAY LOGIC (Preserved) */
    useEffect(() => {
        if (!playing || !history.length) return;

        let i = active !== null ? active : 0;
        if (i >= history.length - 1) i = 0;

        setActive(i);
        onPreview(history[i], i, true);

        const id = setInterval(() => {
            i++;
            if (i >= history.length) {
                clearInterval(id);
                setPlaying(false);
            } else {
                onPreview(history[i], i, true);
                setActive(i);
            }
        }, speed.value);

        return () => clearInterval(id);
    }, [playing, speed, history]);

    /* AUTO SCROLL ACTIVE TO CENTER (Optimized) */
    useEffect(() => {
        if (active !== null) {
            const el = document.getElementById(`replay-step-${active}`);
            if (el) {
                // OPTIMIZATION: Use 'auto' (instant) scroll on low power to prevent lag
                el.scrollIntoView({
                    behavior: isLowPower ? "auto" : "smooth",
                    inline: "center",
                    block: "nearest"
                });
            }
        }
    }, [active, isLowPower]);

    if (!history.length) return null;

    const step = (dir) => {
        if (active === null) {
            setActive(0);
            onPreview(history[0], 0);
            return;
        }
        const next = dir === "prev" ? active - 1 : active + 1;
        if (next < 0 || next >= history.length) return;
        setActive(next);
        onPreview(history[next], next);
    };

    const activeBy = active !== null ? history[active]?.by : null;
    const isP1 = activeBy === "p1" || !activeBy;
    const progress = active === null ? 0 : (active / (history.length - 1)) * 100;

    return (
        <div className="relative w-full max-w-[100vw] overflow-hidden mx-auto font-sans select-none my-4 md:my-8">

            {/* GLOW BACKGROUND (Optimized: Hidden on Low Power) */}
            {!isLowPower && (
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-cyan-500/10 blur-[60px] rounded-full pointer-events-none transition-opacity duration-1000 ${playing ? 'opacity-100 animate-pulse' : 'opacity-30'}`}></div>
            )}

            {/* MAIN CONTAINER */}
            <div className="relative flex flex-col items-center">

                {/* ================= 📼 CASSETTE VISUAL ================= */}
                <div className="relative w-full md:max-w-3xl h-32 md:h-48 bg-[#151725] rounded-3xl border border-white/10 shadow-2xl flex items-center justify-center overflow-hidden mb-6">
                    {/* Inner Texture */}
                    {!isLowPower && <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03),transparent_70%)]" />}

                    {/* Tape Window */}
                    <div className="absolute w-[85%] h-[60%] bg-[#0f101a] rounded-2xl border border-white/5 shadow-inner" />

                    {/* REELS CONTAINER */}
                    <div className="flex items-center gap-4 md:gap-16 relative z-10 w-full justify-center px-4">
                        <CassetteReel playing={playing} filled={100 - progress} color="cyan" isLowPower={isLowPower} />

                        {/* CENTER BRIDGE */}
                        <div className="relative flex-1 max-w-[100px] md:max-w-[180px] h-14 flex flex-col justify-center items-center">
                            {/* Tape Strip */}
                            <div className={`w-full h-10 bg-black/40 rounded border-y border-white/10 relative overflow-hidden ${!isLowPower && "backdrop-blur-sm"}`}>
                                {/* OPTIMIZATION: Remove shimmer animation on low power */}
                                {playing && !isLowPower && (
                                    <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_4px,rgba(255,255,255,0.1)_4px,rgba(255,255,255,0.1)_8px)] animate-[shimmer_0.3s_linear_infinite]" />
                                )}
                            </div>

                            {/* Counter */}
                            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-black/80 rounded-full text-[10px] md:text-xs font-mono text-cyan-400 border border-cyan-900/50 shadow-lg whitespace-nowrap z-20">
                                {String(active !== null ? active + 1 : 0).padStart(3, '0')} <span className="text-white/30 mx-1">/</span> {String(history.length).padStart(3, '0')}
                            </div>
                        </div>

                        <CassetteReel playing={playing} filled={progress} color="pink" isLowPower={isLowPower} />
                    </div>
                </div>

                {/* ================= 🎛 COMPACT CONTROLS ================= */}
                <div className="w-full md:max-w-3xl bg-[#0f101a] rounded-2xl border border-white/5 p-3 md:p-4 shadow-xl mb-6">
                    <div className="flex items-center justify-between mb-3 px-1">
                        <div className="flex bg-[#1a1c29] rounded-lg p-1 gap-1">
                            {SPEEDS.map((s) => (
                                <button
                                    key={s.label}
                                    onClick={() => setSpeed(s)}
                                    className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all ${speed.label === s.label ? "bg-slate-700 text-white shadow-sm" : "text-slate-500 hover:text-slate-300"}`}
                                >
                                    {s.label}
                                </button>
                            ))}
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Turn</span>
                            <div className={`px-2 py-0.5 rounded text-[10px] font-black tracking-wide border ${isP1 ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400" : "bg-pink-500/10 border-pink-500/30 text-pink-400"}`}>
                                {activeBy ? playerNames[activeBy] : "START"}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-center gap-6 md:gap-8 border-t border-white/5 pt-3">
                        <ControlButton onClick={() => step("prev")} icon="⏮" />
                        <button
                            onClick={() => setPlaying(!playing)}
                            className={`w-14 h-14 rounded-full flex items-center justify-center text-xl transition-all duration-200 active:scale-95 shadow-[0_0_20px_rgba(0,0,0,0.5)] border-4 ${playing ? "bg-[#1a1c29] border-slate-700 text-red-500" : "bg-gradient-to-t from-cyan-600 to-cyan-400 border-[#1a1c29] text-black shadow-md hover:-translate-y-0.5"}`}
                        >
                            {playing ? "⏸" : "▶"}
                        </button>
                        <ControlButton onClick={() => step("next")} icon="⏭" />
                    </div>
                </div>

                {/* ================= 🎞 TIMELINE STRIP ================= */}
                <div className="relative w-full">
                    <div className="absolute top-1/2 left-0 right-0 h-1 bg-white/5 -translate-y-1/2" />
                    <div
                        ref={scrollContainerRef}
                        className="relative flex items-center gap-3 overflow-x-auto py-6 px-[50%] scrollbar-hide snap-x snap-mandatory cursor-grab active:cursor-grabbing"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {history.map((h, i) => {
                            const stepIsP1 = h.by === "p1" || !h.by;
                            const isActive = active === i;

                            return (
                                <button
                                    id={`replay-step-${i}`}
                                    key={i}
                                    onClick={() => { setPlaying(false); setActive(i); onPreview(history[i], i); }}
                                    className={`relative flex-shrink-0 transition-all duration-300 snap-center ${isActive ? 'scale-100 z-10' : 'scale-75 opacity-50'}`}
                                >
                                    <div className={`w-12 h-16 rounded-lg flex flex-col items-center justify-center gap-1 border-b-4 transition-colors shadow-lg ${stepIsP1 ? (isActive ? 'bg-cyan-500 border-cyan-700 text-black' : 'bg-slate-800 border-slate-900 text-cyan-500') : (isActive ? 'bg-pink-500 border-pink-700 text-black' : 'bg-slate-800 border-slate-900 text-pink-500')}`}>
                                        <span className="text-xl leading-none">{stepIsP1 ? "😎" : "🤖"}</span>
                                        <span className="text-[9px] font-bold opacity-80">#{i + 1}</span>
                                    </div>
                                    {/* OPTIMIZATION: Remove bounce animation on low power */}
                                    {isActive && <div className={`absolute -top-3 left-1/2 -translate-x-1/2 text-cyan-400 text-[10px] ${!isLowPower && "animate-bounce"}`}>▼</div>}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

/* SUB-COMPONENTS */

function CassetteReel({ playing, filled, color, isLowPower }) {
    const tapeSize = 25 + (filled * 0.5);

    return (
        <div className="relative w-16 h-16 md:w-28 md:h-28 flex-shrink-0 flex items-center justify-center">
            {/* The Tape Roll */}
            <div className="absolute rounded-full bg-[#252836] border border-white/5 transition-all duration-300 shadow-xl" style={{ width: `${tapeSize}%`, height: `${tapeSize}%` }} />

            {/* The Spool (Spinning part) */}
            {/* OPTIMIZATION: Disable 'animate-spin' on low power */}
            <div className={`
                relative w-10 h-10 md:w-16 md:h-16 rounded-full border-[3px] md:border-[5px] border-dashed 
                flex items-center justify-center z-10 bg-[#151725] shadow-lg
                ${playing && !isLowPower ? 'animate-spin' : ''}
                ${color === 'cyan' ? 'border-cyan-500/50' : 'border-pink-500/50'}
            `}
                style={!isLowPower ? { animationDuration: '3s' } : {}}
            >
                <div className="w-2 h-2 md:w-4 md:h-4 rounded-full bg-white/20" />
            </div>
        </div>
    );
}

function ControlButton({ onClick, icon }) {
    return (
        <button onClick={onClick} className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-xl bg-[#1a1c29] text-slate-300 hover:text-white border-b-2 border-slate-800 active:border-b-0 active:translate-y-[2px] transition-all">
            {icon}
        </button>
    );
}