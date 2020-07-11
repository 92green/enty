import {Node} from 'react';
import React from 'react';
import {graphql} from 'gatsby';
import DocsLayout from './DocsLayout';
import Minimap from './Minimap';
import {NavList, NavListHeading, NavListItem} from './Affordance';

type Props = {};

export default function TutorialLayout({data, children}: Props): Node {
    const {frontmatter, fields, headings, body} = data.mdx;
    return (
        <DocsLayout
            sidebar={
                <>
                    <NavListHeading as="h3" textStyle="strong">
                        Tutorials
                    </NavListHeading>
                    <NavList>
                        <NavListItem to="/tutorial/introduction">Introduction</NavListItem>
                        <NavListItem to="/tutorial/getting-started">Getting Started</NavListItem>
                        <NavListItem to="/tutorial/schemas">Defining Schemas</NavListItem>
                        <NavListItem to="/tutorial/api">Connecting to an API</NavListItem>
                        <NavListItem to="/tutorial/requesting-data">Requesting Data</NavListItem>
                    </NavList>
                </>
            }
            minimap={<Minimap headings={headings} slug={fields.slug} title={frontmatter.title} />}
            body={body}
            title={frontmatter.title}
        />
    );
}

export const pageQuery = graphql`
    query TutorialLayout($id: String) {
        allFile(filter: {sourceInstanceName: {eq: "tutorial"}}) {
            group(field: childMdx___frontmatter___group) {
                fieldValue
                nodes {
                    childMdx {
                        fields {
                            slug
                        }
                        frontmatter {
                            title
                        }
                        headings {
                            value
                            depth
                        }
                    }
                }
            }
        }
        mdx(id: {eq: $id}) {
            id
            body
            fields {
                slug
            }
            headings {
                depth
                value
            }
            frontmatter {
                title
            }
        }
    }
`;
