import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';

export default function Avatar3D({
    actionName = "Idle",
    name = "PLAYER",
    color = "#00e5ff",
    variant = "box",
    type = "robot"
}) {
    const group = useRef();
    const headRef = useRef();
    const bodyRef = useRef();
    const leftArmRef = useRef();
    const rightArmRef = useRef();

    // --- ANIMATION LOOP ---
    useFrame((state, delta) => {
        const t = state.clock.getElapsedTime();
        if (!group.current) return;

        // 1. FLOAT & BREATHING
        group.current.position.y = Math.sin(t * 2) * 0.05 - 0.5;

        // 2. ACTIONS
        if (actionName === "Thinking") {
            // Scratch head / Look around
            if (headRef.current) headRef.current.rotation.y += delta * 5;
            if (bodyRef.current) bodyRef.current.rotation.z = Math.sin(t * 10) * 0.05;
        } else if (actionName === "Win") {
            // Jump and Spin
            group.current.position.y = Math.abs(Math.sin(t * 5)) * 0.6 - 0.5;
            group.current.rotation.y += delta * 5;
            // Arms Up
            if (leftArmRef.current) leftArmRef.current.rotation.z = 2.5;
            if (rightArmRef.current) rightArmRef.current.rotation.z = -2.5;
        } else if (actionName === "Lose") {
            // Head Down
            if (headRef.current) headRef.current.rotation.x = 0.5;
            group.current.rotation.y += delta * 0.2;
        } else {
            // Idle
            if (headRef.current) headRef.current.rotation.y = Math.sin(t) * 0.5;
            group.current.rotation.y = 0;
            if (leftArmRef.current) leftArmRef.current.rotation.z = 0;
            if (rightArmRef.current) rightArmRef.current.rotation.z = 0;
        }
    });

    const isRobot = type === 'robot';
    const isRound = variant === 'round';

    // --- MATERIALS ---
    // Robot: Dark Metal
    // Human: White/Grey High-Tech Armor
    const armorColor = isRobot ? "#222" : "#e0e0e0";
    const armorMat = <meshStandardMaterial color={armorColor} roughness={0.3} metalness={0.6} />;

    // Glow: The player color (Blue/Pink/Orange)
    const glowMat = <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.5} toneMapped={false} />;

    // Visor Material (Dark Glass)
    const visorMat = <meshStandardMaterial color="#111" roughness={0.1} metalness={0.9} />;

    return (
        <group ref={group}>
            {/* NAME TAG */}
            <Text position={[0, 2.3, 0]} fontSize={0.25} color={color} anchorX="center" anchorY="middle">
                {name.toUpperCase()}
            </Text>

            {/* --- HEAD --- */}
            <group position={[0, 1.45, 0]} ref={headRef}>
                {isRobot ? (
                    // ROBOT HEAD (The one you liked)
                    <mesh>
                        {isRound ? <sphereGeometry args={[0.35, 32, 32]} /> : <boxGeometry args={[0.5, 0.45, 0.5]} />}
                        {armorMat}
                    </mesh>
                ) : (
                    // HUMAN HEAD (Cyber Pilot Helmet)
                    <group>
                        {/* Helmet Base */}
                        <mesh>
                            <capsuleGeometry args={[0.32, 0.35, 4, 16]} />
                            {armorMat}
                        </mesh>
                        {/* Side Ears/Headphones */}
                        <mesh position={[-0.32, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                            <cylinderGeometry args={[0.1, 0.1, 0.1]} />
                            {visorMat}
                        </mesh>
                        <mesh position={[0.32, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                            <cylinderGeometry args={[0.1, 0.1, 0.1]} />
                            {visorMat}
                        </mesh>
                    </group>
                )}

                {/* EYES / VISOR */}
                {isRobot ? (
                    <>
                        <mesh position={[-0.12, 0.05, 0.28]}><sphereGeometry args={[0.08]} />{glowMat}</mesh>
                        <mesh position={[0.12, 0.05, 0.28]}><sphereGeometry args={[0.08]} />{glowMat}</mesh>
                        {/* Antenna */}
                        {!isRound && <mesh position={[0, 0.4, 0]}><cylinderGeometry args={[0.02, 0.02, 0.4]} />{armorMat}</mesh>}
                        {!isRound && <mesh position={[0, 0.6, 0]}><sphereGeometry args={[0.05]} />{glowMat}</mesh>}
                    </>
                ) : (
                    // HUMAN VISOR (Sleek strip)
                    <mesh position={[0, 0.05, 0.25]}>
                        <boxGeometry args={[0.4, 0.12, 0.15]} />
                        {glowMat}
                    </mesh>
                )}
            </group>

            {/* --- BODY --- */}
            <group position={[0, 0.75, 0]} ref={bodyRef}>
                <mesh>
                    {isRobot
                        ? (isRound ? <sphereGeometry args={[0.5]} /> : <cylinderGeometry args={[0.3, 0.4, 0.8]} />)
                        : <cylinderGeometry args={[0.28, 0.35, 0.75]} /> // Human Armor
                    }
                    {armorMat}
                </mesh>

                {/* Chest Core / Arc Reactor */}
                <mesh position={[0, 0.1, isRound ? 0.45 : 0.26]}>
                    <circleGeometry args={[0.12]} />
                    {glowMat}
                </mesh>
            </group>

            {/* --- ARMS --- */}
            <group position={[-0.42, 1, 0]} ref={leftArmRef}>
                <mesh position={[0, -0.3, 0]}><capsuleGeometry args={[0.09, 0.6]} />{armorMat}</mesh>
            </group>
            <group position={[0.42, 1, 0]} ref={rightArmRef}>
                <mesh position={[0, -0.3, 0]}><capsuleGeometry args={[0.09, 0.6]} />{armorMat}</mesh>
            </group>
        </group>
    );
}