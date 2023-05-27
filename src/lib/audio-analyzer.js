export class AudioAnalyzer {
  #ctx
  #analyzerNode
  #sourceNode

  constructor(audioElement) {
    this.#ctx = new AudioContext()
    this.#analyzerNode = this.#ctx.createAnalyser()
    this.#sourceNode = this.#ctx.createMediaElementSource(audioElement)

    // FIXME: Parameterize these values
    this.#analyzerNode.minDecibels = -70 // -60
    this.#analyzerNode.smoothingTimeConstant = 0.75 // 0.85
    this.#analyzerNode.fftSize = 32 // range [32, 32768]

    this.#sourceNode.connect(this.#analyzerNode)
    this.#sourceNode.connect(this.#ctx.destination)
  }

  getFFT() {
    const data = new Uint8Array(this.#analyzerNode.frequencyBinCount)
    this.#analyzerNode.getByteFrequencyData(data)
    // FIXME: Use Float32Array instead of Uint8Array
    // const data = new Float32Array(this.#analyzerNode.frequencyBinCount)
    // this.#analyzerNode.getFloatFrequencyData(data)
    return data
  }
}
