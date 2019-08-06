module.exports = {
    siteMetadata: {
        title: 'völlig ohne',
        description: 'Labor für Gestaltung in Berlin',
        siteUrl: 'https://volligohne.de',
    },
    plugins: [
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                path: `${__dirname}/src/pages`,
                name: 'pages',
            },
        },
        {
            resolve: `gatsby-transformer-remark`,
            options: {
                plugins: [
                    {
                        resolve: `gatsby-remark-images`,
                        options: {
                            maxWidth: 3000,
                            linkImagesToOriginal: false,
                        },
                    },
                    {
                        resolve: `gatsby-remark-responsive-iframe`,
                        options: {
                            wrapperStyle: `margin-bottom: 1.0725rem`,
                        },
                    },
                    'gatsby-remark-copy-linked-files',
                    'gatsby-remark-smartypants',
                ],
            },
        },
        `gatsby-transformer-sharp`,
        {
            resolve: `gatsby-plugin-sharp`,
            options: {
                defaultQuality: 80,
            },
        },
        {
            resolve: 'gatsby-plugin-matomo',
            options: {
                siteId: '1',
                matomoUrl: 'https://piwik.volligohne.de',
                siteUrl: 'https://volligohne.de',
            },
        },
        {
            resolve: `gatsby-plugin-feed`,
            options: {
                query: `
        {
          site {
            siteMetadata {
              title
              description
              siteUrl
              site_url: siteUrl
            }
          }
        }
      `,
                feeds: [
                    {
                        serialize: ({ query: { site, allMarkdownRemark } }) => {
                            return allMarkdownRemark.edges.map(edge => {
                                let html = edge.node.html;

                                if (edge.node.frontmatter.images) {
                                    const images = edge.node.frontmatter.images.map(image => {
                                        if (image.file) {
                                            return `<img src="${site.siteMetadata.siteUrl}${image.file.childImageSharp.resize.src}" />`;
                                        }
                                    });

                                    html = html + images.join('<br>');
                                }

                                return Object.assign({}, edge.node.frontmatter, {
                                    description: edge.node.excerpt,
                                    url: site.siteMetadata.siteUrl + edge.node.fields.slug,
                                    guid: site.siteMetadata.siteUrl + edge.node.fields.slug,
                                    custom_elements: [{ 'content:encoded': html }],
                                });
                            });
                        },
                        query: `
            {
              allMarkdownRemark(
                limit: 1000,
                sort: { order: DESC, fields: [frontmatter___date] },
                filter: { fields: { slug: { regex: "/^/neuigkeiten/" } } }
              ) {
                edges {
                  node {
                    excerpt
                    html
                    fields { slug }
                    frontmatter {
                        title
                        date
                        images {
                            file {
                                childImageSharp {
                                    resize(width: 2000) {
                                        src
                                    }
                                }
                            }
                        }
                    }
                  }
                }
              }
            }
          `,
                        output: '/rss.xml',
                        title: 'Gatsby RSS Feed',
                    },
                ],
            },
        },
        `gatsby-plugin-react-helmet`,
        `gatsby-plugin-less`,
        {
            resolve: `gatsby-plugin-layout`,
            options: {
                component: require.resolve(`./src/components/layout`),
            },
        },
    ],
};
