import React, { useEffect, useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Waveform from "../waveform"
import { setActiveSongData, setCheckpoint, pauseSong, playSong } from '../../store/song'
// import classes from './Waveform.module.css'


const AudioPlayer = ({ songId, canvasWidth, canvasHeight }) => {
  const [songUrl, setSongUrl] = useState()

  const storeSongData = useSelector(state => state.song)
  const dispatch = useDispatch()
  let audioRef = useRef()
  let buttonRef = useRef()

  // Get the song data
  useEffect(() => {
    (async () => {
      let response = await fetch(`/api/song/${songId}`)
      let data = await response.json()

      let url = data.songURL
      setSongUrl(url)
    })()
  }, [songId])

  // If this song is not the active song, make sure it is paused and the button says play
  useEffect(() => {
    if (storeSongData?.activeSongId === songId && storeSongData.isCurrentlyPlaying) {
      buttonRef.current.innerText = 'Pause'
    }
    else {
      buttonRef.current.innerText = 'Play'
    }
  }, [storeSongData, songId])

  // If the store data changes, and this is the active song, set the audio to the store checkpoint value
  // useEffect(() => {
  //   if (storeSongData?.activeSongId && storeSongData?.activeSongId === songId) {
  //     audioRef.current.currentTime = storeSongData.checkpoint
  //     setLocalCurrentTime(audioRef.current.currentTime)
  //   }
  // }, [storeSongData, songId])

  // When the user clicks the play/pause button...
  const togglePlaying = async (e) => {
    // ...Make this song the active song if it isn't already
    // ... set the checkpoin to 0 (the start of the song)
    /// ... set the local time to 0 as well (this keeps the waveform graphs in sync)
    if (storeSongData?.activeSongId !== songId) {
      dispatch(setActiveSongData(songId, songUrl))
    }

    if (e.target.innerText === 'Play') {
      e.target.innerText = 'Pause'
      dispatch(playSong())
    } else {
      e.target.innerText = 'Play'
      dispatch(pauseSong())
    }
  }

  // const changeStoreTime = () => {

  //   if (audioRef.current.ended) {
  //     buttonRef.current.innerText = 'Play'
  //     dispatch(setCheckpoint(0))
  //   }
  // }

  // const songData = {songId, localCurrentTime, waveformData, trackDuration, songUr}
  return (
    <div>
      <audio src={songUrl} ref={audioRef}></audio>
      <Waveform songId={songId} canvasWidth={canvasWidth} canvasHeight={canvasHeight} />
      <button ref={buttonRef} onClick={togglePlaying}>Play</button>
    </div>
  )
}


export default AudioPlayer
