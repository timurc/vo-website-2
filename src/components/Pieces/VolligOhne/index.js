import React from 'react';
import s from './style.module.css';

import Luise from './luise.jpg';
import Timur from './timur.jpg';

export default {
    component: function() {
        return (
            <div className={s.container}>
                <img className={s.portrait} src={Luise} />
                <img className={s.portrait} src={Timur} />
            </div>
        );
    },
};
