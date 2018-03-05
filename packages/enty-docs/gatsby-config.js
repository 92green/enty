//@flow
module.exports = {
    pathPrefix: '/enty',
    siteMetadata: {
        title: 'Enty'
    },
    plugins: [
        'gatsby-plugin-react-helmet',
        'gatsby-plugin-github-pages',
        'gatsby-transformer-documentationjs',
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                name: `enty`,
                path: `${__dirname}/../enty/src`
            }
        },
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                name: `react-enty`,
                path: `${__dirname}/../react-enty/src`
            }
        }
    ]
};
