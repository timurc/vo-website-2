import React from 'react';
import classNames from 'classnames';
import s from './style.module.less';

export default function Img({ srcSet, base64, className, aspectRatio, sizes = 'calc(100vw - 20rem)' }) {
    return (
        <div style={{ paddingBottom: `${100 / aspectRatio}%` }} className={classNames(className, s.container)}>
            <img className={s.image} sizes={sizes} src={base64} srcSet={srcSet} />
        </div>
    );
}
