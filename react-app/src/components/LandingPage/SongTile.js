import React from 'react';
import { Link } from 'react-router-dom';

import c from './SongTile.module.css';

const SongTile = ({ song }) => {
    const art = {
        background: `url(${song.cover_image}) `,
        backgroundSize: 'contain',
    };

    return (
        <div className={c.container}>
            <div className={c.artwork}>
                <Link to={`/songs/${song.id}`}>
                    <div className={c.artwork__image}>
                        <div className={c.artwork__placeholder}>
                            <span className={c.image} style={art}></span>
                        </div>
                    </div>
                </Link>
                <div className={c.playButton__container}>
                    <a className={c.playButton} role="button">
                        Play
                    </a>
                </div>
            </div>
            <div className={c.description}>
                <div className={c.description__song}>
                    <Link className={c.song__name} to={`/songs/${song.id}`}>
                        {song.name.toUpperCase()}
                    </Link>
                </div>
                <div className={c.description__artist}>
                    {/* <Link
                        className={c.artist__name}
                        to={`/users/${song.user_id}`}
                    >
                        {song.artist}
                    </Link> */}
                    <Link className={c.artist__name} to={`/songs/${song.id}`}>
                        {song.artist}
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SongTile;
