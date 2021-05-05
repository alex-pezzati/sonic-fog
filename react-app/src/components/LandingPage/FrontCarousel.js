import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import { modalLogInOpen } from '../../store/modal';

import FrontNav from './FrontNav';

import c from './FrontCarousel.module.css';

export default function FrontCarousel() {
    const [activeSlide, setActiveSlide] = useState(0);
    const dispatch = useDispatch();
    const openLoginModal = () => dispatch(modalLogInOpen());

    /* TODO:
        --bug on selecting slides manually:
            when it tries to reset to slide 0, style on circle shifts
            to transparent temporarily before refilling, then iterating
        --carousel styling code refactoring
        --site developers buttons need to linked up to routes
    */

    // carousel slide transition styling
    const styleSlide0 = {
        transform: 'translateX(0%)',
        // transition: 'transform 0.6s ease-in-out 0s',
        width: '300%',
    };
    const styleSlide1 = {
        transform: 'translateX(-33.3333%)',
        transition: 'transform 0.6s ease-in-out 0s',
        width: '300%',
    };
    const styleSlide2 = {
        transform: 'translateX(-66.6667%)',
        transition: 'transform 0.6s ease-in-out 0s',
        width: '300%',
    };

    // carousel iteration helper
    const carouselSlideHandler = useCallback(() => {
        if (activeSlide === 1 || activeSlide === 2) {
            setActiveSlide(2);
            setTimeout(() => {
                setActiveSlide(0);
            }, 601);
        }
        setActiveSlide(activeSlide + 1);
    }, [activeSlide]);

    // carousel iteration interval
    useEffect(() => {
        const interval = setInterval(() => {
            carouselSlideHandler();
        }, 5000);
        return () => {
            clearInterval(interval);
        };
    }, [carouselSlideHandler]);

    // carousel nav transition styling
    const navDotStyleFilled = { background: 'rgb(255, 255, 255)' };
    const navDotStyleTransparent = { background: 'transparent' };

    return (
        <div className={c.position}>
            <div className={c.content}>
                <div className={c.container}>
                    <div
                        className={c.slides}
                        style={
                            activeSlide === 0
                                ? styleSlide0
                                : activeSlide === 1
                                ? styleSlide1
                                : styleSlide2
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
                                <button
                                    className={c.slideButton}
                                    onClick={openLoginModal}
                                >
                                    Try it!
                                </button>
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
                                <Link className={c.slideButton} to="/">
                                    Site Developers
                                </Link>
                            </div>
                        </div>
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
                                <button
                                    className={c.slideButton}
                                    onClick={openLoginModal}
                                >
                                    Try it!
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className={c.nav}>
                        <div
                            className={c.navDot}
                            onClick={(e) => setActiveSlide(2)}
                            style={
                                activeSlide === 0 || activeSlide === 2
                                    ? navDotStyleFilled
                                    : navDotStyleTransparent
                            }
                        ></div>
                        <div
                            className={c.navDot}
                            onClick={(e) => setActiveSlide(1)}
                            style={
                                activeSlide === 1
                                    ? navDotStyleFilled
                                    : navDotStyleTransparent
                            }
                        ></div>
                    </div>
                </div>
                <h1 className={c.logo}>SONICFOG</h1>
                <FrontNav />
            </div>
        </div>
    );
}
