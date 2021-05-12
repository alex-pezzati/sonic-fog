import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux'
import {setActiveSongData, playSong, pauseSong} from '../../store/song'

import c from './SongTile.module.css';

const SongTile = ({ song }) => {
    const art = {
        background: `url(${song.cover_image}) `,
        backgroundSize: 'contain',
    };

    const [isPlaying, setIsPlaying] = useState(false)

    const dispatch = useDispatch()
    const storeSongData = useSelector(store => store.song)

    // If this song is the active song, set the button to pause
    // If it is not, set the button to play
    //  - This is here to ensure that if a user switches to another song, then the previous song's waveform updates it's play button.
    useEffect(() => {
      if (storeSongData?.activeSongId === song.id && storeSongData.isPlaying) {
        // playButtonRef.current.innerText = "||";
        setIsPlaying(true)
      } else if (isPlaying) {
        // playButtonRef.current.innerText = "▶";
        setIsPlaying(false)
      }
    // eslint-disable-next-line
    }, [storeSongData, song]);

    // When the user clicks the play/pause button...
    const togglePlaying = async (e) => {
      // ...Make this song the active song if it isn't already
      if (storeSongData?.activeSongId !== song.id) {
        dispatch(setActiveSongData(song.id, song.url, song.name, song.cover_image, song.artist));
      }

      // Pause or play the song as needed
      if (!isPlaying){
        dispatch(playSong());
      }
      else {
        dispatch(pauseSong())
      }
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
                <div className={isPlaying ? c.playButton__container_visible : c.playButton__container }>
                    <div className={isPlaying ? `${c.playButton} ${c.pauseButton}` : `${c.playButton}`} onClick={togglePlaying} role="button">
                        Play
                    </div>
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
