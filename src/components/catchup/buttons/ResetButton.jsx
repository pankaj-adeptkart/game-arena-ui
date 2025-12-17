import { motion } from "framer-motion";
import { useLowPowerMode } from "../../../config/useLowPowerMode";

export default function ResetButton({ resetGameSession, setShowSettings, setStatus, sfx, className = "" }) {
    const isLowPower = useLowPowerMode();

    return (
        <motion.button
            // OPTIMIZATION: Conditional animation props
            whileTap={!isLowPower ? { scale: 0.95 } : undefined}
            whileHover={!isLowPower ? { scale: 1.02, boxShadow: "0 0 25px rgba(244,63,94,0.5)" } : undefined}

            onClick={() => {
                resetGameSession(false, true);
                setShowSettings(true);
                sfx?.bg?.stop();
                setStatus("SESSION RESET");
            }}
            className={`
                group relative flex items-center justify-center gap-3 overflow-hidden
                w-full h-14 rounded-full md:w-auto md:h-11 md:rounded-xl md:px-8
                
                ${isLowPower ? "bg-slate-900" : "bg-slate-950/60 backdrop-blur-md"}
                
                border border-rose-500/30 text-rose-400 font-bold uppercase tracking-wider text-base md:text-sm
                shadow-[0_0_15px_rgba(244,63,94,0.1)] transition-all duration-300
                hover:bg-rose-950/40 hover:border-rose-500/80 hover:text-rose-300
                ${className}
            `}
        >
            {!isLowPower && (
                <div className="absolute inset-0 bg-gradient-to-r from-rose-500/20 via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none" />
            )}

            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                className={`w-5 h-5 relative z-10 ${!isLowPower ? 'drop-shadow-[0_0_8px_rgba(244,63,94,0.8)]' : ''}`}>
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
            </svg>

            <span className="relative z-10 drop-shadow-sm">RESET</span>
        </motion.button>
    );
}