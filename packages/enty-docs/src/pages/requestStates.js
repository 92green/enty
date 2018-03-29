//@flow
/* global graphql: false */
import React from 'react';
import type {Node} from 'react';
import Link from 'gatsby-link';
import Doclet from '../components/Doclet';


class RequestStates extends React.Component<Object> {
    render(): Node {
        const {data} = this.props;
        const {requestState} = data;
        const {edges} = data.requestStates;


        return <div>
            {[].concat({node: requestState}).concat(edges).map(({node}: Object, index: number): Node => {
                return <Doclet node={node} primary={index === 0} />;
            })}
        </div>;
    }
}

export default RequestStates;

export const pageQuery = graphql`
fragment Node on DocumentationJs {
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

query RequestStates {
  requestState: documentationJs(fields: {name: {eq: "RequestState"}}) {
    ...Node
  }
  requestStates: allDocumentationJs(filter: {fields: {name: {regex: "/(Empty|Fetching|Refetching|Error|Succes)State/"}}}) {
    edges {
      node {
        ...Node
      }
    }
  }
}

`;
