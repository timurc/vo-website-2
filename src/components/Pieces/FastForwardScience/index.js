import React from 'react';
import s from './style.module.css';
import video from './videoloop-small.mp4';

function FastForward() {
    return (
        <div className={s.container}>
            <video className={s.video} loop autoPlay>
                <source src={video} type="video/mp4" />
            </video>
        </div>
    );
}

export default (FastForward = { component: FastForward, fullScreen: true });
