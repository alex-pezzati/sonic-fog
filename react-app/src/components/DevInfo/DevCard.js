import React from 'react';

import c from './DevCard.module.css';

const DevCard = ({ dev }) => {
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
                    <div className={c.personal}>Personal Site</div>
                </a>
            </div>
        </div>
    );
};

export default DevCard;
