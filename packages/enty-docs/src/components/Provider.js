// @flow
import type {Node} from 'react';

import React from 'react';
import styled from 'styled-components';
import {ThemeProvider} from 'styled-components';
import {MDXProvider} from "@mdx-js/react"
import {
    Code,
    Image,
    Link,
    List,
    ListItem,
    Quote,
    Table,
    TableHeadCell,
    Text
} from './Affordance';


type Props = {
};

export default function Provider(props: Props): Node {
    const {children, theme} = props;

    const mdxComponents = {
        a: Link,
        blockquote: Quote,
        em: ({children}) => <Text as="em" textStyle="em" my={3}>{children}</Text>,
        h1: (props) => <Text as="h1" textStyle="h1" mb={3} {...props} />,
        h2: (props) => <Text as="h2" textStyle="h2" mt={4} mb={3} {...props} />,
        h3: (props) => <Text as="h3" textStyle="h3" mt={3} {...props} />,
        img: (props) => <Image maxWidth="100%" {...props} />,
        inlineCode: ({children}) => <Text as="code" textStyle="code" my={3}>{children}</Text>,
        li: ListItem,
        p: ({children}) => <Text as="p" mb={3}>{children}</Text>,
        pre: Code,
        strong: ({children}) => <Text as="strong" textStyle="strong" my={3}>{children}</Text>,
        table: Table,
        th: TableHeadCell,
        ul: ({children}) => <List my={3}>{children}</List>,
        ol: ({children}) => <List as="ol" my={3}>{children}</List>
    };

    return <ThemeProvider theme={theme}>
        <MDXProvider components={mdxComponents}>
            {children}
        </MDXProvider>
    </ThemeProvider>;

}

