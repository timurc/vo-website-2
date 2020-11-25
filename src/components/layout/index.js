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
import { BackgroundImageContext } from './background-image-context';
import { ImgInner } from './../Img';

import './base.css';
import s from './style.module.less';

const secondaryLinks = [
    {
        label: 'projekte',
        href: '/projekte/',
    },
    {
        label: 'neuigkeiten',
        href: '/neuigkeiten/',
    },
    {
        label: 'kontakt',
        href: '/kontakt/',
    },
];

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
                        allMarkdownRemark(
                            sort: { fields: [frontmatter___order], order: DESC }
                            filter: { frontmatter: { featured: { eq: true } } }
                        ) {
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

        this.sidebarProjects = get(this.props.data, 'allMarkdownRemark.edges');

        this.setBackgroundImage = image => {
            this.setState({
                backgroundImage: image,
            });
        };

        this.state = {
            activeProject: pathname,
            activeProjects: new Set(),
            setBackgroundImage: this.setBackgroundImage,
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
            track(['trackEvent', 'ProjectBackground', 'off', project]);
        } else {
            newActiveProjects.add(project);
            this.setState({ activeProject: project, activeProjects: newActiveProjects });
            track(['trackEvent', 'ProjectBackground', 'on', project]);
        }

        if (pathname !== '/') {
            navigate('/');
        }
    }
    componentDidUpdate(prevProps) {
        if (this.props.location.pathname !== prevProps.location.pathname && this.props.location.pathname !== '/') {
            this.state.activeProjects.clear();
            this.state.activeProjects.add(this.props.location.pathname);
            this.setState({ activeProject: this.props.location.pathname, activeProjects: this.state.activeProjects });
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

        const activeProject = find(this.sidebarProjects, page => {
            return get(page, 'node.fields.slug') === this.state.activeProject;
        });
        const isRoot = pathname === '/';
        const fullScreenBackground =
            this.state.backgroundImage ||
            (this.state.activeProject &&
                this.state.activeProject !== '/' &&
                Pieces[this.state.activeProject] &&
                Pieces[this.state.activeProject].fullScreen);
        const marginBottom =
            this.state.backgroundImage ||
            fullScreenBackground ||
            (this.state.activeProject &&
                this.state.activeProject !== '/' &&
                Pieces[this.state.activeProject] &&
                Pieces[this.state.activeProject].marginBottom);

        const backgroundPieces = Array.from(this.state.activeProjects)
            .map(activeProject => {
                const Piece = Pieces[activeProject] && Pieces[activeProject].component;
                if (Piece) {
                    return (
                        <React.Fragment key={activeProject}>
                            <Piece />
                        </React.Fragment>
                    );
                }
            })
            .filter(piece => piece);

        return (
            <BackgroundImageContext.Provider value={this.state.setBackgroundImage}>
                <div className={s.container}>
                    <nav className={s.sidebar}>
                        <ul className={s.projects}>
                            {this.sidebarProjects.map((project, index) => (
                                <Project
                                    key={index}
                                    project={project}
                                    activateProject={project => this.activateProject(project)}
                                    pathname={pathname}
                                    activeProjects={this.state.activeProjects}
                                    openInfoBox={this.state.activeProject === project.node.fields.slug}
                                />
                            ))}
                            <li className={s.secondaryLinks}>
                                <ul className={s.secondaryLinksList}>
                                    {secondaryLinks.map(link => (
                                        <li
                                            key={link.href}
                                            className={classNames(s.linkWrapper, {
                                                [s.linkWrapper_isOpen]: pathname.startsWith(link.href),
                                            })}
                                        >
                                            <Link className={s.link} to={link.href}>
                                                {link.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        </ul>
                        <>
                            {typeof window === `undefined` ? (
                                <Link
                                    className={s.homeButton}
                                    style={{ backgroundImage: `url(${Sternchen})` }}
                                    to={'/'}
                                >
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
                    </nav>
                    <div
                        style={{ backgroundImage: `url(${Logo})` }}
                        className={classNames(s.canvas, {
                            [s.canvas__grayscale]: this.state.activeProjects.has('/base/'),
                        })}
                    >
                        {backgroundPieces}
                        {activeProject && isRoot && <InfoBox project={activeProject} link={this.state.activeProject} />}
                        {this.state.backgroundImage && !backgroundPieces.length && (
                            <ImgInner className={s.backgroundImage} {...this.state.backgroundImage} />
                        )}
                    </div>
                    <main
                        className={classNames(s.content, {
                            [s.content__fullScreen]: fullScreenBackground,
                            [s.content__marginBottom]: marginBottom,
                            [s.content__hasPiece]: backgroundPieces.length,
                        })}
                    >
                        {children}
                    </main>
                </div>
            </BackgroundImageContext.Provider>
        );
    }
}

function Project({ project, activateProject, activeProjects, pathname, openInfoBox }) {
    const isOpen = project.node.fields.slug === pathname;
    const className = classNames(s.linkWrapper, {
        [s.linkWrapper_isActive]: activeProjects.has(project.node.fields.slug),
        [s.linkWrapper_isOpen]: isOpen,
    });

    // hack around react re-using li element and not updating className when build for server :-/
    // additionally, checking for the stuff pathname and activeProject does not work on build too
    if (typeof window === `undefined`) {
        return (
            <div className={className}>
                <a href={project.node.fields.slug} className={s.link}>
                    {project.node.frontmatter.title}
                </a>
            </div>
        );
    } else {
        return (
            <li className={className}>
                <div
                    role="button"
                    tabIndex="0"
                    onClick={() => {
                        activateProject(project.node.fields.slug);
                    }}
                    onKeyPress={e => {
                        if (e.charCode === 13 || e.charCode === 32) {
                            activateProject(project.node.fields.slug);
                        }
                    }}
                    className={s.link}
                >
                    {project.node.frontmatter.title}
                </div>
                {openInfoBox && !isOpen && (
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
        <Link
            to={link}
            className={s.infobox}
            onClick={() => {
                track(['trackEvent', 'Infobox', 'LinkClick', link]);
            }}
        >
            <h2>{project.node.frontmatter.title}</h2>
            <p>{project.node.frontmatter.year}</p>
            <p>{project.node.frontmatter.description}</p>
            <p>Mehr info →</p>
        </Link>
    );
}

function track(event) {
    if (window._paq) {
        window._paq.push(event);
    }
}

export default TemplateContainer;
