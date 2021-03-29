import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { useDispatch } from 'react-redux';

import LandingPage from "./components/LandingPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import NavBar from "./components/upper_navbar/NavBar";
import SongPageRoute from "./components/songPage";
import SongNavBar from "./components/song_navbar";
import UploadPicture from "./components/AWS";
import UploadSong from "./components/song_upload_form/AWS_Song";
import User from "./components/User";
import WaveFormControls from "./components/waveformControls";
import Waveform from "./components/waveform";

import { restoreSession } from "./store/session";
// import { authenticate } from "./services/auth";



function App() {
  const dispatch = useDispatch();

  // We never change this, so it is always false
  const [authenticated, setAuthenticated] = useState(false); //TODO: remove eventually and use sessionUser instead
  // I added this just to suppress the warning about setAuthenticated never being used
  if (false) {
    setAuthenticated(false)
  }

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(restoreSession()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    isLoaded && (
      <BrowserRouter>
        <NavBar isLoaded={isLoaded} />
        <SongNavBar isLoaded={isLoaded} />
        <Switch>
          <Route path="/" exact={true}>
            <LandingPage />
          </Route>
          <Route path="/songs/:songId">
            <SongPageRoute setAuthenticated={setAuthenticated} />
          </Route>
          <ProtectedRoute
            path="/users/:displayName"
            exact={true}
            authenticated={authenticated}
          >
            <User />
          </ProtectedRoute>
          <ProtectedRoute
            path="/upload"
            authenticated={authenticated}
          >
            <UploadSong />
            <UploadPicture />
          </ProtectedRoute>
        </Switch>
        {/* <SongNavBar /> */}
      </BrowserRouter>
    )

  );
}

export default App;
