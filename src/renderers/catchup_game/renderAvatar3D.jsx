import React, { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import Avatar3D from "../../components/Avatar/3D_Avatar/Avatar3D";
import { useLowPowerMode } from "../../config/useLowPowerMode";

const MemoAvatar3D = React.memo(Avatar3D);

/* =====================================================
   LITE AVATAR (2D Fallback)
===================================================== */
const LiteAvatar = ({ type, color, variant, action, isTurn }) => {
    let icon = "😐";
    if (type === "robot") {
        if (action === "Win") icon = "🤖🏆";
        else if (action === "Lose") icon = "💥";
        else if (action === "Thinking") icon = "⚡";
        else icon = "🤖";
    } else {
        if (action === "Win") icon = "😎🎉";
        else if (action === "Lose") icon = "😵";
        else if (action === "Thinking") icon = "🤔";
        else icon = "😎";
    }

    const shapeClass = variant === "round" ? "rounded-full" : "rounded-2xl";
    const glowStyle = isTurn ? `0 0 25px ${color}` : "none";
    const borderStyle = `4px solid ${color}`;
    const bgStyle = `${color}15`;

    return (
        <div className={`
            w-full h-full flex items-center justify-center 
            transition-all duration-300 ease-out
            ${isTurn ? "scale-110 grayscale-0" : "scale-95 grayscale-[0.5] opacity-80"}
        `}>
            <div
                className={`
                    w-[90%] h-[90%] flex items-center justify-center 
                    text-4xl md:text-5xl shadow-2xl backdrop-blur-sm
                    ${shapeClass}
                `}
                style={{ border: borderStyle, backgroundColor: bgStyle, boxShadow: glowStyle }}
            >
                <span className={`drop-shadow-md ${isTurn ? "animate-bounce" : ""}`}>{icon}</span>
            </div>
        </div>
    );
};

/* =====================================================
   MAIN COMPONENT (MEMOIZED)
===================================================== */
// FIX: Wrap in React.memo to prevent re-renders on parent updates
export const RenderAvatar3D = React.memo(function RenderAvatar3D({
    player,
    mode,
    isTurn,
    scores = { p1: 0, p2: 0 },
    available = [],
    names = { p1: "", p2: "" }
}) {
    const isLowPower = useLowPowerMode();

    // Logic: Determine Appearance
    const { type, color, variant, action } = useMemo(() => {
        let t = "robot", c = "#00e5ff", v = "box";

        if (mode === 'bvb') {
            t = "robot";
            if (player === 'p1') { c = "#00e5ff"; v = "box"; }
            else { c = "#d500f9"; v = "round"; }
        } else if (mode === 'hvbot') {
            if (player === 'p1') { t = "human"; c = "#00e5ff"; }
            else { t = "robot"; c = "#d500f9"; v = "round"; }
        } else {
            t = "human";
            if (player === 'p1') c = "#00e5ff";
            else c = "#ff9100";
        }

        let a = "Idle";
        if (available.length === 0) {
            const mine = scores[player];
            const opp = scores[player === "p1" ? "p2" : "p1"];
            a = mine > opp ? "Win" : mine < opp ? "Lose" : "Idle";
        } else if (isTurn) {
            a = "Thinking";
        }

        return { type: t, color: c, variant: v, action: a };
    }, [mode, player, available.length, scores.p1, scores.p2, isTurn]); // FIX: Decomposed scores object dependency

    return (
        <div className="avatar-wrapper w-full h-full relative">
            {isLowPower ? (
                <LiteAvatar type={type} color={color} variant={variant} action={action} isTurn={isTurn} />
            ) : (
                // FIX: FRAMELOOP="demand" saves GPU and prevents flicker
                <Canvas frameloop="always" camera={{ position: [0, 1.4, 3.5], fov: 45 }} dpr={[1, 2]}>
                    <ambientLight intensity={0.6} />
                    <spotLight position={[10, 10, 10]} angle={0.3} penumbra={1} intensity={1} />
                    <Environment preset="city" />
                    <group position={[0, -1, 0]}>
                        <MemoAvatar3D
                            actionName={action}
                            name={names[player]}
                            color={color}
                            variant={variant}
                            type={type}
                        />
                    </group>
                    <ContactShadows opacity={0.4} scale={5} blur={2} far={4} color="#000000" />
                    <OrbitControls enableZoom={false} enablePan={false} minPolarAngle={Math.PI / 2.2} maxPolarAngle={Math.PI / 1.8} />
                </Canvas>
            )}
        </div>
    );
}, (prev, next) => {
    // CUSTOM COMPARISON: Only re-render if visual props change
    return (
        prev.isTurn === next.isTurn &&
        prev.available.length === next.available.length &&
        prev.scores.p1 === next.scores.p1 &&
        prev.scores.p2 === next.scores.p2 &&
        prev.mode === next.mode
    );
});