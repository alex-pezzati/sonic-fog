import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';

import ProfileButton from './ProfileButton';

import LogoutButton from '../auth/LogoutButton';
import SignupFormModal from '../SignupForm';
import LoginFormModal from '../LoginForm';
import { modalLogInOpen, modalSignUpOpen } from '../../store/modal';

import c from './NavBar.module.css'

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

  // ONLY for logged in users
  if (sessionUser && !sessionUser.errors) {
    sessionLinks = (
      <>
        <li>
          <LogoutButton />
        </li>
        <li>
          <NavLink exact to='/upload'>
            Upload
          </NavLink>
        </li>
        <li>
          <ProfileButton />
        </li>
      </>
    );
    // ONLY for logged out users
  } else {
    sessionLinks = (
      <>
        <li>
          <button onClick={openLogin}>Log in</button>
          <LoginFormModal />
        </li>
        <li>
          <button onClick={openSignup}>Sign up</button>
          <SignupFormModal />
        </li>
      </>
    );
  }

  // Regardless of logged in status...
  return (
    <nav className={c.nav}>
      <ul className={c.nav_content}>
        <li>
          <NavLink to='/' exact={true} activeClassName='active'>
            Home
					</NavLink>
        </li>
        <li>
          <input type='search' placeholder='Find artists, songs, and more...' />
        </li>
        {isLoaded && sessionLinks}
      </ul>
    </nav>
  );
};

export default NavBar;
