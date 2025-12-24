import { useEffect, useState, useCallback, useRef } from 'react'
import type { SnowSettings } from '../../context/EffectContext'

interface Snowflake {
    id: string
    createdAt: number
    left: number
    top: number
    size: number
    opacity: number
    speed: number
    animationDelay: number
}

type SnowEffectProps = SnowSettings

export default function SnowEffect({ count = 50, speed = 'medium', size = 'medium', color = '#ffffff', style = 'flat', showGround = true, opacity = 1, zIndex = 50 }: SnowEffectProps) {
    const [snowflakes, setSnowflakes] = useState<Snowflake[]>([])
    const [mounted, setMounted] = useState(false)
    const idCounter = useRef(0)

    useEffect(() => {
        setMounted(true)
    }, [])

    const getSpeedValue = useCallback(() => {
        switch (speed) {
            case 'slow':
                return { min: 25, max: 35 }
            case 'fast':
                return { min: 15, max: 22 }
            default:
                return { min: 20, max: 28 }
        }
    }, [speed])

    const getSizeValue = useCallback(() => {
        switch (size) {
            case 'small':
                return { min: 2, max: 5 }
            case 'large':
                return { min: 6, max: 10 }
            default:
                return { min: 3, max: 7 }
        }
    }, [size])

    // create ID: timestamp + counter + random
    const generateUniqueId = useCallback(() => {
        idCounter.current += 1
        return `flake-${Date.now()}-${idCounter.current}-${Math.random().toString(36).slice(2)}`
    }, [])

    // The snowflake-forming function is memoized.
    const createFlake = useCallback(
        (isInitial = false): Snowflake => {
            const sizeRange = getSizeValue()
            const speedRange = getSpeedValue()

            const flakeSize = Math.random() * (sizeRange.max - sizeRange.min) + sizeRange.min
            const flakeSpeed = Math.random() * (speedRange.max - speedRange.min) + speedRange.min

            return {
                id: generateUniqueId(),
                createdAt: Date.now(),
                left: Math.random() * 100,
                top: isInitial ? Math.random() * 100 - 100 : -20,
                size: flakeSize,
                opacity: Math.random() * 0.4 + 0.6,
                speed: flakeSpeed,
                animationDelay: isInitial ? Math.random() * -20 : 0,
            }
        },
        [getSizeValue, getSpeedValue, generateUniqueId]
    )

    useEffect(() => {
        if (!mounted) return

        // 1. Initial snow generation (runs once)
        const initialFlakes = Array.from({ length: count }, () => createFlake(true))
        setSnowflakes(initialFlakes)

        // 2. Loop maintains the number
        const interval = setInterval(() => {
            setSnowflakes((prev) => {
                const now = Date.now()
                const keptFlakes = prev.filter((flake) => now - flake.createdAt < 40000)

                if (keptFlakes.length < count) {
                    const needed = count - keptFlakes.length
                    const newFlakes = []
                    for (let i = 0; i < needed; i++) {
                        newFlakes.push(createFlake(false))
                    }
                    return [...keptFlakes, ...newFlakes]
                }

                return keptFlakes
            })
        }, 2000)

        return () => clearInterval(interval)
    }, [mounted, count, createFlake]) // Dependencies have been optimized

    if (!mounted) return null

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex }}>
            {snowflakes.map((flake) => (
                <div
                    key={flake.id}
                    className="absolute rounded-full pointer-events-none will-change-transform"
                    style={{
                        left: `${flake.left}%`,
                        top: `${flake.top}%`,
                        width: `${flake.size}px`,
                        height: `${flake.size}px`,
                        backgroundColor: color,
                        opacity: flake.opacity * opacity,
                        animation: `snow-fall ${flake.speed}s linear infinite`,
                        animationDelay: `${flake.animationDelay}s`,
                        filter: style === 'blur' ? 'blur(1px)' : 'none',
                        boxShadow: style === 'sparkle' ? `0 0 ${flake.size}px ${color}, 0 0 ${flake.size * 2}px ${color}80` : 'none',
                    }}
                />
            ))}

            {/* --- GROUND EFFECT --- */}
            {showGround && (
                <>
                    {/* Layer 1: Mist */}
                    <div
                        className="absolute bottom-0 left-0 right-0 pointer-events-none transition-all duration-1000"
                        style={{
                            height: '10vh',
                            maxHeight: '100px',
                            background: `linear-gradient(to top, ${color}40 0%, ${color}10 50%, transparent 100%)`,
                            filter: 'blur(5px)',
                            opacity: opacity,
                            zIndex: zIndex + 1,
                        }}
                    />

                    {/* Layer 2: Snow background */}
                    <div
                        className="absolute bottom-0 left-0 right-0 pointer-events-none transition-all duration-1000"
                        style={{
                            height: '4vh',
                            maxHeight: '40px',
                            background: `linear-gradient(to top, ${color}CC 0%, ${color}66 40%, transparent 100%)`,
                            filter: 'blur(4px)',
                            opacity: opacity,
                            zIndex: zIndex + 1,
                        }}
                    />

                    {/* Layer 3: Misty snow-capped hills */}
                    <div className="absolute -bottom-12 -left-10 w-[50vw] h-20 rounded-[100%] pointer-events-none opacity-20 blur-2xl" style={{ backgroundColor: color, zIndex: zIndex }} />
                    <div className="absolute -bottom-12 -right-10 w-[60vw] h-25 rounded-[100%] pointer-events-none opacity-15 blur-2xl" style={{ backgroundColor: color, zIndex: zIndex }} />
                </>
            )}

            <style>{`
                @keyframes snow-fall {
                    0% {
                        transform: translateY(0) translateX(0) rotate(0deg);
                    }
                    25% {
                        transform: translateY(25vh) translateX(15px) rotate(45deg);
                    }
                    50% {
                        transform: translateY(50vh) translateX(-15px) rotate(90deg);
                    }
                    75% {
                        transform: translateY(75vh) translateX(15px) rotate(135deg);
                    }
                    100% {
                        transform: translateY(110vh) translateX(0) rotate(180deg);
                    }
                }

                .will-change-transform {
                    will-change: transform;
                }
            `}</style>
        </div>
    )
}
