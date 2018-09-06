import React from 'react';
import { Link, navigate } from 'gatsby';
import get from 'lodash/get';
import { StaticQuery, graphql } from 'gatsby';
import { find } from 'lodash';
import classNames from 'classnames';
import Pieces from './../Pieces';
import Helmet from 'react-helmet';
import Logo from './vsternchen.svg';
import Sternchen from './sternchen.svg';

import './base.css';
import s from './style.module.less';

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
                                siteUrl
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
                            <meta property="og:url" content={data.site.siteMetadata.siteUrl + location.pathname} />
                            <meta property="og:site_name" content={data.site.siteMetadata.title} />
                            <meta property="og:image" content="/default-og-image.png" />
                            <link rel="shortcut icon" type="image/png" href="/favicon.png" />
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
        const pathname = fixPathname(this.props.location.pathname);
        this.state = {
            activeProject: pathname,
            activeProjects: new Set(),
        };

        if (pathname !== '/') {
            this.state.activeProjects.add(pathname);
        }
    }
    activateProject(project) {
        const {
            location: { pathname },
        } = this.props;

        const newActiveProjects = new Set(this.state.activeProjects);

        if (this.state.activeProjects.has(project)) {
            newActiveProjects.delete(project);
            this.setState({ activeProject: undefined, activeProjects: newActiveProjects });
        } else {
            newActiveProjects.add(project);
            this.setState({ activeProject: project, activeProjects: newActiveProjects });
        }

        if (pathname !== '/') {
            navigate('/');
        }
    }
    componentDidUpdate(prevProps) {
        if (this.props.location.pathname !== prevProps.location.pathname && this.props.location.pathname !== '/') {
            this.state.activeProjects.clear();
            this.state.activeProjects.add(this.props.location.pathname);
            this.setState({ activeProjects: this.state.activeProjects });
        }
    }
    clear() {
        navigate('/');
        this.state.activeProjects.clear();
        this.setState({ activeProject: '/', activeProjects: this.state.activeProjects });
    }
    render() {
        const { children, data } = this.props;
        const pathname = fixPathname(this.props.location.pathname);

        const pages = get(data, 'allMarkdownRemark.edges');
        const activeProject = find(pages, page => {
            return get(page, 'node.fields.slug') === this.state.activeProject;
        });
        const isRoot = pathname === '/';
        const fullScreenBackground =
            this.state.activeProject &&
            this.state.activeProject !== '/' &&
            Pieces[this.state.activeProject] &&
            Pieces[this.state.activeProject].fullScreen;

        return (
            <main className={s.container}>
                <aside className={s.sidebar}>
                    <ul className={s.projects}>
                        {pages.map((project, index) => (
                            <Project
                                key={index}
                                project={project}
                                activateProject={project => this.activateProject(project)}
                                pathname={pathname}
                                activeProjects={this.state.activeProjects}
                                openInfoBox={this.state.activeProject === project.node.fields.slug}
                            />
                        ))}
                    </ul>
                    <>
                        {typeof window === `undefined` ? (
                            <Link className={s.homeButton} style={{ backgroundImage: `url(${Sternchen})` }} to={'/'}>
                                home
                            </Link>
                        ) : (
                            <button
                                className={s.homeButton}
                                style={{ backgroundImage: `url(${Sternchen})` }}
                                onClick={() => this.clear()}
                            >
                                home
                            </button>
                        )}
                    </>
                </aside>
                <div
                    style={{ backgroundImage: `url(${Logo})` }}
                    className={classNames(s.canvas, { [s.canvas__grayscale]: this.state.activeProjects.has('/base/') })}
                >
                    {Array.from(this.state.activeProjects).map(activeProject => {
                        const Piece = Pieces[activeProject] && Pieces[activeProject].component;
                        if (Piece) {
                            return (
                                <React.Fragment key={activeProject}>
                                    <Piece />
                                </React.Fragment>
                            );
                        }
                    })}
                    {activeProject && isRoot && <InfoBox project={activeProject} link={this.state.activeProject} />}
                </div>
                <div className={classNames(s.content, { [s.content__fullScreen]: fullScreenBackground })}>
                    {children}
                </div>
            </main>
        );
    }
}

function Project({ project, activateProject, activeProjects, pathname, openInfoBox }) {
    const isOpen = project.node.fields.slug === pathname;
    const className = classNames(s.project, {
        [s.project_isActive]: activeProjects.has(project.node.fields.slug),
        [s.project_isOpen]: isOpen,
    });

    // hack around react re-using li element and not updating className when build for server :-/
    // additionally, checking for the stuff pathname and activeProject does not work on build too
    if (typeof window === `undefined`) {
        return (
            <div className={className}>
                <a href={project.node.fields.slug} className={s.projectLink}>
                    {project.node.frontmatter.title}
                </a>
            </div>
        );
    } else {
        return (
            <li className={className}>
                <div
                    role="button"
                    tabIndex="1"
                    onClick={() => {
                        activateProject(project.node.fields.slug);
                    }}
                    onKeyPress={e => {
                        if (e.charCode === 13 || e.charCode === 32) {
                            activateProject(project.node.fields.slug);
                        }
                    }}
                    className={s.projectLink}
                >
                    {project.node.frontmatter.title}
                </div>
                {openInfoBox &&
                    !isOpen && (
                        <Link
                            className={s.projectMoreLink}
                            onTouchStart={() => {
                                navigate(project.node.fields.slug);
                            }}
                            to={project.node.fields.slug}
                        >
                            Mehr info →
                        </Link>
                    )}
            </li>
        );
    }
}

// stupid hack to what seems to be a gatbsy bug
function fixPathname(pathname) {
    return typeof window === `undefined` ? pathname.slice(1, -1) + '/' : pathname;
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
