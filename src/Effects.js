import { EffectComposer, Bloom } from '@react-three/postprocessing'

export function Effects() {
  return (
    <EffectComposer>
      <Bloom luminanceThreshold={0.3} mipmapBlur luminanceSmoothing={0} intensity={1} />
    </EffectComposer>
  )
}
