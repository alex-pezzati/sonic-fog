import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { useDispatch } from 'react-redux';
import NavBar from "./components/NavBar";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import UsersList from "./components/UsersList";
import User from "./components/User";

import WaveFormControls from './components/waveformControls'
import Waveform from './components/waveform'
import SongNavBar from './components/song_navbar'

import UploadPicture from "./components/AWS";
import UploadSong from "./components/AWS_Song";
import { restoreSession } from "./store/session";

function App() {
  const dispatch = useDispatch();
  const [authenticated] = useState(false); //TODO: remove eventually and use sessionUser instead
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(restoreSession()).then(() => setIsLoaded(true))
  }, [dispatch]);

  return isLoaded && (
    <BrowserRouter>
      <NavBar isLoaded={isLoaded} />
      <Switch>
        <Route path="/" exact={true}>
          <h1>Hello Sonic Fog</h1>
        </Route>
        <ProtectedRoute path="/users" exact={true} authenticated={authenticated}>
          <UsersList />
        </ProtectedRoute>
        <ProtectedRoute path="/users/:displayName" exact={true} authenticated={authenticated}>
          <User />
        </ProtectedRoute>
        {/* Feel free to delete this route if it doesn't work with you database. It was just for testing the waveform player */}
        <ProtectedRoute exact path='/audioPlayerTest' authenticated={authenticated}>
          <Waveform songId={12} canvasHeight={200} canvasWidth={1000} />
          <WaveFormControls songId={12} />

          <Waveform songId={11} canvasHeight={200} canvasWidth={1000} />
          <WaveFormControls songId={11} />

          <Waveform songId={13} canvasHeight={200} canvasWidth={1000} />
          <WaveFormControls songId={13} />

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
      <SongNavBar />
    </BrowserRouter >
  );
}

export default App;
