import React from 'react';
import s from './style.module.css';
import frame from './frame.svg';

export default {
    component: function() {
        console.log('schnapp');
        return (
            <div className={s.container}>
                <div className={s.k} />
                <div className={s.s}>
                    <div className={s.sInner}>
                        <div className={s.sLeft} />
                        <div className={s.sMiddle} />
                        <div className={s.sRight} />
                    </div>
                </div>
            </div>
        );
    },
};
