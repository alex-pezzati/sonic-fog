import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import LogoutButton from './auth/LogoutButton';
import SignupFormModal from './SignupForm';
import LoginFormModal from './LoginForm';
import { modalLogInOpen, modalSignUpOpen } from '../store/modal';

const NavBar = ({ isLoaded }) => {
	const dispatch = useDispatch();
	const sessionUser = useSelector(state => state.session.user);
	let sessionLinks;

  function openLogin() {
    dispatch(modalLogInOpen())
  }

  function openSignup() {
    dispatch(modalSignUpOpen())
  }

	if (sessionUser && !sessionUser.errors) {
		sessionLinks = <LogoutButton />;
	} else {
		sessionLinks = (
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
					<div>{isLoaded && sessionLinks}</div>
				</li>
			</ul>
		</nav>
	);
};

export default NavBar;
