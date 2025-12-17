import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RedoButton } from "./buttons/UndoButton"; // Ensure path is correct
import ExitButton from "./buttons/ExitButton";     // Ensure path is correct
import { useLowPowerMode } from "../../config/useLowPowerMode";

/* =====================================================
   SHARED ANIMATION VARIANTS (For High End Mode)
===================================================== */
const tapVariant = { scale: 0.92 };
const hoverVariant = { scale: 1.02, filter: "brightness(1.1)" };
const springTransition = { type: "spring", stiffness: 400, damping: 17 };

/* =====================================================
   ATOMIC BUTTONS (Optimized)
===================================================== */

function UndoButton({ handleUndo, disabled }) {
    const isLowPower = useLowPowerMode();
    const baseClass = "relative h-12 w-12 rounded-xl flex items-center justify-center border transition-all duration-200";

    if (isLowPower) {
        const liteClass = "bg-[#1e293b] border-slate-700 text-slate-400 active:bg-slate-800";
        const disabledClass = "bg-[#0f172a] border-slate-800 text-slate-700 cursor-not-allowed";
        return (
            <button onClick={handleUndo} disabled={disabled} className={`${baseClass} ${disabled ? disabledClass : liteClass}`}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path fillRule="evenodd" d="M9.53 2.47a.75.75 0 010 1.06L4.81 8.25H15a6.75 6.75 0 010 13.5h-3a.75.75 0 010-1.5h3a5.25 5.25 0 100-10.5H4.81l4.72 4.72a.75.75 0 11-1.06 1.06l-6-6a.75.75 0 010-1.06l6-6a.75.75 0 011.06 0z" clipRule="evenodd" /></svg>
            </button>
        );
    }

    return (
        <motion.button
            whileTap={disabled ? {} : tapVariant}
            whileHover={disabled ? {} : hoverVariant}
            transition={springTransition}
            onClick={handleUndo}
            disabled={disabled}
            className={`${baseClass} ${disabled ? "bg-slate-900/50 border-slate-800 text-slate-600 cursor-not-allowed" : "bg-slate-900/80 border-red-500/50 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.4)] hover:shadow-[0_0_20px_rgba(239,68,68,0.6)]"}`}
        >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path fillRule="evenodd" d="M9.53 2.47a.75.75 0 010 1.06L4.81 8.25H15a6.75 6.75 0 010 13.5h-3a.75.75 0 010-1.5h3a5.25 5.25 0 100-10.5H4.81l4.72 4.72a.75.75 0 11-1.06 1.06l-6-6a.75.75 0 010-1.06l6-6a.75.75 0 011.06 0z" clipRule="evenodd" /></svg>
        </motion.button>
    );
}

function PickButton({ selected, confirmMove }) {
    const isLowPower = useLowPowerMode();
    const disabled = selected.length === 0;
    const totalValue = selected.reduce((a, b) => a + b, 0);

    if (isLowPower) {
        return (
            <button
                onClick={confirmMove}
                disabled={disabled}
                className={`flex-1 h-14 rounded-2xl flex items-center justify-center gap-2 font-black text-lg tracking-wider uppercase italic transition-colors duration-200 border
                ${disabled
                        ? "bg-[#0f172a] text-slate-700 border-slate-800 cursor-not-allowed"
                        : "bg-cyan-600 text-white border-cyan-500 active:bg-cyan-700"}`}
            >
                <span>{disabled ? "SELECT" : "PLAY"}</span>
                {!disabled && <span className="bg-black/20 px-2 py-0.5 rounded text-sm font-bold border border-white/10">+{totalValue}</span>}
            </button>
        );
    }

    return (
        <motion.button
            animate={!disabled ? { scale: 1, boxShadow: ["0 0 20px rgba(6,182,212,0.4)", "0 0 40px rgba(6,182,212,0.6)", "0 0 20px rgba(6,182,212,0.4)"] } : { scale: 0.95, boxShadow: "none" }}
            transition={{ duration: 2, repeat: Infinity }}
            whileTap={!disabled ? { scale: 0.9 } : {}}
            onClick={confirmMove}
            disabled={disabled}
            className={`relative overflow-hidden flex-1 h-14 rounded-2xl flex items-center justify-center gap-2 transition-all duration-300
            ${disabled ? "bg-slate-800/50 border border-white/5 text-slate-500 cursor-not-allowed" : "bg-gradient-to-r from-cyan-500 to-blue-600 border border-cyan-400/50 text-white shadow-lg"}`}
        >
            {!disabled && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />}
            <span className="font-black text-lg tracking-wider uppercase italic">{disabled ? "SELECT" : "PLAY"}</span>
            {!disabled && <span className="bg-white/20 px-2 py-0.5 rounded text-sm font-bold border border-white/10">+{totalValue}</span>}
        </motion.button>
    );
}

function TurboButton({ turbo, setTurbo }) {
    const isLowPower = useLowPowerMode();

    if (isLowPower) {
        return (
            <button
                onClick={() => setTurbo((t) => !t)}
                className={`h-12 w-12 rounded-xl text-2xl flex items-center justify-center border transition-colors duration-200
                ${turbo ? "bg-yellow-400 text-black border-yellow-500" : "bg-[#1e293b] text-slate-400 border-slate-700 active:bg-slate-800"}`}
            >
                ⚡
            </button>
        );
    }

    return (
        <motion.button
            whileTap={tapVariant}
            whileHover={hoverVariant}
            animate={turbo ? { x: [-1, 1, -1, 1, 0], boxShadow: ["0 0 15px rgba(234,179,8,0.5)", "0 0 30px rgba(234,179,8,0.9)", "0 0 15px rgba(234,179,8,0.5)"] } : { boxShadow: "none" }}
            transition={{ x: { repeat: Infinity, duration: 0.2 }, boxShadow: { repeat: Infinity, duration: 1.5 } }}
            onClick={() => setTurbo((t) => !t)}
            className={`h-12 w-12 rounded-xl text-2xl flex items-center justify-center border transition-all duration-300
            ${turbo ? "bg-yellow-400 text-yellow-950 border-yellow-300 font-bold" : "bg-slate-900/80 border-slate-700 text-slate-400 hover:text-yellow-400 hover:border-yellow-400/50"}`}
        >
            ⚡
        </motion.button>
    );
}

function ReplayButton({ setShowReplay }) {
    const isLowPower = useLowPowerMode();

    if (isLowPower) {
        return (
            <button
                onClick={() => setShowReplay((v) => !v)}
                className="flex-1 py-3 rounded-xl flex items-center justify-center gap-2 bg-[#1e293b] border border-slate-700 text-fuchsia-400 font-bold text-base uppercase tracking-wider active:bg-slate-800 transition-colors"
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M7.793 2.232a.75.75 0 01-.025 1.06L3.622 7.25h10.003a5.375 5.375 0 010 10.75H10.75a.75.75 0 010-1.5h2.875a3.875 3.875 0 000-7.75H3.622l4.146 3.957a.75.75 0 01-1.036 1.085l-5.5-5.25a.75.75 0 010-1.085l5.5-5.25a.75.75 0 011.06.025z" clipRule="evenodd" /></svg>
                Replay
            </button>
        );
    }

    return (
        <motion.button
            whileTap={tapVariant}
            whileHover={hoverVariant}
            transition={springTransition}
            className="flex-1 py-3 rounded-xl flex items-center justify-center gap-2 bg-slate-900/80 border-2 border-fuchsia-500/50 text-fuchsia-400 font-bold text-base tracking-wider uppercase shadow-[0_0_20px_rgba(217,70,239,0.3)] transition-all duration-300 hover:bg-fuchsia-900/30 hover:border-fuchsia-400"
            onClick={() => setShowReplay((v) => !v)}
        >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M7.793 2.232a.75.75 0 01-.025 1.06L3.622 7.25h10.003a5.375 5.375 0 010 10.75H10.75a.75.75 0 010-1.5h2.875a3.875 3.875 0 000-7.75H3.622l4.146 3.957a.75.75 0 01-1.036 1.085l-5.5-5.25a.75.75 0 010-1.085l5.5-5.25a.75.75 0 011.06.025z" clipRule="evenodd" /></svg>
            Replay
        </motion.button>
    );
}

function PlayAgainButton({ setShowPlayAgain, setShowReplay, startGame }) {
    const isLowPower = useLowPowerMode();

    if (isLowPower) {
        return (
            <button
                onClick={() => { setShowPlayAgain(false); setShowReplay(false); startGame(); }}
                className="flex-[2] py-3 rounded-xl flex items-center justify-center gap-2 bg-cyan-600 text-white font-black text-lg tracking-wider uppercase italic active:bg-cyan-700 transition-colors"
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path fillRule="evenodd" d="M4.755 10.059a7.5 7.5 0 0112.548-3.364l1.903 1.903h-3.183a.75.75 0 100 1.5h4.992a.75.75 0 00.75-.75V4.356a.75.75 0 00-1.5 0v3.18l-1.9-1.9A9 9 0 003.306 9.67a.75.75 0 101.45.388zm15.408 3.352a.75.75 0 00-.919.53 7.5 7.5 0 01-12.548 3.364l-1.902-1.903h3.183a.75.75 0 000-1.5H2.984a.75.75 0 00-.75.75v4.992a.75.75 0 001.5 0v-3.18l1.9 1.9a9 9 0 0015.059-4.035.75.75 0 00-.53-.918z" clipRule="evenodd" /></svg>
                Play Again
            </button>
        );
    }

    return (
        <motion.button
            whileTap={tapVariant}
            whileHover={hoverVariant}
            transition={springTransition}
            className="flex-[2] py-3 rounded-xl flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 border-2 border-cyan-300/50 text-white font-black text-lg tracking-wider uppercase italic shadow-[0_0_30px_rgba(6,182,212,0.6)] transition-all duration-300 hover:shadow-[0_0_40px_rgba(6,182,212,0.8)] hover:border-cyan-200"
            onClick={() => { setShowPlayAgain(false); setShowReplay(false); startGame(); }}
        >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path fillRule="evenodd" d="M4.755 10.059a7.5 7.5 0 0112.548-3.364l1.903 1.903h-3.183a.75.75 0 100 1.5h4.992a.75.75 0 00.75-.75V4.356a.75.75 0 00-1.5 0v3.18l-1.9-1.9A9 9 0 003.306 9.67a.75.75 0 101.45.388zm15.408 3.352a.75.75 0 00-.919.53 7.5 7.5 0 01-12.548 3.364l-1.902-1.903h3.183a.75.75 0 000-1.5H2.984a.75.75 0 00-.75.75v4.992a.75.75 0 001.5 0v-3.18l1.9 1.9a9 9 0 0015.059-4.035.75.75 0 00-.53-.918z" clipRule="evenodd" /></svg>
            Play Again
        </motion.button>
    );
}

/* =====================================================
   MOBILE ACTION BAR CONTAINER (The Critical Fix)
===================================================== */
export default function MobileActionBar({
    gameStarted, available, history, selected, mode, turbo, undoStackRef, handleUndo, handleRedo, redoStackRef, confirmMove, setTurbo, setShowReplay, setShowPlayAgain, startGame, resetGameSession, setShowSettings, setStatus, sfx
}) {
    const isLowPower = useLowPowerMode();

    if (!(gameStarted || (!gameStarted && available.length === 0))) return null;

    // THEME STRATEGY:
    // High End: Translucent Glass (backdrop-blur-xl)
    // Low End:  "OLED" Theme (Solid Black #020617 + High Contrast Border)
    const containerClass = `
        fixed bottom-4 left-1/2 -translate-x-1/2 w-[95%] max-w-md md:hidden z-50 rounded-[20px] p-2 flex items-center gap-3
        ${isLowPower
            ? "bg-[#020617] border border-cyan-900/50 shadow-2xl" // OLED MODE
            : "bg-slate-950/60 backdrop-blur-xl border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.5)] ring-1 ring-white/5" // GLASS MODE
        }
    `;

    if (isLowPower) {
        return (
            <div className={containerClass} style={{ contain: 'content' }}>
                {gameStarted ? (
                    <div className="flex items-center gap-3 w-full">
                        <UndoButton handleUndo={handleUndo} disabled={!gameStarted || undoStackRef.current.length === 0 || mode === "bvb"} />
                        <RedoButton handleRedo={handleRedo} disabled={!gameStarted || redoStackRef.current.length === 0 || mode === "bvb"} className="flex-1" />
                        <PickButton selected={selected} confirmMove={confirmMove} />
                        <TurboButton turbo={turbo} setTurbo={setTurbo} />
                    </div>
                ) : (
                    <div className="flex items-center gap-3 w-full">
                        <ReplayButton setShowReplay={setShowReplay} />
                        <PlayAgainButton setShowPlayAgain={setShowPlayAgain} setShowReplay={setShowReplay} startGame={startGame} />
                        <ExitButton resetGameSession={resetGameSession} setShowSettings={setShowSettings} setStatus={setStatus} sfx={sfx} />
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className={containerClass}>
            <AnimatePresence mode="wait">
                {gameStarted && (
                    <motion.div
                        key="ingame"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-3 w-full"
                    >
                        <UndoButton handleUndo={handleUndo} disabled={!gameStarted || undoStackRef.current.length === 0 || mode === "bvb"} />
                        <RedoButton handleRedo={handleRedo} disabled={!gameStarted || redoStackRef.current.length === 0 || mode === "bvb"} className="flex-1" />
                        <PickButton selected={selected} confirmMove={confirmMove} />
                        <TurboButton turbo={turbo} setTurbo={setTurbo} />
                    </motion.div>
                )}
                {!gameStarted && available.length === 0 && history.length > 0 && (
                    <motion.div
                        key="gameover"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-3 w-full"
                    >
                        <ReplayButton setShowReplay={setShowReplay} />
                        <PlayAgainButton setShowPlayAgain={setShowPlayAgain} setShowReplay={setShowReplay} startGame={startGame} />
                        <ExitButton resetGameSession={resetGameSession} setShowSettings={setShowSettings} setStatus={setStatus} sfx={sfx} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}