import React from 'react';
import { Link } from 'gatsby';
import s from './style.module.css';

class Template extends React.Component {
    constructor(props) {
        super(props);
        console.log('constructing...');
    }
    componentDidMount() {
        console.log('componentDidMount');
    }
    componentWillUnmount() {
        console.log('componentWillUnmount');
    }
    render() {
        const { location, children } = this.props;
        const rootPath = `${__PATH_PREFIX__}/`;

        return (
            <div>
                <h1 className={s.header}>
                    <Link to={'/'}>vollig ohne website</Link>
                </h1>
                {children}
            </div>
        );
    }
}

export default Template;
