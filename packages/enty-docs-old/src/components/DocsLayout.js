// @flow
import type {Node} from 'react';

import React, {useState} from "react";
import {MDXRenderer} from 'gatsby-plugin-mdx';
import {Box, Flex, Absolute} from './Layout';
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
    const [menu, setMenu] = useState(false);
    const [outline, setOutline] = useState(false);
    const smallMenuProps = {top: '118px', left: 0, right: 0, bottom: 0, backgroundColor: 'bg', p: 4};

    const content = <>
        <Text as="h1" textStyle="h1" mb="4" pt={2}>{title}</Text>
        <MDXRenderer>{body}</MDXRenderer>
    </>;

    const smallLayout = <Box>
        <Flex backgroundColor="hairline" p={3} mx={-3} justifyContent="space-around">
            <Box onClick={() => {setMenu(!menu); setOutline(false);}}>Menu</Box>
            <Box onClick={() => {setOutline(!outline); setMenu(false);}}>Outline</Box>
        </Flex>
        {content}
        {menu && <Absolute {...smallMenuProps} children={sidebar} />}
        {outline && <Absolute {...smallMenuProps} children={minimap} />}
    </Box>

    const largeLayout = <Flex display={{_: 'block', md: 'flex'}} alignItems="start" pb={6}>
        <Box
            position={{md: 'sticky'}}
            width={{_:1, md: .4}}
            p={4}
            top={0}
            children={sidebar}
        />
        <Box
            order="1"
            position={{md: 'sticky'}}
            width={{_:1, md: .4}}
            px={3}
            mt={4}
            top={4}
            borderLeft="1px solid"
            borderColor="hairline"
            children={minimap}
        />
        <Box width={{_: 1, md: .6}} mx={{md: 4}} mb={3} pt={3} flexShrink={0}>{content}</Box>
    </Flex>;

    return <MainLayout>
        <Box display={{_: 'block', md: 'none'}}>{smallLayout}</Box>
        <Box display={{_: 'none', md: 'block'}}>{largeLayout}</Box>
    </MainLayout>
}


