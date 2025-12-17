// FooterNav.jsx
import React from 'react';

export default function FooterNav({ onNavigate }) {
    return (
        <nav className="footer-nav">
            <button onClick={() => onNavigate('home')} className="nav-btn">🏠</button>
            <button onClick={() => onNavigate('rps')} className="nav-btn">✊✋✌️</button>
            <button onClick={() => onNavigate('catchup')} className="nav-btn">⚡</button>
            <button onClick={() => onNavigate('spectator')} className="nav-btn">👀</button>
            <button onClick={() => onNavigate('settings')} className="nav-btn">⚙️</button>
        </nav>
    );
}
