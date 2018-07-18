import React from 'react';
import s from './style.module.css';
import Platte from './Lieblingsplatte.svg';

export default function Lieblingsplatte() {
    return (
        <div className={s.container}>
            <img src={Platte} className={s.platte} />
        </div>
    );
}
