import React, { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLowPowerMode } from '../../config/useLowPowerMode';

const Header = ({
    currentView, setCurrentView, toggleWallpaper, nextEffect,
    toggleSound, isMuted, profile, setIsEditingProfile,
    showDropdown, setShowDropdown
}) => {
    const isLowPower = useLowPowerMode();

    // --- LITE MODE (No Framer Motion, No Blur, No Shadows) ---
    // Renders standard HTML/CSS for maximum FPS on Android
    if (isLowPower) {
        return (
            <div className="fixed top-0 left-0 right-0 z-50 h-16 md:h-20 px-2 md:px-8 flex items-center justify-between bg-slate-950 border-b border-white/10">
                <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-cyan-500/30" />

                {/* Left: Logo/Back */}
                <div className="flex items-center gap-3 flex-none md:flex-1">
                    {currentView !== 'home' ? (
                        <button onClick={() => setCurrentView('home')} className="w-10 h-10 flex items-center justify-center text-white active:opacity-50">
                            <i className="fa-solid fa-chevron-left"></i>
                        </button>
                    ) : (
                        <div className="flex items-center gap-2">
                            <i className="fa-solid fa-gamepad text-xl text-fuchsia-500"></i>
                            <span className="font-bold text-lg text-white">NEON ARCADE</span>
                        </div>
                    )}
                </div>

                {/* Center: Controls (Simplified) */}
                <div className="flex justify-center flex-1">
                    <div className="flex items-center gap-4 bg-slate-900 rounded-full px-4 py-1.5 border border-white/5">
                        <button onClick={toggleWallpaper}><i className="fa-solid fa-image text-slate-300"></i></button>
                        <button onClick={nextEffect}><i className="fa-solid fa-wand-magic-sparkles text-slate-300"></i></button>
                        <button onClick={toggleSound}><i className={`fa-solid ${isMuted ? 'fa-volume-xmark' : 'fa-volume-high'} text-slate-300`}></i></button>
                    </div>
                </div>

                {/* Right: Avatar */}
                <div className="flex items-center justify-end flex-none md:flex-1">
                    <button onClick={() => { setIsEditingProfile(false); setShowDropdown(!showDropdown); }} className="w-9 h-9 rounded-full bg-slate-800 border border-white/20 flex items-center justify-center">
                        {profile.avatar}
                    </button>
                </div>
            </div>
        );
    }

    // --- PRO MODE (Original High-End Animations) ---
    return (
        <motion.header
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            // Optimization: will-change-transform tells browser to prepare GPU
            className="fixed top-0 left-0 right-0 z-50 h-20 px-4 md:px-8 flex items-center justify-between
                 bg-slate-950/80 backdrop-blur-md border-b border-white/10
                 shadow-lg will-change-transform"
        >
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

            <div className="flex items-center gap-4 flex-1">
                <AnimatePresence mode="wait">
                    {currentView !== 'home' ? (
                        <motion.button
                            key="back"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setCurrentView('home')}
                            className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white"
                        >
                            <i className="fa-solid fa-chevron-left"></i>
                        </motion.button>
                    ) : (
                        <motion.div key="logo" className="flex items-center gap-3">
                            <div className="relative">
                                <i className="fa-solid fa-gamepad text-2xl text-fuchsia-500 z-10 relative"></i>
                                <motion.div
                                    animate={{ opacity: [0.5, 1, 0.5] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="absolute inset-0 text-2xl text-fuchsia-500 blur-sm"
                                ><i className="fa-solid fa-gamepad"></i></motion.div>
                            </div>
                            <span className="font-black text-xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-fuchsia-300">
                                NEON ARCADE
                            </span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="flex justify-center flex-1">
                <div className="flex items-center gap-1 bg-black/40 border border-white/10 rounded-full p-1.5 backdrop-blur-sm">
                    {[
                        { fn: toggleWallpaper, icon: "fa-image" },
                        { fn: nextEffect, icon: "fa-wand-magic-sparkles" },
                        { fn: toggleSound, icon: isMuted ? "fa-volume-xmark" : "fa-volume-high" }
                    ].map((item, idx) => (
                        <motion.button
                            key={idx}
                            whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.1)" }}
                            whileTap={{ scale: 0.9 }}
                            onClick={item.fn}
                            className="w-10 h-10 rounded-full flex items-center justify-center text-slate-300 hover:text-cyan-300 transition-colors"
                        >
                            <i className={`fa-solid ${item.icon}`}></i>
                        </motion.button>
                    ))}
                </div>
            </div>

            <div className="flex items-center justify-end flex-1">
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { setIsEditingProfile(false); setShowDropdown(!showDropdown); }}
                    className="cursor-pointer flex items-center gap-3 px-1 md:px-4 py-1 rounded-full bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
                >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-violet-600 to-fuchsia-600 flex items-center justify-center text-lg shadow-lg">
                        {profile.avatar}
                    </div>
                    <div className="hidden md:flex flex-col items-start leading-none">
                        <span className="font-bold text-sm text-white">{profile.name}</span>
                        <span className="text-[10px] text-slate-400">LVL 1</span>
                    </div>
                </motion.div>
            </div>
        </motion.header>
    );
};

// Memoizing prevents re-renders if parent props haven't changed
export default memo(Header);