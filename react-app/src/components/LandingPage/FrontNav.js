import React from 'react';
import { useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';

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
            <NavLink className={c.developersButton} to="/">
                Site Developers
            </NavLink>
        </div>
    );
};

export default FrontNav;
