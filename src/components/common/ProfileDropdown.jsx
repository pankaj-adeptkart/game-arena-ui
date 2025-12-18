import React from 'react';

const AVATARS = ['😎', '🤖', '🧠', '👩‍🚀', '👾', '🛸', '🐉', '🦄', '🧩', '🦊', '🦁', '🐵', '💀', '👻'];

// --- Helper: Tech Menu Row ---
const MenuRow = ({ icon, label, onClick, highlight }) => (
    <div
        className={`group relative flex items-center gap-3 p-2.5 rounded-md font-bold cursor-pointer transition-all duration-150 overflow-hidden
        ${highlight
                ? 'bg-cyan-900/40 text-cyan-100 border border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10'
            }`}
        onClick={onClick}
    >
        {/* Hover Tech Effect: A sliding bar on the left */}
        <div className={`absolute left-0 top-0 bottom-0 w-1 bg-cyan-400 transition-all duration-200 ${highlight ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />

        <div className="flex-none w-6 text-center z-10">
            <i className={`fa-solid ${icon} text-sm ${highlight ? 'text-cyan-400' : 'group-hover:text-cyan-400 transition-colors'}`}></i>
        </div>
        <span className="text-xs uppercase tracking-widest z-10">{label}</span>

        {/* Subtle Scanline on Highlight */}
        {highlight && <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>}
    </div>
);

const ProfileDropdown = ({
    dropdownRef,
    profile,
    tempProfile,
    setTempProfile,
    isEditingProfile,
    setIsEditingProfile,
    onSaveProfile,
    toggleWallpaper,
    nextEffect,
    toggleSound,
    isMuted,
    isLowPower,
    currentView,
    onNavigateHome,
    onClose
}) => {
    return (
        <div
            ref={dropdownRef}
            // --- LAYOUT LOGIC ---
            // Mobile: Fixed Full Screen (z-100), Flex Center
            // Desktop: Absolute positioned, Slim (w-60), Top-14
            className={`
                fixed inset-0 z-[100] flex flex-col justify-center items-center
                md:absolute md:inset-auto md:top-14 md:right-4 md:w-60 md:block
            `}
        >
            {/* --- BACKGROUND LAYERS --- */}

            {/* 1. Mobile Dark Overlay (Click to close) */}
            <div
                className="absolute inset-0 bg-slate-950/90 backdrop-blur-md md:hidden animate-fadeIn"
                onClick={onClose}
            />

            {/* 2. The Card Container */}
            <div className={`
                relative w-full max-w-sm md:max-w-none 
                bg-[#09090b]/90 backdrop-blur-xl 
                border-y md:border border-cyan-500/30 
                shadow-[0_0_40px_rgba(0,0,0,0.8)] md:shadow-[0_0_20px_rgba(6,182,212,0.15)]
                md:rounded-lg overflow-hidden
                flex flex-col
                animate-slideIn
                ring-1 ring-white/5
            `}>
                {/* Tech Deco: Corner Markers (Desktop only visuals) */}
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan-500 md:block hidden"></div>
                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyan-500 md:block hidden"></div>
                <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-cyan-500 md:block hidden"></div>
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyan-500 md:block hidden"></div>

                {/* --- HEADER --- */}
                <div className="relative p-5 md:p-4 bg-gradient-to-r from-cyan-950/50 to-transparent border-b border-cyan-500/20 flex items-center gap-4">
                    {/* Scanline Texture Overlay */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-0 pointer-events-none bg-[length:100%_4px,3px_100%]"></div>

                    <div className="relative z-10 w-16 h-16 md:w-10 md:h-10 flex items-center justify-center bg-black/40 rounded-md border border-white/10 shadow-inner">
                        <span className="text-4xl md:text-2xl drop-shadow-lg filter">{isEditingProfile ? tempProfile.avatar : profile.avatar}</span>
                        {/* Online Dot */}
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 md:w-2 md:h-2 bg-green-500 border-2 border-black rounded-full shadow-[0_0_8px_#22c55e]"></div>
                    </div>

                    <div className="relative z-10 flex flex-col justify-center">
                        <span className="text-xl md:text-sm font-black tracking-tighter text-white uppercase font-mono">
                            {isEditingProfile ? tempProfile.name : profile.name}
                        </span>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] text-cyan-400 font-mono">LVL.01</span>
                            <div className="h-1 w-12 md:w-8 bg-gray-700 rounded-full overflow-hidden">
                                <div className="h-full bg-cyan-400 w-2/3 shadow-[0_0_5px_#22d3ee]"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- CONTENT BODY --- */}
                <div className="p-6 md:p-3 relative bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]">
                    {isEditingProfile ? (
                        <div className="flex flex-col gap-4 md:gap-3">
                            {/* Input Field (Gaming Style) */}
                            <div className="group">
                                <label className="text-[9px] font-bold text-cyan-600 mb-1 block uppercase tracking-widest">Codename</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        className="w-full bg-black/50 border border-white/10 text-white px-3 py-2 text-sm font-mono focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_10px_rgba(6,182,212,0.3)] transition-all rounded-sm"
                                        value={tempProfile.name}
                                        onChange={e => setTempProfile({ ...tempProfile, name: e.target.value })}
                                        maxLength={10}
                                        autoFocus
                                    />
                                    <div className="absolute right-0 top-0 bottom-0 w-1 bg-cyan-500/20 group-focus-within:bg-cyan-500 transition-colors"></div>
                                </div>
                            </div>

                            {/* Colors */}
                            <div>
                                <label className="text-[9px] font-bold text-cyan-600 mb-2 block uppercase tracking-widest">Neon Signature</label>
                                <div className="flex justify-between gap-1">
                                    {['#00e5ff', '#d500f9', '#ffd700', '#ff1744', '#00e676'].map(c => (
                                        <button
                                            key={c}
                                            className={`w-8 h-8 rounded-sm border-2 transition-all duration-200 ${tempProfile.color === c ? 'border-white shadow-[0_0_10px_' + c + '] scale-110' : 'border-transparent opacity-50 hover:opacity-100 hover:scale-110'}`}
                                            style={{ background: c }}
                                            onClick={() => setTempProfile({ ...tempProfile, color: c })}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Avatar Grid */}
                            <div>
                                <label className="text-[9px] font-bold text-cyan-600 mb-1 block uppercase tracking-widest">Avatar</label>
                                <div className="grid grid-cols-5 gap-2 max-h-[150px] overflow-y-auto pr-1 custom-scrollbar">
                                    {AVATARS.map(a => (
                                        <button
                                            key={a}
                                            className={`aspect-square flex items-center justify-center text-lg rounded-sm border transition-all 
                                            ${tempProfile.avatar === a
                                                    ? 'border-cyan-500 bg-cyan-500/20 text-shadow-glow'
                                                    : 'border-white/5 hover:bg-white/5 hover:border-white/20'}`}
                                            onClick={() => setTempProfile({ ...tempProfile, avatar: a })}
                                        >
                                            {a}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-2 pt-1">
                                <button
                                    className="flex-1 py-2 rounded-sm text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-white/5 hover:bg-white/10 hover:text-white transition-colors border border-white/5"
                                    onClick={() => setIsEditingProfile(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="flex-[2] bg-cyan-600 hover:bg-cyan-500 text-black font-bold py-2 rounded-sm text-[10px] uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                                    onClick={onSaveProfile}
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* Menu List */
                        <div className="flex flex-col gap-1">
                            <MenuRow icon="fa-user-pen" label="Edit ID" onClick={() => { setTempProfile(profile); setIsEditingProfile(true); }} />
                            <MenuRow icon="fa-image" label="Wallpaper" onClick={toggleWallpaper} />
                            {!isLowPower && <MenuRow icon="fa-wand-magic-sparkles" label="FX Mode" onClick={nextEffect} />}
                            <MenuRow
                                icon={isMuted ? "fa-volume-xmark" : "fa-volume-high"}
                                label={`Audio: ${isMuted ? 'OFF' : 'ON'}`}
                                onClick={toggleSound}
                            />
                            {currentView !== 'home' && (
                                <div className="mt-2 pt-2 border-t border-dashed border-white/10">
                                    <MenuRow icon="fa-house" label="Main Menu" onClick={onNavigateHome} highlight />
                                </div>
                            )}

                            {/* Close Button (Mobile Only visible in menu) */}
                            <button onClick={onClose} className="mt-6 w-full py-3 md:hidden text-xs font-bold text-red-400 border border-red-500/30 bg-red-500/10 rounded uppercase tracking-widest">
                                Close Menu
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfileDropdown;