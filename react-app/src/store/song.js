let counter = 0;

const SET_ACTIVE_SONG_DATA = "song/SET_ACTIVE_SONG";
const SET_CHECKPOINT = "song/SET_CHECKPOINT";
const PAUSE_SONG = "song/PAUSE_SONG";
const PLAY_SONG = "song/PLAY_SONG";

const SET_AUDIO_REF = "song/SET_AUDIO_REF";

export const pauseSong = () => {
  return {
    type: PAUSE_SONG,
  };
};

export const playSong = () => {
  return {
    type: PLAY_SONG,
  };
};

export const setActiveSongData = (songId, songURL) => {
  return {
    type: SET_ACTIVE_SONG_DATA,
    data: { songId, songURL },
  };
};

export const setCheckpoint = (seconds) => {
  if (counter % 2) counter++;
  else counter--;

  return {
    type: SET_CHECKPOINT,
    seconds: seconds + counter * 0.01,
  };
};

export const setAudioRef = (audioRef) => {
  return {
    type: SET_AUDIO_REF,
    audioRef,
  };
};

const initialStore = {
  checkpoint: 0,
  activeSongId: null,
  activeSongURL: null,
  isPlaying: false,
  audioRef: null,
};

const songReducer = (songData = initialStore, action) => {
  let newData;
  switch (action.type) {
    case SET_CHECKPOINT:
      newData = { ...songData };
      newData["checkpoint"] = action.seconds;
      return newData;
    case SET_ACTIVE_SONG_DATA:
      newData = { ...songData };
      newData["activeSongId"] = action.data.songId;
      newData["activeSongURL"] = action.data.songURL;
      newData["checkpoint"] = 0.0;
      return newData;
    case PAUSE_SONG:
      newData = { ...songData };
      newData["isPlaying"] = false;
      return newData;
    case PLAY_SONG:
      newData = { ...songData };
      newData["isPlaying"] = true;
      return newData;
    case SET_AUDIO_REF:
      newData = { ...songData };
      newData["audioRef"] = action.audioRef;
      return newData;
    default:
      return songData;
  }
};

export default songReducer;
