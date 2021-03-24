import React, { useEffect, useState, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { setStartTime } from '../../store/track'
// import classes from './Waveform.module.css'


const Waveform = ({ trackDuration, waveformData, currentTime, canvasWidth, canvasHeight }) => {

  // These should probably be passed in as props tbh
  const [numWaveformBars, setNumWaveformBars] = useState(0)
  const [numHighlightedBars, setNumHighlightedBars] = useState(-1)
  const [targetTime, setTargetTime] = useState(0)

  const dispatch = useDispatch()

  useEffect(() => {
    if ((!waveformData || !waveformData.length) && trackDuration !== 0)
      return

    requestAnimationFrame(() => {
      const trackPercentage = currentTime / trackDuration
      const numChunks = waveformData.length
      const numBars = Math.floor(trackPercentage * numChunks)

      // If the song is over, don't update the number of bars
      if (trackPercentage >= 100) {
        return
      }

      // If there is discrepency between the number of bars calculated in this function, and the number stored it the state, update the state
      // This acts as a throttle. The canvas is repainted in a useEffect that has numWaveBars as a dependency
      if (numBars && numBars !== numWaveformBars) {
        setNumWaveformBars(numBars)
      }

    })
  }, [currentTime, numWaveformBars, trackDuration, waveformData])



  let canvasRef = useRef()
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
      const amplitude = Math.round((1 - breakPointRatio) * adjustedValue) // - 2

      ctx.fillStyle = 'darkgrey'

      if (numHighlightedBars > 0 && i <= numHighlightedBars) {
        // Both played and highlighted
        if (i < numWaveformBars) {
          // dark
          ctx.fillStyle = '#fd5d00'

          let grd = ctx.createLinearGradient(
            i * (rectWidth + rectSpacing),
            canvasHeight - amplitude - canvasBreakPoint,
            i * (rectWidth + rectSpacing),
            canvasHeight - canvasBreakPoint)
          grd.addColorStop(1, "#fd1100");
          grd.addColorStop(.5, "#fd5d00");
          ctx.fillStyle = grd
        }
        // Highlighted, not yet played
        else {
          ctx.fillStyle = '#aa3e00'
        }
      } else {
        // Played, not highlighted when there are existing highlights
        if (numHighlightedBars > 0 && i < numWaveformBars) {
          ctx.fillStyle = '#aa3e00'
        }
        // Played, and no existing highlights
        else if (i < numWaveformBars) {
          let grd = ctx.createLinearGradient(
            i * (rectWidth + rectSpacing),
            canvasHeight - amplitude - canvasBreakPoint,
            i * (rectWidth + rectSpacing),
            canvasHeight - canvasBreakPoint)
          grd.addColorStop(1, "#fd1100");
          grd.addColorStop(0, "#fd5d00");
          ctx.fillStyle = grd
        }
        // Neither played nor highlighted
        else {
          ctx.fillStyle = 'darkgrey'
        }
      }

      // Top bars
      ctx.fillRect(
        i * (rectWidth + rectSpacing),
        canvasHeight - amplitude - canvasBreakPoint,
        rectWidth,
        amplitude)



      // Bottom
      if (i < numWaveformBars) {
        // dark
        ctx.fillStyle = '#ffc5b5'
      }
      // Neither played nor highlighted
      else {
        ctx.fillStyle = 'lightgrey'
      }

      // Bottom bars
      ctx.fillRect(
        i * (rectWidth + rectSpacing),
        canvasHeight - canvasBreakPoint + 2,
        rectWidth,
        adjustedValue * breakPointRatio
      )
    })


  }, [waveformData, numWaveformBars, numHighlightedBars, canvasHeight, canvasWidth])


  const getXPosition = (e) => {
    const distanceFromLeft = canvasRef.current.getBoundingClientRect().left
    const relativePosition = e.clientX - distanceFromLeft
    const trackPercentage = relativePosition / canvasWidth

    const numChunks = waveformData.length
    const numBars = Math.floor(trackPercentage * numChunks)
    setNumHighlightedBars(numBars)

    setTargetTime((trackPercentage + .005) * trackDuration)
  }

  const seekTrack = (e) => {
    dispatch(setStartTime(targetTime))
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
