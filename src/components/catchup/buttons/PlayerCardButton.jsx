import React, { useRef } from "react";
import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import { useLowPowerMode } from "../../../config/useLowPowerMode";

export default function PlayerCard({
    avatar,
    name = "PLAYER",
    wins = 0,
    score = 0,
    active = false,
    isP1Turn,
    className = ""
}) {
    const isLowPower = useLowPowerMode();
    const cardRef = useRef(null);

    // 1. DYNAMIC COLOR LOGIC
    const color = isP1Turn ? "cyan" : "fuchsia";
    const shadowColor = isP1Turn ? "34,211,238" : "232,121,249";

    // 2. SPOTLIGHT MOUSE TRACKER
    const handleMouseMove = (e) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        cardRef.current.style.setProperty("--mouse-x", `${x}px`);
        cardRef.current.style.setProperty("--mouse-y", `${y}px`);
    };

    // --- INNER CONTENT ---
    const cardContent = (
        <div className="relative z-20 w-full flex items-center gap-3 px-3 py-2 lg:flex-col lg:justify-center lg:p-0">
            {/* AVATAR: Added deep glow + inset shadow */}
            <div className={`
                relative flex-none w-14 h-14 lg:w-24 lg:h-24
                rounded-full flex items-center justify-center 
                overflow-hidden transform-gpu transition-all duration-500
                ${active
                    ? `bg-${color}-950/50 ring-2 ring-${color}-400 shadow-[0_0_20px_rgba(${shadowColor},0.5),inset_0_0_10px_rgba(${shadowColor},0.2)] scale-105`
                    : "bg-slate-900/80 ring-1 ring-white/10 grayscale opacity-80"}
            `}>
                <div className="absolute inset-0 w-full h-full flex items-center justify-center">
                    {avatar}
                </div>
            </div>

            {/* INFO */}
            <div className="flex-1 min-w-0 flex flex-col justify-center lg:items-center">
                <span className={`font-black uppercase tracking-wider text-sm lg:text-xl leading-tight truncate w-full drop-shadow-md transition-colors ${active ? "text-white" : "text-slate-400"}`}>
                    {name}
                </span>
                <div className="flex items-center gap-2 mt-1 opacity-90">
                    <span className={`text-[10px] lg:text-xs font-bold text-${color}-400 uppercase tracking-wider`}>WINS</span>
                    <span className={`bg-${color}-500/10 px-1.5 py-0.5 rounded text-[10px] lg:text-xs font-mono text-${color}-200 border border-${color}-500/20`}>
                        {wins}
                    </span>
                </div>
            </div>

            {/* SCORE */}
            <div className="flex-none text-right lg:text-center flex flex-col items-end lg:items-center justify-center lg:mt-auto">
                <div className="text-[9px] lg:text-xs font-bold text-slate-500 uppercase tracking-widest hidden lg:block mb-2">Score</div>
                <div className={`font-black leading-none text-3xl lg:text-7xl drop-shadow-2xl transition-all duration-500 ${active ? `text-${color}-400 scale-110` : "text-slate-600 scale-90"}`}>
                    {score}
                </div>
            </div>
        </div>
    );

    // --- CONTAINER & EFFECTS ---
    // If active, we show the spinning border. If inactive, we just show the glass background.

    // Rotating Border Background (Only visible when active)
    const rotatingBorder = active && !isLowPower && (
        <div className="absolute -inset-[2px] rounded-xl lg:rounded-[2rem] overflow-hidden z-0">
            <div className={`absolute inset-[-50%] animate-[spin_4s_linear_infinite] ${isP1Turn ? 'bg-[conic-gradient(from_90deg_at_50%_50%,#0000_50%,#22d3ee_100%)]' : 'bg-[conic-gradient(from_90deg_at_50%_50%,#0000_50%,#e879f9_100%)]'}`} />
        </div>
    );

    const containerClasses = `
        group relative w-full lg:h-full flex flex-col justify-center
        backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl transition-all duration-500
        lg:rounded-[2rem] lg:p-6 overflow-hidden
        ${active ? "bg-slate-900/80" : "bg-slate-950/40"}
        ${className}
    `;

    // --- RENDER ---
    if (isLowPower) {
        return <div className={`${containerClasses} border-${color}-500/50`}>{cardContent}</div>;
    }

    return (
        <Tilt className={`w-full lg:w-auto lg:h-full`} options={{ max: 5, scale: 1.02, glare: true, "max-glare": 0.1, disabled: window.innerWidth < 1024 }}>
            <motion.div
                ref={cardRef}
                onMouseMove={handleMouseMove}
                layout
                className={containerClasses}
            >
                {/* 1. ROTATING BORDER (Active Only) */}
                {rotatingBorder}

                {/* 2. INNER MASK (Hides the center of the rotating border) */}
                <div className="absolute inset-[1px] bg-[#0a0a0f]/90 rounded-xl lg:rounded-[calc(2rem-1px)] z-10" />

                {/* 3. SPOTLIGHT EFFECT (Mouse Hover) */}
                <div
                    className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100 z-20 mix-blend-overlay"
                    style={{ background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(255,255,255,0.15), transparent 40%)` }}
                />

                {cardContent}
            </motion.div>
        </Tilt>
    );
}