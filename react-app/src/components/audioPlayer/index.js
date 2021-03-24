import React, { useEffect, useState, useRef } from 'react'
import { useSelector } from 'react-redux'
import Waveform from "../waveform"
// import classes from './Waveform.module.css'


const AudioPlayer = ({ songId, canvasWidth, canvasHeight }) => {

  // Not fully sure where to put this
  const [waveformData, setWaveFormData] = useState([])
  const [trackDuration, setTrackDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const trackData = useSelector(state => state.track)
  let audioRef = useRef()

  // useEffect(() => {
  //   (async () => {
  //     let answer = await fetch(`/api/waveform/${songId}`)
  //     let json = await answer.json()
  //     setWaveFormData(json.data)
  //     setTrackDuration(json.duration)
  //   })()
  // }, [songId])

  // Set the waveform data
  useEffect(() => {
    (async () => {
      let response = await fetch(`/api/waveform/waveform/${songId}`)
      let data = await response.json()

      let string = data.waveform_data
      string = string.slice(1, -1)

      let arr = string.split(',')
      setWaveFormData(arr)
    })()
  }, [songId])

  // Set the track duration
  useEffect(() => {
    (async () => {
      let response = await fetch(`/api/waveform/duration/${songId}`)
      let data = await response.json()
      setTrackDuration(parseFloat(data))
    })()
  }, [songId])

  let audio_src = 'static/target.wav'

  useEffect(() => {
    if (trackData?.startTime)
      audioRef.current.currentTime = trackData.startTime
  }, [trackData])

  const togglePlaying = (e) => {
    const player = audioRef.current

    if (e.target.innerText === 'Play') {
      e.target.innerText = 'Pause'
      player['play']()
    } else {
      e.target.innerText = 'Play'
      player['pause']()
    }

    setCurrentTime(player.currentTime)
  }

  return (
    <div>
      <audio src={audio_src} ref={audioRef} onTimeUpdate={() => setCurrentTime(audioRef.current.currentTime)}></audio>
      <Waveform waveformData={waveformData} trackDuration={trackDuration} currentTime={currentTime} canvasWidth={canvasWidth} canvasHeight={canvasHeight} />
      <button onClick={togglePlaying}>Play</button>
    </div>
  )
}


export default AudioPlayer
