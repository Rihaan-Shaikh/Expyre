/* eslint-disable react-hooks/purity */
import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

function ParticleField({ isLight }) {
    const ref = useRef();

    // Generate random particles
    const particles = useMemo(() => {
        const count = 3500; // Increased count
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        const sizes = new Float32Array(count);

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            // Spread particles in a larger volume
            const radius = Math.random() * 12 + 4;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);

            positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i3 + 2] = radius * Math.cos(phi);

            if (isLight) {
                // TRUE DARK DOTS for light mode
                const brightness = Math.random() * 0.1; // Very dark
                colors[i3] = brightness;
                colors[i3 + 1] = brightness;
                colors[i3 + 2] = brightness + 0.1; // Subtle blue tint
            } else {
                // "Dark Dots" for dark mode - Deep Indigo/Navy that sits in the void
                const mix = Math.random();
                colors[i3] = mix * 0.1;   // R (Very low)
                colors[i3 + 1] = mix * 0.15; // G (Very low)
                colors[i3 + 2] = mix * 0.4 + 0.1; // B (Deep Indigo)
            }
            sizes[i] = Math.random();
        }

        return { positions, colors, sizes };
    }, [isLight]); // Re-generate on theme change for best colors

    useFrame((state) => {
        if (ref.current) {
            const time = state.clock.elapsedTime;
            // "Super crazy" high-speed rotation
            ref.current.rotation.x = time * 0.18;
            ref.current.rotation.y = time * 0.35;
            ref.current.rotation.z = Math.sin(time * 0.8) * 0.3;

            // Chaotic jitter and cosmic drift
            ref.current.position.y = Math.sin(time * 0.5) * 0.4;
            ref.current.position.x = Math.cos(time * 0.3) * 0.3;

            // Twinkle/Flicker effect
            if (ref.current.material) {
                const flicker = 0.7 + Math.random() * 0.3;
                ref.current.material.opacity = (isLight ? 0.6 : 0.8) * flicker;
            }

            // Expansion pulse
            const s = 1 + Math.sin(time * 1.5) * 0.1;
            ref.current.scale.set(s, s, s);
        }
    });

    return (
        <Points ref={ref} positions={particles.positions} stride={3} frustumCulled={false}>
            <PointMaterial
                transparent
                vertexColors
                size={isLight ? 0.09 : 0.07} // Slightly emboldened "Dots"
                sizeAttenuation={true}
                depthWrite={false}
                blending={isLight ? THREE.NormalBlending : THREE.AdditiveBlending}
                opacity={isLight ? 0.6 : 0.8}
            />
        </Points>
    );
}

function FloatingOrbs({ isLight }) {
    const groupRef = useRef();

    const orbs = useMemo(() => {
        return Array.from({ length: 5 }, (_, i) => ({
            position: [
                (Math.random() - 0.5) * 8,
                (Math.random() - 0.5) * 8,
                (Math.random() - 0.5) * 4 - 2
            ],
            scale: Math.random() * 0.5 + 0.3,
            speed: Math.random() * 0.5 + 0.5,
            color: i % 2 === 0 ? '#6366f1' : '#3b82f6'
        }));
    }, []);

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.children.forEach((orb, i) => {
                const t = state.clock.elapsedTime * orbs[i].speed;
                orb.position.y = orbs[i].position[1] + Math.sin(t) * 0.5;
                orb.position.x = orbs[i].position[0] + Math.cos(t * 0.5) * 0.3;
            });
        }
    });

    return (
        <group ref={groupRef}>
            {orbs.map((orb, i) => (
                <mesh key={i} position={orb.position} scale={orb.scale}>
                    <sphereGeometry args={[1, 32, 32]} />
                    <meshBasicMaterial
                        color={orb.color}
                        transparent
                        opacity={isLight ? 0.3 : 0.15}
                    />
                </mesh>
            ))}
        </group>
    );
}

function GlowingRing({ isLight }) {
    const ringRef = useRef();

    useFrame((state) => {
        if (ringRef.current) {
            ringRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
            ringRef.current.rotation.y = state.clock.elapsedTime * 0.2;
        }
    });

    return (
        <mesh ref={ringRef} position={[0, 0, -5]}>
            <torusGeometry args={[3, 0.02, 16, 100]} />
            <meshBasicMaterial color="#6366f1" transparent opacity={isLight ? 0.1 : 0.3} />
        </mesh>
    );
}

export default function Background3D() {
    const [theme, setTheme] = useState(
        document.documentElement.getAttribute("data-theme") || "dark"
    );

    useEffect(() => {
        const observer = new MutationObserver(() => {
            setTheme(document.documentElement.getAttribute("data-theme") || "dark");
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
        return () => observer.disconnect();
    }, []);

    const isLight = theme === "light";

    return (
        <div className="fixed inset-0 z-0 transition-colors duration-700">
            {/* Gradient overlay */}
            <div className={`absolute inset-0 bg-gradient-to-b from-primary via-primary/95 to-primary z-10 pointer-events-none transition-colors duration-700`} />

            <Canvas
                camera={{ position: [0, 0, 8], fov: 60 }}
                style={{ background: isLight ? '#f8fafc' : '#0a0a0f' }}
                gl={{ antialias: true, alpha: true }}
            >
                <ambientLight intensity={isLight ? 1.5 : 0.5} />
                <ParticleField isLight={isLight} />
                <FloatingOrbs isLight={isLight} />
                <GlowingRing isLight={isLight} />
            </Canvas>
        </div>
    );
}
