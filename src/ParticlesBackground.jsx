import React, { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

// ✅ ACCEPT PROP: effectIndex
const ParticlesBackground = ({ effectIndex = 0 }) => {
    const [init, setInit] = useState(false);

    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
        }).then(() => {
            setInit(true);
        });
    }, []);

    // ⚡ GLOBAL PERFORMANCE PATCH
    // This injects "Safety Mode" into every effect automatically
    const getCommonOptions = (baseParticleCount) => ({
        detectRetina: false, // CRITICAL: Stops iPhone Freeze (renders at 1x scale)
        fpsLimit: 60,       // CRITICAL: Saves battery/heat
        fullScreen: { enable: false },
        responsive: [
            {
                maxWidth: 768, // Mobile Devices
                options: {
                    particles: {
                        number: {
                            // Limit mobile particles to max 60, or 30% of desktop value
                            limit: Math.min(60, Math.floor(baseParticleCount * 0.3)),
                            density: { enable: true, area: 600 }
                        },
                        // Disable expensive link lines on mobile
                        links: { opacity: 0.3, distance: 100 },
                        move: { speed: 1.5 } // Slow down movement slightly
                    },
                    interactivity: {
                        events: {
                            // Disable mouse tracking on mobile (saves CPU)
                            onHover: { enable: false }
                        }
                    }
                }
            }
        ]
    });

    const configs = useMemo(() => [
        // 1. NEON WEB
        {
            ...getCommonOptions(100),
            interactivity: {
                events: { onHover: { enable: true, mode: "repulse" } },
                modes: { repulse: { distance: 300, duration: 0.4 } }, // Optimized duration
            },
            particles: {
                color: { value: "#00e5ff" },
                links: { enable: true, color: "#00e5ff", opacity: 0.7, distance: 150 },
                move: { enable: true, speed: 1 },
                number: { value: 100 },
                opacity: { value: 0.7 },
                size: { value: { min: 1, max: 4 } },
            }
        },
        // 2. STORM RAIN
        {
            ...getCommonOptions(300),
            particles: {
                color: { value: "#a2d9ff" },
                move: { direction: "bottom-right", enable: true, speed: 12, straight: true },
                number: { value: 300 }, // Will be capped at 60 on mobile
                opacity: { value: 0.8 },
                shape: { type: "circle" },
                size: { value: { min: 1, max: 4 } },
            }
        },
        // 3. WARP STARS
        {
            ...getCommonOptions(200),
            particles: {
                color: { value: "#ffffff" },
                move: { direction: "none", enable: true, outModes: "out", random: true, speed: 2 },
                number: { value: 200 },
                opacity: { value: { min: 0.1, max: 0.9 }, animation: { enable: true, speed: 1 } },
                size: { value: { min: 0.5, max: 3 } },
            }
        },
        // 4. HEAVY WATERFALL (The main crasher)
        {
            ...getCommonOptions(450),
            particles: {
                color: { value: ["#ffffff", "#00e5ff"] },
                move: { direction: "bottom", enable: true, speed: 20, straight: true },
                number: { value: 450 }, // Will be capped at 60 on mobile
                opacity: { value: { min: 0.1, max: 0.7 } },
                size: { value: { min: 1, max: 3 } },
            }
        },
        // 5. CYBER RAIN
        {
            ...getCommonOptions(150),
            particles: {
                color: { value: "#00e5ff" },
                move: { direction: "bottom", enable: true, outModes: "out", speed: 8, straight: true },
                number: { value: 150, density: { enable: true, area: 800 } },
                opacity: { value: 0.7 },
                size: { value: { min: 1, max: 3 } },
            }
        },
        // 6. NEON SNOW
        {
            ...getCommonOptions(200),
            particles: {
                color: { value: "#fff" },
                move: { direction: "bottom", enable: true, speed: 2, straight: false },
                number: { value: 200 },
                opacity: { value: 0.7 },
                size: { value: { min: 2, max: 5 } },
                wobble: { enable: true, distance: 5, speed: 5 } // Reduced wobble intensity
            }
        },
        // 7. RISING ORBS
        {
            ...getCommonOptions(30),
            particles: {
                color: { value: ["#00e5ff", "#d500f9", "#ffd700"] },
                move: { direction: "top", enable: true, speed: 1 },
                number: { value: 30 },
                opacity: { value: 0.5 },
                size: { value: { min: 10, max: 40 } }, // Slightly smaller max size
            }
        },
        // 8. NEON WEB (PINK)
        {
            ...getCommonOptions(100),
            interactivity: {
                events: { onHover: { enable: true, mode: "repulse" } },
            },
            particles: {
                color: { value: "#d500f9" },
                links: { enable: true, color: "#d500f9", opacity: 0.5, distance: 150 },
                move: { enable: true, speed: 1 },
                number: { value: 100 },
                opacity: { value: 0.5 },
                size: { value: { min: 1, max: 4 } },
            }
        }
    ], []);

    if (init) {
        return (
            <Particles
                id="tsparticles"
                // Added key to force re-render when effectIndex changes
                key={effectIndex}
                options={configs[effectIndex]}
            />
        );
    }

    return <></>;
};

export default ParticlesBackground;