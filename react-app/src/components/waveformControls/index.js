import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setActiveSongData, pauseSong, playSong } from "../../store/song";

const WaveFormControls = ({ songId }) => {
  const [songUrl, setSongUrl] = useState();

  const storeSongData = useSelector((state) => state.song);
  const dispatch = useDispatch();

  let buttonRef = useRef();

  // Get the song data
  useEffect(() => {
    (async () => {
      let response = await fetch(`/api/songs/${songId}`);
      let data = await response.json();

      let url = data.songURL;
      setSongUrl(url);
    })();
  }, [songId]);

  // If this song is the active song, set the button to pause
  // If it is not, set the button to play
  useEffect(() => {
    if (
      storeSongData?.activeSongId === songId &&
      storeSongData.isCurrentlyPlaying
    ) {
      buttonRef.current.innerText = "||";
    } else {
      buttonRef.current.innerText = "▶";
    }
  }, [storeSongData, songId]);

  // When the user clicks the play/pause button...
  const togglePlaying = async (e) => {
    // ...Make this song the active song if it isn't already
    if (storeSongData?.activeSongId !== songId) {
      dispatch(setActiveSongData(songId, songUrl));
    }

    // Pause or play the song as needed
    if (e.target.innerText === "▶") {
      dispatch(playSong());
    } else {
      dispatch(pauseSong());
    }
  };
  // button style
  const buttonStyle = {
    borderRadius: "50%",
    width: "35px",
    height: "35px",
    backgroundColor: "hsl(20, 100%, 50%)",
    border: "none",
    top: 0,
    fontSize: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };
  return (
    <>
      <button ref={buttonRef} onClick={togglePlaying} style={buttonStyle}>
        hello
      </button>
    </>
  );
};

export default WaveFormControls;
