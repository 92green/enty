// @flow
import type {Node} from 'react';
import React from 'react';
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

import Normalize from '../partials/Normalize';
import Denormalize from '../partials/Denormalize';


type Props = {
};

export default function Provider(props: Props): Node {
    const {children, theme} = props;

    const mdxComponents = {
        Normalize,
        Denormalize,
        a: Link,
        blockquote: Quote,
        em: ({children}) => <Text as="em" textStyle="em" my={3}>{children}</Text>,
        h1: ({children: id}) => <Text as="h1" textStyle="h1" mb={3} id={id} children={id} />,
        h2: ({children: id}) => <Text as="h2" textStyle="h2" pt={4} mb={3} id={id} children={id} />,
        h3: ({children: id}) => <Text as="h3" textStyle="h3" pt={3} id={id} children={id} />,
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
        <MDXProvider components={mdxComponents} children={children} />
    </ThemeProvider>;

}

