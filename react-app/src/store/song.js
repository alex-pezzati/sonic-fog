
let counter = 0

const SET_ACTIVE_SONG_DATA = 'song/SET_ACTIVE_SONG'
const SET_CHECKPOINT = 'song/SET_CHECKPOINT'
const PAUSE_SONG = 'song/PAUSE_SONG'
const PLAY_SONG = 'song/PLAY_SONG'

const SET_AUDIO_REF = 'song/SET_AUDIO_REF'



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


// export const setActiveSongData = (songId, songUrl, songName, albumPhoto, uploaderName) => {
//   return {
//     type: SET_ACTIVE_SONG_DATA,
//     data: { songId, songURL }
//   }
// }
export const setActiveSongData = (songId, songUrl, songName, albumPhoto, uploaderName) => {
  return {
    type: SET_ACTIVE_SONG_DATA,
    data: {songId, songUrl, songName, albumPhoto, uploaderName}
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

export const setAudioRef = (audioRef) => {
  return {
    type: SET_AUDIO_REF,
    audioRef
  }
}


const initialStore = {
  'activeSongId': null,
  'activeSongURL': null,
  'activeSongName': null,
  'activeSongUploader': null,
  'activeSongAlbumCover': null,

  'checkpoint': 0,
  'isPlaying': false,
  'audioRef': null,
}

const songReducer = (songData = initialStore, action) => {
  let newData
  switch (action.type) {
    case SET_CHECKPOINT:
      newData = { ...songData }
      newData['checkpoint'] = action.seconds
      return newData
    case SET_ACTIVE_SONG_DATA:
      newData = { ...songData }
      newData['activeSongId'] = action.data.songId
      newData['activeSongURL'] = action.data.songUrl
      newData['activeSongName'] = action.data.songName
      newData['activeSongUploader'] = action.data.uploaderName
      newData['activeSongAlbumCover'] = action.data.albumPhoto
      newData['checkpoint'] = 0.0
      return newData
    case PAUSE_SONG:
      newData = { ...songData }
      newData['isPlaying'] = false
      return newData
    case PLAY_SONG:
      newData = { ...songData }
      newData['isPlaying'] = true
      return newData
    case SET_AUDIO_REF:
      newData = { ...songData }
      newData['audioRef'] = action.audioRef
      return newData
    default:
      return songData
  }
}

export default songReducer
