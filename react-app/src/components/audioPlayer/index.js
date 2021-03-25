import React, { useEffect, useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Waveform from "../waveform"
import { setActiveSong, setCurrentTime, setCheckpoint } from '../../store/song'
// import classes from './Waveform.module.css'


const AudioPlayer = ({ songId, canvasWidth, canvasHeight }) => {

  const [waveformData, setWaveFormData] = useState([])
  const [trackDuration, setTrackDuration] = useState(0)
  const [songUrl, setSongUrl] = useState()

  const [localCurrentTime, setLocalCurrentTime] = useState(0)

  const storeSongData = useSelector(state => state.song)
  const dispatch = useDispatch()
  let audioRef = useRef()
  let buttonRef = useRef()

  console.log(localCurrentTime, 'index')

  // Get the song data
  useEffect(() => {
    (async () => {
      let response = await fetch(`/api/song/${songId}`)
      let data = await response.json()

      let waveform_data = data.waveform_data
      waveform_data = waveform_data.slice(1, -1)
      let arr = waveform_data.split(',')
      setWaveFormData(arr)

      let duration = data.duration
      setTrackDuration(parseFloat(duration))

      let url = data.songURL
      setSongUrl(url)
    })()
  }, [songId])

  // If this song is not the active song, make sure it is paused and the button says play
  useEffect(() => {
    if (storeSongData?.activeSongId !== songId) {
      buttonRef.current.innerText = 'Play'
      audioRef.current['pause']()
    }
  }, [storeSongData])

  // If the store data changes, and this is the active song, set the audio to the store checkpoint value
  useEffect(() => {
    if (storeSongData?.activeSongId && storeSongData?.activeSongId === songId) {
      audioRef.current.currentTime = storeSongData.checkpoint
      setLocalCurrentTime(audioRef.current.currentTime)
    }
  }, [storeSongData])

  // When the user clicks the play/pause button...
  const togglePlaying = async (e) => {
    const player = audioRef.current

    // ...Make this song the active song if it isn't already
    // ... set the checkpoin to 0 (the start of the song)
    /// ... set the local time to 0 as well (this keeps the waveform graphs in sync)
    if (storeSongData?.activeSongId != songId) {
      dispatch(setActiveSong(songId))
      dispatch(setCheckpoint(0))
      setLocalCurrentTime(0)
    }

    if (e.target.innerText === 'Play') {
      e.target.innerText = 'Pause'
      player['play']()
    } else {
      e.target.innerText = 'Play'
      player['pause']()
    }
  }

  const changeStoreTime = () => {
    // dispatch(setCurrentTime(audioRef.current.currentTime))
    setLocalCurrentTime(audioRef.current.currentTime)

    if (audioRef.current.ended) {
      buttonRef.current.innerText = 'Play'
      dispatch(setCheckpoint(0))
    }
  }

  return (
    <div>
      <audio src={songUrl} ref={audioRef} onTimeUpdate={changeStoreTime}></audio>
      <Waveform songId={songId} localCurrentTime={localCurrentTime} waveformData={waveformData} trackDuration={trackDuration} canvasWidth={canvasWidth} canvasHeight={canvasHeight} />
      <button ref={buttonRef} onClick={togglePlaying}>Play</button>
    </div>
  )
}


export default AudioPlayer
