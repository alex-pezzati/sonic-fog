import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import DevInfo from './components/DevInfo';
import LandingPage from './components/LandingPage';
import MainNavBar from './components/MainNavBar';
import ProtectedRoute from './components/auth/ProtectedRoute';
import SongPageRoute from './components/songPage';
import SongNavBar from './components/song_navbar';
// import UploadPicture from './services/AWS';
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
                <Route path="/" exact={true}>
                    <LandingPage />
                </Route>
                <Switch>
                    <Route path="/the-developers" exact={true}>
                        <MainNavBar isLoaded={isLoaded} />
                        <DevInfo />
                    </Route>
                    <Route path="/songs/:songId" exact={true}>
                        <MainNavBar isLoaded={isLoaded} />
                        <SongPageRoute />
                    </Route>
                    <Route path="/users/:username" exact={true}>
                        <MainNavBar isLoaded={isLoaded} />
                        <User />
                    </Route>
                    <ProtectedRoute path="/upload" exact={true}>
                        <MainNavBar isLoaded={isLoaded} />
                        <UploadSong />
                        {/* <UploadPicture /> */}
                    </ProtectedRoute>
                </Switch>
            </BrowserRouter>
        )
    );
}

export default App;
