//@flow
import React from "react";
import type {Node} from 'react';
import {Text} from 'obtuse';
import {Typography} from 'obtuse';

import getIn from 'unmutable/lib/getIn';



export default function DocumentationTemplate(props: Object): Node {
    const {data} = props;
    const {edges} = data.allDocumentationJs;

    return <div>
        <Text element="h1" modifier="sizeGiga marginGiga">{edges[0].node.fields.name}</Text>

        {edges.map(({node}: Object): Node => {
            const {name} = node;
            const {params} = node;
            const {returns} = node;
            const {description} = node;

            console.log(node);

            const prettyName = name === 'constructor' ? node.fields.name : name;
            const typeAllLiteral = ii => ii.type === 'AllLiteral' ? '*' : ii.name;

            const paramString = params
                .map(pp => <Text element="div">
                    <Text>    </Text>
                    <Text>{pp.name}: </Text>
                    <Text modifier="primary">{
                        pp.type.expression && pp.type.applications
                            ? String(pp.type.expression.name)
                                .concat(`<${pp.type.applications.map(typeAllLiteral).join(', ')}>`)
                            : typeAllLiteral(pp.type)
                    }</Text>
                    {pp.description && <Text modifier="muted">{` // ${pp.description.internal.content.replace(/\n$/, "")}`}</Text>}
                </Text>);

            const returnString = returns.map(pp => <Text>
                <Text>: </Text>
                <Text modifier="primary">{typeAllLiteral(pp.type)}</Text>
                {pp.description && <Text modifier="muted">{` // ${pp.description.internal.content.replace(/\n$/, "")}`}</Text>}
            </Text>)[0];

            return <div key={node.id} style={{marginTop: '5rem'}}>
                <Text element="h2" modifier="sizeMega marginGiga">{name}</Text>
                <Typography dangerouslySetInnerHTML={{__html: getIn(['childMarkdownRemark', 'html'])(description)}}/>
                <Text element="pre">
                    <Text>{name === 'constructor' ? 'new ' : ''}</Text>
                    <Text>{prettyName}</Text>
                    <Text>({paramString})</Text>
                    <Text>{returnString}</Text>
                </Text>

                {node.examples.map(ee => <div className="Code" dangerouslySetInnerHTML={{__html: ee.highlighted}}/>)}
                {/*
                {description && <p>{description.internal.content}</p>}
                <Text element="h3" modifier="sizeMega marginMega">Params</Text>
                <Table>
                    <TableBody>
                        {params.map(pp => (
                            <TableRow key={pp.name}>
                                <TableCell>{pp.name}</TableCell>
                                <TableCell>{pp.type.name}</TableCell>
                                <TableCell>{pp.description && <p>{pp.description.internal.content}</p>}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <Text element="h3" modifier="sizeMega marginMega">Returns</Text>
                <Table>
                    <TableBody>
                        {returns.map(pp => (
                            <TableRow key={pp.name}>
                                <TableCell>{pp.name}</TableCell>
                                <TableCell>{pp.type.name}</TableCell>
                                <TableCell>{pp.description && <p>{pp.description.internal.content}</p>}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                */}
            </div>;
        })}
    </div>;
}

export const query = graphql`
query DocumentationQuery($name: String!) {
  allDocumentationJs(filter: {fields: {name: {eq: $name}}}) {
    edges {
      node {
        id
        name
        kind
        scope
        fields {
          slug
          name
        }
        description {
          childMarkdownRemark {
            html
          }
        }
        returns {
          title
          description {
            internal {
              content
            }
          }
          type {
            name
            type
          }
        }
        examples {
          raw
          highlighted
        }
        params {
          name
          default
          title
          name
          type {
            name
            type
            applications {
              type
              name
            }
            expression {
              type
              name
            }
          }
          description {
            internal {
              content
            }
          }
        }
      }
    }
  }
}

`;
