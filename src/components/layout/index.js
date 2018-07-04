import React from 'react';
import { Link } from 'gatsby';
import get from 'lodash/get';
import { StaticQuery, graphql } from 'gatsby';
import { find } from 'lodash';
import classNames from 'classnames';
import Pieces from './../Pieces';
import Helmet from 'react-helmet';

import './base.css';
import s from './style.module.css';

class TemplateContainer extends React.Component {
    render() {
        const { children, location } = this.props;
        return (
            <StaticQuery
                query={graphql`
                    query IndexQueryFoo {
                        site {
                            siteMetadata {
                                title
                                description
                            }
                        }
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
                        <Helmet>
                            <title>V** {data.site.siteMetadata.title}</title>
                            <meta name="description" content={data.site.siteMetadata.description} />
                        </Helmet>
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
            activeProjects: new Set(),
        };
    }
    componentDidMount() {
        console.log('componentDidMount');
    }
    componentWillUnmount() {
        console.log('componentWillUnmount');
    }
    activateProject(project) {
        const newActiveProjects = new Set(this.state.activeProjects);
        if (this.state.activeProjects.has(project)) {
            newActiveProjects.delete(project);
        } else {
            newActiveProjects.add(project);
        }
        this.setState({ activeProject: project, activeProjects: newActiveProjects });
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

        return (
            <main className={s.container}>
                <aside className={s.sidebar}>
                    <ul className={s.projects}>
                        {pages.map(project => (
                            <li
                                className={classNames(s.project, {
                                    [s.project_isActive]: this.state.activeProjects.has(project.node.fields.slug),
                                })}
                                key={project.node.fields.slug}
                            >
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
                <div className={s.canvas}>
                    {Array.from(this.state.activeProjects).map(activeProject => {
                        const Piece = Pieces[activeProject];
                        if (Pieces[activeProject]) {
                            return (
                                <React.Fragment key={activeProject}>
                                    <Piece />
                                </React.Fragment>
                            );
                        }
                    })}
                </div>
                <div className={s.content}>{children}</div>
            </main>
        );
    }
}

export default TemplateContainer;
