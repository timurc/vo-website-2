import React from 'react';
import { Link } from 'gatsby';
import get from 'lodash/get';
import { StaticQuery, graphql } from 'gatsby';
import Helmet from 'react-helmet';
import Img from '../Img';
import { DateFormatted } from '../Utils';
import { BackgroundImageContext } from '../layout/background-image-context';

import s from './style.module.less';

class OverviewList extends React.Component {
    render() {
        const items = this.props.data.allMarkdownRemark.edges;
        const siteMetadata = this.props.data.site.siteMetadata;
        const { title } = this.props.data.markdownRemark.frontmatter;

        return (
            <div className={s.container}>
                <Helmet>
                    <title>
                        V** {siteMetadata.title} - {title}
                    </title>
                </Helmet>

                <BackgroundImageContext.Consumer>
                    {setBackgroundImage => {
                        setBackgroundImage();
                    }}
                </BackgroundImageContext.Consumer>
                <div className={s.titleContainer}>
                    <h1 className={s.title}>{title}:</h1>
                </div>
                {items.map(item => {
                    const img = get(item, 'node.frontmatter.mainImage.childImageSharp.fluid');
                    return (
                        <article key={item.node.fields.slug}>
                            <Link className={s.link} to={item.node.fields.slug}>
                                <header>
                                    <DateFormatted date={item.node.frontmatter.date} />
                                    <h1>{item.node.frontmatter.title}</h1>
                                </header>
                                <Img
                                    isSquare={true}
                                    className={s.image}
                                    sizes="(max-width: 450px) 100vw, 450px"
                                    {...img}
                                />
                            </Link>
                        </article>
                    );
                })}
            </div>
        );
    }
}

export const pageQuery = graphql`
    query OverviewList($slug: String!) {
        site {
            siteMetadata {
                title
            }
        }
        markdownRemark(fields: { slug: { eq: $slug } }) {
            frontmatter {
                title
            }
        }
        allMarkdownRemark(
            sort: { fields: [frontmatter___date, frontmatter___order], order: [DESC, DESC] }
            filter: { fields: { slug: { regex: $slug, ne: $slug } } }
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
                                fluid(maxWidth: 450, srcSetBreakpoints: [450, 900]) {
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
`;

export default OverviewList;
