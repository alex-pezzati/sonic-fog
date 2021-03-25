import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { useDispatch } from 'react-redux';
import NavBar from "./components/NavBar";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import UsersList from "./components/UsersList";
import User from "./components/User";
import AudioPlayer from './components/audioPlayer'

import UploadPicture from "./components/AWS";
import UploadSong from "./components/AWS_Song";
import { restoreSession } from "./store/session";

function App() {
  const dispatch = useDispatch();
  const [authenticated, setAuthenticated] = useState(false); //TODO: remove eventually and use sessionUser instead
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(restoreSession()).then(() => setIsLoaded(true))
  }, [dispatch]);

  return isLoaded && (
    <BrowserRouter>
      <NavBar isLoaded={isLoaded} />
      <Switch>
        {/* <Route path="/login" exact={true}>
          <LoginForm
            authenticated={authenticated}
            setAuthenticated={setAuthenticated}
          />
        </Route> */}
      {/* <Route path="/sign-up" exact={true}>
        <SignUpForm authenticated={authenticated} setAuthenticated={setAuthenticated} />
      </Route> */}
      {/* <ProtectedRoute path="/" exact={true} authenticated={authenticated}>
        <h1>My Home Page</h1>
      </ProtectedRoute> */}
        <Route path="/" exact={true}>
          <h1>Hello Sonic Fog</h1>
        </Route>
        <ProtectedRoute path="/users" exact={true} authenticated={authenticated}>
          <UsersList />
        </ProtectedRoute>
        <ProtectedRoute path="/users/:displayName" exact={true} authenticated={authenticated}>
          <User />
        </ProtectedRoute>
        <ProtectedRoute exact path='/audioPlayerTest' authenticated={authenticated}>
          <AudioPlayer songId={12} canvasWidth={1000} canvasHeight={200} />
          <AudioPlayer songId={11} canvasWidth={1000} canvasHeight={200} />
          <AudioPlayer songId={7} canvasWidth={1000} canvasHeight={200} />
        </ProtectedRoute>
        <ProtectedRoute
          path="/images"
          exact={true}
          authenticated={authenticated}
        >
          <UploadPicture />
        </ProtectedRoute>
        <ProtectedRoute path="/song" exact={true} authenticated={authenticated}>
          <UploadSong />
        </ProtectedRoute>
      </Switch>
    </BrowserRouter >
  );
}

export default App;
