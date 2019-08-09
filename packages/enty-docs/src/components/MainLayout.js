// @flow
import type {Node} from 'react';
import React, {useState} from "react";
import {DarkTheme, LightTheme} from './Theme';
import {Box, Flex, Fixed} from './Layout';
import {Text} from './Affordance';
import GlobalStyle from './GlobalStyle';
import Navigation from './Navigation';
import Provider from './Provider';

type Props = {
    children: any
};

export default function MainLayout(props: Props): Node {
    const {children} = props;
    const [darkMode, setDarkMode] = useState(false);

    return <Provider theme={darkMode ? DarkTheme : LightTheme}>
        <Navigation />
        <Fixed top={1} left={1}>
            <Text bg="bg" p={1} textStyle="href" onClick={() => setDarkMode(!darkMode)}>{darkMode ? 'dark' : 'light'}</Text>
        </Fixed>
        <Flex display={['block', null, 'flex']} alignItems="start" pb={6}>
            <GlobalStyle />
            <Box width={[1, null, .4]}>side bar</Box>
            <Box order="1" width={[1, null, .4]}>document</Box>
            <Box width={[1, null, .6]} mr={[null, null, 3]} mb={3} flexShrink={0}>{children}</Box>
        </Flex>
    </Provider>;
}


