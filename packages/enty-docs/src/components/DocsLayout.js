// @flow
import type {Node} from 'react';

import React from "react";
import {MDXRenderer} from 'gatsby-plugin-mdx';
import {Box, Flex, Sticky} from './Layout';
import {Text} from './Affordance';
import MainLayout from './MainLayout';

type Props = {
    body: any,
    title: string,
    sidebar: Node,
    minimap: Node
};

export default function DocsLayout(props: Props): Node {
    const {title, body, sidebar, minimap} = props;
    return <MainLayout>
        <Flex display={['block', null, 'flex']} alignItems="start" pb={6}>
            <Sticky width={[1, null, .4]} p={4}>{sidebar}</Sticky>
            <Sticky order="1" width={[1, null, .4]} px={3} mt={4} top={4} borderLeft={`1px solid`} borderColor="hairline">{minimap}</Sticky>
            <Box width={[1, null, .6]} mx={[null, null, 4]} mb={3} pt={3} flexShrink={0}>
                <Text as="h1" textStyle="h1" mb="4" pt={2}>{title}</Text>
                <MDXRenderer>{body}</MDXRenderer>
            </Box>
        </Flex>
    </MainLayout>
}


