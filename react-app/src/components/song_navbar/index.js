import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from 'react-redux'
import { setCheckpoint, setCurrentTime, playSong, pauseSong } from '../../store/song'
import c from './SongNavBar.module.css';


const SongNavBar = () => {
  const storeSongData = useSelector(store => store.song)

  const [lastCheckpoint, setLastCheckpoint] = useState(0)

  const dispatch = useDispatch()

  const navAudioRef = useRef()
  const navButtonRef = useRef()
  const startTimeRef = useRef()
  const endTimeRef = useRef()
  const sliderRef = useRef()

  // Pause and play the song
  useEffect(() => {
    if (storeSongData?.isCurrentlyPlaying) {
      navAudioRef.current['play']()
      navButtonRef.current.innerText = 'Pause'
    } else {
      navAudioRef.current['pause']()
      navButtonRef.current.innerText = 'Play'
    }
  }, [storeSongData])

  // If the track seeks, play that new spot
  useEffect(() => {
    if (storeSongData.checkpoint !== lastCheckpoint) {
      navAudioRef.current.currentTime = storeSongData.checkpoint
      setLastCheckpoint(storeSongData.checkpoint)
    }
  }, [storeSongData, lastCheckpoint])


  const timeChangeHandler = () => {
    updateStoreTime()
    updateCurrentTimeDisplay()
    // updateSliderValue()
  }

  // Update the current time in the store
  const updateStoreTime = () => {
    let currentNumSecs = navAudioRef.current.currentTime
    dispatch(setCurrentTime(currentNumSecs))
  }

  const calculateMinsAndSecs = (totalSecs) => {
    const mins = Math.floor(totalSecs / 60)
    let secs = Math.floor(totalSecs % 60)
    if (secs < 10) secs = `0${secs}`

    return `${mins}:${secs}`
  }

  const seekTrack = (e) => {
    if (!storeSongData.activeSongId) {
      return
    }
    const target = (parseFloat(e.target.value) / 100) * navAudioRef.current.duration
    dispatch(setCheckpoint(target))
  }

  const updateSliderValue = () => {

    if (navAudioRef?.current?.duration && sliderRef.current) {
      const totalSecs = navAudioRef.current.duration
      const newVal = (navAudioRef.current.currentTime / totalSecs) * 100

      // This updates the 'filled in color' of the progress bar in the bottom nav
      const slider = sliderRef.current
      const value = (newVal - slider.min) / (slider.max - slider.min) * 100
      slider.style.background = `linear-gradient(to right, #FD3700 0%, #FD3700 ${value}%, grey ${value}%, grey 100%)`

      return newVal
    }
    return 0


  }

  const updateCurrentTimeDisplay = () => {
    let currentNumSecs = navAudioRef.current.currentTime
    startTimeRef.current.innerText = calculateMinsAndSecs(currentNumSecs)
  }
  const updateDurationDisplay = (e) => {
    let totalSecs = navAudioRef.current.duration
    endTimeRef.current.innerText = calculateMinsAndSecs(totalSecs)
  }
  // Controls the play/pause in the bottom nav
  const togglePlaying = async (e) => {
    if (!storeSongData.activeSongId) {
      return
    }

    if (e.target.innerText === 'Play') {
      e.target.innerText = 'Pause'
      dispatch(playSong())

    } else {
      e.target.innerText = 'Play'
      dispatch(pauseSong())
    }
  }

  return (
    <footer className={c.navbar_total}>
      <audio
        src={storeSongData.activeSongURL}
        ref={navAudioRef}
        preload='metadata'
        loop
        onTimeUpdate={timeChangeHandler}
        onLoadedMetadata={updateDurationDisplay}
      >
      </audio>
      <button ref={navButtonRef} onClick={togglePlaying} className={c.play_pause_button}>Play</button>
      <div className={c.progressbar}>
        <span ref={startTimeRef} className={c.currentTime}>0:00</span>
        <input
          ref={sliderRef}
          type='range'
          max={100}
          min={0}
          step={.01}
          value={updateSliderValue()}
          onChange={seekTrack}
          id={c.slider}
        />
        <span ref={endTimeRef}>0:00</span>
      </div>

    </footer>
  );
};

export default SongNavBar;
