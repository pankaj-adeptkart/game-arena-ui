import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import confetti from 'canvas-confetti';
import { API_URL } from '../../config/config';
import { sfx } from '../../config/audio';
import { useLowPowerMode } from '../../config/useLowPowerMode';

const MySwal = withReactContent(Swal);

/* =========================
   UTILITIES
========================= */
const speak = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = 0.8;
    utterance.rate = 1.1;
    window.speechSynthesis.speak(utterance);
};

const fireFireworks = () => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };
    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) return clearInterval(interval);
        const particleCount = 50 * (timeLeft / duration);
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
};

/* =========================
   MAIN HOOK
========================= */
export function useCatchUpGame(profile) {
    const isLowPower = useLowPowerMode();
    const [available, setAvailable] = useState([]);
    const [selected, setSelected] = useState([]);
    const [scores, setScores] = useState({ p1: 0, p2: 0 });
    const [wins, setWins] = useState({ p1: 0, p2: 0 });
    const [isP1Turn, setIsP1Turn] = useState(true);
    const [gameStarted, setGameStarted] = useState(false);
    const [mode, setMode] = useState('hvbot');
    const [names, setNames] = useState({ p1: "AI Bot", p2: profile?.name || "You" });
    const [status, setStatus] = useState("PRESS START");
    const [turbo, setTurbo] = useState(false);
    const [installPrompt, setInstallPrompt] = useState(null);
    const [history, setHistory] = useState([]);
    const [aiDepth, setAiDepth] = useState(4);
    const [hoverScore, setHoverScore] = useState(null);
    const [glitchActive, setGlitchActive] = useState(false);
    const gridRef = useRef();
    const [p1NameInput, setP1NameInput] = useState(profile?.name || "");
    const [p2NameInput, setP2NameInput] = useState("");
    const [botPreview, setBotPreview] = useState([]);

    // UI Helpers
    const isTV = window.innerWidth >= 1600;
    const [ballCount, setBallCount] = useState(10);
    const finalScoresRef = useRef({ p1: 0, p2: 0 });
    const [showSettings, setShowSettings] = useState(true);

    // Replay State
    const [previewIndex, setPreviewIndex] = useState(null);
    const [isReplaying, setIsReplaying] = useState(false);
    const botTurnHandledRef = useRef(false);
    const undoStackRef = useRef([]);
    const redoStackRef = useRef([])

    /* =========================
       LOGIC: REPLAY PREVIEW
       (Refactored: Removed GSAP animation)
    ========================= */
    const previewState = (step, index, animated = false) => {
        if (gameStarted) return;
        setIsReplaying(true);
        setPreviewIndex(index);

        setAvailable(step.available);
        setScores(step.scores);
        finalScoresRef.current = step.scores;
    };

    // --- EFFECTS ---
    useEffect(() => {
        const handler = (e) => { e.preventDefault(); setInstallPrompt(e); };
        window.addEventListener('beforeinstallprompt', handler);
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    useEffect(() => {
        if (!gameStarted) { sfx.bg.rate(1.0); return; }
        const totalBalls = available.length || 10;
        const progress = 1 - (available.length / totalBalls);
        sfx.bg.rate(1.0 + (progress * 0.5));
    }, [available.length, gameStarted]);

    /* =========================
       LOGIC: START GAME
    ========================= */
    const startGame = () => {
        undoStackRef.current = [];
        redoStackRef.current = [];
        setHistory([]);
        finalScoresRef.current = { p1: 0, p2: 0 };
        setIsReplaying(false);
        setPreviewIndex(null);

        const count = ballCount;
        setAvailable(Array.from({ length: count }, (_, i) => i + 1));
        setScores({ p1: 0, p2: 0 });
        setSelected([]);
        setGameStarted(true);
        setShowSettings(false);
        setIsP1Turn(true);

        let newNames = { ...names };
        if (mode === 'bvb') newNames = { p1: "Bot 1", p2: "Bot 2" };
        else if (mode === 'hvbot') newNames = { p1: p1NameInput || profile?.name || "You", p2: "AI Bot" };
        else newNames = { p1: p1NameInput || "Player 1", p2: p2NameInput || "Player 2" };
        setNames(newNames);

        setStatus("GAME STARTED");
        speak("GAME STARTED");
        sfx.bg.stop(); sfx.bg.play();
    };

    const handleBallClick = (num) => {
        if (!gameStarted) return;
        if (mode === "hvbot" && !isP1Turn) return;
        if (mode === "bvb") return;

        setSelected(prev =>
            prev.includes(num)
                ? prev.filter(n => n !== num)
                : [...prev, num]
        );
    };

    const confirmMove = async () => {
        try {
            const res = await axios.post(`${API_URL}/validate`, { available, p1: scores.p1, p2: scores.p2, move: selected });
            if (res.data.valid) applyMove(selected);
            else {
                MySwal.fire({ icon: 'error', title: 'Invalid Move', text: res.data.reason, background: '#1a1a1a', color: '#fff' });
                speak("Invalid Move.");
            }
        } catch (err) { console.error(err); }
    };

    /* =========================
       LOGIC: APPLY MOVE
    ========================= */
    const applyMove = (nums) => {
        console.log("APPLY MOVE", isP1Turn ? "P1" : "P2");

        // Save undo snapshot
        undoStackRef.current.push({
            available: [...available],
            scores: { ...scores },
            isP1Turn,
        });
        redoStackRef.current = [];

        const sum = nums.reduce((a, b) => a + b, 0);
        const currentP1 = isP1Turn;

        // 1. Compute next scores
        const updatedScores = {
            ...scores,
            [currentP1 ? "p1" : "p2"]: scores[currentP1 ? "p1" : "p2"] + sum
        };

        // 2. Commit scores
        finalScoresRef.current = updatedScores;
        setScores(updatedScores);

        // 3. Compute next available numbers
        const nextAvailable = available.filter(n => !nums.includes(n));
        setAvailable(nextAvailable);

        // 4. Save history
        if (!isReplaying) {
            setHistory(h => [
                ...h,
                {
                    available: nextAvailable,
                    scores: updatedScores,
                    by: currentP1 ? "p1" : "p2"
                }
            ]);
        }

        // 5. Switch Turn
        setSelected([]);
        sfx.switch.play();
        setIsP1Turn(!currentP1);
        botTurnHandledRef.current = false;

        // Optional: Trigger CSS animation for score pop
        requestAnimationFrame(() => {
            document.querySelectorAll('.current-score').forEach(el => {
                el.classList.remove('score-pop');
                void el.offsetWidth;
                el.classList.add('score-pop');
            });
        });
    };

    /* =========================
       LOGIC: BOT & GAME OVER
    ========================= */
    useEffect(() => {
        if (!gameStarted || available.length === 0) return;
        const isBotTurn = (mode === 'bvb') || (mode === 'hvbot' && !isP1Turn);
        if (isBotTurn) {
            setStatus(`BOT (Level ${aiDepth}) Thinking...`);
            setTimeout(async () => {
                try {
                    const res = await axios.post(`${API_URL}/ai-move`, {
                        available_numbers: available, player1_score: scores.p1, player2_score: scores.p2,
                        is_p1_turn: mode === 'bvb' ? isP1Turn : false, difficulty: aiDepth
                    });
                    if (res.data.move) {
                        setBotPreview(res.data.move); // 👀 show robot selection

                        setTimeout(() => {
                            setBotPreview([]);
                            applyMove(res.data.move);
                        }, turbo ? 400 : 900);
                    }
                } catch (err) { console.error(err); setStatus("API ERROR"); }
            }, turbo ? 100 : 1000);
        } else {
            setStatus(`${isP1Turn ? names.p1 : names.p2}'S TURN`);
        }
        if (botTurnHandledRef.current) return;
        botTurnHandledRef.current = true;
    }, [isP1Turn, gameStarted, mode]);

    useEffect(() => {
        if (gameStarted && available.length === 0) {
            sfx.bg.fade(0.3, 0, 1000);
            setTimeout(() => sfx.bg.stop(), 1000);
            sfx.win.play();
            fireFireworks();

            let winner = scores.p1 > scores.p2 ? names.p1 : (scores.p2 > scores.p1 ? names.p2 : "DRAW");
            let wColor = scores.p1 > scores.p2 ? "#00e5ff" : "#d500f9";
            if (scores.p1 > scores.p2) setWins(p => ({ ...p, p1: p.p1 + 1 }));
            else if (scores.p2 > scores.p1) setWins(p => ({ ...p, p2: p.p2 + 1 }));

            setGameStarted(false);
            setStatus(winner + " WINS!");

            MySwal.fire({
                html: `
                <div style="font-family:'Orbitron'">
                  <h1 style="color:${wColor}">${winner} WINS!</h1>
                  <p style="color:#ccc">SCORE: ${finalScoresRef.current.p1} - ${finalScoresRef.current.p2}</p>
                </div>`,
                background: 'rgba(20,20,30,0.9)',
                confirmButtonText: 'CLOSE',
                confirmButtonColor: wColor
            });
        }
    }, [available]);

    useEffect(() => {
        if (mode === 'hvbot' && profile?.name) {
            setNames(prev => ({
                ...prev,
                p1: profile.name
            }));
        }
    }, [profile?.name]);

    const handleInstall = () => { if (installPrompt) { installPrompt.prompt(); setInstallPrompt(null); } };

    const tiltOptions = {
        max: isLowPower ? 5 : 15,
        scale: isLowPower ? 1.02 : 1.05,
        speed: 300,
        glare: !isLowPower,
    };

    const resetGameSession = (keepWins = false, clearReplay = false) => {
        redoStackRef.current = [];
        undoStackRef.current = [];
        setAvailable([]);
        setSelected([]);
        setScores({ p1: 0, p2: 0 });
        if (clearReplay) { setHistory([]); setPreviewIndex(null); }
        setGameStarted(false);
        setIsP1Turn(true);
        setStatus("PRESS START");
        if (!keepWins) setWins({ p1: 0, p2: 0 });
    };

    const getAvatarConfig = (player) => {
        let type = "robot", color = "#00e5ff", variant = "box";

        if (mode === 'bvb') {
            type = "robot";
            if (player === 'p1') { color = "#00e5ff"; variant = "box"; }
            else { color = "#d500f9"; variant = "round"; }
        } else if (mode === 'hvbot') {
            if (player === 'p1') { type = "human"; color = "#00e5ff"; }
            else { type = "robot"; color = "#d500f9"; variant = "round"; }
        } else {
            type = "human";
            if (player === 'p1') color = "#00e5ff";
            else color = "#ff9100";
        }

        let currentAction = "Idle";
        if (available.length === 0) {
            const myScore = scores[player];
            const oppScore = scores[player === 'p1' ? 'p2' : 'p1'];
            currentAction = myScore > oppScore ? "Win" : (myScore < oppScore ? "Lose" : "Idle");
        } else if (gameStarted) {
            const isMyTurn = (player === 'p1' && isP1Turn) || (player === 'p2' && !isP1Turn);
            if (isMyTurn) currentAction = "Thinking";
        }

        return {
            type,
            color,
            variant,
            actionName: currentAction,
            name: names[player]
        };
    };

    return {
        available, selected, scores, wins, isP1Turn, gameStarted,
        mode, names, status, setStatus, turbo, history, setHistory, aiDepth, hoverScore, setHoverScore,
        glitchActive, gridRef, p1NameInput, p2NameInput, ballCount,
        showSettings, previewIndex, isReplaying, isTV, sfx,

        setMode, setAiDepth, setBallCount, setP1NameInput,
        setP2NameInput, setTurbo, setShowSettings,

        startGame, confirmMove, handleBallClick,
        resetGameSession, handleInstall, tiltOptions, getAvatarConfig,
        previewState, installPrompt, setIsReplaying, setPreviewIndex,

        setGlitchActive, setAvailable, setScores, setIsP1Turn, setSelected,
        undoStackRef, redoStackRef,
        botPreview, setBotPreview,
    };
}