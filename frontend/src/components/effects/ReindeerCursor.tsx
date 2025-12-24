import { useEffect, useRef, useState } from 'react'

interface Reindeer {
    id: number
    x: number
    y: number
    opacity: number
    scale: number
}

export default function ReindeerCursor() {
    const [reindeers, setReindeers] = useState<Reindeer[]>([])
    const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })
    const idCounter = useRef(0)

    useEffect(() => {
        let lastTime = Date.now()
        const minInterval = 50 // Tạo tuần lộc mỗi 50ms

        const handleMouseMove = (e: MouseEvent) => {
            const now = Date.now()
            setCursorPosition({ x: e.clientX, y: e.clientY })

            // Chỉ tạo tuần lộc mới nếu đã đủ thời gian
            if (now - lastTime > minInterval) {
                lastTime = now
                const newReindeer: Reindeer = {
                    id: idCounter.current++,
                    x: e.clientX,
                    y: e.clientY,
                    opacity: 1,
                    scale: 1,
                }
                setReindeers((prev) => [...prev, newReindeer])
            }
        }

        document.addEventListener('mousemove', handleMouseMove)

        // Animation loop để fade out các tuần lộc
        const animationInterval = setInterval(() => {
            setReindeers((prev) =>
                prev
                    .map((reindeer) => ({
                        ...reindeer,
                        opacity: reindeer.opacity - 0.02,
                        scale: reindeer.scale - 0.01,
                    }))
                    .filter((reindeer) => reindeer.opacity > 0)
            )
        }, 16) // ~60fps

        return () => {
            document.removeEventListener('mousemove', handleMouseMove)
            clearInterval(animationInterval)
        }
    }, [])

    return (
        <>
            {/* Custom cursor - tuần lộc chính */}
            <div
                className="reindeer-cursor"
                style={{
                    position: 'fixed',
                    left: cursorPosition.x,
                    top: cursorPosition.y,
                    pointerEvents: 'none',
                    zIndex: 9999,
                    transform: 'translate(-50%, -50%)',
                }}
            >
                <div className="text-3xl animate-bounce">🦌</div>
            </div>

            {/* Các tuần lộc trail */}
            {reindeers.map((reindeer) => (
                <div
                    key={reindeer.id}
                    style={{
                        position: 'fixed',
                        left: reindeer.x,
                        top: reindeer.y,
                        pointerEvents: 'none',
                        zIndex: 9998,
                        opacity: reindeer.opacity,
                        transform: `translate(-50%, -50%) scale(${reindeer.scale})`,
                        transition: 'opacity 0.1s ease-out',
                    }}
                >
                    <div className="text-2xl">🦌</div>
                </div>
            ))}

            {/* CSS để ẩn cursor mặc định */}
            <style>{`
                * {
                    cursor: none !important;
                }
            `}</style>
        </>
    )
}
