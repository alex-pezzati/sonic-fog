import React from 'react';
import { logout } from '../../store/session';
import { useDispatch, useSelector } from 'react-redux';
import { modalSignUpClose, modalLogInClose } from '../../store/modal';

import c from './NavBar.module.css';

const SignOutButton = () => {
    const dispatch = useDispatch();
    const modalLogInState = useSelector((state) => state.modal.login);
    const modalSignUpState = useSelector((state) => state.modal.signup);

    const onLogout = async (e) => {
        dispatch(logout());
        if (modalLogInState) dispatch(modalLogInClose());
        if (modalSignUpState) dispatch(modalSignUpClose());
    };

    return (
        <button className={c.signOutButton} onClick={onLogout}>
            Sign Out
        </button>
    );
};

export default SignOutButton;
