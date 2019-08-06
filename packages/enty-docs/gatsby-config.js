// @flow

module.exports = {
    plugins: [
        `gatsby-plugin-styled-components`,
        `gatsby-transformer-remark`,
        `gatsby-plugin-flow`,
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                name: `pages`,
                path: `${__dirname}/src/pages/`
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
                ],
                defaultLayouts: {
                    pages: require.resolve('./src/components/MainLayout')
                }
            }
        }
    ]
};
