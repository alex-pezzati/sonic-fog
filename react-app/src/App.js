import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import DevInfo from './components/DevInfo';
import LandingPage from './components/LandingPage';
import MainNavBar from './components/MainNavBar';
import ProtectedRoute from './components/auth/ProtectedRoute';
import SongPageRoute from './components/songPage';
import SongNavBar from './components/song_navbar';
import UploadSong from './components/song_upload_form/AWS_Song';
// import User from './components/user_profile/User';

import { restoreSession } from './store/session';

function App() {
    const [isLoaded, setIsLoaded] = useState(false);
    const dispatch = useDispatch();

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
                <MainNavBar isLoaded={isLoaded} />
                <SongNavBar />
                <Switch>
                    <Route path="/" exact={true}>
                        <LandingPage />
                    </Route>
                    <Route path="/the-developers" exact={true}>
                        <DevInfo />
                    </Route>
                    <Route path="/songs/:songId" exact={true}>
                        <SongPageRoute />
                    </Route>
                    {/* <Route path="/users/:username" exact={true}>
                        <User />
                    </Route> */}
                    <ProtectedRoute path="/upload" exact={true}>
                        <UploadSong />
                    </ProtectedRoute>
                </Switch>
            </BrowserRouter>
        )
    );
}

export default App;
