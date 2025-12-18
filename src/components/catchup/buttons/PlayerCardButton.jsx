import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import { useLowPowerMode } from "../../../config/useLowPowerMode";

export default function PlayerCard({ avatar, name = "PLAYER", wins = 0, score = 0, active = false, className = "" }) {
    const isLowPower = useLowPowerMode();

    // --- SHARED INNER CONTENT ---
    const cardContent = (
        <div className="relative z-10 w-full flex items-center gap-3 px-3 py-2 lg:flex-col lg:justify-center lg:p-0">

            {/* AVATAR CONTAINER - STRICT FIX 
               1. 'overflow-hidden': Cuts off the full-screen canvas.
               2. 'transform-gpu': Creates a new stacking context.
               3. 'flex-none': Prevents shrinking.
            */}
            <div className={`
                relative flex-none w-14 h-14 lg:w-24 lg:h-24
                rounded-full flex items-center justify-center 
                overflow-hidden transform-gpu
                ${active ? "bg-cyan-950/80 ring-2 ring-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.4)]" : "bg-slate-900/80 ring-1 ring-white/10"}
            `}>
                {/* Canvas Wrapper: Forces the child to fit exactly 100% of this circle */}
                <div className="absolute inset-0 w-full h-full flex items-center justify-center">
                    {avatar}
                </div>
            </div>

            {/* INFO: Name & Wins */}
            <div className="flex-1 min-w-0 flex flex-col justify-center lg:items-center">
                <span className="text-white font-black uppercase tracking-wider text-sm lg:text-xl leading-tight truncate w-full drop-shadow-md">
                    {name}
                </span>
                <div className="flex items-center gap-2 mt-1 opacity-90">
                    <span className="text-[10px] lg:text-xs font-bold text-cyan-400 uppercase tracking-wider">WINS</span>
                    <span className="bg-cyan-500/10 px-1.5 py-0.5 rounded text-[10px] lg:text-xs font-mono text-cyan-200 border border-cyan-500/20">
                        {wins}
                    </span>
                </div>
            </div>

            {/* RIGHT: Score */}
            <div className="flex-none text-right lg:text-center flex flex-col items-end lg:items-center justify-center lg:mt-auto">
                <div className="text-[9px] lg:text-xs font-bold text-slate-400 uppercase tracking-widest hidden lg:block mb-2">Score</div>
                <div className={`font-black leading-none text-3xl lg:text-7xl drop-shadow-xl ${active ? "text-cyan-400 scale-110" : "text-white/80"} transition-all duration-300`}>
                    {score}
                </div>
            </div>
        </div>
    );

    // --- LITE MODE ---
    if (isLowPower) {
        return (
            <div className={`w-full transition-colors ${className} bg-slate-900/50 border border-white/5 rounded-xl lg:bg-slate-900 lg:border-2 lg:rounded-[2rem] lg:p-6 ${active ? "lg:border-cyan-500" : "lg:border-slate-800"}`}>
                {cardContent}
            </div>
        );
    }

    // --- PRO MODE ---
    return (
        <Tilt className={`w-full lg:w-auto lg:h-full ${className}`} options={{ max: 10, scale: 1.02, glare: true, "max-glare": 0.2, disabled: window.innerWidth < 1024 }}>
            <motion.div
                animate={window.innerWidth >= 1024 && active ? { borderColor: "rgba(34, 211, 238, 0.6)", boxShadow: "0 0 30px rgba(34,211,238,0.2)" } : { borderColor: "rgba(255, 255, 255, 0.05)", boxShadow: "none" }}
                className={`
                    relative w-full lg:h-full flex flex-col justify-center
                    bg-[#0a0a0f]/80 backdrop-blur-md border border-white/10 rounded-xl shadow-lg
                    lg:bg-slate-950/60 lg:backdrop-blur-xl lg:border-2 lg:rounded-[2rem] lg:p-6
                `}
            >
                <div className="hidden lg:block absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/40 pointer-events-none" />
                {cardContent}
            </motion.div>
        </Tilt>
    );
}