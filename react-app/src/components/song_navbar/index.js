import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from 'react-redux'
import {useHistory} from 'react-router-dom'
import { setCheckpoint,  playSong, pauseSong, setAudioRef} from '../../store/song'
import c from './SongNavBar.module.css';


const SongNavBar = () => {
  const storeSongData = useSelector(store => store.song)

  const [lastCheckpoint, setLastCheckpoint] = useState(0)
  const [sliderValue, setSliderValue] = useState(0)

  const [buttonState, setButtonState] = useState('Pause')

  const [volume, setVolume] = useState(100)
  const [preMuteVolume, setPreMuteVolume] = useState(100)

  const dispatch = useDispatch()
  const history = useHistory()

  const navAudioRef = useRef()
  const navButtonRef = useRef()
  const startTimeRef = useRef()
  const endTimeRef = useRef()
  const sliderRef = useRef()
  const footerRef = useRef()

  const volumeContainerRef = useRef()
  const volumeSliderRef = useRef()

  const timeoutRef = useRef()

  useEffect(() => {
    if (navAudioRef.current){
      dispatch(setAudioRef(navAudioRef))
    }
  }, [navAudioRef, dispatch])

  // This useEffect just checks the store to see if the song is playing.
  //    - it pauses/plays the ACTUAL AUDIO COMPONENT
  useEffect(() => {
    if (storeSongData.isPlaying) {
      navAudioRef.current['play']()
      setButtonState('Play')
    }
    else {
      navAudioRef.current['pause']()
      setButtonState('Pause')
    }
  }, [storeSongData.activeSongId, storeSongData.isPlaying])


  // This is the function for the navbar play button
  // It will dispatch store actions telling the store to pause or play a song
  const togglePlaying = (e) => {
    if (!storeSongData.activeSongId) {
      return
    }
    if (buttonState === 'Pause') {
      setButtonState('Play')
      dispatch(playSong())

    } else {
      setButtonState('Pause')
      dispatch(pauseSong())
    }
  }

  // If the track seeks, play that new spot
  useEffect(() => {
    if (storeSongData.checkpoint !== lastCheckpoint) {
      navAudioRef.current.currentTime = storeSongData.checkpoint
      setLastCheckpoint(storeSongData.checkpoint)
    }
  }, [storeSongData, lastCheckpoint])


  const timeChangeHandler = () => {
    updateCurrentTimeDisplay()
    updateSliderValue()
  }

  const seekTrack = (e) => {
    if (!storeSongData.activeSongId) {
      return
    }
    const target = (parseFloat(e.target.value) / 100) * navAudioRef.current.duration
    dispatch(setCheckpoint(target))
  }

  const updateSliderValue = () => {

    let newVal = 0
    if (navAudioRef?.current?.duration && sliderRef.current) {
      const totalSecs = navAudioRef.current.duration
      newVal = (navAudioRef.current.currentTime / totalSecs) * 100

      // This updates the 'filled in color' of the progress bar in the bottom nav
      const slider = sliderRef.current
      const value = (newVal - slider.min) / (slider.max - slider.min) * 100
      slider.style.background = `linear-gradient(to right, #FD3700 0%, #FD3700 ${value}%, grey ${value}%, grey 100%)`
    }
    setSliderValue(newVal)
  }

  const calculateMinsAndSecs = (totalSecs) => {
    const mins = Math.floor(totalSecs / 60)
    let secs = Math.floor(totalSecs % 60)
    if (secs < 10) secs = `0${secs}`

    return `${mins}:${secs}`
  }
  const updateCurrentTimeDisplay = () => {
    let currentNumSecs = navAudioRef.current.currentTime
    startTimeRef.current.innerText = calculateMinsAndSecs(currentNumSecs)
  }
  const updateDurationDisplay = (e) => {
    let totalSecs = navAudioRef.current.duration
    endTimeRef.current.innerText = calculateMinsAndSecs(totalSecs)
  }

  const navigateToSongPage = () => {
    history.push(`/songs/${storeSongData.activeSongId}`)
  }

  let button;
  if(buttonState === 'Play'){
    button = <i className="fas fa-pause"></i>
  } else {
    button = <i className="fas fa-play"></i>
  }





  const displayVolume = () => {
    clearTimeout(timeoutRef.current)
    volumeContainerRef.current.style.display = 'flex'
  }
  const hideVolume = () => {
    timeoutRef.current = setTimeout(() => {
      volumeContainerRef.current.style.display = 'none'
    }, 500);
  }

  const muteVolume = () => {
    if (parseInt(volume) === 0){
      setVolume(preMuteVolume)
    } else {
      setVolume(0)
    }
  }
  const changeVolume = (e) => {
    setVolume(e.target.value)

    if(e.target.value > 0) setPreMuteVolume(e.target.value)
    else setPreMuteVolume(5)
  }

  useEffect(() => {
    navAudioRef.current.volume = parseInt(volume) / 100

    volumeSliderRef.current.style.background = `linear-gradient(to right, #FD3700 0%, #FD3700 ${volume}%, grey ${volume}%, grey 100%)`
  }, [volume])


  let volumeButton
  if (volume > 50){
    volumeButton =  <i className="fas fa-volume-up"></i>
  } else if (volume <= 50 && volume > 0){
    volumeButton = <i className="fas fa-volume-down"></i>
  } else {
    volumeButton = <i className="fas fa-volume-mute"></i>
  }





  if(storeSongData?.activeSongId){
    footerRef.current.style.bottom = '0px'
  }
  return (
      <footer className={c.navbar_total} ref={footerRef}>
        <div className={c.navbar_content}>
          <audio
            src={storeSongData.activeSongURL}
            ref={navAudioRef}
            preload='metadata'
            loop
            onTimeUpdate={timeChangeHandler}
            onLoadedMetadata={updateDurationDisplay}
          >
          </audio>
          <button ref={navButtonRef} onClick={togglePlaying} className={c.play_pause_button}>
            {button}
          </button>
          <div className={c.progressbar}>
            <span ref={startTimeRef} className={c.currentTime}>0:00</span>
            <input
              ref={sliderRef}
              type='range'
              max={100}
              min={0}
              step={.01}
              value={sliderValue}
              onChange={seekTrack}
              id={c.slider}
            />
            <span ref={endTimeRef} className={c.duration}>0:00</span>
          </div>
          <div className={c.volume_controls}>
            <div className={c.volume_slider_container} ref={volumeContainerRef} onMouseOver={displayVolume} onMouseLeave={hideVolume}>
              <input
                ref={volumeSliderRef}
                className={c.volume_slider}
                type="range"
                min={0}
                max={100}
                onChange = {changeVolume}
                value={volume}>
              </input>
            </div>
            <div className={c.volume_button} onMouseOver={displayVolume} onMouseLeave={hideVolume} onClick={muteVolume}>
              {volumeButton}
            </div>
          </div>
          {storeSongData?.activeSongId &&
            <div className={c.navbar_song_data}>
              <div className={c.album_cover_container}>
                <img src={storeSongData.activeSongAlbumCover} alt='album cover' className={c.album_cover}></img>
              </div>
              <div className={c.name_and_artist}>
                <div className={c.songName} onClick={navigateToSongPage}>
                  {storeSongData.activeSongName}
                </div>
                <div className={c.artist}>
                  {storeSongData.activeSongUploader}
                </div>
              </div>
            </div>
          }
        </div>
      </footer>
  );
};

export default SongNavBar;
