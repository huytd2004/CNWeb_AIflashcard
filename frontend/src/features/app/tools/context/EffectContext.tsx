'use client'

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import EffectRenderer from '../effects/EffectRenderer'

// core types
export type EffectType = 'snow' | 'confetti' | 'fireworks' | 'bubbles' | 'leaves' | 'mouse-trail'

export interface EffectSettings {
    enabled: boolean
    opacity: number
    zIndex: number
}

// snow effect settings
export interface SnowSettings extends EffectSettings {
    type: 'snow'
    count: number
    speed: 'slow' | 'medium' | 'fast'
    size: 'small' | 'medium' | 'large'
    color: string
    style: 'flat' | 'sparkle' | 'blur'
    showGround: boolean
}

// confetti effect settings
export interface ConfettiSettings extends EffectSettings {
    type: 'confetti'
    density: 'low' | 'medium' | 'high'
    size: 'small' | 'medium' | 'large'
    colors: string[]
    shapes: ('circle' | 'rectangle' | 'star')[]
    gravity: number // 0.5 to 2
}

// bubbles effect settings
export interface BubblesSettings extends EffectSettings {
    type: 'bubbles'
    count: number
    size: 'small' | 'medium' | 'large'
    speed: 'slow' | 'medium' | 'fast'
    colors: string[]
    reflectivity: number // 0 to 1
    popOnClick: boolean
}

// leaves effect settings
export interface LeavesSettings extends EffectSettings {
    type: 'leaves'
    count: number
    types: ('maple' | 'oak' | 'birch')[]
    colors: string[]
    windStrength: number
    season: 'autumn' | 'spring'
}

// fireworks effect settings
export type FireworkStyle = 'peony' | 'burst' | 'glitter' | 'palm' | 'multicolor'
export interface FireworksSettings extends EffectSettings {
    type: 'fireworks'
    intensity: number
    explosion: number
    trace: number
    sound: boolean
}

// mouse trail effect settings
export type MouseTrailStyle = 'string' | 'particle' | 'comet'
export interface MouseTrailSettings extends EffectSettings {
    type: 'mouse-trail'
    trailType: MouseTrailStyle
    color: string
    size: number
    length: number
}

export type AllEffectSettings = SnowSettings | ConfettiSettings | BubblesSettings | LeavesSettings | FireworksSettings | MouseTrailSettings

// default settings for all effects
export const defaultSettings: Record<EffectType, AllEffectSettings> = {
    snow: {
        type: 'snow',
        enabled: false,
        opacity: 1,
        zIndex: 50,
        count: 50,
        speed: 'medium',
        size: 'medium',
        color: '#ffffff',
        style: 'flat',
        showGround: true,
    },
    confetti: {
        type: 'confetti',
        enabled: false,
        opacity: 1,
        zIndex: 50,
        density: 'medium',
        size: 'medium',
        colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'],
        shapes: ['circle', 'rectangle', 'star'],
        gravity: 1,
    },
    bubbles: {
        type: 'bubbles',
        enabled: false,
        opacity: 1,
        zIndex: 40,
        count: 30,
        size: 'medium',
        speed: 'slow',
        colors: ['#87CEEB', '#ADD8E6', '#B0E0E6', '#AFEEEE'],
        reflectivity: 0.7,
        popOnClick: true,
    },
    leaves: {
        type: 'leaves',
        enabled: false,
        opacity: 1,
        zIndex: 45,
        count: 40,
        types: ['maple', 'oak', 'birch'],
        colors: ['#8B4513', '#A0522D', '#D2691E', '#CD853F'],
        windStrength: 0.5,
        season: 'autumn',
    },
    fireworks: {
        type: 'fireworks',
        enabled: false,
        opacity: 1,
        zIndex: 60,
        intensity: 30,
        explosion: 5,
        trace: 3,
        sound: false,
    },
    'mouse-trail': {
        type: 'mouse-trail',
        enabled: false,
        opacity: 1,
        zIndex: 100,
        trailType: 'string',
        color: '#00ffff',
        length: 15,
        size: 4,
    },
}

// context type
interface EffectContextType {
    activeEffects: Record<EffectType, AllEffectSettings>
    toggleEffect: (type: EffectType) => void
    updateEffectSettings: <T extends EffectType>(type: T, settings: Partial<AllEffectSettings>) => void
    resetEffect: (type: EffectType) => void
    resetAllEffects: () => void
    isEffectEnabled: (type: EffectType) => boolean
}

const EffectContext = createContext<EffectContextType | undefined>(undefined)

// storage management
const STORAGE_KEY = 'multi_effect_settings'

const loadSettings = (): Record<EffectType, AllEffectSettings> => {
    if (typeof window === 'undefined') return defaultSettings

    try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (!stored) return defaultSettings

        const parsed = JSON.parse(stored)

        const merged: Record<EffectType, AllEffectSettings> = JSON.parse(JSON.stringify(defaultSettings))

        Object.keys(parsed).forEach((key) => {
            const effectType = key as EffectType
            if (defaultSettings[effectType] && parsed[effectType] && typeof parsed[effectType] === 'object') {
                merged[effectType] = {
                    ...merged[effectType],
                    ...parsed[effectType],
                    type: effectType,
                }
            }
        })

        return merged
    } catch (error) {
        console.error('Error loading effect settings, resetting to default:', error)
        localStorage.removeItem(STORAGE_KEY)
        return defaultSettings
    }
}

const saveSettings = (settings: Record<EffectType, AllEffectSettings>) => {
    if (typeof window === 'undefined') return

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
    } catch (error) {
        console.error('Error saving effect settings:', error)
    }
}

// effect provider
export function EffectProvider({ children }: { children: ReactNode }) {
    const [isClient, setIsClient] = useState(false)
    const [activeEffects, setActiveEffects] = useState<Record<EffectType, AllEffectSettings>>(defaultSettings)

    useEffect(() => {
        setIsClient(true)
        const loaded = loadSettings()
        setActiveEffects(loaded)
    }, [])

    useEffect(() => {
        if (!isClient) return
        saveSettings(activeEffects)
    }, [activeEffects, isClient])

    const toggleEffect = useCallback((type: EffectType) => {
        setActiveEffects((prev) => ({
            ...prev,
            [type]: {
                ...prev[type],
                enabled: !prev[type].enabled,
            },
        }))
    }, [])

    const updateEffectSettings = useCallback(<T extends EffectType>(type: T, settings: Partial<AllEffectSettings>) => {
        setActiveEffects((prev) => ({
            ...prev,
            [type]: {
                ...prev[type],
                ...settings,
            } as AllEffectSettings,
        }))
    }, [])

    const resetEffect = useCallback((type: EffectType) => {
        setActiveEffects((prev) => ({
            ...prev,
            [type]: { ...defaultSettings[type] },
        }))
    }, [])

    const resetAllEffects = useCallback(() => {
        setActiveEffects(JSON.parse(JSON.stringify(defaultSettings)))
        localStorage.removeItem(STORAGE_KEY)
    }, [])

    const isEffectEnabled = useCallback(
        (type: EffectType) => {
            return activeEffects[type]?.enabled || false
        },
        [activeEffects]
    )

    const value: EffectContextType = {
        activeEffects,
        toggleEffect,
        updateEffectSettings,
        resetEffect,
        resetAllEffects,
        isEffectEnabled,
    }

    return (
        <EffectContext.Provider value={value}>
            {children}
            {isClient && <EffectRenderer />}
        </EffectContext.Provider>
    )
}

// custom hook
export function useEffects() {
    const context = useContext(EffectContext)
    if (!context) {
        throw new Error('useEffects must be used within an EffectProvider')
    }
    return context
}
