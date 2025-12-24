import { useEffect, useCallback, useRef } from 'react'
import type { BubblesSettings } from '../../context/EffectContext'

interface BubbleData {
    id: string
    initialX: number
    x: number
    y: number
    size: number
    speed: number
    swayAmplitude: number
    swayFrequency: number
    phase: number
    baseColor: string
    popHeightThreshold: number
    opacity: number
    element: HTMLDivElement | null
    timeOffset: number
}

interface DropletData {
    id: string
    x: number
    y: number
    vx: number
    vy: number
    size: number
    color: string
    opacity: number
    life: number
    element: HTMLDivElement | null
}

type BubblesEffectProps = BubblesSettings

export default function BubblesEffect({ count = 30, size = 'medium', speed = 'slow', colors = ['#87CEEB', '#ADD8E6', '#B0E0E6'], popOnClick = true, opacity = 1, zIndex = 40 }: BubblesEffectProps) {
    const containerRef = useRef<HTMLDivElement>(null)

    // Refs lưu trữ dữ liệu
    const bubblesDataRef = useRef<BubbleData[]>([])
    const dropletsDataRef = useRef<DropletData[]>([])
    const animationFrameRef = useRef<number>(0)
    const lastSpawnTime = useRef(0)
    const lastTimestamp = useRef(0)
    const startTime = useRef(Date.now())

    // --- CONFIG ---
    const getSizeValue = useCallback(() => {
        switch (size) {
            case 'small':
                return { min: 15, max: 30 }
            case 'large':
                return { min: 50, max: 90 }
            default:
                return { min: 30, max: 60 }
        }
    }, [size])

    const getSpeedValue = useCallback(() => {
        switch (speed) {
            case 'slow':
                return { min: 0.3, max: 0.8 }
            case 'fast':
                return { min: 1.5, max: 2.5 }
            default:
                return { min: 0.8, max: 1.5 }
        }
    }, [speed])

    const createBubbleElement = (b: BubbleData) => {
        const div = document.createElement('div')
        div.className = 'soap-bubble'
        div.style.width = `${b.size}px`
        div.style.height = `${b.size}px`
        div.style.setProperty('--bubble-color', b.baseColor)
        div.style.willChange = 'transform, opacity'

        const reflection = document.createElement('div')
        reflection.className = 'bubble-reflection'
        div.appendChild(reflection)

        return div
    }

    const createDropletElement = (d: DropletData) => {
        const div = document.createElement('div')
        div.className = 'soap-droplet'
        div.style.width = `${d.size}px`
        div.style.height = `${d.size}px`
        div.style.backgroundColor = d.color
        div.style.willChange = 'transform, opacity'
        return div
    }

    const createBubbleData = useCallback(
        (startAtBottom = true): BubbleData => {
            const winW = window.innerWidth
            const winH = window.innerHeight

            const sizeRange = getSizeValue()
            const speedRange = getSpeedValue()
            const bubbleSize = Math.random() * (sizeRange.max - sizeRange.min) + sizeRange.min

            const startX = Math.random() * (winW + 40) - 20

            const startY = startAtBottom ? winH + bubbleSize + Math.random() * 100 : Math.random() * winH

            const phase = Math.random() * Math.PI * 2

            return {
                id: `b-${Date.now()}-${Math.random()}`,
                initialX: startX,
                x: startX,
                y: startY,
                size: bubbleSize,
                speed: Math.random() * (speedRange.max - speedRange.min) + speedRange.min,
                swayAmplitude: Math.random() * 20 + 10,
                swayFrequency: Math.random() * 0.0005 + 0.0002,
                phase: phase,
                baseColor: colors[Math.floor(Math.random() * colors.length)],
                popHeightThreshold: Math.random() > 0.4 ? -100 : winH * 0.4 * Math.random(),
                opacity: Math.random() * 0.3 + 0.7, // 0.7 - 1.0
                element: null,
                timeOffset: Math.random() * 1000,
            }
        },
        [colors, getSizeValue, getSpeedValue]
    )

    const createExplosion = (x: number, y: number, color: string, bubbleSize: number) => {
        if (!containerRef.current) return
        const dropletCount = Math.floor(bubbleSize / 4) + 4

        for (let i = 0; i < dropletCount; i++) {
            const angle = Math.random() * Math.PI * 2
            const velocity = Math.random() * 2 + 1

            const d: DropletData = {
                id: `d-${Math.random()}`,
                x: x,
                y: y,
                vx: Math.cos(angle) * velocity,
                vy: Math.sin(angle) * velocity,
                size: Math.random() * 3 + 1,
                color: color,
                opacity: 0.8,
                life: 1.0,
                element: null,
            }

            const el = createDropletElement(d)
            d.element = el
            containerRef.current.appendChild(el)
            dropletsDataRef.current.push(d)
        }
    }

    useEffect(() => {
        if (containerRef.current) containerRef.current.innerHTML = ''
        bubblesDataRef.current = []
        dropletsDataRef.current = []
        lastTimestamp.current = 0
        startTime.current = Date.now()

        const initialCount = Math.floor(count * 0.4)
        for (let i = 0; i < initialCount; i++) {
            const b = createBubbleData(false)
            const el = createBubbleElement(b)
            b.element = el
            if (containerRef.current) {
                containerRef.current.appendChild(el)
                bubblesDataRef.current.push(b)
            }
        }

        const animate = (timestamp: number) => {
            const winW = window.innerWidth

            const deltaTime = lastTimestamp.current === 0 ? 16 : Math.min(timestamp - lastTimestamp.current, 32)
            lastTimestamp.current = timestamp

            const totalTime = Date.now() - startTime.current

            if (bubblesDataRef.current.length < count) {
                if (timestamp - lastSpawnTime.current > 300) {
                    const b = createBubbleData(true)
                    const el = createBubbleElement(b)
                    b.element = el
                    if (containerRef.current) {
                        containerRef.current.appendChild(el)
                        bubblesDataRef.current.push(b)
                    }
                    lastSpawnTime.current = timestamp
                }
            }

            for (let i = bubblesDataRef.current.length - 1; i >= 0; i--) {
                const b = bubblesDataRef.current[i]
                if (!b.element) continue

                const bubbleTime = totalTime + b.timeOffset

                b.y -= b.speed * (deltaTime / 16)

                const swayProgress = bubbleTime * b.swayFrequency

                const sway = Math.sin(swayProgress + b.phase) * b.swayAmplitude

                const microSway = Math.sin(swayProgress * 1.7 + b.phase) * b.swayAmplitude * 0.3

                b.x = b.initialX + sway + microSway

                let shouldPop = false

                if (b.y < b.popHeightThreshold) shouldPop = true

                if (b.x < -b.size || b.x > winW + b.size) shouldPop = true

                if (b.y < -200) {
                    b.element.remove()
                    bubblesDataRef.current.splice(i, 1)
                    continue
                }

                if (shouldPop) {
                    createExplosion(b.x + b.size / 2, b.y + b.size / 2, b.baseColor, b.size)
                    b.element.remove()
                    bubblesDataRef.current.splice(i, 1)
                    continue
                }

                b.element.style.transform = `translate(${b.x}px, ${b.y}px)`
                b.element.style.opacity = `${b.opacity * opacity}`
            }

            for (let i = dropletsDataRef.current.length - 1; i >= 0; i--) {
                const d = dropletsDataRef.current[i]
                if (!d.element) continue

                d.x += d.vx * (deltaTime / 16)
                d.y += d.vy * (deltaTime / 16)
                d.vy += 0.1
                d.life -= 0.02

                if (d.life <= 0) {
                    d.element.remove()
                    dropletsDataRef.current.splice(i, 1)
                    continue
                }

                d.element.style.transform = `translate(${d.x}px, ${d.y}px)`
                d.element.style.opacity = `${d.life * opacity}`
            }

            animationFrameRef.current = requestAnimationFrame(animate)
        }

        animationFrameRef.current = requestAnimationFrame(animate)

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current)
            }
            if (containerRef.current) {
                // eslint-disable-next-line react-hooks/exhaustive-deps
                containerRef.current.innerHTML = ''
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [count, opacity, createBubbleData])

    useEffect(() => {
        if (!popOnClick) return

        const handleClick = (e: MouseEvent) => {
            const clickX = e.clientX
            const clickY = e.clientY

            let closestBubble: { index: number; distance: number } | null = null

            for (let i = 0; i < bubblesDataRef.current.length; i++) {
                const b = bubblesDataRef.current[i]
                if (!b.element) continue

                const centerX = b.x + b.size / 2
                const centerY = b.y + b.size / 2

                const dist = Math.sqrt(Math.pow(clickX - centerX, 2) + Math.pow(clickY - centerY, 2))

                if (dist < (b.size / 2) * 1.5) {
                    if (!closestBubble || dist < closestBubble.distance) {
                        closestBubble = { index: i, distance: dist }
                    }
                }
            }

            if (closestBubble) {
                const b = bubblesDataRef.current[closestBubble.index]
                const centerX = b.x + b.size / 2
                const centerY = b.y + b.size / 2

                createExplosion(centerX, centerY, b.baseColor, b.size)
                if (b.element) b.element.remove()
                bubblesDataRef.current.splice(closestBubble.index, 1)
            }
        }

        window.addEventListener('click', handleClick)
        return () => window.removeEventListener('click', handleClick)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [popOnClick])

    return (
        <>
            <div ref={containerRef} className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex }} />
            <style>{`
                .soap-bubble {
                    position: absolute;
                    top: 0;
                    left: 0;
                    border-radius: 50%;
                    backface-visibility: hidden;
                    transform: translateZ(0);
                    -webkit-font-smoothing: antialiased;
                    background: radial-gradient(130% 130% at 30% 30%, rgba(255, 255, 255, 0) 20%, rgba(255, 255, 255, 0.1) 40%, var(--bubble-color) 80%, rgba(255, 255, 255, 0.9) 100%);
                    box-shadow: inset 0 0 15px rgba(255, 255, 255, 0.4), inset 8px 0 30px rgba(255, 0, 255, 0.15), inset -8px 0 30px rgba(0, 255, 255, 0.15), 0 0 8px rgba(255, 255, 255, 0.2);
                    border: 1px solid rgba(255, 255, 255, 0.3);
                }

                .bubble-reflection {
                    position: absolute;
                    top: 15%;
                    left: 20%;
                    width: 25%;
                    height: 15%;
                    border-radius: 50%;
                    background: radial-gradient(ellipse at center, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0) 70%);
                    filter: blur(0.5px);
                    transform: rotate(-45deg);
                }

                .soap-droplet {
                    position: absolute;
                    top: 0;
                    left: 0;
                    border-radius: 50%;
                    backface-visibility: hidden;
                    transform: translateZ(0);
                    box-shadow: 0 0 3px rgba(255, 255, 255, 0.6);
                }
            `}</style>
        </>
    )
}
