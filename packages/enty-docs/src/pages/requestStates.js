//@flow
/* global graphql: false */
import React from 'react';
import type {Node} from 'react';
import Link from 'gatsby-link';
import {Text} from 'obtuse';
import {Box} from 'obtuse';

class RequestStates extends React.Component<Object> {
    render(): Node {
        return <Box modifier="paddingKilo">
            <ul>
                {this.props.data.allDocumentationJs.edges.map(({node}) => <li key={node.memberof + node.name}>
                    <Link className="Link" to={`/api/${node.memberof ? node.memberof : node.name}`}>
                        <Text modifier="block">{node.memberof ? `${node.memberof}.` : ''}{node.name}</Text>
                    </Link>
                </li>)}
            </ul>
        </Box>;
    }
}

export default RequestStates;

export const pageQuery = graphql`
query RequestStates {
    allDocumentationJs(sort: {fields: [fields___sortBy, name]}) {
        edges {
            node {
                name
                memberof
            }
        }
    }
}
`;
