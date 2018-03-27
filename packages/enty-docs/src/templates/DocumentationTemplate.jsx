//@flow
import React from "react";
import Link from 'gatsby-link';
import type {Node} from 'react';
import {Text} from 'obtuse';
import {Typography} from 'obtuse';
import getIn from 'unmutable/lib/getIn';
import Doclet from '../components/Doclet';


export default function DocumentationTemplate(props: Object): Node {
    const {data} = props;
    const {edges} = data.allDocumentationJs;


    return <div>
        {edges.map(({node}: Object, index: number): Node => {
            return <Doclet node={node} primary={index === 0} />;
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
        namespace
        memberof
        augments {
          title
          name
        }
        kind
        scope
        fields {
          slug
          name
        }
        type {
          type
          name
          fields {
            type
            key
          }
          expression {
            type
            name
          }
          applications {
            type
          }
          params {
            type
            name
            expression {
              type
              name
            }
          }
          result {
            type
            name
            expression {
              type
              name
            }
            applications {
              type
            }
          }
        }
        properties {
          title
          name
          description {
            internal {
              content
            }
          }
          type {
            type
            name
            result {
              type
              name
            }
            params {
              type
              name
              expression {
                type
                name
                expression {
                  type
                  name
                }
                applications {
                  type
                }
              }
            }
            applications {
              type
              name
            }
            expression {
              type
              name
              expression {
                type
                name
              }
              applications {
                type
                name
              }
              params {
                type
                name
                expression {
                  type
                  name
                }
              }
              result {
                type
                name
              }
              elements {
                type
                name
              }

            }
          }
        }
        description {
          childMarkdownRemark {
            html
          }
        }
        returns {
          title
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
            expression {
              type
              name
            }
          }
          properties {
            title
            name
            default
            type {
              type
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
