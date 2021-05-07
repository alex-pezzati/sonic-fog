import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, Link } from 'react-router-dom';

import ProfileButton from './ProfileButton';

import LogoutButton from '../auth/LogoutButton';
import SignupFormModal from '../auth/SignupModal';
import LoginFormModal from '../auth/LoginModal';
import { modalLogInOpen, modalSignUpOpen } from '../../store/modal';

import c from './NavBar.module.css';

const NavBar = ({ isLoaded }) => {
    const dispatch = useDispatch();
    const sessionUser = useSelector((state) => state.session.user);
    // let sessionLinks; we can just change line 30 to var and hoist awayyyyyyyyyyy

    const openLogin = () => dispatch(modalLogInOpen());
    const openSignup = () => dispatch(modalSignUpOpen());

    // ONLY for logged in users
    if (sessionUser && !sessionUser.errors) {
        var sessionLinks = (
            <>
                <li className={c.nav_li_upload}>
                    <NavLink
                        exact
                        to="/upload"
                        activeClassName={c.active}
                        className={c.nav_link_upload}
                    >
                        Upload
                    </NavLink>
                </li>
                <li className={c.nav_li_display_name}>
                    <NavLink
                        exact
                        to={`/users/${sessionUser.display_name}`}
                        activeClassName={c.active}
                        className={c.nav_link_display_name}
                    >
                        <span className={c.nav_display_name}>
                            {sessionUser.display_name}
                        </span>
                    </NavLink>
                </li>
                <li className={c.nav_li_logout}>
                    <LogoutButton />
                </li>
                <li className={c.nav_li_credits}>
                    <ProfileButton user={sessionUser} />
                </li>
            </>
        );
        // ONLY for logged out users
    } else {
        sessionLinks = (
            <>
                <li className={c.nav_li_login}>
                    <button onClick={openLogin}>Log in</button>
                    <LoginFormModal />
                </li>
                <li className={c.nav_li_signup}>
                    <button onClick={openSignup}>Sign up</button>
                    <SignupFormModal />
                </li>
            </>
        );
    }

    // Regardless of logged in status...
    return (
        <header className={c.header}>
            <div className={c.container}>
                <div>
                    <div className={c.header__logo}>
                        <Link className={c.logo} to="/">
                            SonicFog
                        </Link>
                    </div>
                </div>
            </div>

            {/* <ul className={c.nav_content}>
                <li className={c.nav_li_logo}>
                    <img
                        src="/static/logo.jpg"
                        alt="logo"
                        className={c.nav_logo}
                    ></img>
                </li>
                <li className={c.nav_li_home}>
                    <NavLink
                        to="/"
                        exact={true}
                        activeClassName={c.active}
                        className={c.nav_link_home}
                    >
                        Home
                    </NavLink>
                </li>
                <li className={c.nav_li_search}>
                    <input type="search" placeholder="Noisy and Moist" />
                </li>
            </ul> */}
            {/* {isLoaded && sessionLinks} */}
        </header>
    );
};

export default NavBar;
