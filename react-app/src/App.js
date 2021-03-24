import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import LoginForm from "./components/auth/LoginForm";
import SignUpForm from "./components/auth/SignUpForm";
import NavBar from "./components/NavBar";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import UsersList from "./components/UsersList";
import User from "./components/User";
import AudioPlayer from "./components/audioPlayer";
import { authenticate } from "./services/auth";

import UploadPicture from "./components/AWS";
import UploadSong from "./components/AWS_Song";
import Comment from "./components/Comment";

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
          <SignUpForm
            authenticated={authenticated}
            setAuthenticated={setAuthenticated}
          />
        </Route>
        <ProtectedRoute
          path="/users"
          exact={true}
          authenticated={authenticated}
        >
          <UsersList />
        </ProtectedRoute>
        <ProtectedRoute
          path="/users/:userId"
          exact={true}
          authenticated={authenticated}
        >
          <User />
        </ProtectedRoute>
        <ProtectedRoute
          exact
          path="/audioPlayerTest"
          authenticated={authenticated}
        >
          <AudioPlayer songId={12} canvasWidth={1000} canvasHeight={200} />
          <AudioPlayer songId={11} canvasWidth={1000} canvasHeight={200} />
          <AudioPlayer songId={7} canvasWidth={1000} canvasHeight={200} />
        </ProtectedRoute>
        <ProtectedRoute path="/" exact={true} authenticated={authenticated}>
          <h1>My Home Page</h1>
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
        <ProtectedRoute path="/comment" authenticated={authenticated}>
          <Comment song_id={3} />
        </ProtectedRoute>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
