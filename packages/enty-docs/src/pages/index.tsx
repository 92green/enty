import React from 'react';
import MainLayout from '../components/MainLayout';
import {Text, Button} from '../components/Affordance';
import {Box, Flex, Wrapper} from '../components/Layout';
import Declarative from '../images/declarative.svg';
import UpToDate from '../images/uptodate.svg';
import LowBoilerPlate from '../images/boilerplate.svg';
import Predictable from '../images/predictable.svg';

export default function App() {
    return (
        <MainLayout wrapper={false}>
            <Box mb={4} backgroundColor="#1b1a35" color="white">
                <Wrapper>
                    <Box py={[4, 6]} px={4}>
                        <Text as="h1" textStyle="h1" fontWeight={900} fontSize={64}>
                            Enty
                        </Text>
                        <Text as="h2" textStyle="h2" mb={2}>
                            Normalized State Management
                        </Text>
                        <Box width={[1, null, 0.6]}>
                            <Text as="p">
                                Enty is a framework for managing data requested from APIs. Instead
                                of you manually storing data, Enty uses schemas to describe
                                relationships and stores the data as normalized entities.
                            </Text>
                        </Box>

                        <Flex mt={4} display={['block', 'flex']}>
                            <Box mb={[3, 0]} mr={[0, 3]}>
                                <Button to="/tutorial/getting-started/">Getting Started</Button>
                            </Box>
                            <Button href="http://github.com/blueflag/enty/">Github</Button>
                        </Flex>
                    </Box>
                </Wrapper>
            </Box>
            <Wrapper>
                <Flex display={['block', 'flex']} justifyContent="space-between" mb={4}>
                    <Box m={4}>
                        <img src={Declarative} alt="Declarative" />
                        <Text as="h3" textStyle="h3">
                            Declarative
                        </Text>
                        <Text>Describe relationships between your entitites, dont code them.</Text>
                    </Box>
                    <Box m={4}>
                        <img src={UpToDate} alt="Declarative" />
                        <Text as="h3" textStyle="h3">
                            Always up to date
                        </Text>
                        <Text>{`Don't waste time making sure relationships are kept up to date.`}</Text>
                    </Box>
                    <Box m={4}>
                        <img src={LowBoilerPlate} alt="Declarative" />
                        <Text as="h3" textStyle="h3">
                            Low boilerplate
                        </Text>
                        <Text>Zero reducers, actions, action-creators, or selectors.</Text>
                    </Box>
                    <Box m={4}>
                        <img src={Predictable} alt="Declarative" />
                        <Text as="h3" textStyle="h3">
                            Predictable
                        </Text>
                        <Text>Be confident your app is always rendering the correct state.</Text>
                    </Box>
                </Flex>
            </Wrapper>
        </MainLayout>
    );
}
