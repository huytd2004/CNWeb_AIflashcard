import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'

// Christmas Tree Component
function ChristmasTree() {
    const containerRef = useRef<HTMLDivElement>(null)
    const animationRef = useRef<number | null>(null)

    useEffect(() => {
        if (!containerRef.current) return

        const container = containerRef.current
        const width = container.clientWidth
        const height = container.clientHeight

        // Scene setup
        const scene = new THREE.Scene()
        scene.fog = new THREE.FogExp2(0x000000, 0.003)

        const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000)
        camera.position.z = 80

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
        renderer.setSize(width, height)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        container.appendChild(renderer.domElement)

        // Config
        const CONFIG = {
            goldCount: 1500,
            redCount: 200,
            treeHeight: 60,
            treeBaseRadius: 28,
        }

        // Create custom textures
        function createCustomTexture(type: string) {
            const canvas = document.createElement('canvas')
            canvas.width = 128
            canvas.height = 128
            const ctx = canvas.getContext('2d')!
            const cx = 64, cy = 64

            if (type === 'gold_glow') {
                const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, 40)
                grd.addColorStop(0, '#FFFFFF')
                grd.addColorStop(0.2, '#FFFFE0')
                grd.addColorStop(0.5, '#FFD700')
                grd.addColorStop(1, 'rgba(0,0,0,0)')
                ctx.fillStyle = grd
                ctx.fillRect(0, 0, 128, 128)
            } else if (type === 'red_light') {
                const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, 50)
                grd.addColorStop(0, '#FFAAAA')
                grd.addColorStop(0.3, '#FF0000')
                grd.addColorStop(1, 'rgba(0,0,0,0)')
                ctx.fillStyle = grd
                ctx.fillRect(0, 0, 128, 128)
            }
            return new THREE.CanvasTexture(canvas)
        }

        const textures = {
            gold: createCustomTexture('gold_glow'),
            red: createCustomTexture('red_light'),
        }

        // Create particle system
        function createParticleSystem(type: 'gold' | 'red', count: number, size: number) {
            const pPositions: number[] = []
            const pTreeTargets: number[] = []
            const sizes: number[] = []
            const phases: number[] = []

            for (let i = 0; i < count; i++) {
                const h = Math.random() * CONFIG.treeHeight
                const y = h - CONFIG.treeHeight / 2
                const radiusRatio = type === 'gold' ? Math.random() : 0.9 + Math.random() * 0.1
                const maxR = (1 - h / CONFIG.treeHeight) * CONFIG.treeBaseRadius
                const r = maxR * radiusRatio
                const theta = Math.random() * Math.PI * 2
                pTreeTargets.push(r * Math.cos(theta), y, r * Math.sin(theta))
                pPositions.push(r * Math.cos(theta), y, r * Math.sin(theta))
                sizes.push(size)
                phases.push(Math.random() * Math.PI * 2)
            }

            const geo = new THREE.BufferGeometry()
            geo.setAttribute('position', new THREE.Float32BufferAttribute(pPositions, 3))
            geo.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1))

            const colors = new Float32Array(count * 3)
            const baseColor = new THREE.Color()
            if (type === 'gold') baseColor.setHex(0xffd700)
            else baseColor.setHex(0xff0000)

            for (let i = 0; i < count; i++) {
                colors[i * 3] = baseColor.r
                colors[i * 3 + 1] = baseColor.g
                colors[i * 3 + 2] = baseColor.b
            }
            geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))

            geo.userData = { phases, baseColor, baseSize: size }

            const mat = new THREE.PointsMaterial({
                size: size,
                map: textures[type],
                transparent: true,
                opacity: 1.0,
                vertexColors: true,
                blending: THREE.AdditiveBlending,
                depthWrite: false,
                sizeAttenuation: true,
            })

            const points = new THREE.Points(geo, mat)
            scene.add(points)
            return points
        }

        const groupGold = createParticleSystem('gold', CONFIG.goldCount, 2.0)
        const groupRed = createParticleSystem('red', CONFIG.redCount, 3.5)

        // Create star on top
        const starCanvas = document.createElement('canvas')
        starCanvas.width = 128
        starCanvas.height = 128
        const sCtx = starCanvas.getContext('2d')!
        sCtx.fillStyle = '#FFFF00'
        sCtx.shadowColor = '#FFF'
        sCtx.shadowBlur = 20
        sCtx.beginPath()
        const cx = 64, cy = 64, outer = 50, inner = 20
        for (let i = 0; i < 5; i++) {
            sCtx.lineTo(cx + Math.cos((18 + i * 72) / 180 * Math.PI) * outer, cy - Math.sin((18 + i * 72) / 180 * Math.PI) * outer)
            sCtx.lineTo(cx + Math.cos((54 + i * 72) / 180 * Math.PI) * inner, cy - Math.sin((54 + i * 72) / 180 * Math.PI) * inner)
        }
        sCtx.closePath()
        sCtx.fill()
        const starTex = new THREE.CanvasTexture(starCanvas)
        const starMat = new THREE.MeshBasicMaterial({ map: starTex, transparent: true, blending: THREE.AdditiveBlending })
        const starMesh = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), starMat)
        starMesh.position.set(0, CONFIG.treeHeight / 2, 0)
        scene.add(starMesh)

        // Animation
        function animate() {
            animationRef.current = requestAnimationFrame(animate)
            const time = Date.now() * 0.001

            // Rotate tree
            groupGold.rotation.y += 0.005
            groupRed.rotation.y += 0.005

            // Animate colors
            const colorsRed = groupRed.geometry.attributes.color.array as Float32Array
            const phasesRed = groupRed.geometry.userData.phases
            const baseColorRed = groupRed.geometry.userData.baseColor
            for (let i = 0; i < CONFIG.redCount; i++) {
                const brightness = 0.5 + 0.5 * Math.sin(time * 3 + phasesRed[i])
                colorsRed[i * 3] = baseColorRed.r * brightness
                colorsRed[i * 3 + 1] = baseColorRed.g * brightness
                colorsRed[i * 3 + 2] = baseColorRed.b * brightness
            }
            groupRed.geometry.attributes.color.needsUpdate = true

            // Animate star
            starMesh.rotation.z -= 0.02
            starMesh.material.opacity = 0.7 + 0.3 * Math.sin(time * 5)

            renderer.render(scene, camera)
        }
        animate()

        // Handle resize
        const handleResize = () => {
            const w = container.clientWidth
            const h = container.clientHeight
            camera.aspect = w / h
            camera.updateProjectionMatrix()
            renderer.setSize(w, h)
        }
        window.addEventListener('resize', handleResize)

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize)
            if (animationRef.current) cancelAnimationFrame(animationRef.current)
            renderer.dispose()
            container.removeChild(renderer.domElement)
        }
    }, [])

    return <div ref={containerRef} className="w-full h-full" />
}

// Snowflake component
function Snowflakes() {
    const snowflakesData = React.useMemo(() => {
        const snowflakeChars = ['❄', '❅', '❆', '✻', '✼', '❉']
        return Array.from({ length: 50 }).map((_, i) => ({
            id: i,
            char: snowflakeChars[Math.floor(Math.random() * snowflakeChars.length)],
            left: Math.random() * 100,
            duration: Math.random() * 5 + 5,
            delay: Math.random() * 5,
            fontSize: Math.random() * 1.5 + 0.5,
            opacity: Math.random() * 0.5 + 0.5,
        }))
    }, [])

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
            {snowflakesData.map((flake) => (
                <div
                    key={flake.id}
                    className="absolute text-white animate-fall"
                    style={{
                        left: `${flake.left}%`,
                        animationDuration: `${flake.duration}s`,
                        animationDelay: `${flake.delay}s`,
                        fontSize: `${flake.fontSize}em`,
                        opacity: flake.opacity,
                        textShadow: '0 0 10px #fff, 0 0 20px #b3e5fc',
                    }}
                >
                    {flake.char}
                </div>
            ))}
            <style>{`
                @keyframes fall {
                    0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
                    100% { transform: translateY(110vh) rotate(360deg); opacity: 0.3; }
                }
                .animate-fall { animation: fall linear infinite; }
            `}</style>
        </div>
    )
}

interface ChristmasLayoutProps {
    children: React.ReactNode
    title?: string
}

export default function ChristmasLayout({ children, title = 'Merry Christmas' }: ChristmasLayoutProps) {
    return (
        <div className="h-screen w-screen flex relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0c1445 0%, #1a0a2e 50%, #0d1b3e 100%)' }}>
            {/* Snowflakes - Full screen background */}
            <Snowflakes />

            {/* Left Side - Christmas Tree */}
            <div className="hidden lg:flex w-1/2 h-full items-center justify-center relative z-10">
                {/* Merry Christmas Title - On top of tree */}
                <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-20 whitespace-nowrap">
                    <h1 className="text-2xl md:text-4xl font-bold text-yellow-400 animate-pulse inline-flex items-center gap-2" style={{ textShadow: '0 0 10px #ffd700, 0 0 20px #ffd700, 0 0 30px #ff0000' }}>
                        <span>🎄</span>
                        <span>{title}</span>
                        <span>🎄</span>
                    </h1>
                </div>
                <div className="w-full h-full relative">
                    <ChristmasTree />
                    {/* Decorations around tree */}
                    <div className="absolute bottom-16 left-16 text-6xl animate-bounce">🎁</div>
                    <div className="absolute bottom-12 left-40 text-5xl animate-bounce" style={{ animationDelay: '0.3s' }}>🎁</div>
                    <div className="absolute bottom-20 right-24 text-6xl animate-bounce" style={{ animationDelay: '0.6s' }}>🎁</div>
                    <div className="absolute top-24 left-24 text-4xl" style={{ animation: 'twinkle 1.5s ease-in-out infinite' }}>⭐</div>
                    <div className="absolute top-40 right-20 text-4xl" style={{ animation: 'twinkle 1.5s ease-in-out infinite', animationDelay: '0.7s' }}>✨</div>
                    <div className="absolute bottom-24 right-16 text-7xl">⛄</div>
                    <div className="absolute top-1/3 left-8 text-3xl" style={{ animation: 'twinkle 1.5s ease-in-out infinite', animationDelay: '0.3s' }}>🌟</div>
                    <div className="absolute bottom-1/3 left-12 text-4xl animate-bounce" style={{ animationDelay: '0.9s' }}>🎀</div>
                </div>
            </div>

            {/* Right Side - Content */}
            <div className="w-full lg:w-1/2 h-full flex items-center justify-center p-4 z-10">
                {children}
            </div>

            {/* Mobile decorations - only show on small screens */}
            <div className="lg:hidden absolute bottom-4 left-4 text-4xl animate-bounce z-10">🎁</div>
            <div className="lg:hidden absolute bottom-4 right-4 text-4xl animate-bounce z-10" style={{ animationDelay: '0.5s' }}>⛄</div>
            <div className="lg:hidden absolute top-20 left-8 text-3xl z-10" style={{ animation: 'twinkle 1.5s ease-in-out infinite' }}>⭐</div>
            <div className="lg:hidden absolute top-32 right-12 text-3xl z-10" style={{ animation: 'twinkle 1.5s ease-in-out infinite', animationDelay: '0.7s' }}>✨</div>
            
            <style>{`
                @keyframes twinkle {
                    0%, 100% { opacity: 0.3; transform: scale(0.8); }
                    50% { opacity: 1; transform: scale(1.2); }
                }
            `}</style>
        </div>
    )
}
