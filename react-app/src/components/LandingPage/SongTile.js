import React from "react";
import { NavLink } from "react-router-dom";

// import WaveFormControls from '../waveformControls';

import c from "./SongTile.module.css";

function SongTile({ song }) {
  const art = {
    background: `url(${song.cover_image})`,
    backgroundSize: "contain",
    height: "100%",
    width: "100%",
    // objectFit: 'contain',
    opacity: 1,
    // float: 'left',
  };

  return (
    <div className={c.container}>
      <div className={c.artwork}>
        <a href="/">
          <div className={c.artwork__image}>
            <div className={c.artwork__placeholder}>
              <span className={c.image} style={art} />
            </div>
          </div>
        </a>
      </div>
      <div className={c.description}>
        <div>
          <NavLink to={`/songs/${song.id}`}>{song.name}</NavLink>
        </div>
        <div>
          {/* <NavLink to={`/users/${song.user_id}`}> */}
          <NavLink to={`/songs/${song.id}`}>{song.artist}</NavLink>
        </div>
      </div>
    </div>
  );
}

export default SongTile;
