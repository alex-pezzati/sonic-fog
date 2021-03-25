import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import LogoutButton from './auth/LogoutButton';
import SignupFormModal from './SignupForm';
import LoginFormModal from './LoginForm';
import { modalLogInOpen, modalSignUpOpen } from '../store/modal';

const NavBar = ({ isLoaded, authenticated, setAuthenticated }) => {
	const dispatch = useDispatch();
	let authLinks;

  function openLogin() {
    dispatch(modalLogInOpen())
  }

  function openSignup() {
    dispatch(modalSignUpOpen())
  }

	if (authenticated) {
		authLinks = <LogoutButton setAuthenticated={setAuthenticated} />;
	} else {
		authLinks = (
			<>
				<div>
					<button onClick={openLogin}>Log in</button>
					<LoginFormModal />
				</div>
				<div>
					<button onClick={openSignup}>Sign up</button>
					<SignupFormModal />
				</div>
			</>
		);
	}

	return (
		<nav>
			<ul>
				<li>
					<NavLink to='/' exact={true} activeClassName='active'>
						Home
					</NavLink>
				</li>
				<li>
					<div>{isLoaded && authLinks}</div>
				</li>
			</ul>
		</nav>
	);
};

export default NavBar;
