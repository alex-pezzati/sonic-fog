import React, { useEffect, useState } from 'react';

import SongTile from './SongTile';
import c from './LandingPage.module.css';

function LandingPage() {
    const [activeSlide, setActiveSlide] = useState(1);
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

    // carousel iteration

    const style1 = {
        transform: 'translateX(0%)',
        transition: 'transform 0.6s ease-in-out 0s',
        width: '300%',
    };
    const style2 = {
        transform: 'translateX(-33.3333%)',
        transition: 'transform 0.6s ease-in-out 0s',
        width: '300%',
    };
    const style3 = {
        transform: 'translateX(-66.6667%)',
        transition: 'transform 0.6s ease-in-out 0s',
        width: '300%',
    };

    const carouselSlideChange = () => {};

    useEffect(() => {
        const interval = setInterval(() => {
            if (activeSlide == 3) {
                setActiveSlide(0);
            } else {
                setActiveSlide(activeSlide + 1);
            }
        }, 5000);

        return () => {
            clearInterval(interval);
        };
    }, [activeSlide]);

    return (
        <div className={c.content}>
            <div className={c.front}>
                <div className={c.front__content}>
                    <div className={c.front__container}>
                        <div
                            className={c.front__carousel}
                            style={activeSlide == 1 ? style1 : style2}
                        >
                            <div
                                className={`${c.front__carouselContent} ${c.front__listenerSlide}`}
                                style={{ width: '33%' }}
                            ></div>
                            <div
                                className={`${c.front__carouselContent} ${c.front__creatorSlide}`}
                                style={{ width: '33%' }}
                            ></div>
                            <div
                                className={`${c.front__carouselContent} ${c.front__listenerSlide}`}
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
