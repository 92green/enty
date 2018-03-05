//@flow
import React from 'react';

export default function DocumentationTemplate(props) {
    const {data} = props;
    console.log(data.allDocumentationJs.edges);

    return <div>{data.allDocumentationJs
        .edges
        .map(({node}) => {
            const {name} = node;
            const {params} = node;
            const {description} = node;
            // const {name} = data.documentationJs;

            return <div key={name}>
                <h1>{name}</h1>
                {description && <p>{description.internal.content}</p>}
                <h2>Params</h2>
                <table>
                    <tbody>
                        {params.map(pp => <tr>
                            <td>{pp.name}</td>
                            <td>{pp.type.name}</td>
                            <td>{pp.description && <p>{pp.description.internal.content}</p>}</td>
                        </tr>)}
                    </tbody>
                </table>
            </div>;
        })}</div>;
}



export const query = graphql`
    query DocumentationQuery($name: String!) {
        allDocumentationJs(filter: {fields: {name: {eq: $name}}}) {
            edges {
                node {
                    name
                    fields {
                        slug
                        name
                    }
                    description {
                        id
                        internal {
                            content
                        }
                    }
                    returns {
                        title
                    }
                    examples {
                        raw
                        highlighted
                    }
                    params {
                        name
                        type {
                            name
                        }
                        description {
                            id
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
