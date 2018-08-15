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
        const {
            location: { pathname },
        } = this.props;

        this.state = {
            activeProject: pathname,
            activeProjects: new Set(),
        };

        if (pathname !== '/') {
            this.state.activeProjects.add(pathname);
        }
    }
    componentDidMount() {
        if (window.layoutState) {
            this.setState(window.layoutState);
        }
    }
    componentWillUnmount() {
        window.layoutState = this.state;
    }
    activateProject(project) {
        const newActiveProjects = new Set(this.state.activeProjects);
        if (this.state.activeProjects.has(project)) {
            newActiveProjects.delete(project);
            this.setState({ activeProject: undefined, activeProjects: newActiveProjects });
        } else {
            newActiveProjects.add(project);
            this.setState({ activeProject: project, activeProjects: newActiveProjects });
        }
    }
    componentDidUpdate(prevProps) {
        if (this.props.location.pathname !== prevProps.location.pathname) {
            this.setState({ activeProject: this.props.location.pathname });
        }
    }
    render() {
        const { children, data, location } = this.props;
        const pages = get(data, 'allMarkdownRemark.edges');
        const activeProject = find(pages, page => {
            return get(page, 'node.fields.slug') === this.state.activeProject;
        });
        const isRoot = location.pathname === '/';

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
                </aside>
                <div
                    className={classNames(s.canvas, { [s.canvas__grayscale]: this.state.activeProjects.has('/base/') })}
                >
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
                    {activeProject && isRoot && <InfoBox project={activeProject} link={this.state.activeProject} />}
                </div>
                <div className={s.content}>{children}</div>
            </main>
        );
    }
}

function InfoBox({ project, link }) {
    return (
        <Link to={link} className={s.infobox}>
            <h2>{project.node.frontmatter.title}</h2>
            <p>{project.node.frontmatter.year}</p>
            <p>{project.node.frontmatter.description}</p>
            <p>Mehr info →</p>
        </Link>
    );
}

export default TemplateContainer;
