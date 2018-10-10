import React from 'react';
import Helmet from 'react-helmet';
import { Link } from 'gatsby';
import get from 'lodash/get';
import Img from '../../components/Img';
import { DateFormatted } from './../../components/Utils';
import { BackgroundImageContext } from './../../components/layout/background-image-context';

import s from './style.module.less';

class BlogPostTemplateContext extends React.Component {
    render() {
        return (
            <BackgroundImageContext.Consumer>
                {setBackgroundImage => <BlogPostTemplate setBackgroundImage={setBackgroundImage} {...this.props} />}
            </BackgroundImageContext.Consumer>
        );
    }
}

class BlogPostTemplate extends React.Component {
    componentDidMount() {
        const mainImageSrc = get(this.props, 'data.markdownRemark.frontmatter.mainImage.childImageSharp.fluid');
        this.props.setBackgroundImage(mainImageSrc);
    }
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
                    <meta property="og:title" content={`V** ${post.frontmatter.title} ** ${siteTitle}`} />
                </Helmet>
                <article className={s.container}>
                    <div className={s.outer}>
                        <div className={s.inner}>
                            <header className={s.header}>
                                <h1>{post.frontmatter.title}</h1>
                                <HeadSection>{post.frontmatter.description}</HeadSection>
                                <HeadSection>{post.frontmatter.year}</HeadSection>
                                <HeadSection>{post.frontmatter.what}</HeadSection>
                                <HeadSection>{post.frontmatter.what2}</HeadSection>
                                <HeadSection>
                                    {post.frontmatter.date && <DateFormatted date={post.frontmatter.date} />}
                                </HeadSection>
                                <hr />
                            </header>
                            <p>{post.frontmatter.date}</p>
                            <div dangerouslySetInnerHTML={{ __html: post.html }} />
                        </div>
                    </div>
                    {images && (
                        <ul className={s.images}>
                            {images.map((image, index) => (
                                <li key={index} className={s.imageContainer}>
                                    <Img className={s.image} {...image.childImageSharp.fluid} />
                                </li>
                            ))}
                        </ul>
                    )}
                    {(next || previous) && (
                        <div className={s.nextPrevContainer}>
                            {previous && <NextPrev page={previous} rel="prev" />}
                            {next && <NextPrev page={next} rel="next" />}
                        </div>
                    )}
                </article>
            </>
        );
    }
}

function HeadSection({ children }) {
    if (!children) return null;

    return (
        <>
            <hr />
            <p>{children}</p>
        </>
    );
}

function NextPrev({ page, rel }) {
    const img = get(page, 'frontmatter.mainImage.childImageSharp.resize.src');

    return (
        <Link className={[s.nextPrev, s['nextPrev_' + rel]].join(' ')} to={page.fields.slug} rel={rel}>
            <h3 className={s.nextPrevHeading}>
                {rel === 'prev' && <>← </>}
                {page.frontmatter.title}
                {rel === 'next' && <> →</>}
            </h3>
            {img && <img className={s.nextPrevImage} src={page.frontmatter.mainImage.childImageSharp.resize.src} />}
        </Link>
    );
}

export default BlogPostTemplateContext;

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
                date
                mainImage {
                    childImageSharp {
                        resize(width: 2000) {
                            src
                        }
                        fluid(maxWidth: 2000) {
                            base64
                            src
                            srcSet
                            aspectRatio
                            sizes
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
