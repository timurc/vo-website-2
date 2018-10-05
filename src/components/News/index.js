import React from 'react';
import { Link } from 'gatsby';
import get from 'lodash/get';
import { StaticQuery, graphql } from 'gatsby';
import Helmet from 'react-helmet';

import s from './style.module.less';

class News extends React.Component {
    render() {
        const { location } = this.props;
        console.log(location);

        return (
            <StaticQuery
                query={graphql`
                    query NewsQuery {
                        site {
                            siteMetadata {
                                title
                                description
                                siteUrl
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
                            <meta name="description" content={data.site.siteMetadata.description} />
                            <meta property="og:url" content={data.site.siteMetadata.siteUrl + location.pathname} />
                            <meta property="og:site_name" content={data.site.siteMetadata.title} />
                            <meta property="og:image" content="/default-og-image.png" />
                            <link rel="shortcut icon" type="image/png" href="/favicon.png" />
                        </Helmet>
                    </Template>
                )}
            />
        );
    }
}

function Template({ data, location }) {
    console.log(data, location);
    const news = get(data, 'allMarkdownRemark.edges');
    return (
        <ul>
            {news.map(news => {
                return (
                    <li>
                        <Link to={news.node.fields.slug}>{news.node.frontmatter.title}</Link>
                    </li>
                );
            })}
        </ul>
    );
}

export default News;
