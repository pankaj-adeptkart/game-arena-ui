import React, { useCallback } from "react"; // Added useCallback
import { motion, AnimatePresence } from "framer-motion";
import { useLowPowerMode } from "../../../config/useLowPowerMode";

/* =====================================================
   SUB-COMPONENT: NEON BALL (MEMOIZED)
===================================================== */
const NeonBall = React.memo(({ num, isSelected, isP1Turn, onClick, isLowPower }) => {
    const baseStyle = "relative flex items-center justify-center rounded-full transition-all duration-300 w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 font-black text-sm md:text-lg select-none touch-manipulation z-10";

    // --- LITE MODE (CSS Only) ---
    if (isLowPower) {
        // ... (Keep your existing lite mode logic here if you want, or copy from previous)
        const activeClass = isSelected
            ? (isP1Turn ? "bg-cyan-600 text-white" : "bg-fuchsia-600 text-white")
            : "bg-slate-800 text-slate-500";
        return <button onClick={onClick} className={`${baseStyle} ${activeClass}`}>{num}</button>;
    }

    // --- PRO MODE (3D Glass Orb) ---
    // 1. Define the "Glass" look
    const glassStyle = isSelected
        ? (isP1Turn
            // Cyan Glow: Inset shadow gives depth, outer shadow gives glow
            ? "bg-cyan-500/20 text-cyan-50 border border-cyan-400/50 shadow-[inset_0_0_12px_rgba(34,211,238,0.6),0_0_15px_rgba(34,211,238,0.4)]"
            // Fuchsia Glow
            : "bg-fuchsia-500/20 text-fuchsia-50 border border-fuchsia-400/50 shadow-[inset_0_0_12px_rgba(232,121,249,0.6),0_0_15px_rgba(232,121,249,0.4)]")
        // Inactive: Dark glass
        : "bg-slate-900/40 text-slate-500 border border-white/5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] hover:bg-white/5 hover:border-white/20 hover:text-slate-300";

    return (
        <motion.button
            layout
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.15, zIndex: 50 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClick}
            className={`${baseStyle} backdrop-blur-md ${glassStyle}`}
        >
            {/* Inner reflection highlight for extra 3D pop */}
            <div className="absolute top-1 left-1/2 -translate-x-1/2 w-1/2 h-[2px] bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-full opacity-50" />

            <span className="relative z-10 drop-shadow-md">{num}</span>
        </motion.button>
    );
}, (prev, next) => {
    return prev.isSelected === next.isSelected && prev.isP1Turn === next.isP1Turn && prev.isLowPower === next.isLowPower;
});

/* =====================================================
   MAIN COMPONENT
===================================================== */
export default function GameGrid({ status, isP1Turn, available, selected, botPreview = [], handleBallClick }) {
    const isLowPower = useLowPowerMode();

    return (
        <div className="w-full max-w-2xl mx-auto relative z-10 flex flex-col items-center">

            {/* STATUS PILL - Compact */}
            <div className={`flex justify-center mb-2 px-3 py-1 rounded-full border border-white/10 bg-black/40 backdrop-blur-md flex items-center gap-2 transition-colors duration-300`}>
                <div className={`w-1.5 h-1.5 rounded-full ${isP1Turn ? 'bg-cyan-400 shadow-[0_0_8px_#22d3ee]' : 'bg-fuchsia-400 shadow-[0_0_8px_#e879f9]'}`} />
                <span className="font-bold tracking-[0.2em] uppercase text-[9px] md:text-xs text-slate-300">{status}</span>
            </div>

            <div
                style={{ contain: 'content' }}
                className={`
                    relative w-full flex flex-wrap justify-center gap-2 min-h-fit items-center content-center
                    /* MOBILE: Transparent, No Padding, No Border */
                    p-1 bg-transparent border-none shadow-none
                    /* DESKTOP: Glass Container */
                    md:p-6 md:rounded-3xl md:gap-3 
                    ${!isLowPower && "md:bg-slate-950/40 md:backdrop-blur-xl md:border md:border-white/10 md:shadow-2xl"}
                `}
            >
                <AnimatePresence mode="popLayout">
                    {available.map((num) => (
                        <NeonBall
                            key={num}
                            num={num}
                            isLowPower={isLowPower}
                            isSelected={selected.includes(num) || botPreview.includes(num)}
                            isP1Turn={isP1Turn}
                            onClick={() => handleBallClick(num)}
                        />
                    ))}
                </AnimatePresence>

                {available.length === 0 && (
                    <div className="relative flex flex-col items-center justify-center py-6 px-4 group scale-90 md:scale-100">
                        {/* 1. Compact Glowing Aura (Mobile Optimized) */}
                        <div className="absolute w-40 h-20 bg-cyan-500/15 blur-[60px] rounded-full pointer-events-none" />

                        {/* 2. Cute Glass Capsule Container */}
                        <div className="relative z-10 p-[1.5px] rounded-full bg-gradient-to-r from-cyan-400 via-white/40 to-fuchsia-500 shadow-lg">
                            <div className="relative bg-black/70 backdrop-blur-xl px-8 py-3 rounded-full flex flex-col items-center border border-white/10">

                                {/* 3. Stunning Compact Typography */}
                                <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-wider
                           bg-clip-text text-transparent bg-gradient-to-b from-white via-cyan-100 to-cyan-400
                           drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">
                                    {status}
                                </h2>

                                {/* 4. Cute Micro-Detail */}
                                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.5)]">
                                    <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                    <span className="text-[8px] font-black text-black tracking-[0.2em] leading-none uppercase">
                                        Victory Achievement
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* 5. Minimalist HUD Brackets (Compact) */}
                        <div className="absolute top-2 left-1/2 -translate-x-16 w-3 h-3 border-t-2 border-l-2 border-cyan-400/40 rounded-tl" />
                        <div className="absolute bottom-2 right-1/2 translate-x-16 w-3 h-3 border-b-2 border-r-2 border-fuchsia-500/40 rounded-br" />
                    </div>


                )}
            </div>
        </div>
    );
}