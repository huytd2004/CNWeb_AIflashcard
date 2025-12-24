import { useEffect, useRef } from 'react'
import type { MouseTrailSettings } from '../../context/EffectContext'

interface Point {
    x: number
    y: number
    vx?: number
    vy?: number
    life?: number
    size?: number
    color?: string
}

export default function MouseTrailEffect({ trailType = 'string', color = '#00ffff', length = 20, size = 4, opacity = 1, zIndex = 100 }: MouseTrailSettings) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const pointsRef = useRef<Point[]>([])
    const mouseRef = useRef({ x: 0, y: 0 })
    const frameRef = useRef<number>(0)
    const hasMovedRef = useRef(false)

    // 1. STRING (Silk cord)
    const drawString = (ctx: CanvasRenderingContext2D) => {
        if (!hasMovedRef.current) return

        const points = pointsRef.current

        // create new point
        points.push({ x: mouseRef.current.x, y: mouseRef.current.y })

        // Array length limit
        if (points.length > length * 2) {
            points.shift()
        }

        if (points.length < 2) return

        ctx.beginPath()
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'

        // Algorithm Quadratic Curve
        ctx.moveTo(points[0].x, points[0].y)
        for (let i = 1; i < points.length - 1; i++) {
            const p1 = points[i]
            const p2 = points[i + 1]
            const midX = (p1.x + p2.x) / 2
            const midY = (p1.y + p2.y) / 2
            ctx.quadraticCurveTo(p1.x, p1.y, midX, midY)
        }
        const last = points[points.length - 1]
        ctx.lineTo(last.x, last.y)

        // Glow Effect
        ctx.shadowBlur = size * 2
        ctx.shadowColor = color
        ctx.strokeStyle = color
        ctx.lineWidth = size
        ctx.globalAlpha = opacity
        ctx.stroke()
        ctx.shadowBlur = 0
    }

    // 2. PARTICLE
    const updateAndDrawParticles = (ctx: CanvasRenderingContext2D) => {
        if (hasMovedRef.current) {
            for (let i = 0; i < 2; i++) {
                pointsRef.current.push({
                    x: mouseRef.current.x + (Math.random() - 0.5) * 10,
                    y: mouseRef.current.y + (Math.random() - 0.5) * 10,
                    vx: (Math.random() - 0.5) * 2,
                    vy: (Math.random() - 0.5) * 2 + 1,
                    life: 1.0,
                    size: Math.random() * size + 2,
                    color: color,
                })
            }
        }

        for (let i = pointsRef.current.length - 1; i >= 0; i--) {
            const p = pointsRef.current[i]
            // Validate type check
            if (typeof p.vx === 'number' && typeof p.vy === 'number' && typeof p.size === 'number' && typeof p.life === 'number') {
                p.x += p.vx
                p.y += p.vy
                p.life -= 0.02 + 0.05 / length
                p.size *= 0.95

                if (p.life <= 0 || p.size < 0.5) {
                    pointsRef.current.splice(i, 1)
                    continue
                }

                ctx.beginPath()
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
                ctx.fillStyle = color
                ctx.globalAlpha = p.life * opacity
                ctx.fill()
            }
        }
    }

    // 3. COMET
    const drawComet = (ctx: CanvasRenderingContext2D) => {
        const points = pointsRef.current

        if (hasMovedRef.current) {
            points.push({ x: mouseRef.current.x, y: mouseRef.current.y })
        }

        if (points.length > length * 1.5) {
            points.shift()
        }

        for (let i = 0; i < points.length; i++) {
            const p = points[i]
            const indexRatio = i / points.length
            const currentSize = size * indexRatio * 2
            const currentOpacity = indexRatio * opacity

            ctx.beginPath()
            ctx.arc(p.x, p.y, currentSize, 0, Math.PI * 2)
            ctx.fillStyle = color
            ctx.globalAlpha = currentOpacity
            ctx.globalCompositeOperation = 'lighter'
            ctx.fill()
        }
        ctx.globalCompositeOperation = 'source-over'
    }

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const handleResize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }
        handleResize()
        window.addEventListener('resize', handleResize)

        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY }
            if (!hasMovedRef.current) {
                hasMovedRef.current = true
            }
        }
        window.addEventListener('mousemove', handleMouseMove)

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            if (trailType === 'string') {
                drawString(ctx)
            } else if (trailType === 'particle') {
                updateAndDrawParticles(ctx)
            } else if (trailType === 'comet') {
                drawComet(ctx)
            }

            frameRef.current = requestAnimationFrame(animate)
        }

        // Reset points when change setting
        pointsRef.current = []

        frameRef.current = requestAnimationFrame(animate)

        return () => {
            window.removeEventListener('resize', handleResize)
            window.removeEventListener('mousemove', handleMouseMove)
            cancelAnimationFrame(frameRef.current)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [trailType, color, length, size, opacity])

    return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none" style={{ zIndex }} />
}
