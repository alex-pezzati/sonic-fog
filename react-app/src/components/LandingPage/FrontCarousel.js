import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import FrontNav from './FrontNav';

import c from './FrontCarousel.module.css';

export default function FrontCarousel() {
    const [activeSlide, setActiveSlide] = useState(0);

    /* TODO:
        --carousel styling refactoring
        --carousel iteration refactoring
        --carousel active slide buttons + function
    */

    // carousel slide transition styling
    const style0 = {
        transform: 'translateX(0%)',
        width: '300%',
    };
    const style1 = {
        transform: 'translateX(-33.3333%)',
        transition: 'transform 0.6s ease-in-out 0s',
        width: '300%',
    };
    const style2 = {
        transform: 'translateX(-66.6667%)',
        transition: 'transform 0.6s ease-in-out 0s',
        width: '300%',
    };

    // carousel iteration
    useEffect(() => {
        const interval = setInterval(() => {
            if (activeSlide === 1) {
                setActiveSlide(activeSlide + 1);
                setTimeout(() => {
                    setActiveSlide(0);
                }, 601);
            }
            setActiveSlide(activeSlide + 1);
        }, 5000);

        return () => {
            clearInterval(interval);
        };
    }, [activeSlide]);

    return (
        <div className={c.position}>
            <div className={c.content}>
                <div className={c.container}>
                    <div
                        className={c.slides}
                        style={
                            activeSlide === 0
                                ? style0
                                : activeSlide === 1
                                ? style1
                                : style2
                        }
                    >
                        <div
                            className={`${c.slides__content} ${c.slide__listener}`}
                            style={{ width: '34%' }}
                        >
                            <h2 className={c.title}>
                                Discover music with SonicFog
                            </h2>
                            <p className={c.tagline}>
                                SonicFog lets you listen to your favorite music,
                                with an ever growing library of more artists and
                                tracks!
                            </p>
                            <div>
                                <Link to="/">Try it</Link>
                            </div>
                        </div>
                        <div
                            className={`${c.slides__content} ${c.slide__creator}`}
                            style={{ width: '34%' }}
                        >
                            <h2 className={c.title}>Site Developers</h2>
                            <p className={c.tagline}>
                                Checkout the developers behind SonicFog, a clone
                                of SoundCloud!
                            </p>
                            <div>
                                <Link to="/">Site Developers</Link>
                            </div>
                        </div>
                        <div
                            className={`${c.slides__content} ${c.slide__listener}`}
                            style={{ width: '34%' }}
                        ></div>
                    </div>
                    <div className={c.carouselNav}></div>
                </div>
                <h1 className={c.logo}>SONICFOG</h1>
                <FrontNav />
            </div>
        </div>
    );
}
