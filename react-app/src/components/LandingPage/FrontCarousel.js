import React, { useEffect, useState } from 'react';

import FrontNav from './FrontNav';

import c from './FrontCarousel.module.css';

export default function FrontCarousel() {
    const [activeSlide, setActiveSlide] = useState(0);

    /* TODO:
        --carousel styling refactoring
        --carousel iteration refactoring
        --carousel active slide buttons + function
        --add DEMO USER BUTTON
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
                }, 600);
            }
            setActiveSlide(activeSlide + 1);
        }, 4000);

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
                        ></div>
                        <div
                            className={`${c.slides__content} ${c.slide__creator}`}
                            style={{ width: '34%' }}
                        ></div>
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
