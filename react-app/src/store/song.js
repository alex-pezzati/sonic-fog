

// export const asyncFetchTrack = (trackId) => async (dispatch) => {
//   let found = true
//   const res = await csrfFetch(`/api/tracks/${trackId}`)
//     .catch(err => {
//       found = false
//     })

//   let data
//   if (found) {
//     data = await res.json()
//   } else {
//     data = { track: null }
//   }
//   dispatch(getTrack(data))
//   return data
// }


// export const asyncSetActiveSong = (songId) => async (dispatch) => {
//   const res = await fetch('/api/song/setActiveSong', {
//     method: "POST",
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ id: songId }),
//   });
//   const songUrl = await res.json()
//   dispatch(setActiveSong(songId, songUrl))
//   return songUrl
// }


const SET_CURRENT_TIME = 'song/SET_CURRENT_TIME'
const SET_ACTIVE_SONG = 'song/SET_ACTIVE_SONG'
const SET_CHECKPOINT = 'song/SET_CHECKPOINT'

export const setActiveSong = (songId) => {
  return {
    type: SET_ACTIVE_SONG,
    songId
  }
}

export const setCurrentTime = (seconds) => {
  return {
    type: SET_CURRENT_TIME,
    seconds
  }
}

export const setCheckpoint = (seconds) => {
  return {
    type: SET_CHECKPOINT,
    seconds
  }
}


const initialStore = {
  'currentTime': 0.1
}
const songReducer = (songData = initialStore, action) => {
  let newData
  switch (action.type) {
    case SET_CURRENT_TIME:
      newData = { ...songData }
      newData['currentTime'] = action.seconds
      return newData
    case SET_CHECKPOINT:
      newData = { ...songData }
      newData['checkpoint'] = action.seconds
      return newData
    case SET_ACTIVE_SONG:
      newData = { ...songData }
      newData['activeSongId'] = action.songId
      newData['currentTime'] = 0.0
      newData['checkpoint'] = 0.1
      return newData
    default:
      return songData
  }
}

export default songReducer
