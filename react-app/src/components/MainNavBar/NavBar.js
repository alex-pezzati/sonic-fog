import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, Link } from 'react-router-dom';

import SignOutButton from './SignOutButton';
import CreateAccountModal from '../auth/CreateAccountModal';
import SignInModal from '../auth/SignInModal';
import { modalLogInOpen, modalSignUpOpen } from '../../store/modal';

import c from './NavBar.module.css';

const NavBar = ({ isLoaded }) => {
    const dispatch = useDispatch();
    const sessionUser = useSelector((state) => state.session.user);
    // let sessionLinks; we can just change line 30 to var and hoist awayyyyyyyyyyy

    const openLogin = () => dispatch(modalLogInOpen());
    const openSignup = () => dispatch(modalSignUpOpen());

    if (sessionUser && !sessionUser.errors) {
        // ONLY for signed in users
        var sessionLinks = (
            <div className={c.signedIn__menu}>
                <Link
                    exact
                    to={`/users/${sessionUser.display_name}`}
                    activeClassName={c.active}
                    className={c.nav_link_display_name}
                >
                    <span className={c.nav_display_name}>
                        {sessionUser.display_name}
                    </span>
                </Link>
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

    /* do i need this?
    <img
        src="/static/logo.jpg"
        alt="logo"
        className={c.nav_logo}
    ></img>
    */

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
                                    The Developers
                                </NavLink>
                            </li>
                        </ul>
                    </nav>
                </div>
                {/* comment in search bar when functionality is added */}
                {/* <div className={c.middle}>
                    <div>
                        <form>
                            <input type="search" placeholder="Noisy and Moist" />
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
