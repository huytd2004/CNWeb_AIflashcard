import { useEffect, useRef, useCallback } from 'react'
import type { LeavesSettings } from '../../context/EffectContext'

// --- SVG PATHS LEAF ---
const LEAF_PATHS = {
    maple: 'M19.7,9.3c-0.6-0.6-5.6,3.6-5.6,3.6s-1.4-2.7-3.6-3.1c0,0,1.2-4.1-0.9-5.1c0,0-2.3,4.4-4,4.4c0,0-3.3-3.6-4.5-0.9 c0,0,3.3,2.7,3.1,4.9c0,0-4.7,2-4.2,4.9c0,0,4.2-0.9,5.8,0.7C5.8,18.7,3.1,23.3,4.9,24c0,0,2.9-2.9,5.3-2.7c0,0,0,4,1.8,4.4 c0-1.6,0.2-4.4,0.2-4.4s4.2,2.7,6,0.9c0,0-2.2-2.7-1.1-5.1c1.6-1.1,5.3-0.4,6-2.9C23.1,14.2,20.4,13.1,19.7,9.3z',
    oak: 'M18.8,9.6c-0.9-1.8-3.1-2.2-3.1-2.2s0.4-1.8-0.9-2.7c-1.3-0.9-3.1,0.4-3.1,0.4S11.3,2,9.6,2.4C7.8,2.9,8.2,5.1,8.2,5.1 S5.6,5.1,4.7,7.3c-0.9,2.2,1.3,3.6,1.3,3.6s-2.2,2-1.3,4.4c0.9,2.4,3.1,2.2,3.1,2.2s-0.4,2.2,1.3,3.1c1.8,0.9,3.6-0.4,3.6-0.4 V25h1.8v-4.9c0,0,2.2,1.3,4-0.4c1.8-1.8,0.9-3.6,0.9-3.6s2.7-0.4,2.7-2.7c0-2.2-2.2-3.1-2.2-3.1S20.6,11.3,18.8,9.6z',
    birch: 'M12,24.4c0,0,1.6-3.1,0.4-5.3c0,0,6.7-2.7,6.7-9.3C19.1,3.1,12,0.4,12,0.4S4.9,3.1,4.9,9.8c0,6.7,6.7,9.3,6.7,9.3 C10.4,21.3,12,24.4,12,24.4z',
}

interface LeafData {
    id: string
    x: number
    y: number
    z: number
    rotation: { x: number; y: number; z: number }
    rotationSpeed: { x: number; y: number; z: number }
    vx: number // Wind speed
    vy: number // Falling velocity
    swayPhase: number
    swaySpeed: number
    size: number
    color: string
    type: 'maple' | 'oak' | 'birch'
    element: HTMLElement | null
}

export default function LeavesEffect({
    count = 30,
    types = ['maple', 'oak', 'birch'],
    colors = ['#e45f2b', '#d69d2d', '#b84728', '#8c2f1b'],
    windStrength = 0.5,
    season = 'autumn',
    opacity = 1,
    zIndex = 45,
}: LeavesSettings) {
    const containerRef = useRef<HTMLDivElement>(null)
    const leavesRef = useRef<LeafData[]>([])
    const animationFrameRef = useRef<number>(0)
    const lastTimestamp = useRef(0)

    // --- CONFIG ---
    const getSeasonColors = useCallback(() => {
        if (season === 'spring') {
            return ['#84bd00', '#549637', '#a6d65e', '#dcedc1']
        }
        return colors
    }, [season, colors])

    // --- DOM HELPER ---
    const createLeafElement = (leaf: LeafData) => {
        // Create SVG container
        const div = document.createElement('div')
        div.className = 'leaf-particle'
        div.style.width = `${leaf.size}px`
        div.style.height = `${leaf.size}px`
        div.style.opacity = `${opacity}`
        div.style.willChange = 'transform'

        // SVG Content
        div.innerHTML = `
      <svg viewBox="0 0 24 25" fill="${leaf.color}" style="width: 100%; height: 100%; filter: drop-shadow(1px 1px 1px rgba(0,0,0,0.2));">
        <path d="${LEAF_PATHS[leaf.type]}" />
      </svg>
    `

        return div
    }

    // --- SPAWN LOGIC ---
    const createLeafData = useCallback(
        (startAtTop = true): LeafData => {
            const winW = window.innerWidth
            const winH = window.innerHeight
            const currentColors = getSeasonColors()
            const type = types[Math.floor(Math.random() * types.length)]

            const size = Math.random() * 20 + 20 // 20px - 40px

            return {
                id: `leaf-${Math.random()}`,
                x: Math.random() * winW,
                y: startAtTop ? -50 : Math.random() * winH,
                z: Math.random() * 200, // Depth
                rotation: {
                    x: Math.random() * 360,
                    y: Math.random() * 360,
                    z: Math.random() * 360,
                },
                rotationSpeed: {
                    x: (Math.random() - 0.5) * 2, // Flip it over and over
                    y: (Math.random() - 0.5) * 2,
                    z: (Math.random() - 0.5) * 1, // Circular
                },
                vx: (Math.random() - 0.5) * 0.5 + windStrength * 2, // Basic wind
                vy: Math.random() * 1.5 + 1, // Falling speed
                swayPhase: Math.random() * Math.PI * 2,
                swaySpeed: Math.random() * 0.05 + 0.02,
                size: size,
                color: currentColors[Math.floor(Math.random() * currentColors.length)],
                type: type as any,
                element: null,
            }
        },
        [getSeasonColors, types, windStrength]
    )

    // --- ANIMATION LOOP ---
    useEffect(() => {
        // 1. Setup
        if (containerRef.current) containerRef.current.innerHTML = ''
        leavesRef.current = []
        lastTimestamp.current = 0

        // Spawn initial leaves
        for (let i = 0; i < count; i++) {
            const leaf = createLeafData(false)
            const el = createLeafElement(leaf)
            leaf.element = el
            if (containerRef.current) {
                containerRef.current.appendChild(el)
                leavesRef.current.push(leaf)
            }
        }

        // 2. Loop
        const animate = (timestamp: number) => {
            const winW = window.innerWidth
            const winH = window.innerHeight

            // Calculate delta time
            const deltaTime = lastTimestamp.current === 0 ? 16 : Math.min(timestamp - lastTimestamp.current, 32)
            lastTimestamp.current = timestamp
            const fpsMult = deltaTime / 16

            // Gust of wind effect
            const windGust = Math.sin(timestamp * 0.001) * windStrength * 0.5

            if (leavesRef.current.length < count && Math.random() > 0.95) {
                const leaf = createLeafData(true)
                const el = createLeafElement(leaf)
                leaf.element = el
                if (containerRef.current) {
                    containerRef.current.appendChild(el)
                    leavesRef.current.push(leaf)
                }
            }

            // Update each leaf individually
            for (let i = leavesRef.current.length - 1; i >= 0; i--) {
                const l = leavesRef.current[i]
                if (!l.element) continue

                // Update location
                // Y: Falling
                l.y += l.vy * fpsMult

                // X: Wind blowing + Gusts + Swaying
                l.swayPhase += l.swaySpeed * fpsMult
                const sway = Math.sin(l.swayPhase) * 1.5 // Oscillation amplitude
                l.x += (l.vx + windGust + sway) * fpsMult

                // Updated 3D rotation angle (Tumbling effect)
                l.rotation.x += l.rotationSpeed.x * fpsMult
                l.rotation.y += l.rotationSpeed.y * fpsMult
                l.rotation.z += l.rotationSpeed.z * fpsMult

                // Delete when leaving the screen
                if (l.y > winH + 50 || l.x > winW + 100 || l.x < -100) {
                    l.element.remove()
                    leavesRef.current.splice(i, 1)
                    continue
                }

                // Render Transform 3D
                l.element.style.transform = `
                  translate3d(${l.x}px, ${l.y}px, 0) 
                  rotateX(${l.rotation.x}deg) 
                  rotateY(${l.rotation.y}deg) 
                  rotateZ(${l.rotation.z}deg)
                `
            }

            animationFrameRef.current = requestAnimationFrame(animate)
        }

        animationFrameRef.current = requestAnimationFrame(animate)

        return () => {
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
            // eslint-disable-next-line react-hooks/exhaustive-deps
            if (containerRef.current) containerRef.current.innerHTML = ''
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [count, createLeafData, windStrength])

    return (
        <>
            <div
                ref={containerRef}
                className="fixed inset-0 overflow-hidden pointer-events-none"
                style={{
                    zIndex,
                    perspective: '1000px',
                }}
            />
            <style>{`
                .leaf-particle {
                    position: absolute;
                    top: 0;
                    left: 0;
                    /* Giúp icon SVG sắc nét hơn khi xoay */
                    -webkit-font-smoothing: antialiased;
                }
            `}</style>
        </>
    )
}
