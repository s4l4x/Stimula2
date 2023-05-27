import * as THREE from 'three'
import { useMemo, useState, useRef } from 'react'
import { createPortal, useFrame } from '@react-three/fiber'
import { useFBO } from '@react-three/drei'
import { useControls } from 'leva'
import '../shaders/simulationMaterial'
import '../shaders/dofPointsMaterial'

export function Particles({ size = 512, fft = [], low = 0, sum = 0, accumulator = 0 }) {
  // const { focus, speed, aperture, fov, curl } = useControls('Particles', {
  //   focus: { value: 5.8, min: 3, max: 7, step: 0.01 },
  //   speed: { value: 8.5, min: 0.1, max: 100, step: 0.1 },
  //   aperture: { value: 5.4, min: 1, max: 5.6, step: 0.1 },
  //   fov: { value: 6, min: 0, max: 200 },
  //   curl: { value: 0.18, min: 0.01, max: 0.5, step: 0.01 }
  // })
  const { focus, speed, aperture, fov, curl } = useControls('Particles', {
    focus: { value: 5.3, min: 3, max: 7, step: 0.01 },
    speed: { value: 1.2, min: 0.1, max: 100, step: 0.1 },
    aperture: { value: 4.2, min: 1, max: 5.6, step: 0.1 },
    fov: { value: 98, min: 0, max: 200 },
    curl: { value: 0.18, min: 0.01, max: 0.5, step: 0.01 }
  })

  const simRef = useRef()
  const renderRef = useRef()
  // Set up FBO
  const [scene] = useState(() => new THREE.Scene())
  const [camera] = useState(() => new THREE.OrthographicCamera(-1, 1, 1, -1, 1 / Math.pow(2, 53), 1))
  const [positions] = useState(() => new Float32Array([-1, -1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0, 1, 1, 0, -1, 1, 0]))
  // const [freqbins] = useState(() => new Float32Array(fft.length))
  const [uvs] = useState(() => new Float32Array([0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0]))
  const target = useFBO(size, size, {
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
    format: THREE.RGBAFormat,
    type: THREE.FloatType
  })
  // Normalize points
  const particles = useMemo(() => {
    const length = size * size
    const particles = new Float32Array(length * 3)
    for (let i = 0; i < length; i++) {
      let i3 = i * 3
      particles[i3 + 0] = (i % size) / size
      particles[i3 + 1] = i / size / size
    }
    return particles
  }, [size])
  // Update FBO and pointcloud every frame
  useFrame((state) => {
    state.gl.setRenderTarget(target)
    state.gl.clear()
    state.gl.render(scene, camera)
    state.gl.setRenderTarget(null)
    renderRef.current.uniforms.positions.value = target.texture
    renderRef.current.uniforms.uTime.value = state.clock.elapsedTime
    renderRef.current.uniforms.uFocus.value = THREE.MathUtils.lerp(renderRef.current.uniforms.uFocus.value, focus, 0.1)
    renderRef.current.uniforms.uFov.value = THREE.MathUtils.lerp(renderRef.current.uniforms.uFov.value, fov, 0.1)
    renderRef.current.uniforms.uBlur.value = THREE.MathUtils.lerp(renderRef.current.uniforms.uBlur.value, (5.6 - aperture) * 9, 0.1)

    simRef.current.uniforms.uTime.value = accumulator + state.clock.elapsedTime * speed
    simRef.current.uniforms.uCurlFreq.value = THREE.MathUtils.lerp(simRef.current.uniforms.uCurlFreq.value, curl * Math.max(low, 0.005), 0.1)
  })
  return (
    <>
      {/* Simulation goes into a FBO/Off-buffer */}
      {createPortal(
        <mesh>
          <simulationMaterial ref={simRef} />
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
            <bufferAttribute attach="attributes-uv" count={uvs.length / 2} array={uvs} itemSize={2} />
          </bufferGeometry>
        </mesh>,
        scene
      )}
      {/* The result of which is forwarded into a pointcloud via data-texture */}
      <points>
        <dofPointsMaterial ref={renderRef} />
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={particles.length / 3} array={particles} itemSize={3} />
        </bufferGeometry>
      </points>
    </>
  )
}
