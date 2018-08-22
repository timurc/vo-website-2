import React from 'react';
import Helmet from 'react-helmet';
import { Link } from 'gatsby';
import get from 'lodash/get';

import s from './style.module.css';

class BlogPostTemplate extends React.Component {
    render() {
        const post = this.props.data.markdownRemark;
        const siteTitle = get(this.props, 'data.site.siteMetadata.title');
        const { previous, next } = this.props.pageContext;
        const images = get(post, 'frontmatter.images');

        return (
            <>
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

                        <ul className={s.nextPrev}>
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
                    {images && (
                        <ul className={s.images}>
                            {images.map(image => (
                                <li key={image.src} className={s.imageContainer}>
                                    <Img className={s.image} {...image.childImageSharp.fluid} />
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </>
        );
    }
}

function Img({ src, srcSet, base64, className }) {
    return <img sizes="calc(100vw - 20rem)" className={className} src={base64} srcSet={srcSet} />;
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
                images {
                    childImageSharp {
                        fluid(maxWidth: 2000) {
                            base64
                            src
                            srcSet
                            aspectRatio
                            sizes
                        }
                    }
                }
            }
        }
    }
`;
