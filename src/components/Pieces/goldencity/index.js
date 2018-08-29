import React from 'react';
import s from './style.module.css';
import boa from './boa.png';

export default {
    component: function() {
        return <div style={{ backgroundImage: `url(${boa})` }} className={s.boa} />;
    },
};
