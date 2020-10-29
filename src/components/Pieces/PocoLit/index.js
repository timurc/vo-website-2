import React, { useEffect, useRef } from 'react';
import s from './style.module.less';
import BOUNDARY from '!svg-inline-loader!./boundary.svg';

const SQUARES_COUNT = 100;

const COLORS = ['#ceb9d1', '#1e5166', '#a0cfaf', '#eda37b'];

export default {
    component: function() {
        const boundaryContainer = useRef(null);
        const squaresContainer = useRef(null);

        useEffect(() => {
            boundaryContainer.current.innerHTML = BOUNDARY;
            const svg = document.querySelector('#decoration_main svg');
            const measuringPoint = svg.createSVGPoint();
            const boundaryPath = svg.querySelector('path');

            const points = [];

            for (let i = 0; i < SQUARES_COUNT; ) {
                measuringPoint.x = Math.random() * svg.viewBox.baseVal.width;
                measuringPoint.y = Math.random() * svg.viewBox.baseVal.height;
                if (boundaryPath.isPointInFill(measuringPoint)) {
                    i++;
                    points.push({ x: measuringPoint.x, y: measuringPoint.y });
                }
            }

            points.forEach(({ x, y }) => {
                const square = document.createElement('div');
                square.classList.add(s.square);
                square.style.left = (x / svg.viewBox.baseVal.width) * 100 + '%';
                square.style.top = (y / svg.viewBox.baseVal.height) * 100 + '%';
                square.style.backgroundColor = pickRandom(COLORS);
                square.addEventListener('mouseenter', changeColorRandomly);
                square.addEventListener('touchstart', changeColorRandomly);
                squaresContainer.current.appendChild(square);
            });
        }, []);
        return (
            <div id="decoration_main" className={s.decoration}>
                <div className={s.boundary} ref={boundaryContainer} />
                <div className={s.squares} ref={squaresContainer} />
            </div>
        );
    },
};

function changeColorRandomly({ target }) {
    const withoutCurrentColor = COLORS.filter(color => color !== RGBToHex(target.style.backgroundColor));
    target.style.backgroundColor = pickRandom(withoutCurrentColor);
}

function pickRandom(array) {
    return array[Math.round(Math.random() * (array.length - 1))];
}

// https://css-tricks.com/converting-color-spaces-in-javascript/
function RGBToHex(rgb) {
    // Choose correct separator
    let sep = rgb.indexOf(',') > -1 ? ',' : ' ';
    // Turn "rgb(r,g,b)" into [r,g,b]
    rgb = rgb
        .substr(4)
        .split(')')[0]
        .split(sep);

    let r = (+rgb[0]).toString(16),
        g = (+rgb[1]).toString(16),
        b = (+rgb[2]).toString(16);

    if (r.length == 1) r = '0' + r;
    if (g.length == 1) g = '0' + g;
    if (b.length == 1) b = '0' + b;

    return '#' + r + g + b;
}
