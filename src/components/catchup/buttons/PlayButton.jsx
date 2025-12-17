import { motion } from "framer-motion";
import { UndoButton, RedoButton } from "./UndoButton"; // Ensure this matches your file structure
import { useLowPowerMode } from "../../../config/useLowPowerMode";

/* =====================================================
   HERO BUTTON: PLAY MOVE
===================================================== */
function PlayMoveButton({ selected, confirmMove, disabled }) {
    const isLowPower = useLowPowerMode();
    const totalValue = selected.reduce((a, b) => a + b, 0);

    const baseClass = "w-full flex-1 min-h-[60px] rounded-xl flex items-center justify-center gap-3 font-black text-lg tracking-wider uppercase italic border-2 transition-all";
    const disabledClass = "bg-slate-900 border-slate-700 text-slate-600 cursor-not-allowed";
    const activeClass = "bg-gradient-to-br from-cyan-500 via-cyan-400 to-blue-500 border-white/20 text-black";

    if (isLowPower) {
        return (
            <button onClick={confirmMove} disabled={disabled} className={`${baseClass} ${disabled ? disabledClass : activeClass}`}>
                <span>PLAY {totalValue > 0 && `+${totalValue}`}</span>
            </button>
        );
    }

    return (
        <motion.button
            whileHover={!disabled ? { scale: 1.02, filter: "brightness(1.1)" } : {}}
            whileTap={!disabled ? { scale: 0.96 } : {}}
            animate={!disabled ? { boxShadow: ["0 0 20px rgba(6,182,212,0.5)", "0 0 35px rgba(6,182,212,0.8)", "0 0 20px rgba(6,182,212,0.5)"] } : { boxShadow: "none" }}
            transition={{ duration: 2, repeat: Infinity }}
            onClick={confirmMove} disabled={disabled}
            className={`${baseClass} ${disabled ? "bg-slate-900/50 border-slate-700 text-slate-600" : activeClass}`}
        >
            <span className="relative z-10">PLAY {totalValue > 0 && <span className="opacity-90 ml-1">+{totalValue}</span>}</span>
        </motion.button>
    );
}

/* =====================================================
   DESKTOP CONTROL PANEL
===================================================== */
export function DesktopControlPanel({ gameStarted, undoStackRef, redoStackRef, handleUndo, handleRedo, selected, confirmMove, mode }) {
    const isLowPower = useLowPowerMode();
    if (!gameStarted && undoStackRef.current.length === 0) return null;

    return (
        <div className={`hidden lg:flex flex-col gap-5 w-full max-w-[340px] mx-auto mt-6 p-6 rounded-[2rem] border border-white/10 relative overflow-hidden
            ${isLowPower ? "bg-slate-950" : "bg-slate-950/40 backdrop-blur-xl shadow-[0_0_40px_rgba(0,0,0,0.4)]"}`}>
            <div className="relative z-10 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] text-center mb-1">COMMAND DECK</div>
            <div className="relative z-10 flex gap-4 w-full">
                <UndoButton handleUndo={handleUndo} disabled={!gameStarted || undoStackRef.current.length === 0} className="flex-1" />
                <RedoButton handleRedo={handleRedo} disabled={!gameStarted || redoStackRef.current.length === 0 || mode === "bvb"} className="flex-1" />
            </div>
            <div className="relative z-10"><PlayMoveButton selected={selected} confirmMove={confirmMove} disabled={!gameStarted || selected.length === 0} /></div>
        </div>
    );
}

/* =====================================================
   HERO BUTTON: PLAY AGAIN
===================================================== */
export function PlayAgainButton({ startGame, setShowPlayAgain, setShowReplay, className = "" }) {
    const isLowPower = useLowPowerMode();
    const handleClick = () => { setShowPlayAgain(false); setShowReplay(false); startGame(); };
    const baseClass = `group relative flex items-center justify-center gap-3 h-14 rounded-full text-lg md:h-12 md:rounded-xl md:text-base bg-gradient-to-r from-cyan-500 via-cyan-400 to-blue-500 border-2 border-white/20 text-black font-black uppercase tracking-wider italic ${className}`;

    if (isLowPower) {
        return <button onClick={handleClick} className={baseClass}>Play Again</button>;
    }

    return (
        <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }}
            animate={{ boxShadow: ["0 0 20px rgba(6,182,212,0.4)", "0 0 35px rgba(6,182,212,0.7)", "0 0 20px rgba(6,182,212,0.4)"] }}
            transition={{ duration: 2, repeat: Infinity }}
            onClick={handleClick} className={baseClass}
        >
            <span className="relative z-10 drop-shadow-sm">Play Again</span>
        </motion.button>
    );
}

/* =====================================================
   HERO BUTTON: REPLAY
===================================================== */
export function ReplayButton({ setShowReplay, className = "" }) {
    // Simplified for brevity - logic same as above
    return (
        <button onClick={() => setShowReplay((v) => !v)} className={`flex items-center justify-center gap-2 h-14 rounded-full text-base md:h-12 md:rounded-xl md:text-sm bg-slate-900 border border-fuchsia-500/30 text-fuchsia-400 font-bold uppercase tracking-wider hover:bg-fuchsia-900/40 ${className}`}>
            Replay
        </button>
    );
}