import { motion } from "framer-motion";
import { useLowPowerMode } from "../../../config/useLowPowerMode";

export function UndoButton({ handleUndo, disabled, className = "" }) {
    const isLowPower = useLowPowerMode();

    return (
        <motion.button
            // OPTIMIZATION: Disable motion props on low power
            whileTap={!disabled && !isLowPower ? { scale: 0.90 } : undefined}
            whileHover={!disabled && !isLowPower ? { scale: 1.05, boxShadow: "0 0 20px rgba(239,68,68,0.5)" } : undefined}

            onClick={handleUndo}
            disabled={disabled}
            className={`
                relative group flex items-center justify-center gap-2 overflow-hidden transition-all duration-300
                h-14 w-14 rounded-full md:w-auto md:h-11 md:px-6 md:rounded-xl border
                
                /* OPTIMIZATION: Swap backdrop-blur for solid bg on low power */
                ${isLowPower ? "bg-slate-900" : "backdrop-blur-md"}

                ${disabled
                    ? "bg-slate-900/40 border-slate-800 text-slate-600 cursor-not-allowed shadow-none"
                    : "bg-slate-950/60 border-red-500/30 text-red-400 cursor-pointer shadow-[0_0_15px_rgba(239,68,68,0.15)] hover:border-red-500 hover:text-red-300 hover:bg-red-950/30"
                }
                ${className}
            `}
        >
            {/* OPTIMIZATION: Only render sheen on high end */}
            {!disabled && !isLowPower && (
                <div className="absolute inset-0 bg-gradient-to-tr from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            )}

            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                className={`w-6 h-6 relative z-10 transition-all duration-300 ${!disabled && !isLowPower ? 'drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]' : ''}`}>
                <path d="M3 7v6h6" />
                <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
            </svg>

            <span className="hidden md:block relative z-10 font-bold tracking-wider text-sm">UNDO</span>
        </motion.button>
    );
}

export function RedoButton({ handleRedo, disabled, className = "" }) {
    const isLowPower = useLowPowerMode();

    return (
        <motion.button
            whileTap={!disabled && !isLowPower ? { scale: 0.90 } : undefined}
            whileHover={!disabled && !isLowPower ? { scale: 1.05, boxShadow: "0 0 20px rgba(234,179,8,0.5)" } : undefined}

            onClick={handleRedo}
            disabled={disabled}
            className={`
                relative group flex items-center justify-center overflow-hidden transition-all duration-300
                w-12 h-12 rounded-xl md:w-auto md:h-11 md:px-6 md:gap-2 md:rounded-xl border
                
                ${isLowPower ? "bg-slate-900" : "backdrop-blur-md"}

                ${disabled
                    ? "bg-slate-900/40 border-slate-800 text-slate-600 cursor-not-allowed shadow-none opacity-50"
                    : "bg-slate-950/60 border-yellow-500/30 text-yellow-400 cursor-pointer shadow-[0_0_15px_rgba(234,179,8,0.15)] hover:border-yellow-500 hover:text-yellow-300 hover:bg-yellow-950/30"
                }
                ${className}
            `}
        >
            {!disabled && !isLowPower && (
                <div className="absolute inset-0 bg-gradient-to-tl from-yellow-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            )}

            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                className={`w-5 h-5 md:w-5 md:h-5 relative z-10 transition-all duration-300 transform -scale-x-100 ${!disabled && !isLowPower ? 'drop-shadow-[0_0_8px_rgba(234,179,8,0.8)]' : ''}`}>
                <path d="M3 7v6h6" />
                <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
            </svg>

            <span className="hidden md:block relative z-10 font-bold tracking-wider text-sm">REDO</span>
        </motion.button>
    );
}