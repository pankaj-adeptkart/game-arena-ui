// ThemeToggle.jsx
import React from 'react';

const THEMES = {
    neon: { '--bg': '#0b0b0f', '--accent': '#00eaff', '--glow': '#00bcd4' },
    gold: { '--bg': '#0a0704', '--accent': '#ffd166', '--glow': '#ffb703' },
    ice: { '--bg': '#071428', '--accent': '#8be9fd', '--glow': '#5ed0ff' }
};

export default function ThemeToggle() {
    const apply = (map) => {
        Object.entries(map).forEach(([k, v]) => document.documentElement.style.setProperty(k, v));
    };

    return (
        <div className="theme-toggle card">
            <h4>Themes</h4>
            <div className="theme-list">
                {Object.keys(THEMES).map(k => (
                    <button key={k} className="theme-btn" onClick={() => apply(THEMES[k])}>
                        {k}
                    </button>
                ))}
            </div>
        </div>
    );
}
