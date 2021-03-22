import React, { useEffect, useState, useRef } from 'react'
// import classes from './Waveform.module.css'


const Waveform = ({ trackDuration, waveformData, currentTime }) => {

  // These should probably be passed in as props tbh
  const [trackPercentage, setTrackPercentage] = useState(0)
  const [numWaveformBars, setNumWaveformBars] = useState(0)
  const [numHighlightedBars, setNumHighlightedBars] = useState(0)


  useEffect(() => {
    if ((!waveformData || !waveformData.length) && trackDuration !== 0)
      return

    requestAnimationFrame(() => {
      // const secondsElapsed = ((Date.now() - startTime) / 1000)
      const secondsElapsed = currentTime
      const songPercentage = secondsElapsed / trackDuration
      const numChunks = waveformData.length
      const numBars = Math.floor(songPercentage * numChunks)

      if (songPercentage < 1) {
        setTrackPercentage(songPercentage)
      }
      if (numBars > numWaveformBars) {
        setNumWaveformBars(numBars)
      }

    })
  }, [trackPercentage, currentTime])



  let canvasRef = useRef()
  const canvasHeight = 200
  const canvasWidth = 1000
  useEffect(() => {
    if (!waveformData || !waveformData.length)
      return

    let canvas = canvasRef.current
    let ctx = canvas.getContext('2d')

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // In order for the waveform to perfectly fit the inside the canvas,
    // num_chums *( rectWidth + rectSpacing) MUST EQUAL canvasWidth
    // so (x1 / y1 ) + (x2/y2) must equal 1
    // (eg. numChunks / 3   +   2*numchunks/ 3)
    let num_chunks = waveformData.length
    let rectWidth = (2 * canvasWidth / (3 * num_chunks))
    let rectSpacing = (canvasWidth / (3 * num_chunks))


    // This sets where the middle line of waveform is relative to the bottom of the canvas
    // e.g. 1/3 is 1/3 up from the bottom
    const breakPointRatio = 1 / 3
    const canvasBreakPoint = breakPointRatio * canvasHeight

    waveformData.forEach((value, i) => {

      const adjustedValue = (value / 100) * canvasHeight
      const amplitude = Math.round((1 - breakPointRatio) * adjustedValue) - 2

      if (i <= numHighlightedBars) {
        console.log(numHighlightedBars)
        ctx.fillStyle = 'hotpink'
      }
      else if (i < numWaveformBars) {
        ctx.fillStyle = 'black'
      }
      else {
        ctx.fillStyle = 'grey'
      }

      // Top bars
      ctx.fillRect(
        i * (rectWidth + rectSpacing),
        canvasHeight - amplitude - canvasBreakPoint,
        rectWidth,
        amplitude)


      if (i <= numHighlightedBars) {
        ctx.fillStyle = 'lightpink'
      }
      else if (i < numWaveformBars) {
        ctx.fillStyle = 'darkgrey'
      } else {
        ctx.fillStyle = 'lightgray'
      }
      // Bottom bars
      ctx.fillRect(
        i * (rectWidth + rectSpacing),
        canvasHeight - canvasBreakPoint + 2,
        rectWidth,
        adjustedValue * breakPointRatio - 3)
    })
  }, [waveformData, numWaveformBars, numHighlightedBars])


  const getXPosition = (e) => {
    const distanceFromLeft = canvasRef.current.getBoundingClientRect().left
    const relativePosition = e.clientX - distanceFromLeft
    const trackPercentage = relativePosition / canvasWidth
    const numChunks = waveformData.length
    const numBars = Math.floor(trackPercentage * numChunks)

    setNumHighlightedBars(numBars)
  }

  const seekTrack = (e) => {
    const distanceFromLeft = canvasRef.current.getBoundingClientRect().left
    const relativePosition = e.clientX - distanceFromLeft
    const trackPercentage = relativePosition / canvasWidth


  }

  return (
    <div>
      <canvas
        width={canvasWidth}
        height={canvasHeight}
        ref={canvasRef}
        onMouseMove={getXPosition}
        onMouseLeave={() => setNumHighlightedBars(-1)}
        onClick={seekTrack}
      >
        Hi
        </canvas>
    </div>
  )
}


export default Waveform
