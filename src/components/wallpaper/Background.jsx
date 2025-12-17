import React from 'react';

const WALLPAPERS = [
    'url("https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=1920&auto=format&fit=crop")',
    'url("https://images.unsplash.com/photo-1519608487953-e999c9dc7468?q=80&w=1920&auto=format&fit=crop")',
    'url("https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1920&auto=format&fit=crop")',
    'url("https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1920&auto=format&fit=crop")'
];

export default function Background({ activeIndex }) {
    // Ensure the index is always valid (handles 1-based or 0-based logic safely)
    // We subtract 1 because your App.jsx uses 1-4, but arrays are 0-3
    const bgStyle = WALLPAPERS[(activeIndex - 1) % WALLPAPERS.length] || WALLPAPERS[0];

    return (
        <div
            className="fixed inset-0 -z-10 bg-cover bg-center transition-[background-image] duration-500 ease-in-out"
            style={{
                backgroundImage: bgStyle
            }}
        >
            {/* Optional: Add a dark overlay gradient if you want text to pop more */}
            <div className="absolute inset-0 bg-black/40" />
        </div>
    );
}