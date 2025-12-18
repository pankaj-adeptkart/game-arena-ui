import React, { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLowPowerMode } from '../../config/useLowPowerMode';

const Header = ({
    currentView, setCurrentView, toggleWallpaper, nextEffect,
    toggleSound, isMuted, profile, setIsEditingProfile,
    showDropdown, setShowDropdown
}) => {
    const isLowPower = useLowPowerMode();

    // --- SHARED STYLES ---
    // Reduced height from h-16 to h-12 (mobile) / h-14 (desktop)
    const glassContainer = "fixed top-0 left-0 right-0 z-50 h-12 md:h-14 px-3 md:px-6 flex items-center justify-between border-b border-white/5";
    const logoTextGradient = "bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-white to-fuchsia-300";

    // --- LITE MODE ---
    if (isLowPower) {
        return (
            <div className={`${glassContainer} bg-[#05050a] border-b-cyan-500/20`}>
                <div className="flex-1 flex items-center">
                    {currentView !== 'home' ? (
                        <button onClick={() => setCurrentView('home')} className="w-8 h-8 flex items-center justify-center text-white active:opacity-50">
                            <i className="fa-solid fa-chevron-left text-sm"></i>
                        </button>
                    ) : (
                        <div className="flex items-center gap-2">
                            <i className="fa-solid fa-gamepad text-fuchsia-500 text-lg"></i>
                            <span className="font-bold text-sm text-white tracking-wider">NEON</span>
                        </div>
                    )}
                </div>

                {/* Center Controls */}
                <div className="flex bg-white/5 rounded-full px-1 border border-white/10 gap-1">
                    <LiteBtn onClick={toggleWallpaper} icon="fa-image" />
                    <LiteBtn onClick={nextEffect} icon="fa-wand-magic-sparkles" />
                    <LiteBtn onClick={toggleSound} icon={isMuted ? "fa-volume-xmark" : "fa-volume-high"} />
                </div>

                <div className="flex-1 flex justify-end">
                    <button
                        onClick={() => { setIsEditingProfile(false); setShowDropdown(!showDropdown); }}
                        className="w-7 h-7 rounded-full bg-slate-800 border border-white/20 flex items-center justify-center text-xs"
                    >
                        {profile.avatar}
                    </button>
                </div>
            </div>
        );
    }

    // --- PRO MODE (Compact & Glassy) ---
    return (
        <motion.header
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 90, damping: 15 }}
            className={`${glassContainer} bg-[#0a0a12]/70 backdrop-blur-md shadow-sm`}
        >
            {/* Subtle bottom line */}
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* --- LEFT --- */}
            <div className="flex-1 flex items-center gap-3">
                <AnimatePresence mode="wait">
                    {currentView !== 'home' ? (
                        <motion.button
                            key="back"
                            initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setCurrentView('home')}
                            className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white bg-white/5 hover:bg-white/10"
                        >
                            <i className="fa-solid fa-chevron-left text-xs"></i>
                        </motion.button>
                    ) : (
                        <motion.div
                            key="logo"
                            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-2 select-none"
                        >
                            <i className="fa-solid fa-gamepad text-lg text-fuchsia-500"></i>
                            <span className={`hidden md:block font-extrabold text-base tracking-[0.15em] ${logoTextGradient}`}>
                                ARCADE
                            </span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* --- CENTER: SLIM ISLAND --- */}
            <div className="flex items-center justify-center">
                <div className="flex items-center px-1 py-0.5 gap-0.5 bg-black/40 border border-white/10 rounded-full backdrop-blur-md shadow-lg">
                    <ControlBtn onClick={toggleWallpaper} icon="fa-image" />
                    <div className="w-[1px] h-3 bg-white/10 mx-0.5"></div>
                    <ControlBtn onClick={nextEffect} icon="fa-wand-magic-sparkles" />
                    <div className="w-[1px] h-3 bg-white/10 mx-0.5"></div>
                    <ControlBtn
                        onClick={toggleSound}
                        icon={isMuted ? "fa-volume-xmark" : "fa-volume-high"}
                        active={!isMuted}
                        color={isMuted ? "text-slate-500" : "text-green-400"}
                    />
                </div>
            </div>

            {/* --- RIGHT: COMPACT PROFILE --- */}
            <div className="flex-1 flex justify-end">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => { setIsEditingProfile(false); setShowDropdown(!showDropdown); }}
                    className={`flex items-center gap-2 pl-0.5 pr-0.5 md:pr-3 py-0.5 rounded-full border transition-all duration-300
                    ${showDropdown
                            ? 'bg-cyan-500/10 border-cyan-500/40'
                            : 'bg-transparent border-transparent hover:bg-white/5 hover:border-white/10'}`}
                >
                    <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-b from-indigo-500 to-violet-600 flex items-center justify-center text-sm shadow-inner ring-1 ring-white/20">
                        {profile.avatar}
                    </div>
                    <div className="hidden md:flex flex-col items-start leading-none gap-[1px]">
                        <span className="font-bold text-[10px] text-white tracking-wide">{profile.name}</span>
                        <span className="text-[8px] font-bold text-cyan-500 uppercase tracking-wider">LVL 1</span>
                    </div>
                </motion.button>
            </div>
        </motion.header>
    );
};

// --- SUB COMPONENTS (Scaled Down) ---

const LiteBtn = ({ onClick, icon }) => (
    <button onClick={onClick} className="w-8 h-8 flex items-center justify-center text-slate-400 active:text-white">
        <i className={`fa-solid ${icon} text-xs`}></i>
    </button>
);

const ControlBtn = ({ onClick, icon, active, color = "text-slate-400" }) => (
    <motion.button
        whileHover={{ scale: 1.1, color: "#fff" }}
        whileTap={{ scale: 0.9 }}
        onClick={onClick}
        className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors relative ${color}`}
    >
        <i className={`fa-solid ${icon} text-xs`}></i>
        {active && <span className="absolute bottom-1.5 w-0.5 h-0.5 bg-current rounded-full shadow-[0_0_4px_currentColor]"></span>}
    </motion.button>
);

export default memo(Header);