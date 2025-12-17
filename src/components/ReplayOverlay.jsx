// ReplayOverlay.jsx
import React, { useEffect } from 'react';

export default function ReplayOverlay({ round, onClose }) {
    // round: { user, ai, result }
    useEffect(() => {
        const t = setTimeout(() => onClose && onClose(), 1200);
        return () => clearTimeout(t);
    }, [round]);

    if (!round) return null;
    return (
        <div className="replay-overlay">
            <div className="replay-card glow">
                <div className="large-move">{round.user}</div>
                <div className="vs">→ {round.result}</div>
                <div className="large-move right">{round.ai}</div>
            </div>
        </div>
    );
}
