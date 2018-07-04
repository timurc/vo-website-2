import React from 'react';
import s from './style.module.css';
import video from './videoloop-small.mp4';

export default function() {
    return (
        <div className={s.container}>
            <video className={s.video} loop autoPlay>
                <source src={video} type="video/mp4" />
            </video>
        </div>
    );
}
