const SET_CURRENT_TIME = 'track/SET_CURRENT_TIME'
const SET_ACTIVE_SONG = 'tracl/SET_ACTIVE_SONG'

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

const setActiveSong = (songId, songURL) => {
  return {
    type: SET_ACTIVE_SONG,
    activeSongData: { 'id': songId, 'songURL': songURL }
  }
}

export const asyncSetActiveSong = (songId) => async (dispatch) => {
  const res = await fetch('/api/song/setActiveSong', {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: songId }),
  });
  const songUrl = await res.json()
  dispatch(setActiveSong(songId, songUrl))
  return songUrl
}


export const setCurrentTime = (seconds) => {
  return {
    type: SET_CURRENT_TIME,
    seconds
  }
}


const initialStore = {
  'currentTime': 0
}
const songReducer = (songData = initialStore, action) => {
  let newData
  switch (action.type) {
    case SET_CURRENT_TIME:
      newData = { ...songData }
      newData['currentTime'] = action.seconds
      return newData
    case SET_ACTIVE_SONG:
      newData = { ...songData }
      newData['activeSongId'] = action.activeSongData.id
      newData['activeSongURL'] = action.activeSongData.songURL
      return newData
    default:
      return songData
  }
}

export default songReducer
