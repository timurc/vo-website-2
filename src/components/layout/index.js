import React from 'react';
import { Link } from 'gatsby';
import get from 'lodash/get';
import { StaticQuery, graphql } from 'gatsby';
import { find } from 'lodash';

import './base.css';
import s from './style.module.css';

class TemplateContainer extends React.Component {
    render() {
        const { children, location } = this.props;

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
                render={data => (
                    <Template data={data} location={location}>
                        {children}
                    </Template>
                )}
            />
        );
    }
}

class Template extends React.Component {
    constructor(props) {
        super(props);
        const { location } = this.props;
        this.state = {
            activeProject: location.pathname,
        };
    }
    componentDidMount() {
        console.log('componentDidMount');
    }
    componentWillUnmount() {
        console.log('componentWillUnmount');
    }
    activateProject(project) {
        this.setState({ activeProject: project });
    }
    componentDidUpdate(prevProps) {
        if (this.props.location.pathname !== prevProps.location.pathname) {
            this.setState({ activeProject: this.props.location.pathname });
        }
    }
    render() {
        const { children, data } = this.props;
        const pages = get(data, 'allMarkdownRemark.edges');
        const activeProject = find(pages, page => {
            return get(page, 'node.fields.slug') === this.state.activeProject;
        });

        console.log(activeProject);

        return (
            <main className={s.container}>
                <aside className={s.sidebar}>
                    <ul className={s.projects}>
                        {pages.map(project => (
                            <li className={s.project} key={project.node.fields.slug}>
                                <button
                                    onClick={() => {
                                        this.activateProject(project.node.fields.slug);
                                    }}
                                    className={s.projectLink}
                                >
                                    {project.node.frontmatter.title}
                                </button>
                            </li>
                        ))}
                        <li>
                            <Link to={'/'}>home</Link>
                        </li>
                    </ul>

                    {activeProject && (
                        <Link to={this.state.activeProject} className={s.description}>
                            <h2>{activeProject.node.frontmatter.title}</h2>
                            <p>{activeProject.node.frontmatter.year}</p>
                            <p>{activeProject.node.frontmatter.description}</p>
                        </Link>
                    )}
                </aside>
                <div className={s.canvas} />
                <div className={s.content}>{children}</div>
            </main>
        );
    }
}

export default TemplateContainer;
