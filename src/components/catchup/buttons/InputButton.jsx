import React from 'react';
import { motion } from "framer-motion";
import { useLowPowerMode } from "../../../config/useLowPowerMode";

/* =====================================================
   NEON SELECT
===================================================== */
export function NeonSelect({ label, value, onChange, options, disabled }) {
    const isLowPower = useLowPowerMode();

    return (
        <div className="flex flex-col gap-2 w-full">
            <label className="text-xs font-bold text-cyan-400 uppercase tracking-widest pl-1">{label}</label>
            <div className="relative group">
                <select
                    value={value} onChange={onChange} disabled={disabled}
                    className={`
                        w-full appearance-none border text-cyan-100 font-bold text-sm rounded-xl px-4 py-3 transition-all duration-300 focus:outline-none
                        ${isLowPower
                            ? "bg-[#0f172a] border-cyan-900"
                            : "bg-slate-900/60 backdrop-blur-md border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.1)]"
                        }
                    `}
                >
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value} className="bg-slate-900 text-cyan-100">{opt.label}</option>
                    ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-cyan-500/70">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                        <path fillRule="evenodd" d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z" clipRule="evenodd" />
                    </svg>
                </div>
            </div>
        </div>
    );
}

/* =====================================================
   NEON NUMBER INPUT
===================================================== */
export function NeonInput({ label, value, onChange, min, max, disabled }) {
    const isLowPower = useLowPowerMode();
    return (
        <div className="flex flex-col gap-2 w-full">
            <label className="text-xs font-bold text-fuchsia-400 uppercase tracking-widest pl-1">{label}</label>
            <input
                type="number" min={min} max={max} value={value} onChange={onChange} disabled={disabled}
                className={`
                    w-full border text-fuchsia-100 font-bold text-sm rounded-xl px-4 py-3 transition-all duration-300 focus:outline-none text-center
                    ${isLowPower
                        ? "bg-[#0f172a] border-fuchsia-900"
                        : "bg-slate-900/60 backdrop-blur-md border-fuchsia-500/30 shadow-[0_0_10px_rgba(217,70,239,0.1)]"
                    }
                `}
            />
        </div>
    );
}

/* =====================================================
   NEON TEXT INPUT
===================================================== */
export function NeonTextInput({ label, value, onChange, placeholder, disabled, color = "cyan" }) {
    const isLowPower = useLowPowerMode();
    const borderColor = color === "cyan" ? "border-cyan-500/30" : "border-fuchsia-500/30";
    const focusColor = color === "cyan" ? "focus:border-cyan-400" : "focus:border-fuchsia-400";
    const textColor = color === "cyan" ? "text-cyan-100" : "text-fuchsia-100";
    const labelColor = color === "cyan" ? "text-cyan-400" : "text-fuchsia-400";
    const lowPowerBorder = color === "cyan" ? "border-cyan-900" : "border-fuchsia-900";

    return (
        <div className="flex flex-col gap-2 w-full">
            <label className={`text-xs font-bold uppercase tracking-widest pl-1 ${labelColor}`}>{label}</label>
            <input
                type="text"
                value={value}
                onChange={onChange}
                disabled={disabled}
                placeholder={placeholder}
                maxLength={12}
                className={`
                    w-full border font-bold text-sm rounded-xl px-4 py-3 transition-all duration-300 focus:outline-none ${textColor} ${focusColor}
                    ${isLowPower
                        ? `bg-[#0f172a] ${lowPowerBorder}`
                        : `bg-slate-900/60 backdrop-blur-md ${borderColor} shadow-sm`
                    }
                    disabled:opacity-50 disabled:cursor-not-allowed
                `}
            />
        </div>
    );
}

/* =====================================================
   GAME HEADER (Main Component)
===================================================== */
export default function GameHeader({
    gameStarted, mode, setMode, aiDepth, setAiDepth, ballCount, setBallCount, startGame,
    p1Name, setP1Name, p2Name, setP2Name
}) {
    const isLowPower = useLowPowerMode();
    const isHvH = mode === "hvh";

    return (
        <header className={`relative z-40 w-full max-w-6xl mx-auto mb-6 transition-all duration-500 ease-in-out ${gameStarted ? "opacity-50 pointer-events-none hidden md:flex scale-95 grayscale-[0.5]" : "flex opacity-100 scale-100"}`}>

            <div className={`
                w-full rounded-2xl p-4 md:p-6 flex flex-col gap-6
                ${isLowPower
                    ? "bg-[#020617] border border-slate-800 shadow-xl"
                    : "bg-slate-950/40 backdrop-blur-xl border border-white/10 shadow-2xl"
                }
            `}>
                {/* ROW 2: Game Settings */}
                <div className={`flex flex-col md:flex-row items-end gap-5 md:gap-6 ${isHvH ? "border-t border-white/5 pt-4" : ""}`}>

                    {/* Mode */}
                    <div className="w-full md:flex-1">
                        <NeonSelect
                            label="Game Mode"
                            value={mode}
                            disabled={gameStarted}
                            onChange={(e) => !gameStarted && setMode(e.target.value)}
                            options={[
                                { value: "hvbot", label: "You vs Bot" },
                                { value: "hvh", label: "Human vs Human" },
                                { value: "bvb", label: "Bot vs Bot" },
                            ]}
                        />
                    </div>
                    {/*Player Names (ONLY VISIBLE IN HvH MODE) */}
                    {isHvH && (
                        <div className="flex flex-col md:flex-row gap-5 animate-fadeIn">
                            <div className="flex-1">
                                <NeonTextInput
                                    label="Player 1 Name"
                                    value={p1Name}
                                    onChange={(e) => setP1Name(e.target.value)}
                                    disabled={gameStarted}
                                    color="cyan"
                                />
                            </div>
                            <div className="flex-1">
                                <NeonTextInput
                                    label="Player 2 Name"
                                    value={p2Name}
                                    onChange={(e) => setP2Name(e.target.value)}
                                    disabled={gameStarted}
                                    placeholder="Enter Name"
                                    color="fuchsia"
                                />
                            </div>
                        </div>
                    )}
                    {/* Difficulty (Hide in HvH to declutter) */}
                    {!isHvH && (
                        <div className="w-full md:flex-1">
                            <NeonSelect
                                label="Difficulty"
                                value={aiDepth === 4 ? "dynamic" : aiDepth}
                                disabled={gameStarted}
                                onChange={(e) => !gameStarted && setAiDepth(e.target.value === "dynamic" ? 4 : Number(e.target.value))}
                                options={[
                                    { value: 2, label: "Easy" },
                                    { value: 3, label: "Medium" },
                                    { value: "dynamic", label: "Dynamic AI" },
                                ]}
                            />
                        </div>
                    )}

                    {/* Ball Count */}
                    <div className="w-full md:w-32 md:flex-none">
                        <NeonInput
                            label="Balls"
                            value={ballCount}
                            min={3} max={25}
                            disabled={gameStarted}
                            onChange={(e) => !gameStarted && setBallCount(Number(e.target.value))}
                        />
                    </div>

                    {/* Start Button */}
                    <div className="w-full md:flex-[1.5]">
                        {isLowPower ? (
                            <button onClick={() => startGame(p1Name, p2Name)} disabled={gameStarted}
                                className={`w-full h-[48px] rounded-xl flex items-center justify-center gap-2 text-white font-black text-lg tracking-wider uppercase italic ${gameStarted ? "bg-slate-800 text-slate-500" : "bg-cyan-600 active:bg-cyan-700"}`}>
                                START GAME
                            </button>
                        ) : (
                            <motion.button whileTap={!gameStarted ? { scale: 0.96 } : {}} onClick={() => startGame(p1Name, p2Name)} disabled={gameStarted}
                                className={`w-full h-[48px] rounded-xl flex items-center justify-center gap-2 text-white font-black text-lg tracking-wider uppercase italic transition-all ${gameStarted ? "bg-slate-800 border border-white/5 cursor-not-allowed text-slate-500" : "bg-gradient-to-r from-green-500 to-emerald-600 border border-white/20 shadow-[0_0_20px_rgba(34,197,94,0.4)]"}`}>
                                {!gameStarted && <span className="animate-pulse">▶</span>} START GAME
                            </motion.button>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}