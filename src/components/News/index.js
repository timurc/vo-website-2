import React from 'react';
import { Link } from 'gatsby';
import get from 'lodash/get';
import { StaticQuery, graphql } from 'gatsby';
import Helmet from 'react-helmet';

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
                return (
                    <li key={news.node.fields.slug}>
                        <Link to={news.node.fields.slug}>{news.node.frontmatter.title}</Link>
                    </li>
                );
            })}
            {children}
        </ul>
    );
}

export default News;
