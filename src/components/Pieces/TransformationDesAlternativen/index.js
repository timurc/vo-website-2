import React from 'react';
import s from './style.module.less';

import Klecks from './klecks.gif';

export default {
    component: class TransformationDesAlternativen extends React.Component {
        constructor(props) {
            super(props);
            this.kleckse = Array.from({ length: 10 }, () => {
                return { top: getRandomDistance(), left: getRandomDistance() };
            });
        }
        render() {
            return (
                <div className={s.container}>
                    {this.kleckse.map((klecksStyle, index) => (
                        <img key={index} style={klecksStyle} className={s.klecks} src={Klecks} />
                    ))}
                </div>
            );
        }
    },
};

function getRandomDistance() {
    return Math.floor(Math.random() * 100) + '%';
}
