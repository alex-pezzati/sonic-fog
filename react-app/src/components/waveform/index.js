import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCheckpoint, setActiveSongData } from "../../store/song";

// import classes from './Waveform.module.css'

const Waveform = ({ songId, canvasWidth, canvasHeight }) => {

  // This is the amplitude data, the array of normalized numbers
  const [waveformData, setWaveFormData] = useState();
  // This is the number of filled in bars. Like, how complete the song is, as represented by the number of bars
  const [numWaveformBars, setNumWaveformBars] = useState(0);
  // This is the number of USER highlighted bars (which appear when a user tries to seek a track)
  const [numHighlightedBars, setNumHighlightedBars] = useState(0);

  const [targetTime, setTargetTime] = useState(0);
  const [trackDuration, setTrackDuration] = useState();

  // Used for updating the store's 'active song data'
  const [songUrl, setSongUrl] = useState();
  const [uploaderName, setUploaderName] = useState({})
  const [albumPhoto, setAlbumPhoto] = useState({})
  const [songName, setSongName] = useState({})

  const storeSongData = useSelector((store) => store.song);

  const dispatch = useDispatch();

  let canvasRef = useRef();
  let animationFrameRef = useRef();

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

      setSongName(data.songName)
      setUploaderName(data.uploaderName)
      setAlbumPhoto(data.albumPhoto)
      setSongUrl(data.songURL);
    })();
  }, [songId, canvasWidth]);

  const updateNumWaveformBars = () => {
    let trackPercentage =
      storeSongData.audioRef.current.currentTime /
      storeSongData.audioRef.current.duration;

    // Multiply the percentage points times the number of waveform bars to get how many bars should be filled in
    const numChunks = waveformData.length;
    const numBars = Math.floor(trackPercentage * numChunks);

    // If there is discrepency between the number of bars calculated in this function, and the number stored it the state, update the state
    // This check acts as a throttle. The canvas is repainted in a useEffect that has numWaveBars as a dependency
    if (numBars && numBars !== numWaveformBars) {
      setNumWaveformBars(numBars);
    }
    animationFrameRef.current = requestAnimationFrame(memoizedCallback);
  };
  // eslint-disable-next-line
  const memoizedCallback = useCallback(updateNumWaveformBars, [
    trackDuration,
    waveformData,
  ]);

  useEffect(() => {
    if (storeSongData.activeSongId && storeSongData.activeSongId !== songId) {
      if (numWaveformBars !== 0) setNumWaveformBars(0);
      return;
    }

    if (!storeSongData?.audioRef) return;
    if (!waveformData) return;

    requestAnimationFrame(memoizedCallback);
    return () => window.cancelAnimationFrame(animationFrameRef.current);
  }, [storeSongData, waveformData, songId, memoizedCallback, numWaveformBars]);

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
      return;
    }
    const distanceFromLeft = canvasRef.current.getBoundingClientRect().left;
    const relativePosition = e.clientX - distanceFromLeft;
    const trackPercentage = relativePosition / canvasWidth;

    const numChunks = waveformData.length;
    const numBars = Math.floor(trackPercentage * numChunks);
    setNumHighlightedBars(numBars);

    // setTargetTime((trackPercentage + .005) * trackDuration)
    setTargetTime(trackPercentage * trackDuration);
  };

  const seekTrack = (e) => {
    if (storeSongData.activeSongId !== songId) {
      dispatch(setActiveSongData(songId, songUrl, songName, albumPhoto, uploaderName));
    }
    console.log(targetTime);
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
      ></canvas>
    </div>
  );
};

export default Waveform;
