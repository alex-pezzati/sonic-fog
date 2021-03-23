import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { useSelector } from 'react-redux'
import LoginForm from "./components/auth/LoginForm";
import SignUpForm from "./components/auth/SignUpForm";
import NavBar from "./components/NavBar";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import UsersList from "./components/UsersList";
import User from "./components/User";
import { authenticate } from "./services/auth";

import Waveform from "./components/waveform"

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const user = await authenticate();
      if (!user.errors) {
        setAuthenticated(true);
      }
      setLoaded(true);
    })();
  }, []);



  // Not fully sure where to put this
  const [waveformData, setWaveFormData] = useState([])
  const [trackDuration, setTrackDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const trackData = useSelector(state => state.track)

  useEffect(() => {
    (async () => {
      let answer = await fetch('/api/waveform')
      let json = await answer.json()
      setWaveFormData(json.data)
      setTrackDuration(json.duration)
    })()
  }, [])

  let audio_src = '/static/Lana.wav'
  let audioRef = useRef()

  useEffect(() => {
    if (trackData?.startTime)
      audioRef.current.currentTime = trackData.startTime
  }, [trackData])

  const togglePlaying = (e) => {
    const player = audioRef.current

    if (e.target.innerText === 'Play') {
      e.target.innerText = 'Pause'
      player['play']()
    } else {
      e.target.innerText = 'Play'
      player['pause']()
    }

    setCurrentTime(player.currentTime)
  }






  if (!loaded) {
    return null;
  }

  return (
    <BrowserRouter>
      <NavBar setAuthenticated={setAuthenticated} />
      <Switch>
        <Route path="/login" exact={true}>
          <LoginForm
            authenticated={authenticated}
            setAuthenticated={setAuthenticated}
          />
        </Route>
        <Route path="/sign-up" exact={true}>
          <SignUpForm authenticated={authenticated} setAuthenticated={setAuthenticated} />
        </Route>
        <ProtectedRoute path="/users" exact={true} authenticated={authenticated}>
          <UsersList />
        </ProtectedRoute>
        <ProtectedRoute path="/users/:userId" exact={true} authenticated={authenticated}>
          <User />
        </ProtectedRoute>
        <ProtectedRoute exact path='/waveform' authenticated={authenticated}>
          <audio src={audio_src} ref={audioRef} onTimeUpdate={() => setCurrentTime(audioRef.current.currentTime)}></audio>
          <Waveform waveformData={waveformData} trackDuration={trackDuration} currentTime={currentTime} canvasWidth={1000} canvasHeight={200} />
          <button onClick={togglePlaying}>Play</button>
        </ProtectedRoute>
        <ProtectedRoute path="/" exact={true} authenticated={authenticated}>
          <h1>My Home Page</h1>
        </ProtectedRoute>
      </Switch>
    </BrowserRouter >
  );
}

export default App;
