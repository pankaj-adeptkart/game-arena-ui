import React from 'react';
import Tilt from 'react-parallax-tilt';
import { useLowPowerMode } from './config/useLowPowerMode';
import InstallPWA from './components/common/InstallPWA'; // Import the button

/* =====================================================
   WRAPPER: Conditionally renders Tilt or Static Div
===================================================== */
const CardWrapper = ({ children, isLowPower, options, className, style }) => {
    if (isLowPower) {
        return (
            <div className={`${className} transition-transform duration-300 hover:scale-[1.02] active:scale-95`} style={style}>
                {children}
            </div>
        );
    }
    return (
        <Tilt className={className} options={options} style={style}>
            {children}
        </Tilt>
    );
};

// FIX: Accept installPrompt and handleInstall props
export default function GameSelection({ onSelectGame, installPrompt, handleInstall }) {
    const isLowPower = useLowPowerMode();
    const tiltOptions = { max: 15, scale: 1.05, speed: 400, glare: true, "max-glare": 0.5 };

    // Shared Styles
    const cardBase = "w-full max-w-[280px] min-h-[350px] flex flex-col items-center p-6 rounded-[20px] backdrop-blur-xl border border-white/10 transition-all duration-200 cursor-pointer hover:-translate-y-1.5";
    const glassStyle = "bg-[rgba(5,10,25,0.65)]";
    const hoverGlowBlue = "hover:shadow-[0_0_25px_rgba(0,229,255,0.4)] hover:border-cyan-400/30";
    const hoverGlowPink = "hover:shadow-[0_0_25px_rgba(213,0,249,0.4)] hover:border-fuchsia-400/30";

    const btnBase = "w-full mt-auto p-3.5 rounded-xl font-black text-lg uppercase tracking-wide border-none transition-all hover:brightness-110 active:scale-95";

    return (
        <div className="flex flex-col justify-center items-center min-h-[calc(100vh-120px)] p-4 relative">

            {/* INSTALL BUTTON (Shows only if installPrompt exists) */}
            <InstallPWA installPrompt={installPrompt} handleInstall={handleInstall} />

            {/* Responsive Grid Container */}
            <div className="flex flex-wrap justify-center gap-8 w-full max-w-6xl">

                {/* GAME 1: NEON CATCH-UP */}
                <CardWrapper
                    isLowPower={isLowPower}
                    options={tiltOptions}
                    className="w-full max-w-[280px]"
                >
                    <div
                        className={`${cardBase} ${glassStyle} ${hoverGlowBlue}`}
                        onClick={() => onSelectGame('catchup')}
                    >
                        <div className="text-6xl mb-4">⚡</div>
                        <div className="text-2xl font-bold text-white mb-2 text-center">NEON CATCH-UP</div>
                        <p className="text-slate-400 text-sm text-center mt-2 leading-relaxed">
                            Strategic Math. Beat the AI to the target sum.
                        </p>

                        <button
                            className={`${btnBase} bg-gradient-to-br from-cyan-400 to-blue-500 text-black shadow-[0_0_20px_rgba(0,229,255,0.3)]`}
                            onClick={(e) => { e.stopPropagation(); onSelectGame('catchup'); }}
                        >
                            PLAY NOW
                        </button>
                    </div>
                </CardWrapper>

                {/* GAME 2: PSYCHIC HAND */}
                <CardWrapper
                    isLowPower={isLowPower}
                    options={tiltOptions}
                    className="w-full max-w-[280px]"
                >
                    <div
                        className={`${cardBase} ${glassStyle} ${hoverGlowPink} border-fuchsia-500/20`}
                        onClick={() => onSelectGame('rps')}
                    >
                        <div className="text-6xl mb-4">🔮</div>
                        <div className="text-2xl font-bold text-fuchsia-400 mb-2 text-center">PSYCHIC HAND</div>
                        <p className="text-slate-400 text-sm text-center mt-2 leading-relaxed">
                            Rock Paper Scissors. The AI reads your mind.
                        </p>

                        <button
                            className={`${btnBase} bg-gradient-to-br from-fuchsia-500 to-purple-600 text-white shadow-[0_0_20px_rgba(213,0,249,0.4)]`}
                            style={isLowPower ? { boxShadow: 'none' } : {}}
                            onClick={(e) => { e.stopPropagation(); onSelectGame('rps'); }}
                        >
                            PLAY NOW
                        </button>
                    </div>
                </CardWrapper>

            </div>
        </div>
    );
}