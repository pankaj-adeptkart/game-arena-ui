import React from "react";
import GameHeader from "./buttons/InputButton";

export default function SettingsBar({
    mode,
    setMode,
    aiDepth,
    setAiDepth,
    ballCount,
    setBallCount,
    gameStarted,
    startGame,
    p1Name,
    setP1Name,
    p2Name,
    setP2Name,
    isTV,
}) {
    const tvFocus = isTV ? ` focus-visible:outline-none focus-visible:ring-4 
    focus-visible:ring-cyan-400 focus-visible:ring-offset-4
    focus-visible:ring-offset-black focus-visible:shadow-[0_0_30px_rgba(0,229,255,0.9)]`
        : "";


    return (

        <GameHeader
            gameStarted={gameStarted}
            mode={mode}
            setMode={setMode}
            aiDepth={aiDepth}
            setAiDepth={setAiDepth}
            ballCount={ballCount}
            setBallCount={setBallCount}
            startGame={startGame}
            p1Name={p1Name}
            setP1Name={setP1Name}
            p2Name={p2Name}
            setP2Name={setP2Name}
        />

    );
}
