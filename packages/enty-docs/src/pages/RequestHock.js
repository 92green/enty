// @flow
import type {Node} from 'react';
import React from 'react';
import RequestHockMarkdown from 'babel-loader!mdx-loader!./RequestHock.md';

export default class RequestHock extends React.Component<Object> {
    render(): Node {
        let {data} = this.props;
        return <RequestHockMarkdown data={data} />;
    }
}


export const pageQuery = graphql`
fragment RequestHockNode on DocumentationJs {
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
    fields {
      type
      key
      value {
        type
        name
        expression {
          type
          name
          elements {
            type
            name
            applications {
              type
              name
            }
            expression {
              type
              name
            }
          }
        }
      }
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
          expression {
            type
            name
          }
          applications {
            type
            name
          }
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

query RequestHockQuery {
  RequestHockConfig: documentationJs(fields: {name: {eq: "RequestHockConfig"}}) {
    ...RequestHockNode
  }
  RequestHock: documentationJs(fields: {name: {eq: "RequestHock"}}) {
    ...RequestHockNode
  }

}
`;
