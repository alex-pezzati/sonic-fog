import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCheckpoint, setActiveSongData } from "../../store/song";

// import classes from './Waveform.module.css'

const Waveform = ({ songId, canvasWidth, canvasHeight }) => {
  const [waveformData, setWaveFormData] = useState();
  const [trackDuration, setTrackDuration] = useState();
  const [songUrl, setSongUrl] = useState();

  const [numWaveformBars, setNumWaveformBars] = useState(-1);
  const [numHighlightedBars, setNumHighlightedBars] = useState(-1);
  const [targetTime, setTargetTime] = useState(0);

  const storeSongData = useSelector((store) => store.song);

  const dispatch = useDispatch();

  // const { songId, localCurrentTime, waveformData, trackDuration, songUrl } = propSongData
  // console.log(songUrl, propSongData)

  let canvasRef = useRef();


  // Setting the initial data
  useEffect(() => {
    (async () => {
      let response = await fetch(`/api/songs/${songId}`);
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

  // Set the number of waveform bars
  useEffect(() => {
    if (storeSongData.activeSongId && storeSongData.activeSongId !== songId) {
      setNumWaveformBars(-1);
      return;
    }

    if ((!waveformData || !waveformData.length) && trackDuration !== 0) return;

    requestAnimationFrame(() => {
      const trackPercentage = storeSongData.currentTime / trackDuration;

      const numChunks = waveformData.length;
      const numBars = Math.floor(trackPercentage * numChunks);

      // If the song is over, don't update the number of bars
      if (trackPercentage >= 100) {
        return;
      }

      // If there is discrepency between the number of bars calculated in this function, and the number stored it the state, update the state
      // This acts as a throttle. The canvas is repainted in a useEffect that has numWaveBars as a dependency
      if (numBars && numBars !== numWaveformBars) {
        setNumWaveformBars(numBars);
      }
    });
  }, [storeSongData, numWaveformBars, songId, trackDuration, waveformData]);

  // Paint the canvas with the waveformbars and the highlighted bars
  useEffect(() => {
    if (!waveformData || !waveformData.length) return;

    let canvas = canvasRef.current;
    let ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // In order for the waveform to perfectly fit the inside the canvas,
    // num_chums *( rectWidth + rectSpacing) MUST EQUAL canvasWidth
    // so (x1 / y1 ) + (x2/y2) must equal 1
    // (eg. numChunks / 3   +   2*numchunks/ 3)
    let num_chunks = waveformData.length;
    let rectWidth = (2 * canvasWidth) / (3 * num_chunks);
    let rectSpacing = canvasWidth / (3 * num_chunks);

    // This sets where the middle line of waveform is relative to the bottom of the canvas
    // e.g. 1/3 is 1/3 up from the bottom
    const breakPointRatio = 1 / 3;
    const canvasBreakPoint = breakPointRatio * canvasHeight;

    waveformData.forEach((value, i) => {
      const adjustedValue = (value / 100) * canvasHeight;
      const amplitude = Math.round((1 - breakPointRatio) * adjustedValue); // - 2

      ctx.fillStyle = "darkgrey";

      // Top bar colorings
      if (numHighlightedBars > 0 && i <= numHighlightedBars) {
        // Both played and highlighted
        if (i <= numWaveformBars) {
          // dark
          ctx.fillStyle = "#fd5d00";

          let grd = ctx.createLinearGradient(
            i * (rectWidth + rectSpacing),
            canvasHeight - amplitude - canvasBreakPoint,
            i * (rectWidth + rectSpacing),
            canvasHeight - canvasBreakPoint
          );
          grd.addColorStop(1, "#fd1100");
          grd.addColorStop(0.5, "#fd5d00");
          ctx.fillStyle = grd;
        }
        // Highlighted, not yet played
        else {
          ctx.fillStyle = "#aa3e00";
        }
      } else {
        // Played, not highlighted when there are existing highlights
        if (numHighlightedBars > 0 && i <= numWaveformBars) {
          ctx.fillStyle = "#aa3e00";
        }
        // Played, and no existing highlights
        else if (i <= numWaveformBars) {
          let grd = ctx.createLinearGradient(
            i * (rectWidth + rectSpacing),
            canvasHeight - amplitude - canvasBreakPoint,
            i * (rectWidth + rectSpacing),
            canvasHeight - canvasBreakPoint
          );
          grd.addColorStop(1, "#fd1100");
          grd.addColorStop(0, "#fd5d00");
          ctx.fillStyle = grd;
        }
        // Neither played nor highlighted
        else {
          ctx.fillStyle = "darkgrey";
        }
      }
      // Top bars
      ctx.fillRect(
        i * (rectWidth + rectSpacing),
        canvasHeight - amplitude - canvasBreakPoint,
        rectWidth,
        amplitude
      );

      // Bottom Colorings
      if (i <= numWaveformBars) {
        // dark
        ctx.fillStyle = "#ffc5b5";
      }
      // Neither played nor highlighted
      else {
        ctx.fillStyle = "lightgrey";
      }

      // Bottom bars
      ctx.fillRect(
        i * (rectWidth + rectSpacing),
        canvasHeight - canvasBreakPoint + 2,
        rectWidth,
        adjustedValue * breakPointRatio
      );
    });
  }, [
    waveformData,
    numWaveformBars,
    numHighlightedBars,
    canvasHeight,
    canvasWidth,
  ]);

  // Sets the target time
  const getXPosition = (e) => {
    if (!waveformData || !waveformData.length) {
      return
    }
    const distanceFromLeft = canvasRef.current.getBoundingClientRect().left
    const relativePosition = e.clientX - distanceFromLeft
    const trackPercentage = relativePosition / canvasWidth

    const numChunks = waveformData.length;
    const numBars = Math.floor(trackPercentage * numChunks);
    setNumHighlightedBars(numBars);

    // setTargetTime((trackPercentage + .005) * trackDuration)
    setTargetTime(trackPercentage * trackDuration);
  };

  const seekTrack = (e) => {
    if (storeSongData.activeSongId !== songId) {
      dispatch(setActiveSongData(songId, songUrl));
    }
    dispatch(setCheckpoint(targetTime));
  };

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
  );
};

export default Waveform;
