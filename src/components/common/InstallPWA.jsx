import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLowPowerMode } from "../../config/useLowPowerMode";

export default function InstallPWA({ installPrompt, handleInstall }) {
    const isLowPower = useLowPowerMode();

    if (!installPrompt) return null;

    // --- LITE MODE (Simple HTML, No Animation) ---
    if (isLowPower) {
        return (
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-sm">
                <button
                    onClick={handleInstall}
                    className="w-full flex items-center justify-center gap-3 py-4 rounded-xl font-bold uppercase tracking-wider shadow-xl bg-cyan-600 text-white border border-cyan-400 active:bg-cyan-700 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 animate-bounce">
                        <path fillRule="evenodd" d="M12 2.25a.75.75 0 01.75.75v11.69l3.22-3.22a.75.75 0 111.06 1.06l-4.5 4.5a.75.75 0 01-1.06 0l-4.5-4.5a.75.75 0 111.06-1.06l3.22 3.22V3a.75.75 0 01.75-.75zm-9 13.5a.75.75 0 01.75.75v2.25a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5V16.5a.75.75 0 011.5 0v2.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V16.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
                    </svg>
                    Install App
                </button>
            </div>
        );
    }

    // --- PRO MODE (Glassmorphism + Animation) ---
    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-sm"
            >
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.02 }}
                    onClick={handleInstall}
                    className="
                        group relative w-full flex items-center justify-center gap-3 py-4 rounded-2xl
                        bg-slate-950/80 backdrop-blur-xl border border-cyan-500/50 
                        text-cyan-400 font-bold text-lg uppercase tracking-wider
                        shadow-[0_0_30px_rgba(6,182,212,0.3)]
                        overflow-hidden
                    "
                >
                    {/* Shimmer Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />

                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 animate-bounce">
                        <path fillRule="evenodd" d="M12 2.25a.75.75 0 01.75.75v11.69l3.22-3.22a.75.75 0 111.06 1.06l-4.5 4.5a.75.75 0 01-1.06 0l-4.5-4.5a.75.75 0 111.06-1.06l3.22 3.22V3a.75.75 0 01.75-.75zm-9 13.5a.75.75 0 01.75.75v2.25a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5V16.5a.75.75 0 011.5 0v2.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V16.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
                    </svg>
                    <span>Install App</span>
                </motion.button>
            </motion.div>
        </AnimatePresence>
    );
}