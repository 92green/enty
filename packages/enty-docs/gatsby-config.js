//@flow
module.exports = {
    pathPrefix: '/enty',
    siteMetadata: {
        title: 'Enty'
    },
    plugins: [
        'gatsby-plugin-sass',
        'gatsby-plugin-react-helmet',
        'gatsby-transformer-documentationjs',
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
                name: 'react-enty',
                path: `${__dirname}/../react-enty/src`
            }
        },
        {
            resolve: 'gatsby-source-filesystem',
            options: {
                path: `${__dirname}/docs`,
                name: 'markdown-pages'
            }
        },
        'gatsby-transformer-remark'
    ]
};
