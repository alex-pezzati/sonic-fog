import React from 'react';

import DevCard from './DevCard';
import c from './DevInfo.module.css';

function DevInfo() {
    // dev info constants
    const RAYMOND = {
        NAME: 'Raymond-Arthur May',
        GITHUB: 'https://github.com/raymondmay95',
        LINKEDIN: 'https://www.linkedin.com/in/coderay//',
        PORTFOLIO: 'https://www.raymondmay.com',
    };

    const JAMIE = {
        NAME: 'Jamie Kichuk',
        GITHUB: 'https://github.com/JKLolling"',
        LINKEDIN: 'https://www.linkedin.com/in/jamie-kichuk-45778068/',
        PORTFOLIO: 'https://www.jkichuk.com',
    };

    const ALEX = {
        NAME: 'Alex Pezzati',
        GITHUB: 'https://github.com/alex-pezzati',
        LINKEDIN: 'https://www.linkedin.com/in/alex-pezzati/',
        PORTFOLIO: 'https://github.com/alex-pezzati',
    };

    const devs = [RAYMOND, JAMIE, ALEX];

    return (
        <div className={c.container}>
            {devs.map((dev) => (
                <DevCard dev={dev} key={dev.name} />
            ))}
        </div>
    );
}

export default DevInfo;
