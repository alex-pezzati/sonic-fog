import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setActiveSongData, pauseSong, playSong } from "../../store/song";

import c from './WaveformControls.module.css'

const WaveFormControls = ({ songId }) => {
  const [songUrl, setSongUrl] = useState();
  const [uploaderName, setUploaderName] = useState({})
  const [albumPhoto, setAlbumPhoto] = useState({})
  const [songName, setSongName] = useState({})

  const [isPlaying, setIsPlaying] = useState(false)

  const storeSongData = useSelector((state) => state.song);
  const dispatch = useDispatch();

  let buttonRef = useRef();

  // Get the song data
  useEffect(() => {
    (async () => {
      let response = await fetch(`/api/songs/${songId}`);
      let data = await response.json();

      setSongName(data.songName)
      setUploaderName(data.uploaderName)
      setAlbumPhoto(data.albumPhoto)
      setSongUrl(data.songURL);
    })();
  }, [songId]);




  // If this song is the active song, set the button to pause
  // If it is not, set the button to play
  //  - This is here to ensure that if a user switches to another song, then the previous song's waveform updates it's play button.
  let playButton = useRef()
  useEffect(() => {
    if (storeSongData?.activeSongId === songId && storeSongData.isPlaying) {
      setIsPlaying(true)
      playButton.current = <i className="fas fa-pause"></i>
    } else {
      setIsPlaying(false)
      playButton.current = <i className="fas fa-play"></i>
    }
  }, [storeSongData, songId]);

  // When the user clicks the play/pause button...
  const togglePlaying = async (e) => {
    // ...Make this song the active song if it isn't already
    if (storeSongData?.activeSongId !== songId) {
      dispatch(setActiveSongData(songId, songUrl, songName, albumPhoto, uploaderName));
    }

    // Pause or play the song as needed
    if (!isPlaying) {
      dispatch(playSong());
    } else {
      dispatch(pauseSong());
    }
  };

  return (
    <>
      <button ref={buttonRef} onClick={togglePlaying} className={c.playButton}>
        {playButton.current}
      </button>
    </>
  );
};

// <i class="fas fa-play"></i>
export default WaveFormControls;
