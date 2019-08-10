// @flow
import type {Node} from 'react';
import React, {useState} from "react";
import {MDXRenderer} from 'gatsby-plugin-mdx';
import {DarkTheme, LightTheme} from './Theme';
import {Box, Flex, Sticky, Wrapper} from './Layout';
import {Text} from './Affordance';
import GlobalStyle from './GlobalStyle';
import Navigation from './Navigation';
import Provider from './Provider';

type Props = {
    body: any,
    title: string,
    sidebar: Node,
    minimap: Node
};

export default function MainLayout(props: Props): Node {
    const {title, body, sidebar, minimap} = props;
    const [darkMode, setDarkMode] = useState(false);
    return <Provider theme={darkMode ? DarkTheme : LightTheme}>
        <Navigation />
        <Wrapper>
        <Flex display={['block', null, 'flex']} alignItems="start" pb={6}>
            <GlobalStyle />
            <Sticky width={[1, null, .4]} p={4}>{sidebar}</Sticky>
            <Sticky order="1" width={[1, null, .4]} px={3} mt={4} top={4} borderLeft={`1px solid`} borderColor="hairline">{minimap}</Sticky>
            <Box width={[1, null, .6]} mx={[null, null, 4]} mb={3} pt={3} flexShrink={0}>
                <Text as="h1" textStyle="h1" mb="4" pt={2}>{title}</Text>
                <MDXRenderer>{body}</MDXRenderer>
            </Box>
        </Flex>
        </Wrapper>
    </Provider>;
}


