import React from 'react';
import Helmet from 'react-helmet';
import { Link } from 'gatsby';
import get from 'lodash/get';

import s from './style.module.less';

class BlogPostTemplate extends React.Component {
    render() {
        const post = this.props.data.markdownRemark;
        const siteTitle = get(this.props, 'data.site.siteMetadata.title');
        const { previous, next } = this.props.pageContext;
        const images = get(post, 'frontmatter.images');
        const mainImageSrc = get(post, 'frontmatter.mainImage.childImageSharp.resize.src');

        return (
            <>
                <Helmet>
                    <title>{`V** ${post.frontmatter.title} ** ${siteTitle}`}</title>
                    <meta
                        name="description"
                        content={`${siteTitle} ** ${post.frontmatter.title} ** ${post.frontmatter.description}`}
                    />
                    <meta property="og:image" content={mainImageSrc} />
                </Helmet>
                <div className={s.container}>
                    <article className={s.outer}>
                        <div className={s.inner}>
                            <header className={s.header}>
                                <h1>{post.frontmatter.title}</h1>
                                <p>{post.frontmatter.description}</p>
                                <hr />
                                {(post.frontmatter.year || post.frontmatter.what) && (
                                    <p>
                                        {post.frontmatter.year && (
                                            <>
                                                {post.frontmatter.year}
                                                <br />
                                            </>
                                        )}
                                        {post.frontmatter.what}
                                    </p>
                                )}
                                {post.frontmatter.what2 && (
                                    <>
                                        <hr />
                                        <p>{post.frontmatter.what2}</p>
                                    </>
                                )}
                                <hr />
                            </header>
                            <p>{post.frontmatter.date}</p>
                            <div dangerouslySetInnerHTML={{ __html: post.html }} />
                        </div>
                    </article>
                    {images && (
                        <ul className={s.images}>
                            {images.map((image, index) => (
                                <li key={index} className={s.imageContainer}>
                                    <Img className={s.image} {...image.childImageSharp.fluid} />
                                </li>
                            ))}
                        </ul>
                    )}
                    <div className={s.nextPrevOuter}>
                        <ul className={s.nextPrev}>
                            {next && (
                                <li>
                                    <Link to={next.fields.slug} rel="next">
                                        ← {next.frontmatter.title}
                                    </Link>
                                </li>
                            )}

                            {previous && (
                                <li>
                                    <Link to={previous.fields.slug} rel="prev">
                                        {previous.frontmatter.title} →
                                    </Link>
                                </li>
                            )}
                        </ul>
                    </div>
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
                what
                what2
                mainImage {
                    childImageSharp {
                        resize(width: 2000) {
                            src
                        }
                    }
                }
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
