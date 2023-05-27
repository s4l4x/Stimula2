import * as React from 'react'
import { useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Particles } from './Particles'

export function Visualizer({ analyzer }) {
  const [fft, setFFT] = useState([])
  const [low, setLow] = useState(0)
  const [mid, setMid] = useState(0)
  const [high, setHigh] = useState(0)
  const [sum, setSum] = useState(0)
  const [accumulator, setAccumulator] = useState(0)

  useFrame(() => {
    if (!analyzer) return
    setFFT(analyzer.getFFT())
    setLow(fft.slice(0, 3).reduce((partialSum, a) => partialSum + a / 255, 0))
    setMid(fft.slice(3, 6).reduce((partialSum, a) => partialSum + a / 255, 0))
    setHigh(fft.slice(6, 9).reduce((partialSum, a) => partialSum + a / 255, 0))
    setSum(fft.reduce((partialSum, a) => partialSum + a / 255, 0))
    setAccumulator(accumulator + sum)
  })

  return <Particles size={512} fft={fft} low={high} sum={sum} accumulator={accumulator} />
}
