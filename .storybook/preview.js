import '@storybook/addon-console';
import React from 'react';
import theme from './theme.js';
import {ThemeProvider} from 'theme-ui';
import {addParameters, addDecorator} from '@storybook/react';


addDecorator(storyFn => <ThemeProvider
    theme={theme}
    children={storyFn()}
/>);

addParameters({
    options: {
        storySort: (aa, bb) => {
            const prev = aa[1].kind.toLowerCase();
            const next = bb[1].kind.toLowerCase();

            const sort = [
                'start here',
                'the parts of enty',
                'requesting data',
                'fallbacks'
            ].reverse();

            const aIndex = sort.findIndex(ii => prev.includes(ii));
            const bIndex = sort.findIndex(ii => next.includes(ii));

            if(aIndex === -1 && bIndex === -1) {
                if (prev < next) return -1;
                if (prev > next) return 1;
                return 0;
            }

            return bIndex - aIndex;
        }
    }
});
