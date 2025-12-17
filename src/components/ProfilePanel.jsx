import { useState, useEffect } from 'react';
import { load, save } from '../utils/storage';

const DEFAULT = { name: 'Player', avatar: '😎', color: '#00e5ff' };

// This component now acts as a STATE MANAGER, not a UI component.
// It loads profile data and passes it to the parent (App.jsx).
export default function ProfilePanel({ onProfileChange }) {
    const [profile, setProfile] = useState(load('profile', DEFAULT));

    // Load on mount & notify parent
    useEffect(() => {
        if (onProfileChange) onProfileChange(profile);
        // Set global CSS accent color
        document.documentElement.style.setProperty('--accent', profile.color || DEFAULT.color);
    }, []); // Run once on mount

    // Listen for changes from outside (the dropdown editor) and save them
    useEffect(() => {
        save('profile', profile);
        document.documentElement.style.setProperty('--accent', profile.color);
    }, [profile]);

    // This component doesn't render anything itself anymore.
    // The App.jsx will use the profile data it provides.
    return null;
}