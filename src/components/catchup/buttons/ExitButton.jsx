import { motion } from "framer-motion";
import { useLowPowerMode } from "../../../config/useLowPowerMode";

export default function ExitButton({ resetGameSession, setShowSettings, setStatus, sfx, className = "" }) {
    const isLowPower = useLowPowerMode();

    return (
        <motion.button
            whileTap={!isLowPower ? { scale: 0.95 } : undefined}
            whileHover={!isLowPower ? { scale: 1.05, boxShadow: "0 0 25px rgba(220,38,38,0.5)" } : undefined}

            onClick={() => {
                resetGameSession(false, true);
                setShowSettings(true);
                sfx?.bg?.stop();
                setStatus("STOPPED");
            }}
            className={`
                group relative flex items-center justify-center overflow-hidden transition-all duration-300
                w-12 h-12 rounded-xl md:w-auto md:h-11 md:rounded-xl md:px-6 md:gap-2

                ${isLowPower ? "bg-slate-900" : "bg-slate-950/70 backdrop-blur-md"}
                
                border border-red-600/30 text-red-500 font-bold uppercase tracking-wider text-sm
                shadow-[0_0_15px_rgba(220,38,38,0.15)]
                hover:bg-red-950/60 hover:border-red-500 hover:text-red-400
                ${className}
            `}
        >
            {!isLowPower && (
                <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none" />
            )}

            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                className={`w-5 h-5 relative z-10 ${!isLowPower ? 'drop-shadow-[0_0_8px_rgba(220,38,38,0.6)]' : ''}`}>
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
            </svg>

            <span className="hidden md:block relative z-10 drop-shadow-sm">EXIT</span>
        </motion.button>
    );
}