import React from 'react';
import s from './style.module.css';
import classNames from 'classnames';

const COUNT = 8000;
const TIME_TO_GROW = 5;
const INTERVAL = 10;
const GAPS = 2;

export default class FuchsUndWald extends React.Component {
    constructor(props) {
        super(props);

        this.forest = Array(COUNT)
            .fill(0)
            .map(tree => {
                return Math.random();
            });
    }
    render() {
        const forests = [];
        const steps = 1 / INTERVAL;

        for (let i = 0; i <= INTERVAL - GAPS; i++) {
            const forestMin = steps * i;
            const forestMax = steps * (i + 1);
            const delay = steps * i * TIME_TO_GROW + 's';

            forests.push(
                <div key={i} style={{ animationDelay: delay }} className={s.forest}>
                    {getForest(this.forest, forestMin, forestMax)}
                </div>
            );
        }
        return <div className={s.container}>{forests}</div>;
    }
}

function getForest(forest, forestMin, forestMax) {
    return forest
        .map(tree => {
            return tree > forestMin && tree < forestMax ? '∧' : ' ';
        })
        .join('');
}
