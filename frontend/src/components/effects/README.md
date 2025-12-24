# Reindeer Cursor Effect 🦌

Hiệu ứng con tuần lộc chạy theo chuột cho ứng dụng Christmas theme.

## Các Components

### 1. ReindeerCursor (Simple)

Phiên bản đơn giản sử dụng emoji 🦌

### 2. AdvancedReindeerCursor (Advanced)

Phiên bản nâng cao với SVG tuần lộc tùy chỉnh, xoay theo hướng di chuyển

## Cách sử dụng

### Cách 1: Thêm vào Layout/App chính

```tsx
import ReindeerCursor from '@/components/effects/ReindeerCursor'
// hoặc
import AdvancedReindeerCursor from '@/components/effects/AdvancedReindeerCursor'

function App() {
    return (
        <>
            <ReindeerCursor />
            {/* hoặc */}
            <AdvancedReindeerCursor />

            {/* Nội dung app của bạn */}
        </>
    )
}
```

### Cách 2: Sử dụng với Hook để bật/tắt

```tsx
import { useReindeerCursor } from '@/hooks/useReindeerCursor'
import AdvancedReindeerCursor from '@/components/effects/AdvancedReindeerCursor'
import { Button } from '@/components/ui/button'

function MyComponent() {
    const { enabled, toggle } = useReindeerCursor()

    return (
        <>
            {enabled && <AdvancedReindeerCursor />}

            <Button onClick={toggle}>{enabled ? 'Tắt' : 'Bật'} hiệu ứng tuần lộc 🦌</Button>
        </>
    )
}
```

### Cách 3: Chỉ bật trong trang cụ thể

```tsx
// Trong LoginPage.tsx chẳng hạn
import ReindeerCursor from '@/components/effects/ReindeerCursor'

export default function LoginPage() {
    return (
        <>
            <ReindeerCursor />
            {/* Nội dung trang login */}
        </>
    )
}
```

## Tính năng

✨ **ReindeerCursor (Simple)**

-   Emoji tuần lộc 🦌
-   Animation bounce
-   Trail effect đơn giản
-   Nhẹ, không ảnh hưởng performance

🎨 **AdvancedReindeerCursor (Advanced)**

-   SVG tuần lộc tùy chỉnh
-   Xoay theo hướng di chuyển chuột
-   Animation float mượt mà
-   Hiệu ứng fade-out và scale
-   Trail effect chuyên nghiệp

## Tùy chỉnh

Bạn có thể chỉnh sửa các thông số trong file component:

```tsx
const minInterval = 30 // Tốc độ spawn tuần lộc (ms)
const fadeSpeed = 0.025 // Tốc độ biến mất
const scaleSpeed = 0.98 // Tốc độ thu nhỏ
```

## Note

-   Component sử dụng `cursor: none` để ẩn con trỏ mặc định
-   Không ảnh hưởng đến các sự kiện click/hover
-   Tự động cleanup khi unmount
-   Compatible với dark/light mode
