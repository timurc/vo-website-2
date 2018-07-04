import React from 'react';
import Helmet from 'react-helmet';
import { Link } from 'gatsby';
import get from 'lodash/get';

import Layout from '../components/layout';
import s from './style.module.css';

class BlogPostTemplate extends React.Component {
    render() {
        const post = this.props.data.markdownRemark;
        const siteTitle = get(this.props, 'data.site.siteMetadata.title');
        const { previous, next } = this.props.pageContext;

        return (
            <Layout location={this.props.location}>
                <Helmet>
                    <title>{`${post.frontmatter.title} ** ${siteTitle}`}</title>
                    <meta
                        name="description"
                        content={`${siteTitle} ** ${post.frontmatter.title} ** ${post.frontmatter.description}`}
                    />
                </Helmet>
                <div className={s.container}>
                    <div className={s.inner}>
                        <h1>{post.frontmatter.title}</h1>
                        <p>{post.frontmatter.date}</p>
                        <div dangerouslySetInnerHTML={{ __html: post.html }} />
                        <hr />

                        <ul>
                            {previous && (
                                <li>
                                    <Link to={previous.fields.slug} rel="prev">
                                        ← {previous.frontmatter.title}
                                    </Link>
                                </li>
                            )}

                            {next && (
                                <li>
                                    <Link to={next.fields.slug} rel="next">
                                        {next.frontmatter.title} →
                                    </Link>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </Layout>
        );
    }
}

export default BlogPostTemplate;

export const pageQuery = graphql`
    query BlogPostBySlug($slug: String!) {
        site {
            siteMetadata {
                title
            }
        }
        markdownRemark(fields: { slug: { eq: $slug } }) {
            id
            html
            frontmatter {
                title
                year
                description
            }
        }
    }
`;
