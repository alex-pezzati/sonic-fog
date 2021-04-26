const SET_USER = 'session/SET_USER';
const REMOVE_USER = 'session/REMOVE_USER';

// actions
const setUser = (user) => ({
  type: SET_USER,
  payload: user,
});

const removeUser = () => ({
  type: REMOVE_USER,
});

//thunks
export const login = (user) => async (dispatch) => {
  const { email, password } = user;
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const data = await response.json();
  dispatch(setUser(data));
  return data;
};

export const signup = (user) => async (dispatch) => {
  const { displayName, email, password } = user;
  const response = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      display_name: displayName,
      email,
      password,
    }),
  });

  const data = await response.json();
  dispatch(setUser(data));
  return data;
};

export const logout = () => async (dispatch) => {
  const response = await fetch('/api/auth/logout', {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();
  dispatch(removeUser());
  return data;
};

export const restoreSession = () => async (dispatch) => {
  const response = await fetch('/api/auth/', {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();
  if (!data.errors)
    dispatch(setUser(data));
  return data;
};

const initialState = { user: null };

export default function sessionReducer(state = initialState, action) {
  switch (action.type) {
    case SET_USER:
      return { ...state, user: action.payload };
    case REMOVE_USER:
      return { user: null };
    default:
      return state;
  }
}
