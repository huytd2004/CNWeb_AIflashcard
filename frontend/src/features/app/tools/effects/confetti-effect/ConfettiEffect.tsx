import { useEffect, useRef, useCallback } from 'react'
import confetti from 'canvas-confetti'
import type { ConfettiSettings } from '../../context/EffectContext'

type ConfettiEffectProps = ConfettiSettings

export default function ConfettiEffect({
    density = 'medium',
    size = 'medium',
    colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'],
    shapes = ['circle', 'rectangle', 'star'],
    gravity = 1,
    opacity = 1,
    zIndex = 50,
}: ConfettiEffectProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const confettiInstance = useRef<confetti.CreateTypes | null>(null)

    const burstCounter = useRef(0)

    const getCommonOptions = useCallback(() => {
        let scalar = 1
        if (size === 'small') scalar = 0.8
        if (size === 'large') scalar = 1.5

        let particleCountBase = 50
        if (density === 'low') particleCountBase = 30
        if (density === 'high') particleCountBase = 80

        const mappedShapes = shapes.map((s) => (s === 'rectangle' ? 'square' : s))

        return {
            particleCountBase,
            scalar,
            shapes: mappedShapes as confetti.Shape[],
            colors,
            gravity,
            disableForReducedMotion: true,
            zIndex,
        }
    }, [density, size, shapes, colors, gravity, zIndex])

    // Init Canvas
    useEffect(() => {
        if (canvasRef.current && !confettiInstance.current) {
            confettiInstance.current = confetti.create(canvasRef.current, {
                resize: true,
                useWorker: true,
            })
        }
        return () => {
            if (confettiInstance.current) {
                confettiInstance.current.reset()
                confettiInstance.current = null
            }
        }
    }, [])

    // --- THE DIRECTOR ---
    useEffect(() => {
        if (!confettiInstance.current) return

        const opts = getCommonOptions()
        const myConfetti = confettiInstance.current
        let timeoutId: ReturnType<typeof setTimeout>

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min

        const fireStandard = () => {
            myConfetti({
                particleCount: opts.particleCountBase,
                spread: 90,
                origin: {
                    x: randomInRange(0.1, 0.9),
                    y: randomInRange(0.1, 0.6),
                },
                colors: opts.colors,
                shapes: opts.shapes,
                gravity: opts.gravity,
                scalar: opts.scalar,
                drift: randomInRange(-0.5, 0.5),
                ticks: 200,
            })
        }

        // Fireworks explode in a circular pattern
        const fireFireworks = () => {
            const burstParams = {
                startVelocity: 30,
                spread: 360,
                ticks: 60,
                zIndex: opts.zIndex,
                shapes: opts.shapes,
                colors: opts.colors,
                gravity: opts.gravity,
                scalar: opts.scalar,
            }

            myConfetti({
                ...burstParams,
                particleCount: opts.particleCountBase * 1.5,
                origin: { x: randomInRange(0.1, 0.3), y: randomInRange(0.2, 0.5) },
            })
            setTimeout(() => {
                myConfetti({
                    ...burstParams,
                    particleCount: opts.particleCountBase * 1.5,
                    origin: { x: randomInRange(0.7, 0.9), y: randomInRange(0.2, 0.5) },
                })
            }, 200)
        }

        // Shot from both flanks
        const fireSideCannons = () => {
            const cannonOpts = {
                spread: 55,
                startVelocity: 60,
                colors: opts.colors,
                shapes: opts.shapes,
                gravity: opts.gravity,
                scalar: opts.scalar,
            }

            myConfetti({
                ...cannonOpts,
                particleCount: opts.particleCountBase,
                angle: 60,
                origin: { x: 0, y: 0.7 },
            })

            myConfetti({
                ...cannonOpts,
                particleCount: opts.particleCountBase,
                angle: 120,
                origin: { x: 1, y: 0.7 },
            })
        }

        // Starfall
        const fireStars = () => {
            const starDefaults = {
                spread: 360,
                ticks: 100,
                gravity: 0,
                decay: 0.94,
                startVelocity: 30,
                shapes: ['star'] as confetti.Shape[],
                colors: ['#FFE400', '#FFBD00', '#E89400', '#FFCA6C', '#FDFFB8'],
                scalar: opts.scalar * 1.2,
            }

            myConfetti({
                ...starDefaults,
                particleCount: opts.particleCountBase,
                origin: { x: 0.5, y: 0.4 },
            })
        }

        // --- MAIN LOOP ---
        const loop = () => {
            burstCounter.current += 1

            // 3 regular shots -> 1 special shot
            if (burstCounter.current % 4 === 0) {
                const randomSpecial = Math.random()
                if (randomSpecial < 0.33) {
                    fireFireworks()
                } else if (randomSpecial < 0.66) {
                    fireSideCannons()
                } else {
                    fireStars()
                }
            } else {
                fireStandard()
            }

            let interval = 2000
            if (density === 'high') interval = 800
            if (density === 'low') interval = 3500

            const randomInterval = interval * (0.8 + Math.random() * 0.4)

            timeoutId = setTimeout(loop, randomInterval)
        }

        loop()

        return () => clearTimeout(timeoutId)
    }, [getCommonOptions, density])

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none"
            style={{
                width: '100%',
                height: '100%',
                zIndex,
                opacity,
            }}
        />
    )
}
