import React from 'react';
import s from './style.module.css';

import Kiste from './Kiste';
const kisteArmStates = ['', 'L', 'R'];

export class Tiefseemonster extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            kisteArm: 0,
        };

        this.interval = setInterval(() => {
            this.setState({ kisteArm: this.state.kisteArm + 1 });
        }, 5000);
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }
    render() {
        return (
            <div className={s.container}>
                <Kiste raiseArm={kisteArmStates[this.state.kisteArm % kisteArmStates.length]} />
            </div>
        );
    }
}
