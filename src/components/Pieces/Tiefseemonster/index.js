import React from 'react';
import { throttle } from 'lodash';
import s from './style.module.css';

export default {
    component: class Tiefseemonster extends React.Component {
        constructor(props) {
            super(props);
        }
        render() {
            return <div className={s.sea} />;
        }
    },
};
