const Promise = require('bluebird');
const path = require('path');
const { createFilePath } = require('gatsby-source-filesystem');
const { forEach } = require('lodash');

exports.createPages = ({ graphql, actions }) => {
    const { createPage } = actions;

    return new Promise((resolve, reject) => {
        const project = path.resolve('./src/templates/project/index.js');
        resolve(
            graphql(
                `
                    {
                        allMarkdownRemark(sort: { fields: [frontmatter___order], order: DESC }, limit: 1000) {
                            edges {
                                node {
                                    fields {
                                        slug
                                    }
                                    frontmatter {
                                        title
                                        order
                                        date
                                        mainImage {
                                            childImageSharp {
                                                resize(width: 700) {
                                                    src
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                `
            ).then(result => {
                if (result.errors) {
                    console.log(result.errors);
                    reject(result.errors);
                }

                const posts = result.data.allMarkdownRemark.edges;

                const postsSplit = posts.reduce((postsSplit, post) => {
                    const parent = post.node.fields.slug.split('/')[1];

                    if (!postsSplit[parent]) {
                        postsSplit[parent] = [];
                    }
                    postsSplit[parent].push(post);

                    return postsSplit;
                }, {});

                if (postsSplit['neuigkeiten']) {
                    postsSplit['neuigkeiten'].sort((neuigkeit1, neuigkeit2) => {
                        const date1 = neuigkeit1.node.frontmatter.date;
                        const date2 = neuigkeit2.node.frontmatter.date;
                        if (date1 < date2) {
                            return -1;
                        }
                        if (date1 > date2) {
                            return 1;
                        }
                        return 0;
                    });
                }

                forEach(postsSplit, posts => {
                    posts.forEach((post, index) => {
                        const next = index === posts.length - 1 ? null : posts[index + 1].node;
                        const previous = index === 0 ? null : posts[index - 1].node;

                        createPage({
                            path: post.node.fields.slug,
                            component: project,
                            context: {
                                slug: post.node.fields.slug,
                                previous,
                                next,
                            },
                        });
                    });
                });
            })
        );
    });
};

exports.onCreateNode = ({ node, actions, getNode }) => {
    const { createNodeField } = actions;

    if (node.internal.type === `MarkdownRemark`) {
        const value = createFilePath({ node, getNode });
        createNodeField({
            name: `slug`,
            node,
            value,
        });
    }
};
