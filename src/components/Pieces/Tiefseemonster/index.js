import React from 'react';
import { throttle } from 'lodash';
import s from './style.module.css';

import Kiste from './Kiste';
const kisteArmStates = ['', 'L', 'R'];

export class Tiefseemonster extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            kisteArm: 0,
            kistePosition: getTransform(100, 100),
        };

        this.interval = setInterval(() => {
            this.setState({ kisteArm: this.state.kisteArm + 1 });
        }, 3000);
    }
    componentWillUnmount() {
        clearInterval(this.interval);
        this.containerEl.parentElement.removeEventListener('mousemove', this.setKisteThrottled);
        this.setKisteThrottled.cancel();
    }
    componentDidMount() {
        this.containerEl.parentElement.addEventListener('mousemove', this.setKisteThrottled);
    }
    setKisteThrottled = throttle(event => {
        this.setKiste({
            y: event.pageY - this.containerEl.parentElement.offsetTop,
            x: event.pageX - this.containerEl.parentElement.offsetLeft,
        });
    }, 1000);
    setKiste({ x, y }) {
        this.setState({ kistePosition: getTransform(x, y) });
    }
    render() {
        return (
            <div className={s.container} ref={c => (this.containerEl = c)}>
                <div style={this.state.kistePosition} className={s.kiste}>
                    <Kiste raiseArm={kisteArmStates[this.state.kisteArm % kisteArmStates.length]} />
                </div>
            </div>
        );
    }
}

function getTransform(x, y) {
    return { transform: `translate(${x}px, ${y}px)` };
}