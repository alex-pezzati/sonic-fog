import React, { useEffect, useState, useRef, useMemo, useCallback } from "react";
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

  const [isPlayingLocally, setIsPlayingLocally] = useState(false)

  const [lastCheckpoint, setLastCheckpoint] = useState(0)
  const [timeLastSaved, setTimeLastSaved] = useState(Date.now())

  const storeSongData = useSelector((store) => store.song);

  const dispatch = useDispatch();

  let canvasRef = useRef();
  let animationFrameRef = useRef()


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


  // If the song is paused in the store, make sure it is also paused locally
  useEffect(() => {
    if (!storeSongData?.isPlaying){
      setIsPlayingLocally(false)
    }
  },[storeSongData])


  // Reset the number of waveform bars if this song is no longer the active song
  useEffect(() => {
    if (storeSongData.activeSongId && storeSongData.activeSongId !== songId) {
      setNumWaveformBars(-1);
    }
  }, [storeSongData, songId])


  // This is the meat of the waveform calculations.
  // It recursively calls itself while a song is playing and calculates the time difference between timeLastSaved and the current moment
  //    -note that timeLastSaved is initially equal to the moment the song starts, but is updated if the song pauses or is searched
  //    -- so it's not the amount of time since the song first began playing, it's the amount of time since the song has resumed playing
  //  it uses this time difference to calculate what percentage of the track is complete
  //    - note if a song is playing uninterupted, this percentage = the percentage of the song played
  //    - BUT if the song has been paused, then this percentage must be added to the percentage of LastCheckpoint
  //  it muliplies that (total) percentage by the total number of waveform bars
  //  the result is how many bars should be filled in
  const updateNumWaveformBars = () => {
      // What percentage of the song has already played? We find this by converting the lastCheckpoint into a percent
      const checkpointPercentage = lastCheckpoint / trackDuration

      // How many seconds have passed since we resumed/started playing?
      let time = (Date.now() / 1000) - timeLastSaved
      // What is that in 'track percentage points'
      let trackPercentage = time /trackDuration
      // Add that to the percentage points from our checkpoint and we end up with the total amount of completed track percentage points
      trackPercentage += checkpointPercentage

      // Multiply the percentage points times the number of waveform bars to get how many bars should be filled in
      const numChunks = waveformData.length;
      const numBars = Math.floor(trackPercentage * numChunks);

      // // If the song is over, don't update the number of bars
      // if (trackPercentage >= 1) {
      //   return;
      // }

      // If there is discrepency between the number of bars calculated in this function, and the number stored it the state, update the state
      // This check acts as a throttle. The canvas is repainted in a useEffect that has numWaveBars as a dependency
      if (numBars && numBars !== numWaveformBars) {
        setNumWaveformBars(numBars);
      }
      animationFrameRef.current = requestAnimationFrame(updateNumWaveformBars)
  }
  const memoizedCallback = useCallback(updateNumWaveformBars, [lastCheckpoint, trackDuration, timeLastSaved, waveformData])

  // This function handles all the requisite setup for when a song
  //    -starts playing for the first time
  //    -resumes playing after being paused
  //    -has been scrubbed or searched by a user
  useEffect(() => {
    // If there is no waveform data, don't bother with any calculations
    if ((!waveformData || !waveformData.length) && trackDuration !== 0) return;


  //    - if a song has started playing, or resumes playing, then...
  //      -- grab the last checkpoint from the store, and store it locally
  //      -- record the time it grabbed the checkpoint, and store that locally
  //      -- update the local 'isPlaying' state

    //       If a song has resumed playing             OR     the user scrubbed/searched through the track...
    if ((storeSongData.isPlaying && !isPlayingLocally) || (storeSongData.checkpoint !== lastCheckpoint)){

      // compare this to the store to see if a user has scrubbed)
      setLastCheckpoint(storeSongData.checkpoint)
      // Compare this to the store to see if a song has resumed playing (or begun for the first time)
      setIsPlayingLocally(true)

      // Used for calculating how much time has passed between when we started playing and any given moment.
      setTimeLastSaved(Date.now() / 1000)

    // If we've already been playing and there are no updates, then request an animation frame which will actually calculate and update the number of waveform bars
    } else if (storeSongData.isPlaying && isPlayingLocally){
      requestAnimationFrame(memoizedCallback)
    }

    // Clean up. Notice the use of a useRef to store the ever-changing animation frame id
    return () => window.cancelAnimationFrame(animationFrameRef.current)
  }, [storeSongData, isPlayingLocally, lastCheckpoint, trackDuration, memoizedCallback, waveformData]);





  // This paints the canvas. This function fills in the bar colorings, including the user highlights.
  useMemo(() => {
    // If there is no waveform data, then stop
    if (!waveformData || !waveformData.length) return;

    let canvas = canvasRef.current;
    let ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // In order for the waveform to perfectly fit the inside the canvas,
    //    num_chums *( rectWidth + rectSpacing) MUST EQUAL canvasWidth
    //    so (x1 / y1 ) + (x2/y2) must equal 1
    //    (eg. numChunks / 3   +   2*numchunks/ 3)
    let num_chunks = waveformData.length;
    let rectWidth = (2 * canvasWidth) / (3 * num_chunks);
    let rectSpacing = canvasWidth / (3 * num_chunks);

    // This sets where the middle line of waveform is relative to the bottom of the canvas
    // e.g. 1/3 is 1/3 up from the bottom
    const breakPointRatio = 1 / 3;
    const canvasBreakPoint = breakPointRatio * canvasHeight;

    waveformData.forEach((value, i) => {
      const adjustedValue = (value / 100) * canvasHeight;
      const amplitude = Math.round((1 - breakPointRatio) * adjustedValue);

      ctx.fillStyle = "darkgrey";


      // TOP BAR COLORINGS
      //   bars that are highlighed...
      if (numHighlightedBars > 0 && i <= numHighlightedBars) {

        // ... and played
        if (i < numWaveformBars) {
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
        // ... and NOT played
        else {
          ctx.fillStyle = "#aa3e00";
        }

        // bars that are not highlighted...
      } else {
        // ... and played, and highlights exist
        if (numHighlightedBars > 0 && i < numWaveformBars) {
          ctx.fillStyle = "#aa3e00";
        }
        // ... and played, and highlights do not exist
        else if (i < numWaveformBars) {
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
        // ... and not played
        else {
          ctx.fillStyle = "darkgrey";
        }
      }
      // Actually fill the top bars
      ctx.fillRect(
        i * (rectWidth + rectSpacing),
        canvasHeight - amplitude - canvasBreakPoint,
        rectWidth,
        amplitude
      );

      // BOTTOM BAR COLORINGS

      // bars that have been played
      if (i < numWaveformBars) {
        ctx.fillStyle = "#ffc5b5";
      }
      // bars that have not been played
      else {
        ctx.fillStyle = "lightgrey";
      }
      // Actually fill the bars
      ctx.fillRect(
        i * (rectWidth + rectSpacing),
        canvasHeight - canvasBreakPoint + 2,
        rectWidth,
        adjustedValue * breakPointRatio
      );

    });
  }, [waveformData, numWaveformBars, numHighlightedBars, canvasHeight, canvasWidth]);





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
      </canvas>
    </div>
  );
};

export default Waveform;
