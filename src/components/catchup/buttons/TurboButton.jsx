import { motion } from "framer-motion";
import { useLowPowerMode } from "../../../config/useLowPowerMode";

export default function TurboButton({ turbo, setTurbo, size = "md" }) {
    const isLowPower = useLowPowerMode();
    const sizeMap = {
        sm: "w-10 h-10 text-lg",
        md: "w-12 h-12 text-xl",
        tv: "w-16 h-16 text-2xl"
    };

    // --- LITE MODE (No Animation) ---
    if (isLowPower) {
        return (
            <button
                onClick={() => setTurbo((t) => !t)}
                className={`${sizeMap[size]} rounded-xl font-extrabold transition-colors duration-200 ${turbo ? "bg-yellow-400 text-black border-2 border-yellow-500" : "bg-slate-800 text-slate-400 border border-slate-700 active:bg-slate-700"}`}
            >
                ⚡
            </button>
        );
    }

    // --- PRO MODE (Motion Animations) ---
    return (
        <motion.button
            animate={turbo ? { scale: [1, 1.15, 1] } : { scale: 1 }}
            transition={{ repeat: turbo ? Infinity : 0, duration: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setTurbo((t) => !t)}
            className={`${sizeMap[size]} rounded-xl font-extrabold transition-colors ${turbo ? "bg-yellow-400 text-black shadow-[0_0_15px_rgba(250,204,21,0.6)]" : "bg-white/10 text-white hover:bg-white/20"} backdrop-blur-sm`}
        >
            ⚡
        </motion.button>
    );
}