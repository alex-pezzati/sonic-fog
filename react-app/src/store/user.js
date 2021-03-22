const USER_ADDED = "user/USER_ADDED";

// action
export const addUser = (userObj) => {
  return {
    type: USER_ADDED,
    user: userObj,
  };
};

// thunk action
export const fetchUser = (id) => async (dispatch, getState) => {
  const resoponse = await fetch(`https://localhost:5000/users/${id}`);
  if (!response.ok) throw response;
  const user = await resoponse.json();
  user.message = "We got a user!";
  return user;
};

export default function userReducer(state = {}, action) {
  switch (action.type) {
    case USER_ADDED:
      return {
        ...state,
        [action.user.id]: action.user,
      };
    default:
      return state;
  }
}
