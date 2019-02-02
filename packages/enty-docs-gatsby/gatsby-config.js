//@flow
module.exports = {
    pathPrefix: '/enty',
    siteMetadata: {
        title: 'Enty'
    },
    plugins: [
        'gatsby-plugin-react-next',
        'gatsby-plugin-sass',
        'gatsby-plugin-react-helmet',
        'gatsby-transformer-blueflagdocs',
        {
            resolve: 'gatsby-source-filesystem',
            options: {
                name: 'react-enty',
                path: `${__dirname}/../react-enty/src`
            }
        },
        {
            resolve: 'gatsby-source-filesystem',
            options: {
                name: 'enty',
                path: `${__dirname}/../enty/src`
            }
        },
        {
            resolve: 'gatsby-source-filesystem',
            options: {
                path: `${__dirname}/docs`,
                name: 'markdown-pages'
            }
        },
        {
            resolve: 'gatsby-transformer-remark',
            options: {
                plugins: [
                    `gatsby-remark-prismjs`
                ]
            }
        }
    ]
};
