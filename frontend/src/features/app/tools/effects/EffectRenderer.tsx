import SnowEffect from './snow-effect/SnowEffect'
import ConfettiEffect from './confetti-effect/ConfettiEffect'
import BubblesEffect from './bubble-effect/BubblesEffect'
import LeavesEffect from './leaf-effect/LeavesEffect'
import FireworksEffect from './firework-effect/FireworksEffect'
import MouseTrailEffect from './mouse-effect/MouseTrailEffect'
import { useEffects } from '../context/EffectContext'

export default function EffectRenderer() {
    const { activeEffects, isEffectEnabled } = useEffects()

    return (
        <>
            {/* Snow Effect */}
            {isEffectEnabled('snow') && <SnowEffect {...(activeEffects.snow as any)} />}

            {/* Confetti Effect */}
            {isEffectEnabled('confetti') && <ConfettiEffect {...(activeEffects.confetti as any)} />}

            {/* Bubbles Effect */}
            {isEffectEnabled('bubbles') && <BubblesEffect {...(activeEffects.bubbles as any)} />}

            {/* Leaves Effect */}
            {isEffectEnabled('leaves') && <LeavesEffect {...(activeEffects.leaves as any)} />}

            {/* Fireworks Effect */}
            {isEffectEnabled('fireworks') && <FireworksEffect {...(activeEffects.fireworks as any)} />}

            {/* Mouse Trail Effect */}
            {isEffectEnabled('mouse-trail') && <MouseTrailEffect {...(activeEffects['mouse-trail'] as any)} />}
        </>
    )
}
