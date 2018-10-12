import React from 'react';
import classNames from 'classnames';
import s from './style.module.less';

export default function Img({ srcSet, base64, className, aspectRatio, sizes }) {
    return (
        <div style={{ paddingBottom: `${100 / aspectRatio}%` }} className={classNames(className, s.container)}>
            <ImgInner className={s.image} sizes={sizes} src={base64} srcSet={srcSet} />
        </div>
    );
}

export function ImgInner({ srcSet, src, className, sizes = 'calc(100vw - 20rem)' }) {
    return <img className={className} sizes={sizes} src={src} srcSet={srcSet} />;
}