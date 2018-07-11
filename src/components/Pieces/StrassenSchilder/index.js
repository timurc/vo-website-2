import React from 'react';
import s from './style.module.css';

import Background from './background.png';

export default class TimoBecker extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return <div className={s.container} style={{ backgroundImage: `url(${Background})` }} />;
    }
}
