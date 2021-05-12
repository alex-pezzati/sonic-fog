import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import CreateAccountModal from '../auth/CreateAccountModal';
import SignInModal from '../auth/SignInModal';

import { modalLogInOpen, modalSignUpOpen } from '../../store/modal';

import c from './FrontNav.module.css';

/*
THIS COMPONENT IS TEMPORARILY DISABLED
until the /discover page is implemented
permitting the removable of the nav bar on '/'
*/

const FrontNav = () => {
    const dispatch = useDispatch();

    const openLoginModal = () => dispatch(modalLogInOpen());
    const openSignupModal = () => dispatch(modalSignUpOpen());

    return (
        <div className={c.login}>
            <button className={c.loginButton} onClick={openLoginModal}>
                Sign In
            </button>
            <SignInModal />
            <button className={c.createAccountButton} onClick={openSignupModal}>
                Create Account
            </button>
            <CreateAccountModal />
            <Link className={c.developersButton} to="/the-developers">
                The Developers
            </Link>
        </div>
    );
};

export default FrontNav;
