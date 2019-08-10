// @flow
const path = require('path');

module.exports = {
    plugins: [
        `gatsby-plugin-flow`,
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                name: `tutorial`,
                path: `${__dirname}/src/content/tutorial`
            }
        },
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                name: `api`,
                path: `${__dirname}/src/content/api`
            }
        },
        {
            resolve: `gatsby-plugin-mdx`,
            options: {
                extensions: ['.mdx', '.md'],
                gatsbyRemarkPlugins: [
                    {
                        resolve: `gatsby-remark-prismjs`,
                        options: {
                            noInlineHighlight: true
                        }
                    }
                ]
            }
        },
        `gatsby-plugin-styled-components`,
        `gatsby-transformer-remark`,
    ]
};
