import React from 'react';
import { Link } from 'gatsby';
import get from 'lodash/get';
import { StaticQuery, graphql } from 'gatsby';
import Helmet from 'react-helmet';
import Img from './../Img';

import s from './style.module.less';

class News extends React.Component {
    render() {
        const { location } = this.props;

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
                    </Template>
                )}
            />
        );
    }
}

function Template({ data, location, children }) {
    const news = get(data, 'allMarkdownRemark.edges');

    return (
        <ul>
            {news.map(news => {
                const img = get(news, 'node.frontmatter.mainImage.childImageSharp.fluid');
                return (
                    <li key={news.node.fields.slug}>
                        <Link className={s.newsLink} to={news.node.fields.slug}>
                            <Img sizes="(max-width: 450px) 100vw, 450px" {...img} />
                            {news.node.frontmatter.title}
                        </Link>
                    </li>
                );
            })}
            {children}
        </ul>
    );
}

export default News;
