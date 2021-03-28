import React, { useEffect, useState } from 'react';

import SongTile from './SongTile';

function LandingPage() {
    const [songs, setSongs] = useState([]);

    const getSongs = async () => {
        const res = await fetch(`/api/songs/get`);
        const data = await res.json();
        await setSongs(data.songs);
    }


    useEffect(() => {
        getSongs();
        // not sure i need a cleanup; will revisit
        // return () => {
        //     cleanup
        // }
    }, [])


    return (
        <div>
            <h1>Test Sonic Fog</h1>
            <div>
                <h1>
                    logo here
                </h1>
                carousel in here
            </div>
            <div>
                songs container
                <div>
                    songs trunk
                    <div>
                        Here's what's trending for free in the SonicFog community
                    </div>
                    <div>
                        <ul>
                            <li>
                                {songs.map(song => (
                                    <SongTile song={song} key={song.id}/>
                                ))}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default LandingPage;
