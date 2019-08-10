// @flow
import type {Node} from 'react';
import React from 'react';
import {graphql} from 'gatsby';
import MainLayout from './MainLayout';
import {NavList, NavListHeading, NavListItem} from './Affordance';

type Props = {};

export default function ApiLayout({data, children}: Props) {
    const {frontmatter, fields, headings, body} = data.mdx;
    return <MainLayout
        sidebar={<Sidebar allFile={data.allFile} />}
        minimap={<Minimap headings={headings} slug={fields.slug} title={frontmatter.title} />}
        body={body}
        title={frontmatter.title}
    />;
}

function Sidebar({allFile}): Node {
    return <NavList>
        {allFile.group.map(group => {
            return <>
                <NavListHeading as="h3" textStyle="strong">{group.fieldValue}</NavListHeading>
                <NavList>{group.nodes.map(ii => {
                    const {title} = ii.childMdx.frontmatter;
                    const {slug} = ii.childMdx.fields;
                    return <NavListItem key={slug} to={slug}>{title}</NavListItem>;
                })}</NavList>
            </>
        })}
    </NavList>;
}

function Minimap({headings, slug, title}): Node {
    return <NavList color="muted" fontSize=".8em">
        <NavListHeading to={slug} mt={2}>{title}</NavListHeading>
        {headings.map(({depth, value}) => {
            switch (depth) {
                case 1:
                case 2:
                    return <NavListHeading to={`${slug}#${value}`} mt={2}>{value}</NavListHeading>;

                case 3:
                default:
                    return <NavListItem to={`${slug}#${value}`}>{value}</NavListItem>;

            }
        })}
    </NavList>;
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
    mdx(id: { eq: $id }) {
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
`




