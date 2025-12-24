import type { FireworksSettings } from '../../context/EffectContext'
import { Fireworks } from '@fireworks-js/react'

export default function FireworksEffect({ intensity = 30, explosion = 5, trace = 3, sound = false, opacity = 1, zIndex = 60 }: FireworksSettings) {
    // City blur
    const CITY_OPACITY = 0.15

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: zIndex,
                overflow: 'hidden',
            }}
        >
            {/* === CITY LAYER (Static, Faint, Dense) === */}
            <div
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    height: '18vh',
                    opacity: CITY_OPACITY * opacity,
                    zIndex: -1, // Located behind the fireworks
                    display: 'flex',
                    alignItems: 'flex-end',
                }}
            >
                <svg viewBox="0 0 1000 150" preserveAspectRatio="none" className="w-full h-full text-gray-900 dark:text-gray-600" fill="currentColor">
                    <path d="M0,150 L0,50 L30,50 L30,80 L60,80 L60,30 L100,30 L100,110 L130,110 L130,40 L170,40 L170,70 L200,70 L200,20 L250,20 L250,100 L280,100 L280,60 L330,60 L330,120 L360,120 L360,50 L400,50 L400,80 L430,80 L430,30 L480,30 L480,100 L510,100 L510,40 L550,40 L550,90 L580,90 L580,20 L630,20 L630,70 L660,70 L660,110 L700,110 L700,50 L740,50 L740,80 L770,80 L770,30 L820,30 L820,100 L850,100 L850,60 L890,60 L890,120 L920,120 L920,40 L960,40 L960,80 L1000,80 L1000,150 Z" />
                </svg>
            </div>

            <Fireworks
                options={{
                    autoresize: true,
                    opacity: opacity,
                    acceleration: 1.05,
                    friction: 0.97,
                    gravity: 1.5,
                    particles: 50,
                    traceSpeed: 10,
                    rocketsPoint: {
                        min: 0,
                        max: 100,
                    },
                    traceLength: trace,
                    intensity: intensity,
                    explosion: explosion,

                    lineWidth: {
                        explosion: { min: 1, max: 3 },
                        trace: { min: 1, max: 2 },
                    },
                    sound: {
                        enabled: sound,
                        files: ['https://fireworks.js.org/sounds/explosion0.mp3', 'https://fireworks.js.org/sounds/explosion1.mp3', 'https://fireworks.js.org/sounds/explosion2.mp3'],
                        volume: { min: 4, max: 8 },
                    },
                    hue: { min: 0, max: 360 },
                    delay: { min: 30, max: 60 },
                    brightness: { min: 50, max: 80 },
                    decay: { min: 0.015, max: 0.03 },
                    mouse: { click: false, move: false, max: 1 },
                }}
                style={{
                    width: '100%',
                    height: '100%',
                    background: 'transparent',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                }}
            />
        </div>
    )
}
