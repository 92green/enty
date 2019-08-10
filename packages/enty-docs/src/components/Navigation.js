// @flow
import type {Node} from 'react';

import React from 'react';
import styled from 'styled-components';
import {Flex, Box, Wrapper} from './Layout';
import {Link, Text} from './Affordance';


type Props = {
};

function Navigation(props: Props): Node {
    const api = <Link to="/api/entity-schema" color="navigationCopy">Api</Link>;
    const tutorial = <Link to="/tutorial/getting-started" color="navigationCopy">Tutorial</Link>;
    const logo = 'Logo';
    const title = <Text color="navigationCopy">Enty</Text>;

    return <Box className={props.className}>
        <Wrapper>
            <Flex justifyContent="space-between" p={3}>
                <Flex>
                    <Box>{logo}</Box>
                    <Box>{title}</Box>
                </Flex>
                <Flex>
                    <Box px={2}>{api}</Box>
                    <Box px={2}>{tutorial}</Box>
                </Flex>
            </Flex>
        </Wrapper>
    </Box>;
}

export default styled(Navigation)`
    background-color: ${p => p.theme.colors.alpha};,
`;
