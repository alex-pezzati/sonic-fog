import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, Link } from 'react-router-dom';

import CreateAccountModal from '../auth/CreateAccountModal';
import SignInModal from '../auth/SignInModal';
import SignOutButton from './SignOutButton';
import { modalLogInOpen, modalSignUpOpen } from '../../store/modal';

import c from './NavBar.module.css';

const NavBar = ({ isLoaded }) => {
    const dispatch = useDispatch();
    const sessionUser = useSelector((state) => state.session.user);
    // let sessionLinks; we can just change line 30 to var and hoist awayyyyyyyyyyy

    const openLogin = () => dispatch(modalLogInOpen());
    const openSignup = () => dispatch(modalSignUpOpen());

    /*
    TODO:
    -- link user profiles with button
    -- refactor home/upload/devs links styling
    -- refactor NavBar into smaller sub components
    -- style search feature sub component
    -- implement search feature sub component
    -- add comments
    */

    if (sessionUser && !sessionUser.errors) {
        // ONLY for signed in users
        var sessionLinks = (
            <div className={c.signedIn__menu}>
                <div
                    // exact
                    // replace with proper route when users implemented
                    // to={`/users/${sessionUser.display_name}`}
                    className={c.user__button}
                >
                    <div className={c.user__profile}>
                        <span
                            className={c.user__avatar}
                            style={{
                                backgroundImage: `url(${sessionUser.profile_url})`,
                            }}
                        ></span>
                        <span className={c.user__displayName}>
                            {sessionUser.display_name}
                        </span>
                    </div>
                </div>
                <SignOutButton />
            </div>
        );
    } else {
        // ONLY for logged out users
        sessionLinks = (
            <div className={c.signedOut__menu}>
                <button className={c.signInButton} onClick={openLogin}>
                    Sign in
                </button>
                <SignInModal />
                <button className={c.createAccountButton} onClick={openSignup}>
                    Create Account
                </button>
                <CreateAccountModal />
            </div>
        );
    }

    // Regardless of logged in status...
    return (
        <header className={c.header}>
            <div className={c.container}>
                <div className={c.left}>
                    <div className={c.header__logo}>
                        <Link className={c.logo} to="/">
                            SonicFog
                        </Link>
                    </div>
                    <nav className={c.left}>
                        <ul className={`${c.left} ${c.noStyle}`}>
                            <li>
                                <NavLink
                                    activeClassName={c.navItemActive}
                                    className={c.navItem}
                                    exact
                                    to="/"
                                >
                                    Home
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    activeClassName={c.navItemActive}
                                    className={c.navItem}
                                    exact
                                    to="/upload"
                                >
                                    Upload
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    activeClassName={c.navItemActive}
                                    className={c.navItem}
                                    exact
                                    to="/the-developers"
                                >
                                    The Devs
                                </NavLink>
                            </li>
                        </ul>
                    </nav>
                </div>
                {/* comment in search bar when functionality is added */}
                {/* <div className={c.middle}>
                    <div>
                        <form>
                            <input
                                type="search"
                                placeholder="Noisy and Moist"
                            />
                            <button type="submit">Search</button>
                        </form>
                    </div>
                </div> */}
                <div className={c.right}>
                    <>{isLoaded && sessionLinks}</>
                </div>
            </div>
        </header>
    );
};

export default NavBar;
