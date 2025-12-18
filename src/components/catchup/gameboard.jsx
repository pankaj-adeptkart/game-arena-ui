
import ReplayTimeline from "../../components/replay/ReplayTimeline";
import { DesktopControlPanel, PlayAgainButton, ReplayButton } from "../../components/catchup/buttons/PlayButton";
import PlayerCard from "./buttons/PlayerCardButton";
import GameGrid from "./buttons/GameGrid";
import { useLowPowerMode } from "../../config/useLowPowerMode"; // Added Hook

/* =====================================
   BASE PANEL (internal reusable)
===================================== */
function BasePlayerPanel({ avatar, name, wins, score, active, isP1Turn, tiltOptions }) {
    return (
        <div className="w-full flex justify-center lg:h-full lg:items-start">
            <PlayerCard
                avatar={avatar}
                name={name}
                wins={wins}
                score={score}
                active={active}
                isP1Turn={isP1Turn}
                className="w-full max-w-[500px] lg:max-w-none"
            />
        </div>
    );
}

/* =====================================
   PLAYER 1 PANEL
===================================== */
export function Player1Panel({ avatar, wins, scores, isP1Turn, tiltOptions, names }) {
    return (
        <BasePlayerPanel
            avatar={avatar}
            name={names.p1}
            wins={wins.p1}
            score={scores.p1}
            active={isP1Turn}
            isP1Turn={true}
            tiltOptions={tiltOptions}
        />
    );
}

/* =====================================
   PLAYER 2 PANEL
===================================== */
export function Player2Panel({ avatar, wins, scores, isP1Turn, tiltOptions, names }) {
    return (
        <BasePlayerPanel
            avatar={avatar}
            name={names.p2}
            wins={wins.p2}
            score={scores.p2}
            active={!isP1Turn}
            isP1Turn={false}
            tiltOptions={tiltOptions}
        />
    );
}

/* =====================================================
   CENTER GAME BOARD
===================================================== */
export function CenterStageBoard({
    isP1Turn, status, gridRef, available, selected, botPreview, handleBallClick,
    gameStarted, mode, undoStackRef, redoStackRef, handleUndo, handleRedo, confirmMove
}) {
    return (
        <div className="w-full flex flex-col items-center">
            {/* 1. THE STATUS HUD & GRID */}
            <div className="w-full">
                <GameGrid
                    status={status}
                    isP1Turn={isP1Turn}
                    available={available}
                    selected={selected}
                    botPreview={botPreview}
                    handleBallClick={handleBallClick}
                />
            </div>

            {/* 2. DESKTOP CONTROLS (Only visible on large screens) */}
            <div className="w-full mt-6 hidden lg:block">
                <DesktopControlPanel
                    gameStarted={gameStarted}
                    undoStackRef={undoStackRef}
                    redoStackRef={redoStackRef}
                    handleUndo={handleUndo}
                    handleRedo={handleRedo}
                    selected={selected}
                    confirmMove={confirmMove}
                    mode={mode}
                />
            </div>
        </div>
    );
}

/* =====================================================
   POST GAME + REPLAY (MERGED)
===================================================== */
export function ReplayPanel({
    gameStarted, history, showReplay, setShowReplay, setShowPlayAgain, startGame, previewState, names
}) {
    const isLowPower = useLowPowerMode(); // OPTIMIZATION

    if (gameStarted || history.length === 0) return null;

    return (
        <div className="w-full flex flex-col items-center gap-6 mt-6 animate-fadeIn">

            {/* ACTION BUTTONS */}
            <div className="w-full max-w-[360px] flex flex-col gap-4">
                <PlayAgainButton
                    startGame={startGame}
                    setShowPlayAgain={setShowPlayAgain}
                    setShowReplay={setShowReplay}
                    className="w-full"
                />

                <ReplayButton
                    setShowReplay={setShowReplay}
                    className="w-full"
                />
            </div>

            {/* REPLAY TIMELINE */}
            {showReplay && (
                <div className="w-full max-w-[720px] lg:max-w-[900px] mt-4">
                    <div className={`
                        rounded-2xl p-2 md:p-4 border border-white/10
                        ${isLowPower
                            ? "bg-slate-950 shadow-md"
                            : "bg-slate-950/40 backdrop-blur-xl shadow-2xl"}
                    `}>
                        <ReplayTimeline
                            history={history}
                            onPreview={previewState}
                            playerNames={names}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}