import React from 'react';
import { throttle } from 'lodash';
import s from './style.module.css';

const MAX_HEART_COUNT = 200;

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

                this.addRandom();
            }, 200);
        }
        componentWillUnmount() {
            window.removeEventListener('mousemove', this.sparkHeartsThrottled);
            this.sparkHeartsThrottled.cancel();
            clearTimeout(this.timer);
        }
        componentDidMount() {
            window.addEventListener('mousemove', this.sparkHeartsThrottled);
            this.addRandom();
        }
        addRandom() {
            if (this.timer) {
                clearTimeout(this.timer);
            }
            this.timer = setTimeout(() => {
                this.addRandom();
                this.sparkHearts({
                    x: this.containerEl.offsetWidth * Math.random(),
                    y: this.containerEl.offsetHeight * Math.random(),
                });
            }, 2800);
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
                        <React.Fragment key={index}>
                            {MAX_HEART_COUNT - this.state.hearts.length + index > 0 ? (
                                <div className={s.heart} style={{ top: `${heart.y}px`, left: `${heart.x}px` }}>
                                    <div className={s.heartInner} />
                                </div>
                            ) : null}
                        </React.Fragment>
                    ))}
                </div>
            );
        }
    },
};

function getTransform(x, y) {
    return { transform: `translate(${x}px, ${y}px)` };
}
