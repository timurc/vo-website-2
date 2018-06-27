import React from 'react';
import { Link } from 'gatsby';
import get from 'lodash/get';
import Helmet from 'react-helmet';

import Layout from '../components/layout';

class BlogIndex extends React.Component {
    render() {
        const siteTitle = get(this, 'props.data.site.siteMetadata.title');
        const posts = get(this, 'props.data.allMarkdownRemark.edges');

        return (
            <Layout location={this.props.location}>
                <Helmet title={siteTitle} />
                {posts.map(({ node }) => {
                    const title = get(node, 'frontmatter.title') || node.fields.slug;
                    return (
                        <div key={node.fields.slug}>
                            <h3>
                                <Link to={node.fields.slug}>{title}</Link>
                            </h3>
                            <small>{node.frontmatter.year}</small>
                            <p dangerouslySetInnerHTML={{ __html: node.excerpt }} />
                        </div>
                    );
                })}
            </Layout>
        );
    }
}

export default BlogIndex;

export const pageQuery = graphql`
    query IndexQuery {
        site {
            siteMetadata {
                title
            }
        }
        allMarkdownRemark(sort: { fields: [frontmatter___order], order: DESC }) {
            edges {
                node {
                    excerpt
                    fields {
                        slug
                    }
                    frontmatter {
                        title
                        year
                        order
                    }
                }
            }
        }
    }
`;
