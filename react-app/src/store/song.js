
let counter = 0


const SET_CURRENT_TIME = 'song/SET_CURRENT_TIME'
const SET_ACTIVE_SONG_DATA = 'song/SET_ACTIVE_SONG'
const SET_CHECKPOINT = 'song/SET_CHECKPOINT'
const PAUSE_SONG = 'song/PAUSE_SONG'
const PLAY_SONG = 'song/PLAY_SONG'

// export const asyncSetActiveSong = (songId) => async (dispatch) => {
//   const res = await fetch(`/api/song/${songId}`)
//   let data = await response.json()
//   let songUrl = data.songURL

//   dispatch(setActiveSong(songId, songUrl))
// }

export const pauseSong = () => {
  return {
    type: PAUSE_SONG,
  }
}

export const playSong = () => {
  return {
    type: PLAY_SONG,
  }
}


export const setActiveSongData = (songId, songURL) => {
  return {
    type: SET_ACTIVE_SONG_DATA,
    data: { songId, songURL }
  }
}

export const setCurrentTime = (seconds) => {
  return {
    type: SET_CURRENT_TIME,
    seconds
  }
}

export const setCheckpoint = (seconds) => {
  if (counter % 2) counter++
  else counter--

  return {
    type: SET_CHECKPOINT,
    seconds: seconds + (counter * .01)
  }
}


const initialStore = {
  'currentTime': 0,
  'checkpoint': 0,
  'activeSongId': null,
  'activeSongURL': null,
  'isCurrentlyPlaying': false
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
    case SET_ACTIVE_SONG_DATA:
      newData = { ...songData }
      newData['activeSongId'] = action.data.songId
      newData['activeSongURL'] = action.data.songURL
      newData['currentTime'] = 0.0
      newData['checkpoint'] = 0.0
      return newData
    case PAUSE_SONG:
      newData = { ...songData }
      newData['isCurrentlyPlaying'] = false
      return newData
    case PLAY_SONG:
      newData = { ...songData }
      newData['isCurrentlyPlaying'] = true
      return newData
    default:
      return songData
  }
}

export default songReducer
