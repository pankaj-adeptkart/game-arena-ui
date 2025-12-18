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
// IMPORT THE NEW COMPONENT
import ProfileDropdown from './components/common/ProfileDropdown';

const Header = lazy(() => import('./components/common/GameHeader'));

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

    const saveProfileChanges = () => {
        setProfile(tempProfile);
        setIsEditingProfile(false);
        setShowDropdown(false);
    };

    const handleNavigateHome = () => {
        setCurrentView('home');
        setShowDropdown(false);
    };

    return (
        <div className="relative w-full h-screen overflow-hidden text-white font-sans selection:bg-cyan-500/30">
            <ProfilePanel onProfileChange={handleProfileUpdate} />

            <Background activeIndex={wallpaperIdx} />
            {/* ADD THIS LINE HERE */}
            <div className="pointer-events-none fixed inset-0 z-[5] opacity-[0.04]" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }} />

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

                {/* --- EXTRACTED COMPONENT USAGE --- */}
                {showDropdown && (
                    <ProfileDropdown
                        dropdownRef={dropdownRef}
                        profile={profile}
                        tempProfile={tempProfile}
                        setTempProfile={setTempProfile}
                        isEditingProfile={isEditingProfile}
                        setIsEditingProfile={setIsEditingProfile}
                        onSaveProfile={saveProfileChanges}
                        toggleWallpaper={toggleWallpaper}
                        nextEffect={nextEffect}
                        toggleSound={toggleSound}
                        isMuted={isMuted}
                        isLowPower={isLowPower}
                        currentView={currentView}
                        onNavigateHome={handleNavigateHome}
                        onClose={() => setShowDropdown(false)} // Pass close handler
                    />
                )}

                <div className="min-h-screen w-full max-w-none overflow-x-hidden flex-1 overflow-y-auto relative scrollbar-hide pt-8 md:pt-8 lg:pt-5 sm:pt-24">
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

export default App;