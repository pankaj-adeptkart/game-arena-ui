import { useEffect, useRef } from "react";
import { getAiMove } from "../../services/catchup_number/gameApi";

export function useBotController({
    enabled,
    gameStarted,
    available,
    scores,
    aiDepth,
    applyMove,
    setStatus
}) {
    const handledRef = useRef(false);

    useEffect(() => {
        if (!enabled || !gameStarted || available.length === 0) return;
        if (handledRef.current) return;

        handledRef.current = true;
        setStatus("BOT THINKING...");

        setTimeout(async () => {
            const res = await getAiMove({
                available_numbers: available,
                player1_score: scores.p1,
                player2_score: scores.p2,
                is_p1_turn: false,
                difficulty: aiDepth
            });

            if (res?.data?.move) applyMove(res.data.move);
            handledRef.current = false;
        }, 700);
    }, [enabled, gameStarted, available]);
}
