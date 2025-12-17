// Spectator.jsx
import React, { useEffect, useState, useRef } from 'react';
import { play, vibrate } from '../utils/audio';

const MOVES = ['R', 'P', 'S'];
function rand() { return MOVES[Math.floor(Math.random() * 3)]; }
function result(a, b) { // a vs b from perspective of a
    if (a === b) return 'draw';
    if ((a === 'R' && b === 'S') || (a === 'S' && b === 'P') || (a === 'P' && b === 'R')) return 'win';
    return 'lose';
}

export default function Spectator({ speed = 800 }) {
    const [log, setLog] = useState([]);
    const [running, setRunning] = useState(false);
    const timerRef = useRef();

    useEffect(() => {
        if (running) {
            timerRef.current = setInterval(() => {
                const a = rand(), b = rand();
                const r = result(a, b);
                setLog(prev => [{ a, b, r, ts: Date.now() }, ...prev].slice(0, 50));
                if (r === 'win') play('pop');
                vibrate(30);
            }, speed);
        }
        return () => clearInterval(timerRef.current);
    }, [running, speed]);

    return (
        <div className="spectator card">
            <div className="spec-head">
                <h4>Spectator</h4>
                <div>
                    <button className="btn" onClick={() => setRunning(v => !v)}>{running ? 'Pause' : 'Play'}</button>
                </div>
            </div>

            <div className="spec-log">
                {log.slice(0, 8).map((it, i) => (
                    <div key={it.ts} className="spec-row">
                        <span className="who">BotA {it.a}</span>
                        <span className="vs">vs</span>
                        <span className="who">BotB {it.b}</span>
                        <span className={`res ${it.r}`}>{it.r}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
