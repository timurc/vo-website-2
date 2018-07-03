import React from 'react';
import s from './style.module.css';
import classNames from 'classnames';

const COUNT = 8000;
const TIME_TO_GROW = 5;
const INTERVAL = 10;
const GAPS = 5;

export default class FuchsUndWald extends React.Component {
    constructor(props) {
        super(props);

        this.forests = Array(INTERVAL).fill('');

        for (let i = 0; i <= COUNT; i++) {
            const forestIndex = Math.round(Math.random() * (INTERVAL + GAPS));

            this.forests.forEach((forest, index, forests) => {
                forests[index] = forest + (forestIndex === index ? '∧' : ' ');
            });
        }
    }
    render() {
        return (
            <div className={s.container}>
                {this.forests.map((forest, i) => {
                    return (
                        <div
                            key={i}
                            style={{ animationDelay: (TIME_TO_GROW / INTERVAL) * i + 's' }}
                            className={s.forest}
                        >
                            {forest}
                        </div>
                    );
                })}
            </div>
        );
    }
}
