import React from 'react';
import { Link } from 'gatsby';
import get from 'lodash/get';
import { StaticQuery, graphql } from 'gatsby';

import s from './style.module.css';

class TemplateContainer extends React.Component {
    render() {
        const { children } = this.props;

        return (
            <StaticQuery
                query={graphql`
                    query IndexQueryFoo {
                        allMarkdownRemark(sort: { fields: [frontmatter___order], order: DESC }) {
                            edges {
                                node {
                                    fields {
                                        slug
                                    }
                                    frontmatter {
                                        title
                                        year
                                        order
                                        description
                                    }
                                }
                            }
                        }
                    }
                `}
                render={data => <Template data={data}>{children}</Template>}
            />
        );
    }
}

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
        const { children, data } = this.props;
        const pages = get(data, 'allMarkdownRemark.edges');
        console.log(pages);

        return (
            <main className={s.container}>
                <ul className={s.projects}>
                    {pages.map(project => (
                        <li className={s.project} key={project.node.fields.slug}>
                            <Link to={project.node.fields.slug}>{project.node.frontmatter.title}</Link>
                        </li>
                    ))}
                    <li>
                        <Link to={'/'}>home</Link>
                    </li>
                </ul>
                <div className={s.canvasContainer}>{children}</div>
            </main>
        );
    }
}

export default TemplateContainer;
