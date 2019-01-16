import React from 'react';
import { Link } from 'gatsby';
import get from 'lodash/get';
import { StaticQuery, graphql } from 'gatsby';
import Helmet from 'react-helmet';
import Img from './../Img';
import { DateFormatted } from './../Utils';

import s from './style.module.less';

class News extends React.Component {
    render() {
        const { location, children } = this.props;

        return (
            <StaticQuery
                query={graphql`
                    query NewsQuery {
                        site {
                            siteMetadata {
                                title
                            }
                        }
                        allMarkdownRemark(
                            sort: { fields: [frontmatter___date], order: DESC }
                            filter: { fields: { slug: { regex: "/^/neuigkeiten/" } } }
                        ) {
                            edges {
                                node {
                                    fields {
                                        slug
                                    }
                                    frontmatter {
                                        title
                                        year
                                        date
                                        description
                                        mainImage {
                                            childImageSharp {
                                                fluid {
                                                    srcSet
                                                    aspectRatio
                                                    base64
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                `}
                render={data => (
                    <Template data={data} location={location}>
                        <Helmet>
                            <title>V** {data.site.siteMetadata.title} - neuigkeiten</title>
                        </Helmet>
                        {children}
                    </Template>
                )}
            />
        );
    }
}

function Template({ data, children }) {
    const news = get(data, 'allMarkdownRemark.edges');

    return (
        <div className={s.container}>
            {news.map(news => {
                const img = get(news, 'node.frontmatter.mainImage.childImageSharp.fluid');
                return (
                    <article key={news.node.fields.slug}>
                        <Link className={s.newsLink} to={news.node.fields.slug}>
                            <header>
                                <DateFormatted date={news.node.frontmatter.date} />
                                <h1>{news.node.frontmatter.title}</h1>
                            </header>
                            <Img isSquare={true} className={s.image} sizes="(max-width: 450px) 100vw, 450px" {...img} />
                        </Link>
                    </article>
                );
            })}
            {children}
        </div>
    );
}

export default News;
