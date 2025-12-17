// Achievements.jsx
import React, { useEffect, useState } from 'react';
import { load, save } from '../utils/storage';

const ALL = [
    { id: 'first_win', title: 'First Win', desc: 'Win your first match' },
    { id: 'streak3', title: '3 Win Streak', desc: 'Win 3 matches in a row' },
    { id: 'beat_bot5', title: 'Beat Bot Level 5', desc: 'Defeat Bot Lv 5' },
];

export default function Achievements({ events }) {
    // events is optional function/observable you can call to notify achievement checks
    const [unlocked, setUnlocked] = useState(load('achievements', []));
    useEffect(() => save('achievements', unlocked), [unlocked]);

    // helper to test or call externally:
    const unlock = (id) => {
        if (unlocked.includes(id)) return false;
        setUnlocked(prev => [...prev, id]);
        // small toast:
        const el = document.createElement('div');
        el.className = 'achievement-toast';
        el.textContent = `🏆 ${ALL.find(a => a.id === id)?.title || id}`;
        document.body.appendChild(el);
        setTimeout(() => el.classList.add('show'), 10);
        setTimeout(() => { el.classList.remove('show'); setTimeout(() => el.remove(), 300); }, 3200);
        return true;
    };

    // optional: expose to window for quick testing
    useEffect(() => { window.unlockAchievement = unlock; }, []);

    return (
        <div className="achievements card">
            <h4>Achievements</h4>
            <ul>
                {ALL.map(a => (
                    <li key={a.id} className={unlocked.includes(a.id) ? 'unlocked' : ''}>
                        <strong>{a.title}</strong><small>{a.desc}</small>
                    </li>
                ))}
            </ul>
            <div className="ach-actions">
                <button className="btn" onClick={() => setUnlocked([])}>Reset</button>
            </div>
        </div>
    );
}
