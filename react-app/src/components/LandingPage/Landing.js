import React, { useEffect, useState } from 'react';

import {useSelector} from 'react-redux'

import FrontCarousel from './FrontCarousel';
import SongTile from './SongTile';
import c from './Landing.module.css';

const Landing = () => {
    const [songs, setSongs] = useState([]);

    const storeSongData = useSelector(store => store.song)

    // grabs song art/info for display
    const getSongs = async () => {
        const res = await fetch(`/api/songs/get`);
        const data = await res.json();
        await setSongs(data.songs);
    };

    // runs on initial render
    useEffect(() => {
      (async() => {
        if(storeSongData?.keyword){
          const res = await fetch(`/api/songs/${storeSongData.keyword}`)
          const data = await res.json()
          setSongs(data.songs)
        } else {
          getSongs();
        }
      })()
    }, [storeSongData]);

    return (
        <div className={c.content}>
            <FrontCarousel />
            <div>
                <div className={c.tracks}>
                    <div className={c.tracks__title}>
                        Hear what's trending for free in the SonicFog community
                    </div>
                    <div className={c.container}>
                        <ul className={c.ulist}>
                            {songs.map((song) => (
                                <li className={c.list} key={song.name}>
                                    <SongTile song={song} key={song.id} />
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Landing;
