import React, { useEffect, useState } from 'react';

import SongTile from './SongTile';
import c from './LandingPage.module.css';

function LandingPage() {
    const [songs, setSongs] = useState([]);

    // grabs song art/info for display
    const getSongs = async () => {
        const res = await fetch(`/api/songs/get`);
        const data = await res.json();
        await setSongs(data.songs);
    };

    // runs on initial render
    useEffect(() => {
        getSongs();
    }, []);

    //
    useEffect(() => {}, []);

    return (
        <div className={c.content}>
            <div className={c.front}>
                <div className={c.front__content}>
                    <div className={c.front__container}>
                        <div className={c.front__carousel}>
                            <div
                                className={`${c.front__carouselContent} ${c.front__listenerSlide}`}
                                style={{ width: '33%' }}
                            ></div>
                            <div
                                className={`${c.front__carouselContent} ${c.front__creatorSlide}`}
                                style={{ width: '33%' }}
                            ></div>
                        </div>
                    </div>
                </div>
                <div className={c.front__carouselNav}></div>
                <h1>SONICFOG</h1>
            </div>
            <div>
                <div className={c.tracks}>
                    <div className={c.tracks__title}>
                        Hear what's trending for free in the SonicFog community
                    </div>
                    <div className={c.container}>
                        <ul className={c.ulist}>
                            <li className={c.list}>
                                {songs.map((song) => (
                                    <SongTile song={song} key={song.id} />
                                ))}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LandingPage;
