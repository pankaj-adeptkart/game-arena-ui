import React, { useCallback } from "react"; // Added useCallback
import { motion, AnimatePresence } from "framer-motion";
import { useLowPowerMode } from "../../../config/useLowPowerMode";

/* =====================================================
   SUB-COMPONENT: NEON BALL (MEMOIZED)
===================================================== */
// React.memo prevents the 20+ other balls from re-rendering when you click just one.
const NeonBall = React.memo(({ num, isSelected, isP1Turn, onClick, isLowPower }) => {
    const baseStyle = "relative flex items-center justify-center rounded-full transition-all duration-200 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 font-bold text-sm md:text-lg select-none touch-manipulation";

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

    // STATUS HUD
    const StatusHUD = () => (
        <div className={`flex justify-center mb-3 px-4 py-1.5 rounded-full border flex items-center gap-2 transition-colors duration-300
            ${isP1Turn ? "bg-cyan-950 border-cyan-500/50 text-cyan-100" : "bg-fuchsia-950 border-fuchsia-500/50 text-fuchsia-100"}`}>
            <div className={`w-2 h-2 rounded-full ${isP1Turn ? 'bg-cyan-400' : 'bg-fuchsia-400'} ${!isLowPower && 'animate-pulse'}`} />
            <span className="font-bold tracking-widest uppercase text-[10px] md:text-xs">{status}</span>
        </div>
    );

    return (
        <div className="w-full max-w-2xl mx-auto my-2 relative z-10 flex flex-col items-center">
            <StatusHUD />

            <div
                // OPTIMIZATION: 'contain: content' prevents layout shifts affecting the rest of the page
                style={{ contain: 'content' }}
                className={`
                    relative w-full rounded-3xl p-4 md:p-6 flex flex-wrap justify-center gap-2 md:gap-3 min-h-fit items-center content-center
                    ${isLowPower
                        ? "bg-[#020617] border border-slate-800 shadow-xl" // Dark OLED look (Fast)
                        : "bg-slate-950/40 backdrop-blur-xl border transition-colors duration-500" // Glass look (Heavy)
                    }
                `}
            >
                {/* Static Grid for Low Power */}
                {isLowPower ? (
                    available.map((num) => (
                        <NeonBall
                            key={num}
                            num={num}
                            isLowPower={true}
                            isSelected={selected.includes(num) || botPreview.includes(num)}
                            isP1Turn={isP1Turn}
                            onClick={() => handleBallClick(num)}
                        />
                    ))
                ) : (
                    <AnimatePresence mode="popLayout">
                        {available.map((num) => (
                            <NeonBall
                                key={num}
                                num={num}
                                isLowPower={false}
                                isSelected={selected.includes(num) || botPreview.includes(num)}
                                isP1Turn={isP1Turn}
                                onClick={() => handleBallClick(num)}
                            />
                        ))}
                    </AnimatePresence>
                )}

                {available.length === 0 && (
                    <div className="text-center py-4 opacity-50"><div className="text-2xl font-black">00</div><div className="text-[10px]">CLEAR</div></div>
                )}
            </div>
        </div>
    );
}