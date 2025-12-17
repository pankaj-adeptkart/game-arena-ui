// Leaderboard.jsx
import React, { useEffect, useState } from 'react';
import { load, save } from '../utils/storage';

export default function Leaderboard({ id = 'global' }) {
    const [list, setList] = useState(load('leaderboard', {}));

    useEffect(() => { save('leaderboard', list); }, [list]);

    const addScore = (name, score, meta = '') => {
        setList(prev => {
            const arr = (prev[id] || []);
            const newArr = [{ name, score, meta, ts: Date.now() }, ...arr].slice(0, 50)
                .sort((a, b) => b.score - a.score);
            return { ...prev, [id]: newArr };
        });
    };

    const clear = () => setList({});

    return (
        <div className="leaderboard card">
            <div className="lb-header">
                <h3>Leaderboard</h3>
                <div>
                    <button className="btn" onClick={clear}>Clear</button>
                </div>
            </div>

            <ol className="lb-list">
                {(list[id] || []).map((r, i) => (
                    <li key={r.ts} className="lb-row">
                        <span className="pos">{i + 1}</span>
                        <span className="who">{r.name}</span>
                        <span className="score">{r.score}</span>
                    </li>
                ))}
                {(!(list[id] || []).length) && <li className="empty">No scores yet</li>}
            </ol>

            {/* A tiny control to test adding a score — remove in production */}
            <div className="lb-actions">
                <button className="btn" onClick={() => addScore('You', Math.floor(Math.random() * 100), 'test')}>Add random</button>
            </div>
        </div>
    );
}
