import React from 'react';

import DevCard from './DevCard';
import c from './DevInfo.module.css';

function DevInfo() {
    // dev info constants
    // PICTURE => github profile picture; should live update here!
    const RAYMOND = {
        NAME: 'Raymond-Arthur May',
        PICTURE: 'https://avatars.githubusercontent.com/u/67204493?v=4',
        GITHUB: 'https://github.com/raymondmay95',
        LINKEDIN: 'https://www.linkedin.com/in/coderay',
        PORTFOLIO: 'https://www.raymondmay.com',
        EMAIL: 'raymond.may.95@outlook.com',
    };

    const JAMIE = {
        NAME: 'Jamie Kichuk',
        PICTURE: 'https://avatars.githubusercontent.com/u/24994328?v=4',
        GITHUB: 'https://github.com/JKLolling',
        LINKEDIN: 'https://www.linkedin.com/in/jamie-kichuk-45778068',
        PORTFOLIO: 'https://www.jkichuk.com',
        EMAIL: 'jckichuk@gmail.com',
    };

    const ALEX = {
        NAME: 'Alex Pezzati',
        PICTURE: 'https://avatars.githubusercontent.com/u/58381081?v=4',
        GITHUB: 'https://github.com/alex-pezzati',
        LINKEDIN: 'https://www.linkedin.com/in/alex-pezzati',
        PORTFOLIO: 'https://github.com/alex-pezzati',
        EMAIL: 'aapezzati@gmail.com',
    };

    const devs = [RAYMOND, JAMIE, ALEX];

    return (
        <>
            <h1 className={c.header}>Meet The Devs Behind SonicFog!</h1>
            <div className={c.container}>
                {devs.map((dev) => (
                    <DevCard dev={dev} key={dev.name} />
                ))}
            </div>
        </>
    );
}

export default DevInfo;
