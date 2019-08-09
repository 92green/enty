// @flow
import React from 'react';
import styled from 'styled-components';
import {space, layout, textStyle, typography, color} from 'styled-system';
import GatsbyLink from 'gatsby-link';

const getColor = (key) => (props) => props.theme.colors[key];

export const List = styled.ul`
    ${space}
    padding-left: 1.8em;
    position: relative;
`;

export const ListItem = styled.li`
    ul > & {
        &:before {
            content: '*';
            position: absolute;
            left: .6em;
        }
    }

    ol > & {
        list-style-type: decimal;
    }
`;




export const Link = styled((props) => props.href ? <a {...props} /> : <GatsbyLink {...props} />)`
    ${color}
    color: ${_ => _.theme.colors.link};
    &:visited {
        color: ${_ => _.theme.colors.link};
    }
`;



export const Label = styled.span`
   color: ${_ => _.theme.colors.comment};
`;

export const Input = styled.input`
    background-color: ${p => p.theme.colors.black};
    color: ${p => p.theme.colors.fg};
    border: none;
    font-size: inherit;
    font-family: inherit;
    display: block;
    width: 100%;
`;


const syntax = (key, color) => (props) => `& .${key} {color: ${props.theme.colors[color]};}`;
export const Code = styled.pre`
    color: ${_ => _.theme.colors.codeFg};
    background-color: ${_ => _.theme.colors.codeBg};
    font-family: ${_ => _.theme.fonts.code};
    font-size: 13px;
    line-height: 1.4;
    margin: 1em 0;
    padding: 1rem;
    overflow-x: auto;

    ${syntax('comment', 'comment')}
    ${syntax('keyword', 'orange')}
    ${syntax('string', 'green')}
    ${syntax('number', 'blue')}
    ${syntax('tag', 'yellow')}
    ${syntax('script', 'codeFg')}

    ${syntax('selector', 'yellow')}
    ${syntax('property', 'red')}

    .gatsby-highlight-code-line {
        display: block;
        background-color: ${getColor('lineHighlight')};
        margin: 0 -.6em;
        padding: 0 .6em;
    }

    code {
        display: block;
    }
`;

export const Quote = styled.blockquote`
    font-style: italic;
    overflow: hidden;
    position: relative;
    padding-left: 1.2em;
    padding-top: 1.2em;
    margin: 1em 0;
    color: ${getColor('purple')};
    &:before {
        content: '>\\A>\\A>\\A>\\A>\\A>\\A>\\A>\\A>\\A>\\A>\\A>\\A>\\A>\\A>\\A>\\A>\\A>\\A>\\A>\\A>\\A>\\A>\\A>\\A>\\A>\\A>\\A>\\A>\\A>\\A>\\A>\\A>\\A>\\A>\\A>\\A>\\A>\\A>\\A>\\A>\\A>\\A>\\A>\\A>\\A>\\A>\\A>\\A>\\A>\\A>\\A>\\A>\\A>\\A>\\A>\\A>\\A>\\A>\\A>\\A>\\A>\\A>\\A>\\A>\\A>\\A>\\A>\\A>\\A>\\A>\\A>\\A>\\A>\\A>\\A>\\A>\\A>\\A>\\A>\\A>\\A>\\A>\\A>\\A>\\A>\\A>\\A>\\A>\\A>\\A>\\A>\\A>\\A>\\A>\\A>\\A>\\A>\\A>\\A>';
        position: absolute;
        left: 0;
        white-space: pre;
        top: -2px;
    }
`;

export const Text = styled.span({}, textStyle, typography, space, color);

export const Heading = styled(Text)``;
Heading.defaultProps = {
    as: 'h1',
    textStyle: 'h1'
};

export const SubHeading = styled(Text)``;
SubHeading.defaultProps = {
    as: 'h2',
    textStyle: 'h2'
};


export const Image = styled('img')({}, layout);

//
// Tables

export const Table = styled.table`
    width: 100%;
    border-bottom: 1px solid;
`;

export const TableHeadCell = styled.th`
    border-bottom: 1px solid;
    text-align: left;
    font-weight: bold;
`;
