const {createFilePath} = require('gatsby-source-filesystem');
const path = require('path');
const fs = require('fs');

const DOCUMENTATION_QUERY = `{
    allDocumentationJs {
        edges {
            node {
                name
                fields {
                    slug
                    name
                    kind
                    sortBy
                }
                description {
                    id
                }
                returns {
                    title
                }
                examples {
                    raw
                    highlighted
                }
                params {
                    name
                    type {
                        name
                    }
                    description {
                        id
                    }
                }
            }
        }
    }
}`;

exports.onCreateNode = ({node, getNode, boundActionCreators}) => {
    const {createNodeField} = boundActionCreators;

    switch (node.internal.type) {
        case 'DocumentationJs':

            const name = node.memberof || node.name;

            createNodeField({
                node,
                name: 'slug',
                value: `/api/${name}`
            });

            createNodeField({
                node,
                name: 'name',
                value: name
            });

            createNodeField({
                node,
                name: 'sortBy',
                value: name.toLowerCase()
            });

            createNodeField({
                node,
                name: 'kind',
                value: 'api'
            });
            break;
    }
};



exports.createPages = ({graphql, boundActionCreators}) => {
    const {createPage} = boundActionCreators;

    function createDocumentation() {
        return graphql(DOCUMENTATION_QUERY)
            .then(({data}) => data.allDocumentationJs.edges.map(({node}) => {
                createPage({
                    path: node.fields.slug,
                    component: path.resolve(`./src/templates/DocumentationTemplate.jsx`),
                    context: {
                        slug: node.fields.slug,
                        kind: node.fields.kind,
                        sortBy: node.fields.sortBy,
                        name: node.fields.name || 'NONE'
                    }
                });
            }))
    }

    function createMarkdown() {
        const blogPostTemplate = path.resolve(`src/templates/MarkdownTemplate.jsx`);

        return graphql(`
            {
              allMarkdownRemark(
                sort: { order: DESC, fields: [frontmatter___date] }
                limit: 1000
              ) {
                edges {
                  node {
                    frontmatter {
                      path
                    }
                  }
                }
              }
            }
        `)
            .then(result => {
                if (result.errors) {
                    return Promise.reject(result.errors);
                }

                result.data.allMarkdownRemark.edges.forEach(({ node }) => {
                    if(node.frontmatter.path) {
                        createPage({
                            path: node.frontmatter.path,
                            component: blogPostTemplate,
                            context: {}, // additional data can be passed via context
                        });
                    }
                });
            });
    }

    return Promise.resolve()
        .then(createDocumentation)
        .then(createMarkdown)
    ;
};

const circleYml = `
general:
  branches:
    ignore:
      - gh-pages
`;

exports.onPostBuild = () => {
    fs.writeFileSync(`${__dirname}/public/circle.yml`, circleYml);
}
