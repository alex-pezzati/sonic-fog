import React from 'react';
import { NavLink } from 'react-router-dom'

import c from './SongTile.module.css'

function SongTile({ song }) {


    const art = {
        background: `url(${song.cover_image})`,
        backgroundSize: 'contain',
        height: '100%',
        width: '100%',
        // objectFit: 'contain',
        opacity: 1,
        // float: 'left',
    }


    return (
        <div className={c.container}>
            <div className={c.artwork}>
                <a>
                    <div className={c.artwork__image}>
                        <div className={c.artwork__placeholder}>
                            <span  className={c.image} style={art}/>
                        </div>
                    </div>
                </a>
            </div>
            <div className={c.description}>
                <div>
                    <NavLink to='/songs/songId'>
                        {song.name}
                    </ NavLink>
                </div>
                <div>
                    <NavLink to='/users/artist'>
                        {song.artist}
                    </ NavLink>
                </div>
            </div>
        </div>
    )
}

export default SongTile;
