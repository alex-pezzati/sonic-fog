import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import LoginFormModal from '../auth/LoginModal';
import SignupFormModal from '../auth/SignupModal';

import { modalLogInOpen, modalSignUpOpen } from '../../store/modal';

import c from './FrontNav.module.css';

const FrontNav = () => {
    const dispatch = useDispatch();

    const openLoginModal = () => dispatch(modalLogInOpen());
    const openSignupModal = () => dispatch(modalSignUpOpen());

    return (
        <div className={c.login}>
            <button className={c.loginButton} onClick={openLoginModal}>
                Sign In
            </button>
            <LoginFormModal />
            <button className={c.createAccountButton} onClick={openSignupModal}>
                Create Account
            </button>
            <SignupFormModal />
            <Link className={c.developersButton} to="/the-developers">
                The Developers
            </Link>
        </div>
    );
};

export default FrontNav;
