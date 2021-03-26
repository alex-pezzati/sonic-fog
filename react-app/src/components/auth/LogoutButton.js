import React from 'react';
import { logout } from '../../store/session';
import { useDispatch, useSelector } from 'react-redux';
import { modalSignUpClose, modalLogInClose } from '../../store/modal';

const LogoutButton = () => {
	const dispatch = useDispatch();
  const modalLogInState = useSelector((state) => state.modal.login);
  const modalSignUpState = useSelector((state) => state.modal.signup);

	const onLogout = async (e) => {
		const logoutMsg = dispatch(logout());
    if (modalLogInState) dispatch(modalLogInClose());
    if (modalSignUpState) dispatch(modalSignUpClose());
	};

	return <button onClick={onLogout}>Logout</button>;
};

export default LogoutButton;
