import React, { useCallback } from "react"; // Added useCallback
import { motion, AnimatePresence } from "framer-motion";
import { useLowPowerMode } from "../../../config/useLowPowerMode";

/* =====================================================
   SUB-COMPONENT: NEON BALL (MEMOIZED)
===================================================== */
// React.memo prevents the 20+ other balls from re-rendering when you click just one.
const NeonBall = React.memo(({ num, isSelected, isP1Turn, onClick, isLowPower }) => {
    const baseStyle = "relative flex items-center justify-center rounded-full transition-all duration-200 w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 font-bold text-sm md:text-lg select-none touch-manipulation";

    // --- LITE MODE (CSS Only) ---
    if (isLowPower) {
        const activeClass = isSelected
            ? (isP1Turn ? "bg-cyan-900 border-2 border-cyan-400 text-cyan-100" : "bg-fuchsia-900 border-2 border-fuchsia-400 text-fuchsia-100")
            : "bg-slate-800 border border-slate-700 text-slate-500 active:bg-slate-700 active:scale-95";

        return (
            <button onClick={onClick} id={`ball-${num}`} className={` ${baseStyle} ${activeClass}`}>
                {num}
            </button>
        );
    }

    // --- HIGH END MODE (Framer Motion) ---
    return (
        <motion.button
            layout
            initial={{ scale: 0, opacity: 0 }}
            animate={{
                scale: 1, opacity: 1,
                boxShadow: isSelected
                    ? isP1Turn
                        ? ["0 0 0px rgba(34,211,238,0)", "0 0 15px rgba(34,211,238,0.6)", "0 0 0px rgba(34,211,238,0)"]
                        : ["0 0 0px rgba(232,121,249,0)", "0 0 15px rgba(232,121,249,0.6)", "0 0 0px rgba(232,121,249,0)"]
                    : "0 0 0px rgba(0,0,0,0)"
            }}
            transition={{ scale: { duration: 0.2 }, boxShadow: { duration: 2, repeat: Infinity } }}
            whileHover={{ scale: 1.1, zIndex: 20 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClick}
            id={`ball-${num}`}
            className={`${baseStyle} backdrop-blur-sm border ${isSelected ? (isP1Turn ? "bg-cyan-500/20 border-cyan-400 text-cyan-50" : "bg-fuchsia-500/20 border-fuchsia-400 text-fuchsia-50") : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10"}`}
        >
            <span className={`z-10 ${isSelected ? "drop-shadow-[0_0_5px_currentColor]" : ""}`}>{num}</span>
        </motion.button>
    );
}, (prev, next) => {
    // Only re-render if selection state or power mode changes
    return prev.isSelected === next.isSelected &&
        prev.isP1Turn === next.isP1Turn &&
        prev.isLowPower === next.isLowPower;
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
                    <div className="text-center py-10 opacity-50">
                        <div className="text-4xl font-black text-white/20">EMPTY</div>
                    </div>
                )}
            </div>
        </div>
    );
}