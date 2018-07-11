import React from 'react';
import s from './style.module.css';

const animations = [
    require('./animation-1.gif'),
    require('./animation-2.gif'),
    require('./animation-3.gif'),
    require('./animation-4.gif'),
    require('./animation-5.gif'),
    require('./animation-6.gif'),
];

export default class TimoBecker extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        console.log(s);
        return (
            <div className={s.container}>
                {animations.map((animation, index) => <img key={index} className={s.animation} src={animation} />)}
            </div>
        );
    }
}
