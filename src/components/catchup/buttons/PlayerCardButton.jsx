import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import { useLowPowerMode } from "../../../config/useLowPowerMode";

export default function PlayerCard({ avatar, name = "PLAYER", wins = 0, score = 0, active = false, className = "" }) {
    const isLowPower = useLowPowerMode();

    // --- SHARED INNER CONTENT ---
    const cardContent = (
        <div className="relative z-10 w-full grid grid-cols-[auto_1fr_auto] items-center gap-4 lg:flex lg:flex-col lg:gap-6">
            <div className="flex items-center gap-3 lg:flex-col lg:gap-4">
                {/* Avatar Container - Keeps size stable */}
                <div className={`relative w-14 h-14 lg:w-24 lg:h-24 rounded-full flex items-center justify-center shadow-inner overflow-hidden
                    ${active ? "bg-cyan-950/50 border border-cyan-500" : "bg-slate-900 border border-white/5"}`}>
                    <div className="w-full h-full flex items-center justify-center">
                        {avatar}
                    </div>
                </div>

                {/* Text Info */}
                <div className="flex flex-col lg:items-center">
                    <span className="text-white font-black uppercase tracking-wider text-sm lg:text-xl leading-tight">{name}</span>
                    <div className="flex items-center gap-1.5 mt-1 opacity-80">
                        <span className="text-[10px] lg:text-xs font-bold text-slate-400 uppercase">Wins</span>
                        <span className="bg-white/10 px-1.5 rounded text-[10px] lg:text-xs font-mono text-cyan-300 border border-white/5">{wins}</span>
                    </div>
                </div>
            </div>

            {/* Score */}
            <div className="text-right lg:text-center lg:mt-auto">
                <div className="text-[10px] lg:text-xs font-bold text-slate-500 uppercase tracking-widest mb-0 lg:mb-2">Total Score</div>
                <div className={`font-black leading-none text-4xl lg:text-7xl ${active ? "text-cyan-400" : "text-slate-200"}`}>{score}</div>
            </div>
        </div>
    );

    // --- LITE MODE (No Tilt, No Motion Loop) ---
    if (isLowPower) {
        return (
            <div className={`relative overflow-hidden w-full h-full bg-slate-900 border-2 rounded-[2rem] p-4 lg:p-6 flex flex-col justify-center
                ${active ? "border-cyan-500 shadow-md" : "border-slate-800"} ${className}`}>
                {cardContent}
            </div>
        );
    }

    // --- HIGH END MODE ---
    return (
        <Tilt className={`w-full lg:w-auto h-full ${className}`} options={{ max: 10, scale: 1.02, glare: true, "max-glare": 0.2 }}>
            <motion.div
                animate={active ? { borderColor: "rgba(34, 211, 238, 0.6)", boxShadow: ["0 0 0px rgba(34,211,238,0)", "0 0 30px rgba(34,211,238,0.4)", "0 0 0px rgba(34,211,238,0)"] } : { borderColor: "rgba(255, 255, 255, 0.1)", boxShadow: "0 0 0px rgba(0,0,0,0)" }}
                transition={{ duration: 2, repeat: Infinity }}
                className="relative overflow-hidden w-full h-full bg-slate-950/60 backdrop-blur-xl border-2 rounded-[2rem] p-4 lg:p-6 flex flex-col justify-center"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/40 pointer-events-none" />
                {cardContent}
            </motion.div>
        </Tilt>
    );
}