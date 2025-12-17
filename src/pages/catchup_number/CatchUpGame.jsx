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

    /* Show PLAY AGAIN only AFTER popup closed */
    useEffect(() => {
        if (!gameStarted && available.length === 0) {
            const t = setTimeout(() => setShowPlayAgain(true), 200);
            return () => clearTimeout(t);
        }
    }, [gameStarted, available.length]);


    const handleUndo = () => {
        if (!gameStarted || mode === "bvb") return;
        const undoStack = undoStackRef.current;
        if (undoStack.length === 0) return;

        const steps = mode === "hvbot" ? 2 : 1;
        let snapshot = null;
        for (let i = 0; i < steps && undoStack.length; i++) {
            snapshot = undoStack.pop();
        }
        if (!snapshot) return;

        redoStackRef.current.push({ available: [...available], scores: { ...scores }, isP1Turn });

        // State updates immediately after
        setAvailable(snapshot.available);
        setScores(snapshot.scores);
        setIsP1Turn(snapshot.isP1Turn);
        setSelected([]);
        setStatus("UNDO");
    };

    const handleRedo = () => {
        if (!gameStarted || mode === "bvb") return;
        const redoStack = redoStackRef.current;
        if (redoStack.length === 0) return;

        const snapshot = redoStack.pop();
        undoStackRef.current.push({ available: [...available], scores: { ...scores }, isP1Turn });

        setAvailable(snapshot.available);
        setScores(snapshot.scores);
        setIsP1Turn(snapshot.isP1Turn);
        setSelected([]);
        setStatus("REDO");
    };

    // OPTIMIZATION: Disable Tilt on Low Power Mode
    const optimizedTiltOptions = useMemo(() => {
        return isLowPower
            ? { tiltEnable: false, glareEnable: false }
            : { max: 10, scale: 1.02, glare: true, "max-glare": 0.2 };
    }, [isLowPower]);

    return (
        <div className={`
            relative min-h-screen w-full overflow-x-hidden
            bg-[#0B0C15]/90 text-white font-sans selection:bg-cyan-500/30
            ${glitchActive ? "glitch-anim" : ""}
        `}>

            {/* --- GLOBAL AMBIENT GLOW (OPTIMIZED) --- */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                {!isLowPower && (
                    <>
                        <div className="absolute -top-[10%] -left-[10%] w-[60vw] h-[60vw] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
                        <div className="absolute -bottom-[10%] -right-[10%] w-[60vw] h-[60vw] bg-fuchsia-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '1s' }} />
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]" />
                    </>
                )}
                {/* Low Power fallback: Just the dark background color defined in parent div */}
            </div>

            {/* --- MAIN CONTENT LAYER --- */}
            <div className="relative z-10 flex flex-col min-h-screen p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto">

                {/* 1. HEADER / SETTINGS */}
                <div className={`mb-6 lg:mb-10 transition-all duration-500 ${!gameStarted ? 'mt-[10vh] lg:mt-0' : ''}`}>
                    <SettingsBar
                        mode={mode}
                        setMode={setMode}
                        aiDepth={aiDepth}
                        setAiDepth={setAiDepth}
                        ballCount={ballCount}
                        setBallCount={setBallCount}
                        gameStarted={gameStarted}
                        startGame={startGame}
                        p1Name={p1NameInput}
                        setP1Name={setP1NameInput}
                        p2Name={p2NameInput}
                        setP2Name={setP2NameInput}
                        isTV={isTV}
                    />
                </div>

                {/* 2. GAME ARENA */}
                <div className={`
                    flex-1 flex-col lg:flex-row items-start justify-center gap-6 xl:gap-12 pb-40 lg:pb-0
                    ${!gameStarted ? "hidden lg:flex" : "flex"} 
                `}>

                    {/* LEFT: PLAYER 1 */}
                    <div className="w-full lg:w-auto order-1 lg:order-1 flex flex-col gap-6">
                        <Player1Panel
                            avatar={
                                <RenderAvatar3D
                                    player="p1"
                                    mode={mode}
                                    isTurn={isP1Turn}
                                    scores={scores}
                                    available={available}
                                    names={names}
                                />
                            }
                            wins={wins}
                            scores={scores}
                            isP1Turn={isP1Turn}
                            tiltOptions={optimizedTiltOptions}
                            names={names}
                        />
                    </div>

                    {/* CENTER: GAME BOARD */}
                    <div className="w-full flex-1 order-2 lg:order-2 flex flex-col items-center">
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

                        {/* REPLAY PANEL */}
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

                    {/* RIGHT: PLAYER 2 */}
                    <div className="w-full lg:w-auto order-3 lg:order-3 flex flex-col gap-6">
                        <Player2Panel
                            avatar={
                                <RenderAvatar3D
                                    player="p2"
                                    mode={mode}
                                    isTurn={!isP1Turn}
                                    scores={scores}
                                    available={available}
                                    names={names}
                                />
                            }
                            wins={wins}
                            scores={scores}
                            isP1Turn={isP1Turn}
                            tiltOptions={optimizedTiltOptions}
                            names={names}
                        />
                    </div>

                </div>

            </div>

            {/* --- MOBILE ACTION BAR (Fixed Bottom) --- */}
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

            {/* --- DESKTOP FOOTER CONTROLS --- */}
            <DesktopFooterControls
                turbo={turbo}
                setTurbo={setTurbo}
                resetGameSession={resetGameSession}
                setShowSettings={setShowSettings}
                setStatus={setStatus}
                sfx={sfx}
            />

        </div>
    );
}