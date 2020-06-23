module.exports = {
    printWidth: 100,
    trailingComma: 'none',
    tabWidth: 4,
    semi: true,
    singleQuote: true,
    bracketSpacing: false,
    overrides: [
        {
            files: '*.{json,yml}',
            options: {
                tabWidth: 2
            }
        }
    ]
};
