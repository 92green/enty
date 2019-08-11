
function makeTheme(colors: {}) {
    const fontSizes = [12, 14, 16, 20, 24, 32, 48, 64, 72];
    const space = [0, 4, 8, 16, 32, 64, 128, 256, 512];
    const fonts = {
        copy: '-apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol',
        code: 'Menlo, monospace'
    };
    return {
        colors,
        fontSizes,
        fonts,
        space,
        textStyles: {
            href: {
                textDecoration: 'underline',
                cursor: 'pointer'
            },
            navigationLink: {
                textDecoration: 'none',
                cursor: 'pointer',
                color: colors.bg
            },
            code: {
                fontFamily: fonts.code,
                fontSize: '13px',
                lineHeight: '1.45',
                backgroundColor: 'rgba(27,31,35,.05)',
            },
            em: {
                fontStyle: 'italic'
            },
            strong: {
                fontWeight: '500'
            },
            muted: {
                color: colors.muted
            },
            h1: {
                fontWeight: '500',
                fontSize: fontSizes[5]
            },
            h2: {
                fontWeight: '500',
                fontSize: fontSizes[4]
            },
            h3: {
                fontWeight: '500',
                fontSize: fontSizes[3]
            },
        }
    };
}


export const DarkTheme = makeTheme({
    bg: '#222',
    fg: '#fff',
    alpha: '#2d2b57',
    beta: '#24292e',
    link: '#7469f9',

    // specifics
    navigationCopy: '#fff',

    codeFg: '#e3dfff',
    comment: '#7875a7',
    codeBg: '#2d2b57',
    yellow: '#f8d000',
    orange: '#fb9e00',
    green: '#4cd213',
});

export const LightTheme = makeTheme({
    fg: '#222',
    muted: '#717171',
    hairline: '#ccc',
    bg: '#fff',
    alpha: '#2d2b57',
    navigationCopy: '#fff',
    link: '#7469f9',

    // code
    comment: '#7875a7',
    codeFg: '#e3dfff',
    codeBg: '#2d2b57',
    yellow: '#f8d000',
    orange: '#fb9e00',
    green: '#4cd213',
});
