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
            <div className={c.name}>{dev.NAME}</div>
            <div>
                <a href={dev.GITHUB} rel="noopener noreferrer" target="_blank">
                    GitHub
                </a>
            </div>
            <div>
                <a
                    href={dev.LINKEDIN}
                    rel="noopener noreferrer"
                    target="_blank"
                >
                    LinkedIn
                </a>
            </div>
            <div>
                <a
                    href={dev.PORTFOLIO}
                    rel="noopener noreferrer"
                    target="_blank"
                >
                    Personal Site
                </a>
            </div>
        </div>
    );
};

export default DevCard;
