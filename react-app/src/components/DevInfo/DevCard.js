import React from 'react';

import c from './DevCard.module.css';

const DevCard = ({ dev }) => {
    return (
        <div className={c.container}>
            <img className={c.picture} src={`${dev.PICTURE}`}></img>
            <div>{dev.NAME}</div>
            <div>{dev.GITHUB}</div>
            <div>{dev.LINKEDIN}</div>
            <div>{dev.PORTFOLIO}</div>
        </div>
    );
    // <div className={classes.parent}>
    //     <div className={classes.outer}>
    //         <fieldset className={(classes.fieldset, classes.Alex)}>
    //             <legend className={classes.legend}>Alex Pezzati</legend>
    //             <ul>
    //                 <li>
    //                     <a
    //                         rel="noopener noreferrer"
    //                         target="_blank"
    //                         href="https://github.com/alex-pezzati"
    //                     >
    //                         GitHub
    //                     </a>
    //                 </li>
    //                 <li>
    //                     <a
    //                         rel="noopener noreferrer"
    //                         target="_blank"
    //                         href="https://www.linkedin.com/"
    //                     >
    //                         LinkedIn
    //                     </a>
    //                 </li>
    //                 <li>
    //                     <a
    //                         rel="noopener noreferrer"
    //                         target="_blank"
    //                         href="https://www.google.com"
    //                     >
    //                         Personal Site
    //                     </a>
    //                 </li>
    //             </ul>
    //         </fieldset>
    //         <fieldset className={(classes.fieldset, classes.Jamie)}>
    //             <legend className={classes.legend}>Jamie Kichuk</legend>
    //             <ul>
    //                 <li>
    //                     <a
    //                         rel="noopener noreferrer"
    //                         target="_blank"
    //                         href="https://github.com/JKLolling"
    //                     >
    //                         GitHub
    //                     </a>
    //                 </li>
    //                 <li>
    //                     <a
    //                         rel="noopener noreferrer"
    //                         target="_blank"
    //                         href="https://www.linkedin.com/in/jamie-kichuk-45778068/"
    //                     >
    //                         LinkedIn
    //                     </a>
    //                 </li>
    //                 <li>
    //                     <a
    //                         rel="noopener noreferrer"
    //                         target="_blank"
    //                         href="https://www.jkichuk.com"
    //                     >
    //                         Personal Site
    //                     </a>
    //                 </li>
    //             </ul>
    //         </fieldset>
    //         <fieldset className={(classes.fieldset, classes.Raymond)}>
    //             <legend className={classes.legend}>
    //                 Raymond-Arthur May
    //             </legend>
    //             <ul>
    //                 <li>
    //                     <a
    //                         rel="noopener noreferrer"
    //                         target="_blank"
    //                         href="https://github.com/raymondmay95"
    //                     >
    //                         GitHub
    //                     </a>
    //                 </li>
    //                 <li>
    //                     <a
    //                         rel="noopener noreferrer"
    //                         target="_blank"
    //                         href="https://www.linkedin.com/in/coderay/"
    //                     >
    //                         LinkedIn
    //                     </a>
    //                 </li>
    //                 <li>
    //                     <a
    //                         rel="noopener noreferrer"
    //                         target="_blank"
    //                         href="https://www.raymondmay.com"
    //                     >
    //                         Personal Site
    //                     </a>
    //                 </li>
    //             </ul>
    //         </fieldset>
    //     </div>
    // </div>
};

export default DevCard;
