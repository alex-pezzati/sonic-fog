// frontend/src/components/Navigation/ProfileButton.js
import React, { useState, useEffect } from "react";
// import * as sessionActions from '../../store/session';
import './ProfileButton.css'

function ProfileButton({ user }) {
  const [showMenu, setShowMenu] = useState(false);

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = () => {
      setShowMenu(false);
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  // const logout = (e) => {
  //   e.preventDefault();
  //   dispatch(sessionActions.logout());
  // };

  return (
    <div className='profileButton_wrapper'>
      <button onClick={openMenu} className='userButton'>
        <i className={"fas fa-ellipsis-v"}></i>
      </button>
      {showMenu && (
        <ul className="profile-dropdown">
          <b>Made By:</b>
          <li>Jamie Kichuk</li>
          <li>Alex Pezzati</li>
          <li>Raymond-Arthur May</li>
          <li>Chou Fomenky</li>
        </ul>
      )}
    </div>
  );
}

export default ProfileButton;
