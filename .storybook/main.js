const path = require('path');

module.exports = {
    stories: [
        '../packages/**/*.stories.(js|mdx)',
        '../docs/**/*.stories.(js|mdx)'
    ],
    addons: [
        '@storybook/addon-storysource'
    ]
};
