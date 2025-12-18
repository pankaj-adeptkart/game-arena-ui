import { useEffect, useState, useMemo } from "react";
import { useCatchUpGame } from "./useCatchUpGame";
import { useLowPowerMode } from "../../config/useLowPowerMode";
import SettingsBar from "../../components/catchup/SettingsBar";
import {
    CenterStageBoard, ReplayPanel,
    Player1Panel, Player2Panel
} from "../../components/catchup/gameboard";
import MobileActionBar from "../../components/catchup/MobileActionBar";
import DesktopFooterControls from "../../components/catchup/FooterControls";
import { RenderAvatar3D } from "../../renderers/catchup_game/renderAvatar3D";

export default function CatchUpGame({ profile }) {
    // 1. DETECT LOW POWER MODE
    const isLowPower = useLowPowerMode();
    const game = useCatchUpGame(profile);

    const {
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
    } = game;

    /* ===============================
        UI STATE ONLY
    =============================== */
    const [showPlayAgain, setShowPlayAgain] = useState(false);
    const [showReplay, setShowReplay] = useState(false);

    useEffect(() => {
        if (!gameStarted && available.length === 0) {
            const t = setTimeout(() => setShowPlayAgain(true), 200);
            return () => clearTimeout(t);
        }
    }, [gameStarted, available.length]);

    const handleUndo = () => { if (!gameStarted || mode === "bvb") return; const undoStack = undoStackRef.current; if (undoStack.length === 0) return; const steps = mode === "hvbot" ? 2 : 1; let snapshot = null; for (let i = 0; i < steps && undoStack.length; i++) { snapshot = undoStack.pop(); } if (!snapshot) return; redoStackRef.current.push({ available: [...available], scores: { ...scores }, isP1Turn }); setAvailable(snapshot.available); setScores(snapshot.scores); setIsP1Turn(snapshot.isP1Turn); setSelected([]); setStatus("UNDO"); };
    const handleRedo = () => { if (!gameStarted || mode === "bvb") return; const redoStack = redoStackRef.current; if (redoStack.length === 0) return; const snapshot = redoStack.pop(); undoStackRef.current.push({ available: [...available], scores: { ...scores }, isP1Turn }); setAvailable(snapshot.available); setScores(snapshot.scores); setIsP1Turn(snapshot.isP1Turn); setSelected([]); setStatus("REDO"); };

    const optimizedTiltOptions = useMemo(() => {
        return isLowPower ? { tiltEnable: false, glareEnable: false } : { max: 10, scale: 1.02, glare: true, "max-glare": 0.2 };
    }, [isLowPower]);

    return (
        <div className={`
            relative w-full h-[100dvh] overflow-hidden
            bg-[#050508]/30 text-white font-sans selection:bg-cyan-500/30
            flex flex-col
            ${glitchActive ? "glitch-anim" : ""}
        `}>

            {/* --- 0. BACKGROUND LAYER --- */}
            <div className="fixed inset-0 pointer-events-none z-0">
                {!isLowPower && (
                    <>
                        <div className="absolute top-[-20%] left-[20%] w-[50vw] h-[50vw] bg-cyan-900/10 rounded-full blur-[100px]" />
                        <div className="absolute bottom-[-20%] right-[20%] w-[50vw] h-[50vw] bg-fuchsia-900/10 rounded-full blur-[100px]" />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#050508_90%)]" />
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] opacity-30 [transform:perspective(1000px)_rotateX(20deg)] origin-bottom" />
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]" />
                    </>
                )}
            </div>

            {/* --- MAIN CONTENT LAYER --- */}
            <div className="relative z-10 flex flex-col h-full w-full max-w-[1600px] mx-auto p-0 md:p-4 gap-0 md:gap-4">

                {/* 1. HEADER (Settings) */}
                <div className="flex-none z-30 px-2 pt-2 md:px-0 md:pt-0">
                    <SettingsBar
                        mode={mode} setMode={setMode} aiDepth={aiDepth} setAiDepth={setAiDepth} ballCount={ballCount} setBallCount={setBallCount} gameStarted={gameStarted} startGame={startGame} p1Name={p1NameInput} setP1Name={setP1NameInput} p2Name={p2NameInput} setP2Name={setP2NameInput} isTV={isTV}
                    />
                </div>

                {/* 2. GAME ARENA */}
                {/* FIX: 'hidden lg:flex' ensures that on MOBILE, this entire section is hidden until gameStarted is true */}
                <div className={`
                    flex-1 min-h-0 relative items-center justify-center
                    ${!gameStarted ? "hidden lg:flex" : "flex"} 
                `}>

                    {/* LAYOUT GRID */}
                    <div className={`
                        w-full h-full 
                        flex flex-col lg:grid lg:grid-cols-[minmax(260px,320px)_1fr_minmax(260px,320px)]
                        /* Mobile Spacing */
                        gap-2 p-2 pb-32
                        /* Desktop Spacing */
                        lg:gap-8 lg:p-4 lg:pb-0
                        overflow-y-auto lg:overflow-visible no-scrollbar
                    `}>

                        {/* --- TOP: PLAYER 1 --- */}
                        <div className={`
                            w-full max-w-md mx-auto lg:max-w-none flex-shrink-0 min-h-[80px] order-1 lg:order-1 transition-all duration-700
                            ${!gameStarted ? 'opacity-40 blur-sm scale-95 lg:opacity-100 lg:blur-0 lg:scale-100' : 'opacity-100'}
                        `}>
                            <Player1Panel avatar={<RenderAvatar3D player="p1" mode={mode} isTurn={isP1Turn} scores={scores} available={available} names={names} />} wins={wins} scores={scores} isP1Turn={isP1Turn} tiltOptions={optimizedTiltOptions} names={names} />
                        </div>

                        {/* --- CENTER: BOARD --- */}
                        <div className="w-full flex flex-col items-center justify-center order-2 lg:order-2 z-20 my-auto">
                            <CenterStageBoard
                                isP1Turn={isP1Turn}
                                status={status}
                                gridRef={gridRef}
                                available={available}
                                selected={selected}
                                botPreview={botPreview}
                                handleBallClick={handleBallClick}
                                gameStarted={gameStarted}
                                mode={mode}
                                undoStackRef={undoStackRef}
                                redoStackRef={redoStackRef}
                                handleUndo={handleUndo}
                                handleRedo={handleRedo}
                                confirmMove={confirmMove}
                            />

                            <ReplayPanel
                                gameStarted={gameStarted}
                                history={history}
                                showReplay={showReplay}
                                setShowReplay={setShowReplay}
                                setShowPlayAgain={setShowPlayAgain}
                                startGame={startGame}
                                previewState={previewState}
                                names={names}
                            />
                        </div>

                        {/* --- BOTTOM: PLAYER 2 --- */}
                        <div className={`
                            w-full max-w-md mx-auto lg:max-w-none flex-shrink-0 min-h-[80px] order-3 lg:order-3 transition-all duration-700
                            ${!gameStarted ? 'opacity-40 blur-sm scale-95 lg:opacity-100 lg:blur-0 lg:scale-100' : 'opacity-100'}
                        `}>
                            <Player2Panel avatar={<RenderAvatar3D player="p2" mode={mode} isTurn={!isP1Turn} scores={scores} available={available} names={names} />} wins={wins} scores={scores} isP1Turn={isP1Turn} tiltOptions={optimizedTiltOptions} names={names} />
                        </div>

                    </div>
                </div>

                {/* 3. DESKTOP FOOTER */}
                <div className="flex-none z-30 hidden lg:block">
                    <DesktopFooterControls turbo={turbo} setTurbo={setTurbo} resetGameSession={resetGameSession} setShowSettings={setShowSettings} setStatus={setStatus} sfx={sfx} />
                </div>
            </div>

            {/* --- 4. MOBILE ACTION BAR (Fixed Bottom) --- */}
            <MobileActionBar
                gameStarted={gameStarted}
                available={available}
                history={history}
                selected={selected}
                mode={mode}
                turbo={turbo}
                undoStackRef={undoStackRef}
                handleUndo={handleUndo}
                handleRedo={handleRedo}
                redoStackRef={redoStackRef}
                confirmMove={confirmMove}
                setTurbo={setTurbo}
                setShowReplay={setShowReplay}
                setShowPlayAgain={setShowPlayAgain}
                startGame={startGame}
                resetGameSession={resetGameSession}
                setShowSettings={setShowSettings}
                setStatus={setStatus}
                sfx={sfx}
            />
        </div>
    );
}