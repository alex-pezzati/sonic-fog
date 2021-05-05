import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import DevInfo from './components/DevInfo';
import LandingPage from './components/LandingPage';
import NavBar from './components/upper_navbar/NavBar';
import ProtectedRoute from './components/auth/ProtectedRoute';
import SongPageRoute from './components/songPage';
import SongNavBar from './components/song_navbar';
import UploadPicture from './services/AWS';
import UploadSong from './components/song_upload_form/AWS_Song';
import User from './components/user_profile/User';
// import WaveFormControls from "./components/waveformControls";
// import Waveform from "./components/waveform";

import { restoreSession } from './store/session';
// import { authenticate } from "./services/auth";

function App() {
    const dispatch = useDispatch();

    const [isLoaded, setIsLoaded] = useState(false);
    // const [authorized, setAuthorized] = useState(false);

    // Try to restore the user
    useEffect(() => {
        (async () => {
            dispatch(restoreSession());
            setIsLoaded(true);
        })();
    }, [dispatch]);

    return (
        isLoaded && (
            <BrowserRouter>
                <SongNavBar />
                <Switch>
                    <Route path="/" exact={true}>
                        <LandingPage />
                    </Route>
                    <Route path="/the-developers" exact={true}>
                        <NavBar isLoaded={isLoaded} />
                        <DevInfo />
                    </Route>
                    <Route path="/songs/:songId" exact={true}>
                        <NavBar isLoaded={isLoaded} />
                        <SongPageRoute />
                    </Route>
                    <Route path="/users/:username" exact={true}>
                        <NavBar isLoaded={isLoaded} />
                        <User />
                    </Route>
                    <ProtectedRoute path="/upload" exact={true}>
                        <NavBar isLoaded={isLoaded} />
                        <UploadSong />
                        <UploadPicture />
                    </ProtectedRoute>
                </Switch>
            </BrowserRouter>
        )
    );
}

export default App;
