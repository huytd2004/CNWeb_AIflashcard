import { useState } from 'react'

/**
 * Hook để bật/tắt hiệu ứng con tuần lộc
 * 
 * @example
 * const { enabled, toggle, enable, disable } = useReindeerCursor()
 * 
 * @returns Object với các phương thức điều khiển
 */
export const useReindeerCursor = () => {
    const [enabled, setEnabled] = useState(false)

    const toggle = () => setEnabled((prev) => !prev)
    const enable = () => setEnabled(true)
    const disable = () => setEnabled(false)

    return {
        enabled,
        toggle,
        enable,
        disable,
    }
}
