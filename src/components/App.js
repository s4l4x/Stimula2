import { Canvas } from '@react-three/fiber'
import { useEffect, useRef, useState } from 'react'
import { Perf } from 'r3f-perf'
import { OrbitControls, CameraShake } from '@react-three/drei'
import { Leva } from 'leva'
import { useControls } from 'leva'
import { Visualizer } from './Visualizer'
import { AudioAnalyzer } from '../lib/audio-analyzer'
import Audio from '../assets/oliver-20230516-stimula.wav'
import './App.css'

export default function App() {
  const [audioUrl, setAudioUrl] = useState(Audio)
  const [analyzer, setAnalyzer] = useState(null)
  const [isAnalyzerReady, setIsAnalyzerReady] = useState(false)
  const audioElmRef = useRef(null)

  useEffect(() => {
    // Set CSS variable for 1vh for use when positioning elements in CSS above chrome
    const vh = window.innerHeight * 0.01
    document.documentElement.style.setProperty('--vh', `${vh}px`)
  }, [])

  // Load audio file
  // const onFileChange = (e) => {
  //   const file = e.target.files?.[0]
  //   if (!file) return
  //   setAudioUrl(URL.createObjectURL(file))
  //   setAnalyzer(new AudioAnalyzer(audioElmRef.current))
  // }

  const { perfVisible } = useControls('Debug', {
    perfVisible: false
  })
  return (
    <>
      <Leva collapsed={true} />
      <Canvas
        camera={{
          fov: 25,
          near: 0.1,
          far: 200,
          linear: true,
          position: [0, 0, 6]
        }}
        style={{
          width: '100vw',
          height: '100vh',
          background: '#000'
        }}>
        {perfVisible && <Perf position="top-left" />}
        <OrbitControls makeDefault autoRotate autoRotateSpeed={0.5} zoomSpeed={0.1} />
        {/* FIXME: Animate camera shake */}
        <CameraShake yawFrequency={1} maxYaw={0.05} pitchFrequency={1} maxPitch={0.05} rollFrequency={0.5} maxRoll={0.5} intensity={0.2} />
        <Visualizer analyzer={analyzer} />
      </Canvas>
      {/* Audio */}
      {/* Load audio file UI */}
      {/* <div
        style={{
          height: 80,
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center'
        }}> */}
      {/* <label htmlFor="file-upload" className="custom-file-upload">
          Choose Audio File
          <input id="file-upload" type="file" accept="audio/*" onChange={onFileChange} />
        </label>*/}
      <div className="audio-player">
        {!analyzer && (
          <button
            onClick={() => {
              setAnalyzer(new AudioAnalyzer(audioElmRef.current))
            }}>
            Setup
          </button>
        )}
        <audio src={audioUrl} controls ref={audioElmRef} />
      </div>
    </>
  )
}
