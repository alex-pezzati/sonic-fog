import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import Waveform from "../waveform";
import { asyncSetActiveSong } from "../../store/song";
import classes from "./AudioPlayer.module.css";

const AudioPlayer = ({ songId, canvasWidth, canvasHeight }) => {
  const [waveformData, setWaveFormData] = useState([]);
  const [trackDuration, setTrackDuration] = useState(0);
  const [songUrl, setSongUrl] = useState();

  const [currentTime, setCurrentTime] = useState(0);
  const songData = useSelector((state) => state.song);
  const dispatch = useDispatch();
  let audioRef = useRef();

  // Set the waveform data
  // useEffect(() => {
  //   (async () => {
  //     let response = await fetch(`/api/song/waveform/${songId}`)
  //     let data = await response.json()

  //     let string = data.waveform_data
  //     string = string.slice(1, -1)

  //     let arr = string.split(',')
  //     setWaveFormData(arr)
  //   })()
  // }, [songId])

  // // Set the track duration
  // useEffect(() => {
  //   (async () => {
  //     let response = await fetch(`/api/song/duration/${songId}`)
  //     let data = await response.json()
  //     setTrackDuration(parseFloat(data))
  //   })()
  // }, [songId])

  // Get the song data
  useEffect(() => {
    (async () => {
      let response = await fetch(`/api/song/${songId}`);
      let data = await response.json();

      let waveform_data = data.waveform_data;
      waveform_data = waveform_data.slice(1, -1);
      let arr = waveform_data.split(",");
      setWaveFormData(arr);

      let duration = data.duration;
      setTrackDuration(parseFloat(duration));

      let url = data.songURL;
      setSongUrl(url);
    })();
  }, [songId]);

  // Set the current time of the song
  useEffect(() => {
    if (songData?.currentTime)
      audioRef.current.currentTime = songData.currentTime;
  }, [songData]);

  const togglePlaying = async (e) => {
    const player = audioRef.current;

    if (e.target.innerText === "Play") {
      // let res = await dispatch(asyncSetActiveSong(songId))
      // setAudioSrc(res)
      // // setAudioSrc()
      e.target.innerText = "Pause";
      player["play"]();
    } else {
      e.target.innerText = "Play";
      player["pause"]();
    }

    setCurrentTime(player.currentTime);
  };

  return (
    <div>
      <div className={classes.play_btn__container}>
        <button onClick={togglePlaying} className={classes.play_btn__style}>
          Play
        </button>
      </div>
      <div>
        <audio
          src={songUrl}
          ref={audioRef}
          onTimeUpdate={() => setCurrentTime(audioRef.current.currentTime)}
        ></audio>
        <Waveform
          waveformData={waveformData}
          trackDuration={trackDuration}
          currentTime={currentTime}
          canvasWidth={canvasWidth}
          canvasHeight={canvasHeight}
        />
      </div>
    </div>
  );
};

export default AudioPlayer;
