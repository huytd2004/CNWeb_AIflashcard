import { useEffect, useRef, useState } from 'react'

interface Reindeer {
    id: number
    x: number
    y: number
    opacity: number
    scale: number
    rotation: number
}

export default function AdvancedReindeerCursor() {
    const [reindeers, setReindeers] = useState<Reindeer[]>([])
    const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })
    const [velocity, setVelocity] = useState({ x: 0, y: 0 })
    const lastPosition = useRef({ x: 0, y: 0 })
    const idCounter = useRef(0)

    useEffect(() => {
        let lastTime = Date.now()
        const minInterval = 30 // Tạo tuần lộc mỗi 30ms

        const handleMouseMove = (e: MouseEvent) => {
            const now = Date.now()
            const dx = e.clientX - lastPosition.current.x
            const dy = e.clientY - lastPosition.current.y

            // Tính vận tốc để xác định hướng quay
            setVelocity({ x: dx, y: dy })
            lastPosition.current = { x: e.clientX, y: e.clientY }

            setCursorPosition({ x: e.clientX, y: e.clientY })

            // Chỉ tạo tuần lộc mới nếu đã đủ thời gian và chuột đang di chuyển
            if (now - lastTime > minInterval && (Math.abs(dx) > 1 || Math.abs(dy) > 1)) {
                lastTime = now
                const rotation = Math.atan2(dy, dx) * (180 / Math.PI)

                const newReindeer: Reindeer = {
                    id: idCounter.current++,
                    x: e.clientX,
                    y: e.clientY,
                    opacity: 1,
                    scale: 1,
                    rotation: rotation,
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
                        opacity: reindeer.opacity - 0.025,
                        scale: reindeer.scale * 0.98,
                    }))
                    .filter((reindeer) => reindeer.opacity > 0 && reindeer.scale > 0.1)
            )
        }, 16) // ~60fps

        return () => {
            document.removeEventListener('mousemove', handleMouseMove)
            clearInterval(animationInterval)
        }
    }, [])

    // SVG Reindeer component
    const ReindeerSVG = ({ size = 32, rotation = 0 }: { size?: number; rotation?: number }) => (
        <svg
            width={size}
            height={size}
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
                transform: `rotate(${rotation}deg)`,
            }}
        >
            {/* Body */}
            <ellipse cx="32" cy="36" rx="18" ry="14" fill="#8B4513" />

            {/* Head */}
            <circle cx="45" cy="28" r="10" fill="#A0522D" />

            {/* Nose */}
            <circle cx="52" cy="28" r="4" fill="#FF0000" />

            {/* Antlers */}
            <path d="M 42 18 L 40 12 M 40 12 L 38 14 M 40 12 L 42 10" stroke="#654321" strokeWidth="2" strokeLinecap="round" />
            <path d="M 48 18 L 50 12 M 50 12 L 52 14 M 50 12 L 48 10" stroke="#654321" strokeWidth="2" strokeLinecap="round" />

            {/* Eyes */}
            <circle cx="48" cy="26" r="2" fill="#000000" />

            {/* Legs */}
            <rect x="22" y="46" width="3" height="10" fill="#654321" rx="1.5" />
            <rect x="30" y="46" width="3" height="10" fill="#654321" rx="1.5" />
            <rect x="38" y="46" width="3" height="10" fill="#654321" rx="1.5" />
            <rect x="46" y="46" width="3" height="10" fill="#654321" rx="1.5" />

            {/* Tail */}
            <path d="M 14 36 Q 8 36 8 40" stroke="#654321" strokeWidth="3" strokeLinecap="round" />

            {/* Ear */}
            <ellipse cx="43" cy="23" rx="3" ry="5" fill="#8B4513" transform="rotate(-20 43 23)" />
        </svg>
    )

    const cursorRotation = Math.atan2(velocity.y, velocity.x) * (180 / Math.PI)

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
                <div
                    style={{
                        animation: 'float 1s ease-in-out infinite',
                        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
                    }}
                >
                    <ReindeerSVG size={40} rotation={cursorRotation} />
                </div>
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
                        filter: 'blur(0.5px)',
                    }}
                >
                    <ReindeerSVG size={32} rotation={reindeer.rotation} />
                </div>
            ))}

            {/* CSS animations và ẩn cursor mặc định */}
            <style>{`
                * {
                    cursor: none !important;
                }
                
                @keyframes float {
                    0%, 100% {
                        transform: translateY(0px);
                    }
                    50% {
                        transform: translateY(-4px);
                    }
                }
            `}</style>
        </>
    )
}
