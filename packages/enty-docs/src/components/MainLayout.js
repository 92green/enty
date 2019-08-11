// @flow
import type {Node} from 'react';

import React, {useState} from "react";
import {MDXRenderer} from 'gatsby-plugin-mdx';
import {DarkTheme, LightTheme} from './Theme';
import {Wrapper} from './Layout';
import GlobalStyle from './GlobalStyle';
import Navigation from './Navigation';
import Provider from './Provider';

type Props = {
    children: any
};

export default function MainLayout(props: Props): Node {
    const {children, wrapper = true} = props;
    const [darkMode, setDarkMode] = useState(false);
    return <Provider theme={darkMode ? DarkTheme : LightTheme}>
        <GlobalStyle/>
        <Navigation setDarkMode={setDarkMode} />
        {wrapper ? <Wrapper>{children}</Wrapper> : children}
    </Provider>;
}


