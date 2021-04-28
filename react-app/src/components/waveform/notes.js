// This is the meat of the waveform calculations.
  // It recursively calls itself while a song is playing and calculates the time difference between timeLastSaved and the current moment
  //    -note that timeLastSaved is initially equal to the moment the song starts, but is updated if the song pauses or is searched
  //    -- so it's not the amount of time since the song first began playing, it's the amount of time since the song has resumed playing
  //  it uses this time difference to calculate what percentage of the track is complete
  //    - note if a song is playing uninterupted, this percentage = the percentage of the song played
  //    - BUT if the song has been paused, then this percentage must be added to the percentage of LastCheckpoint
  //  it muliplies that (total) percentage by the total number of waveform bars
  //  the result is how many bars should be filled in
  // const updateNumWaveformBars = () => {

  //     // What percentage of the song has already played? We find this by converting the lastCheckpoint into a percent
  //     const checkpointPercentage = lastCheckpoint / trackDuration

  //     // How many seconds have passed since we resumed/started playing?
  //     let time = (Date.now() / 1000) - timeLastSaved
  //     // What is that in 'track percentage points'
  //     let trackPercentage = time /trackDuration
  //     // Add that to the percentage points from our checkpoint and we end up with the total amount of completed track percentage points
  //     trackPercentage += checkpointPercentage

  //     // Multiply the percentage points times the number of waveform bars to get how many bars should be filled in
  //     const numChunks = waveformData.length;
  //     const numBars = Math.floor(trackPercentage * numChunks);

  //     // // If the song is over, don't update the number of bars
  //     // if (trackPercentage >= 1) {
  //     //   return;
  //     // }

  //     // If there is discrepency between the number of bars calculated in this function, and the number stored it the state, update the state
  //     // This check acts as a throttle. The canvas is repainted in a useEffect that has numWaveBars as a dependency
  //     if (numBars && numBars !== numWaveformBars) {
  //       setNumWaveformBars(numBars);
  //     }
  //     animationFrameRef.current = requestAnimationFrame(updateNumWaveformBars)
  // }
  // const memoizedCallback = useCallback(updateNumWaveformBars, [lastCheckpoint, trackDuration, timeLastSaved, waveformData])

  // // This function handles all the requisite setup for when a song
  // //    -starts playing for the first time
  // //    -resumes playing after being paused
  // //    -has been scrubbed or searched by a user
  // useEffect(() => {
  //   if (storeSongData.activeSongId && storeSongData.activeSongId !== songId) {
  //     if (numWaveformBars !== 0)
  //       setNumWaveformBars(0);
  //       return;
  //   }

  //   // If there is no waveform data, don't bother with any calculations
  //   if ((!waveformData || !waveformData.length) && trackDuration !== 0) return;


  // //    - if a song has started playing, or resumes playing, then...
  // //      -- grab the last checkpoint from the store, and store it locally
  // //      -- record the time it grabbed the checkpoint, and store that locally
  // //      -- update the local 'isPlaying' state


  //   //       If a song has resumed playing             OR     the user scrubbed/searched through the track...
  //   if ((storeSongData.isPlaying && !isPlayingLocally) || (storeSongData.checkpoint !== lastCheckpoint)){
  //     // compare this to the store to see if a user has scrubbed)
  //     setLastCheckpoint(storeSongData.checkpoint)
  //     // Compare this to the store to see if a song has resumed playing (or begun for the first time)
  //     setIsPlayingLocally(true)

  //     // Used for calculating how much time has passed between when we started playing and any given moment.
  //     setTimeLastSaved(Date.now() / 1000)

  //   // If we've already been playing and there are no updates, then request an animation frame which will actually calculate and update the number of waveform bars
  //   } else if (storeSongData.isPlaying && isPlayingLocally){
  //     requestAnimationFrame(memoizedCallback)
  //   }

  //   // Clean up. Notice the use of a useRef to store the ever-changing animation frame id
  //   return () => window.cancelAnimationFrame(animationFrameRef.current)
  // }, [storeSongData, isPlayingLocally, lastCheckpoint, trackDuration, memoizedCallback, waveformData]);
