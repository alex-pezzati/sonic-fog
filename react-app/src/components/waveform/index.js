import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCheckpoint, setActiveSongData } from "../../store/song";

// import classes from './Waveform.module.css'

const Waveform = ({ songId, canvasWidth, canvasHeight }) => {
  // This is the amplitude data, the array of normalized numbers
  const [waveformData, setWaveFormData] = useState();
  // This is the number of filled in bars. Like, how complete the song is, as represented by the number of bars
  const [numWaveformBars, setNumWaveformBars] = useState(-1);
  // This is the number of USER highlighted bars (which appear when a user tries to seek a track)
  const [numHighlightedBars, setNumHighlightedBars] = useState(-1);

  const [targetTime, setTargetTime] = useState(0);
  const [songUrl, setSongUrl] = useState();
  const [trackDuration, setTrackDuration] = useState();

  const storeSongData = useSelector((store) => store.song);

  const dispatch = useDispatch();

  let canvasRef = useRef();


  // Grab the initial data from the backend
  //  - the waveform array
  //  - the duration
  //  - the url
  useEffect(() => {
    (async () => {
      let response = await fetch(`/api/songs/${songId}`);
      let data = await response.json();

      // The waveform data is stored as a string in the backend, so we have to do some string manipulation
      // to turn it into a the array of numbers we need
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
    // If the active song is NOT this song, then reset the number of waveformbars
    if (storeSongData.activeSongId && storeSongData.activeSongId !== songId) {
      setNumWaveformBars(-1);
      return;
    }

    // If there is no waveform data, stop right here
    if ((!waveformData || !waveformData.length) && trackDuration !== 0) return;


    // Case1: Start playing, don't stop
    //  get the message to start from the store
    //  save the time you got the message
    //  calculate difference between NOW and the start time
    //  convert that to seconds, calculate the trackpercentage and proceed as normal
    // Case2: Start playing, pause, then start
    //  same as above, but when you get the message to stop you save the current percentage
    //  when you get the message to resume, you set that as the new start time
    //  then when you calculate the percentage, you add that to the saved percentage
    // Case3: Seek the track
    //  update the track to the checkpoint time. calculate the current percentage. Save that
    //  get the current time as the start time.
    //  calculate the percentage as normal, add it to the saved percentage

    // In all cases, if you are starting, resuming or seeking, get the checkpoint/track time, convert it to track percentage and save it
    // also save the TIME when you saved that percentage and use it to calulcate the difference between right now and then
    // convert that diff to a percentage, then add that percentage to the saved percentage

    // Pausing: just stop.
    // Resuming/Playing: get the checkpoint from the store, convert it to track percentage, save it. Also save the time you got it
    //    then calculate the diffs, convert to percents and add to the saved
    // Seeking: same as resume/playing (maybe check if the song is already playing or not tho)
    const current_time = Date.now()
    console.log(current_time)

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
