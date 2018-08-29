import React from 'react';
import { throttle } from 'lodash';
import s from './style.module.css';

export default {
    component: class Vostel extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                hearts: [],
            };

            this.sparkHeartsThrottled = throttle(event => {
                this.sparkHearts({
                    y: event.pageY - this.containerEl.parentElement.offsetTop,
                    x: event.pageX - this.containerEl.parentElement.offsetLeft,
                });
            }, 200);
        }
        componentWillUnmount() {
            window.removeEventListener('mousemove', this.sparkHeartsThrottled);
            this.sparkHeartsThrottled.cancel();
        }
        componentDidMount() {
            window.addEventListener('mousemove', this.sparkHeartsThrottled);
        }
        sparkHearts({ x, y }) {
            if (x > 0 && y > 0) {
                this.state.hearts.push({ x: x, y: y });
                this.setState({ hearts: this.state.hearts });
            }
        }
        render() {
            return (
                <div className={s.container} ref={c => (this.containerEl = c)}>
                    {this.state.hearts.map((heart, index) => (
                        <div key={index} className={s.heart} style={{ top: `${heart.y}px`, left: `${heart.x}px` }}>
                            <div className={s.heartInner} />
                        </div>
                    ))}
                </div>
            );
        }
    },
};

function getTransform(x, y) {
    return { transform: `translate(${x}px, ${y}px)` };
}
