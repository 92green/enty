const {createFilePath} = require('gatsby-source-filesystem');
const path = require('path');
const {List} = require('immutable');

const DOCUMENTATION_QUERY = `{
    allDocumentationJs {
        edges {
            node {
                name
                fields {
                    slug
                    name
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

            // if(node.name === 'ArraySchema' || node.memberof === 'ArraySchema') {
            //     console.log(`\n${node.name} ${node.memberof} ${node.kind}`);
            //     console.log(node);

            // }

            // if(!(node.scope ? node.memberof : node.name)) {
            //     console.log(node);
            // }

            // Create slugs for documentation types

            createNodeField({
                node,
                name: 'slug',
                value: `/api${createFilePath({node, getNode, basePath: 'api'})}`
            });

            createNodeField({
                node,
                name: 'name',
                value: node.scope ? node.memberof : node.name
            });
            break;

        // case 'DocumentationJSComponentDescription':
    }
};

exports.createPages = ({graphql, boundActionCreators}) => {
    const {createPage} = boundActionCreators;

    return graphql(DOCUMENTATION_QUERY)
        .then(({data}) => data.allDocumentationJs.edges.map(({node}) => {
            createPage({
                path: node.fields.slug,
                component: path.resolve(`./src/templates/DocumentationTemplate.jsx`),
                context: {
                    slug: node.fields.slug,
                    name: node.fields.name || 'NONE'
                }
            });
        }))
    ;
};
