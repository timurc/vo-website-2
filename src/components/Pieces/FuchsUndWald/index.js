import React from 'react';
import s from './style.module.css';
import classNames from 'classnames';

const COUNT = 3000;
const DENSITY = 0.8;
const TIME_TO_GROW = 5;

export default class FuchsUndWald extends React.Component {
    constructor(props) {
        super(props);
        console.log('hu?');

        this.forest = Array(COUNT)
            .fill(0)
            .map(tree => {
                return Math.random();
            });
    }
    render() {
        return (
            <div className={s.container}>
                {this.forest.map(tree => {
                    const isGrown = tree < DENSITY;
                    const delay = TIME_TO_GROW * tree + 's';
                    return (
                        <span
                            key={tree}
                            style={{ animationDelay: delay }}
                            className={classNames(s.tree, { [s.tree_grown]: isGrown })}
                        >
                            ∧
                        </span>
                    );
                })}
            </div>
        );
    }
}
