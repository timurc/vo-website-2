import React from 'react';
import s from './style.module.css';

const CHAR_WIDTH = 13;
const LINE_HEIGHT = 23;

const COUNT = 3000;
const TIME_TO_GROW = 5;
const INTERVAL = 5;
const GAPS = 5;

export default class FuchsUndWald extends React.Component {
    constructor(props) {
        super(props);
        this.state = { forests: false };
    }
    componentDidMount() {
        const count = Math.round(
            (this.containerEl.offsetWidth / CHAR_WIDTH) * (this.containerEl.offsetHeight / LINE_HEIGHT)
        );

        const forests = Array(INTERVAL).fill('');

        for (let i = 0; i <= count; i++) {
            const forestIndex = Math.round(Math.random() * (INTERVAL + GAPS));

            forests.forEach((forest, index, forests) => {
                forests[index] = forest + (forestIndex === index ? '∧' : ' ');
            });
        }

        this.setState({ forests: forests });
    }
    render() {
        return (
            <div className={s.container} ref={c => (this.containerEl = c)}>
                {this.state.forests &&
                    this.state.forests.map((forest, i) => {
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
