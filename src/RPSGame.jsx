import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { API_URL } from './config/config';
import { sfx } from './config/audio';
import { useLowPowerMode } from './config/useLowPowerMode'; // Optional: for optimization

export default function RPSGame() {
    const isLowPower = useLowPowerMode();
    const [result, setResult] = useState(null);
    const [history, setHistory] = useState([]);
    const [aiMove, setAiMove] = useState('?');
    const [score, setScore] = useState({ user: 0, bot: 0 });
    const [selectedMove, setSelectedMove] = useState(null);

    const handleMove = async (move) => {
        setSelectedMove(move);
        sfx.pop.play();
        setAiMove('⏳');

        try {
            const res = await axios.post(`${API_URL}/rps/play`, { move });
            const data = res.data;

            setAiMove(data.ai_move);
            setResult(data.result);

            if (data.result === 'win') {
                setScore(p => ({ ...p, user: p.user + 1 }));
                sfx.win.play();
            } else if (data.result === 'lose') {
                setScore(p => ({ ...p, bot: p.bot + 1 }));
                sfx.switch.play();
            }

            setHistory(prev => [{ u: move, a: data.ai_move, r: data.result }, ...prev].slice(0, 5));
            setTimeout(() => setSelectedMove(null), 1200);

        } catch (err) {
            console.error(err);
            Swal.fire({ icon: 'error', title: 'Error', text: 'Backend offline', background: '#1a1a1a', color: '#fff' });
        }
    };

    const getIcon = (code) => {
        if (code === 'R') return '✊';
        if (code === 'P') return '✋';
        if (code === 'S') return '✌️';
        return code;
    };

    // Shared Styles
    const panelStyle = `flex flex-col items-center justify-center p-6 rounded-3xl border border-white/10 w-full lg:w-64 transition-all ${isLowPower ? 'bg-slate-900' : 'bg-[#050a19]/60 backdrop-blur-xl'}`;
    const avatarStyle = "text-5xl mb-3 drop-shadow-md";
    const nameStyle = "font-bold text-lg text-slate-300 uppercase tracking-widest";
    const scoreStyle = "text-4xl font-black text-white mt-2";

    // Button Styles
    const btnBase = "w-20 h-20 rounded-full flex items-center justify-center text-3xl border-2 transition-all duration-200 active:scale-90 hover:scale-105";
    const btnDefault = "bg-white/5 border-white/10 text-white hover:bg-white/10";
    const btnSelected = "bg-cyan-400 border-white text-black shadow-[0_0_20px_rgba(0,229,255,0.6)] scale-110";

    return (
        <div className="w-full flex flex-col items-center min-h-full p-4 lg:p-8">

            {/* Header / Logo */}
            <div className="mb-8 text-center animate-fadeIn">
                <div className="text-2xl font-black tracking-widest text-fuchsia-400 flex items-center gap-3 drop-shadow-[0_0_10px_rgba(213,0,249,0.5)]">
                    <i className="fa-solid fa-hand-sparkles"></i> PSYCHIC HAND
                </div>
            </div>

            {/* Game Board Container (Responsive Grid) */}
            <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-6 lg:gap-12 w-full max-w-5xl flex-1">

                {/* 1. BOT PANEL */}
                <div className={`${panelStyle} border-fuchsia-500/20 shadow-[0_0_30px_rgba(213,0,249,0.1)]`}>
                    <div className={avatarStyle}>🔮</div>
                    <div className={nameStyle} style={{ color: '#d500f9' }}>The Psychic</div>
                    <div className={scoreStyle}>{score.bot}</div>

                    {/* Bot Move Display */}
                    <div className="mt-6 w-24 h-24 flex items-center justify-center bg-black/30 rounded-2xl border border-white/5 text-5xl">
                        {getIcon(aiMove)}
                    </div>
                </div>

                {/* 2. CENTER STAGE (The Arena) */}
                <div className="flex-1 w-full max-w-md flex flex-col items-center gap-8 py-4">

                    {/* Status Pill */}
                    <div
                        className={`px-6 py-2 rounded-full font-black text-sm uppercase tracking-[0.2em] shadow-lg transition-colors duration-300
                        ${result === 'win' ? 'bg-[#00e676] text-black' : result === 'lose' ? 'bg-[#ff1744] text-white' : 'bg-[#ffd700] text-black'}
                        `}
                    >
                        {result ? result : "CHOOSE WISELY"}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 justify-center">
                        {['R', 'P', 'S'].map((move) => (
                            <button
                                key={move}
                                className={`${btnBase} ${selectedMove === move ? btnSelected : btnDefault}`}
                                onClick={() => handleMove(move)}
                            >
                                {getIcon(move)}
                            </button>
                        ))}
                    </div>

                    {/* History Log */}
                    <div className="w-full bg-black/20 rounded-2xl p-4 border border-white/5 backdrop-blur-sm">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest text-center mb-3">RECENT VISIONS</h4>
                        <div className="flex justify-center flex-wrap gap-2">
                            {history.map((h, i) => (
                                <div
                                    key={i}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border flex gap-2 items-center
                                    ${h.r === 'win' ? 'border-green-500/30 bg-green-500/10 text-green-400' : 'border-red-500/30 bg-red-500/10 text-red-400'}
                                    `}
                                >
                                    <span>{getIcon(h.u)}</span>
                                    <span className="opacity-50 text-[10px]">VS</span>
                                    <span>{getIcon(h.a)}</span>
                                </div>
                            ))}
                            {history.length === 0 && <span className="text-slate-600 text-xs italic">No moves yet...</span>}
                        </div>
                    </div>
                </div>

                {/* 3. PLAYER PANEL */}
                <div className={`${panelStyle} border-cyan-500/20 shadow-[0_0_30px_rgba(0,229,255,0.1)]`}>
                    <div className={avatarStyle}>👤</div>
                    <div className={nameStyle} style={{ color: '#00e5ff' }}>You</div>
                    <div className={scoreStyle}>{score.user}</div>
                </div>

            </div>
        </div>
    );
}