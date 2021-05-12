import React, { useCallback, useEffect } from 'react';
import { Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import NotAuthorized from './NotAuthorized';
import { modalLogInOpen } from '../../store/modal';

const ProtectedRoute = (props) => {
    const dispatch = useDispatch();
    const sessionUser = useSelector((state) => state.session.user);

    // sign in modal handler
    const openSignInModal = useCallback(() => {
        dispatch(modalLogInOpen());
    }, [dispatch]);

    // checks to see if sign in modal should pop up
    useEffect(() => {
        if (!sessionUser) {
            return openSignInModal();
        }
    }, [openSignInModal, sessionUser]);

    // renders error page if not authorized
    return (
        <Route {...props}>
            {sessionUser ? props.children : <NotAuthorized />}
        </Route>
    );
};

export default ProtectedRoute;
