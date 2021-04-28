import React, { useEffect, useState } from 'react';

import SongTile from './SongTile';
import c from './LandingPage.module.css';

function LandingPage() {
    const [songs, setSongs] = useState([]);

    const getSongs = async () => {
        const res = await fetch(`/api/songs/get`);
        const data = await res.json();
        await setSongs(data.songs);
    };

    useEffect(() => {
        getSongs();
    }, []);

    return (
        <div className={c.content}>
            <h1>Test Sonic Fog</h1>
            <div>
                <h1>logo here</h1>
                carousel in here
            </div>
            <div>
                <div>songs container</div>
                <div className={c.tracks}>
                    songs trunk
                    <div>
                        Here's what's trending for free in the SonicFog
                        community
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
