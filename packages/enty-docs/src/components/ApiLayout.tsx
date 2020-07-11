import {Node} from 'react';
import React from 'react';
import {graphql} from 'gatsby';
import DocsLayout from './DocsLayout';
import Minimap from './Minimap';
import Sidebar from './Sidebar';

type Props = {};

export default function ApiLayout({data, children}: Props): Node {
    const {frontmatter, fields, headings, body} = data.mdx;
    return (
        <DocsLayout
            sidebar={<Sidebar allFile={data.allFile} />}
            minimap={<Minimap headings={headings} slug={fields.slug} title={frontmatter.title} />}
            body={body}
            title={frontmatter.title}
        />
    );
}

export const pageQuery = graphql`
    query ApiLayoutQuery($id: String) {
        allFile(filter: {sourceInstanceName: {eq: "api"}}) {
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
