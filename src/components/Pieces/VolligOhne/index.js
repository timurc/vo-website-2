import React from 'react';
import s from './style.module.css';

import Luise from './luise.png';
import Timur from './timur.png';

export default function() {
    return (
        <div className={s.container}>
            <img className={s.portrait} src={Luise} />
            <img className={s.portrait} src={Timur} />
        </div>
    );
}
