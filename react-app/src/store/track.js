const SET_STARTTIME = 'track/SET_STARTTIME'


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

export const setStartTime = (seconds) => {
  return {
    type: SET_STARTTIME,
    seconds
  }
}

const initialStore = {
  'startTime': 0
}
const trackReducer = (trackData = initialStore, action) => {
  let newData
  switch (action.type) {
    case SET_STARTTIME:
      newData = { ...trackData }
      newData['startTime'] = action.seconds
      return newData
    default:
      return trackData
  }
}

export default trackReducer
