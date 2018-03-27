//@flow
import React from "react";
import Link from 'gatsby-link';
import type {Node} from 'react';
import {Text} from 'obtuse';
import {Typography} from 'obtuse';
import getIn from 'unmutable/lib/getIn';

function separate(divider: string, mapper: Function): Function {
    return (item, key) => <Text key={key}>
        {key > 0 && <Text>{divider}</Text>}
        {mapper(item, key)}
    </Text>;
}

function FunctionType({type}: Object): Node {
    if(!type.params && !type.result) {
        return <Text modifier="primary">Function</Text>;
    }
    return <Text >
        <Text>({type.params.map(separate(', ', (type) => <Text>
            <Text>{type.name}: </Text>
            <TypeLink type={type.expression}/>
        </Text>))})</Text>
        <Text> => {type.result ? <TypeLink type={type.result}/> : 'void'}</Text>
    </Text>;
}

function NodePrefix({node}: Object): Node {


    const {scope, memberof, name} = node;

    if(name === 'constructor') {
        return <Text>new </Text>;
    }

    if(scope === 'instance') {
        return <Text>{memberof[0].toLowerCase()}{memberof.slice(1)}.</Text>;
    }

    return null;
}

function Keys(param: Object, ii: number): Node {
    const {name, type, description, default: def} = param;
    return <Text element="div" key={`${name}${ii}`}>
        <Text>    </Text>
        <Text>{name}{type.type === 'OptionalType' ? '?' : ''}: </Text>
        <TypeLink type={type}/>
        {def && <Text> = {def}</Text>}
        {description && <Text modifier="muted">{` // ${description.internal.content.replace(/\n$/, "")}`}</Text>}
    </Text>;
}

function Spread(param: Object): Node {
    const {name, type, description, default: def} = param;

    return <Text element="div" key={name}>
        <Text>        </Text>
        {type && type.type === 'RestType' && '...'}
        <Text>{name}</Text>
        {def && <Text> = {def}</Text>}
        {description && <Text modifier="muted">{` // ${description.internal.content.replace(/\n$/, "")}`}</Text>}
    </Text>;
}

function NodeName({node}: Object): Node {
    const {params = [], name, returns = []} = node;
    const {kind} = node;
    const {properties} = node;
    const {type} = node;
    const prettyName = name === 'constructor' ? node.fields.name : name;

    const paramString = params
        .map(Keys);

    const returnString = returns.map(pp => <Text>
        <Text>: </Text>
        <TypeLink type={pp.type}/>
        {pp.description && <Text modifier="muted">{` // ${pp.description.internal.content.replace(/\n$/, "")}`}</Text>}
    </Text>)[0];

    if(name[0] === '$') {
        return <Text>
            <Text>{'   {'}</Text>
            {properties.map(Spread)}
            <Text>{'   }\n'}</Text>
        </Text>;
    }


    if(kind === 'typedef' || kind === 'interface') {
        if(type && type.type === 'FunctionType') {
            return <Text>{name} = <FunctionType type={type}/></Text>;
        }

        if(properties.length) {
            return <Text>
                <Text>{'{'}</Text>
                {properties.map(Keys)}
                <Text>{'}'}</Text>
            </Text>;
        }
        return <Text>
            <Text>{name} = </Text>
            <TypeLink type={node.type}/>
        </Text>;

    }

    if(kind === 'class' || kind === 'function') {
        return <Text>
            {prettyName}
            <Text>({paramString})</Text>
            {returnString}
        </Text>;
    }

    return null;
}

function TypeLink({type}: Object): Node {
    const {expression, applications, elements, name} = type;
    const typeAllLiteral = ii => ii.type === 'AllLiteral' ? '*' : ii.name;


    let typeString;

    if(type && type.type === 'FunctionType') {
        return <FunctionType type={type} />;
    }

    if(type && type.type === 'NullableType') {
        return <Text modifier="primary">?<TypeLink type={type.expression} /></Text>;
    }

    if(elements) {
        typeString = elements.map(separate('|', type => <TypeLink type={type} />));
    }

    else if(expression) {
        if(applications) {
            typeString = <Text>
                <TypeLink type={expression} />
                <Text>{'<'}</Text>
                <Text>{applications.map(separate(', ', (ii) => <TypeLink type={ii} />))}</Text>
                <Text>{'>'}</Text>
            </Text>;
        }
        else {
            typeString = `${expression.name}`;
        }
    } else {
        typeString = typeAllLiteral(type);
    }


    switch (name) {
        case 'Array':
        case 'Object':
        case 'Function':
        case 'function':
        case 'string':
            return <Text modifier="primary">{name}</Text>;


        default:
            if(expression) {
                if(expression.name) {
                    return <Text modifier="primary">{typeString}</Text>;
                }
                return <TypeLink type={expression} />;
            }

            if(type && type.type === 'AllLiteral') {
                return <Text modifier="primary">{typeString}</Text>;
            }

            return <Link className="Link" to={`/api/${name}`}>{typeString}</Link>;
    }
}


export default function DocumentationTemplate(props: Object): Node {
    const {data} = props;
    const {edges} = data.allDocumentationJs;

    const extend = (node: Object): Node => {
        const {augments} = node;
        if(augments.length) {
            return <Text>extends {augments.map(({name}) =>
                <Text key={name}>
                    <Text> </Text>
                    <Link className="Link" to={`/api/${name}`}>{name}</Link>
                </Text>
            )}</Text>;
        }
    };

    return <div>
        {edges.map(({node}: Object, index: number): Node => {
            const {name} = node;
            const {description} = node;
            const {augments} = node;
            const {kind} = node;
            const {scope} = node;

            console.log(node);

            return <div key={node.id} style={{marginTop: index === 0 ? '' : '6rem'}}>
                {<Text element="h2" modifier={`${index === 0 ? 'sizeGiga' : 'sizeMega'} marginGiga`}>{name}</Text>}
                <Text modifier="block muted marginGiga">
                    <Text>{scope} {kind} </Text>
                    {augments.length > 0 && <Text>{extend(node)}</Text>}
                </Text>
                <Typography dangerouslySetInnerHTML={{__html: getIn(['childMarkdownRemark', 'html'])(description)}}/>
                <Text element="pre" modifier="marginGiga definition">
                    <NodePrefix node={node} />
                    <NodeName node={node} />
                </Text>
                {node.examples.length > 0 && <Text modifier="strong">Examples</Text>}
                {node.examples.map((ee, key) => <div className="Code" key={key} dangerouslySetInnerHTML={{__html: ee.highlighted}}/>)}
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
