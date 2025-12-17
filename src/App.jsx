import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { Howler } from 'howler';
import CatchUpGame from './pages/catchup_number/CatchUpGame';
import RPSGame from './RPSGame';
import GameSelection from './GameSelection';
import ParticlesBackground from './ParticlesBackground';
import ProfilePanel from './components/ProfilePanel';
import { useLowPowerMode } from './config/useLowPowerMode';
import './styles/Tailwind.css';
import Background from './components/wallpaper/Background';

const Header = lazy(() => import('./components/common/GameHeader'));

const AVATARS = ['😎', '🤖', '🧠', '👩‍🚀', '👾', '🛸', '🐉', '🦄', '🧩', '🦊', '🦁', '🐵', '💀', '👻'];

function App() {
    const isLowPower = useLowPowerMode();
    const [wallpaperIdx, setWallpaperIdx] = useState(1);
    const [effectIndex, setEffectIndex] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const [currentView, setCurrentView] = useState('home');

    // --- PROFILE STATE ---
    const [profile, setProfile] = useState({ name: 'Player', avatar: '😎', color: '#00e5ff' });
    const [showDropdown, setShowDropdown] = useState(false);
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [tempProfile, setTempProfile] = useState(profile);
    const [installPrompt, setInstallPrompt] = useState(null);

    // --- INSTALL LOGIC ---
    useEffect(() => {
        const handler = (e) => { e.preventDefault(); setInstallPrompt(e); };
        window.addEventListener('beforeinstallprompt', handler);
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstall = () => {
        if (installPrompt) {
            installPrompt.prompt();
            installPrompt.userChoice.then((res) => { if (res.outcome === 'accepted') setInstallPrompt(null); });
        }
    };

    // --- CLICK OUTSIDE ---
    const dropdownRef = useRef(null);
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
                !event.target.closest('.mobile-profile-trigger') && !event.target.closest('.profile-desktop-trigger')) {
                setShowDropdown(false);
                setIsEditingProfile(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownRef]);

    // --- EFFECTS ---
    useEffect(() => {
        if (!isLowPower) {
            const timer = setInterval(() => setEffectIndex(p => (p + 1) % 8), 15000);
            return () => clearInterval(timer);
        }
    }, [isLowPower]);

    const toggleWallpaper = () => setWallpaperIdx(p => (p % 4) + 1);
    const nextEffect = () => setEffectIndex(p => (p + 1) % 8);
    const toggleSound = () => { Howler.mute(!isMuted); setIsMuted(!isMuted); };
    const handleProfileUpdate = (newProfile) => { setProfile(newProfile); setTempProfile(newProfile); };
    const saveProfileChanges = () => { setProfile(tempProfile); setIsEditingProfile(false); setShowDropdown(false); };

    // --- RENDER DROPDOWN ---
    const renderDropdown = () => (
        <div
            ref={dropdownRef}
            className="w-[280px] bg-[#14141e]/98 backdrop-blur-xl border border-white/15 rounded-[20px] shadow-[0_10px_40px_rgba(0,0,0,0.8)] overflow-hidden animate-fadeIn"
        >
            <div className="bg-gradient-to-br from-white/5 to-transparent p-5 flex items-center gap-4 border-b border-white/5">
                <div className="text-5xl">{isEditingProfile ? tempProfile.avatar : profile.avatar}</div>
                <div className="flex flex-col">
                    <div className="text-xl font-extrabold break-all" style={{ color: isEditingProfile ? tempProfile.color : profile.color }}>
                        {isEditingProfile ? tempProfile.name : profile.name}
                    </div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">LEVEL 1</div>
                </div>
            </div>

            <div className="p-4">
                {isEditingProfile ? (
                    <div className="flex flex-col gap-3">
                        <div>
                            <label className="text-xs font-bold text-slate-400 mb-1 block">NAME</label>
                            <input
                                type="text"
                                className="w-full bg-black/30 border border-white/10 text-white p-2.5 rounded-lg focus:outline-none focus:border-cyan-500 transition-colors text-sm font-bold"
                                value={tempProfile.name}
                                onChange={e => setTempProfile({ ...tempProfile, name: e.target.value })}
                                maxLength={10}
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-400 mb-2 block">COLOR</label>
                            <div className="flex gap-2.5">
                                {['#00e5ff', '#d500f9', '#ffd700', '#ff1744', '#00e676'].map(c => (
                                    <div
                                        key={c}
                                        className={`w-6 h-6 rounded-full cursor-pointer border-2 transition-transform hover:scale-110 ${tempProfile.color === c ? 'border-white scale-110' : 'border-transparent'}`}
                                        style={{ background: c }}
                                        onClick={() => setTempProfile({ ...tempProfile, color: c })}
                                    />
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-400 mb-1 block">AVATAR</label>
                            <div className="grid grid-cols-5 gap-1.5">
                                {AVATARS.map(a => (
                                    <button
                                        key={a}
                                        className={`text-2xl p-1 rounded-lg border transition-colors ${tempProfile.avatar === a ? 'border-cyan-400 bg-cyan-400/20' : 'border-white/10 hover:bg-white/10'}`}
                                        onClick={() => setTempProfile({ ...tempProfile, avatar: a })}
                                    >
                                        {a}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <button
                            className="w-full bg-cyan-400 text-black font-extrabold p-3 rounded-xl mt-2 hover:bg-cyan-300 active:scale-95 transition-all"
                            onClick={saveProfileChanges}
                        >
                            SAVE
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-1">
                        <MenuRow icon="fa-user-pen" label="Edit Profile" onClick={() => { setTempProfile(profile); setIsEditingProfile(true); }} />
                        <MenuRow icon="fa-image" label="Change Wallpaper" onClick={toggleWallpaper} />
                        {!isLowPower && <MenuRow icon="fa-wand-magic-sparkles" label="Magic Effect" onClick={nextEffect} />}
                        <MenuRow
                            icon={isMuted ? "fa-volume-xmark" : "fa-volume-high"}
                            label={`Sound: ${isMuted ? 'OFF' : 'ON'}`}
                            onClick={toggleSound}
                        />
                        {currentView !== 'home' && (
                            <MenuRow icon="fa-house" label="Main Menu" onClick={() => { setCurrentView('home'); setShowDropdown(false); }} highlight />
                        )}
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="relative w-full h-screen overflow-hidden text-white font-sans selection:bg-cyan-500/30">
            <ProfilePanel onProfileChange={handleProfileUpdate} />

            <Background activeIndex={wallpaperIdx} />

            {!isLowPower && <ParticlesBackground effectIndex={effectIndex} />}

            <div className="relative z-10 flex flex-col h-full w-full">
                <Suspense fallback={<div className="h-20 w-full fixed top-0 left-0 bg-slate-950 border-b border-white/10 z-50" />}>
                    <Header
                        currentView={currentView}
                        setCurrentView={setCurrentView}
                        toggleWallpaper={toggleWallpaper}
                        nextEffect={nextEffect}
                        toggleSound={toggleSound}
                        isMuted={isMuted}
                        profile={profile}
                        setIsEditingProfile={setIsEditingProfile}
                        showDropdown={showDropdown}
                        setShowDropdown={setShowDropdown}
                    />
                </Suspense>

                {showDropdown && (
                    <div className="absolute top-[70px] right-4 z-[60]">
                        {renderDropdown()}
                    </div>
                )}

                <div className="min-h-screen w-full max-w-none overflow-x-hidden">
                    {/* FIX: PASS INSTALL PROPS HERE */}
                    {currentView === 'home' && (
                        <GameSelection
                            onSelectGame={setCurrentView}
                            installPrompt={installPrompt}
                            handleInstall={handleInstall}
                        />
                    )}

                    {currentView === 'catchup' && (
                        <div className="w-full min-h-full">
                            <CatchUpGame profile={profile} />
                        </div>
                    )}

                    {currentView === 'rps' && <RPSGame profile={profile} />}
                </div>
            </div>
        </div>
    );
}

const MenuRow = ({ icon, label, onClick, highlight }) => (
    <div
        className={`flex items-center gap-3 p-3 rounded-xl font-medium cursor-pointer transition-colors ${highlight ? 'text-white bg-white/10' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`}
        onClick={onClick}
    >
        <i className={`fa-solid ${icon} w-6 text-center text-cyan-400`}></i> {label}
    </div>
);

export default App;