import React from 'react';

import c from './DevCard.module.css';

const DevCard = ({ dev }) => {
    /* TODO:
        -- settle on proper icons (svg) for hover effect to work consistently
        -- not sure what else
    */

    return (
        <div className={c.container}>
            <div className={c.picture__container}>
                <img
                    className={c.picture}
                    src={`${dev.PICTURE}`}
                    alt={''}
                ></img>
            </div>
            <h3 className={c.name}>{dev.NAME}</h3>
            <div className={c.line}></div>
            <div className={c.links__container}>
                <a href={dev.GITHUB} rel="noopener noreferrer" target="_blank">
                    <div className={c.github}></div>
                </a>
                <a
                    href={dev.LINKEDIN}
                    rel="noopener noreferrer"
                    target="_blank"
                >
                    <div className={c.linkedin}></div>
                </a>
                <a
                    href={dev.PORTFOLIO}
                    rel="noopener noreferrer"
                    target="_blank"
                >
                    <div className={c.personal}></div>
                </a>
                <a
                    href={`mailto:${dev.EMAIL}`}
                    rel="noopener noreferrer"
                    target="_blank"
                >
                    <div className={c.email}></div>
                </a>
            </div>
            <div className={c.line}></div>
        </div>
    );
};

export default DevCard;
