import React from 'react';
import styled from 'styled-components';
import {space, layout, textStyle, typography, color} from 'styled-system';
import GatsbyLink from 'gatsby-link';
import getIn from 'unmutable/getIn';

const theme = (...keys) => getIn(['theme', ...keys]);
const getColor = (key) => (props) => props.theme.colors[key];

export const List = styled.ul`
    ${space}
    padding-left: 1em;
    position: relative;
`;

export const ListItem = styled.li`
    ${textStyle}
    ul > & {
        list-style-type: disc;
    }

    ol > & {
        list-style-type: decimal;
    }
`;

export const Link = styled(({textStyle, ...props}) =>
    props.href ? <a {...props} children={props.children} /> : <GatsbyLink {...props} />
)`
    color: ${(_) => _.theme.colors.link};
    &:visited {
        color: ${(_) => _.theme.colors.link};
    }
`;

export const Button = styled(Link)`
    background: ${theme('colors', 'alpha')};
    display: block;
    padding: 0.5rem 1rem;
    text-decoration: none;
    text-align: center;
    color: ${theme('colors', 'bg')};
    &:visited {
        color: ${theme('colors', 'bg')};
    }
`;

export const NavigationLink = styled(Link)`
    color: ${theme('colors', 'bg')};
    text-decoration: none;
    &:visited {
        color: ${theme('colors', 'bg')};
    }
`;

export const Label = styled.span`
    color: ${(_) => _.theme.colors.comment};
`;

export const Input = styled.input`
    background-color: ${(p) => p.theme.colors.black};
    color: ${(p) => p.theme.colors.fg};
    border: none;
    font-size: inherit;
    font-family: inherit;
    display: block;
    width: 100%;
`;

const syntax = (key, color) => (props) => `& .${key} {color: ${props.theme.colors[color]};}`;
export const Code = styled.pre`
    color: ${(_) => _.theme.colors.codeFg};
    background-color: ${(_) => _.theme.colors.codeBg};
    font-family: ${(_) => _.theme.fonts.code};
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
`;

export const Text = styled.span({}, textStyle, typography, space, color);
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

export const TableCell = styled.td`
    padding: ${theme('space', 1)}px 0;
`;

// Navgation Lists

export const NavList = styled.ul`
    ${typography}
    ${color}
    padding-bottom: ${theme('space', 3)}px;
`;

const ItemLink = (props) => <li>{props.to ? <GatsbyLink {...props} /> : <Text {...props} />}</li>;
export const NavListHeading = styled(ItemLink)`
    ${space}
    color: ${theme('colors', 'fg')};
    font-weight: 500;
    display: block;
    text-decoration: none;
`;

export const NavListItem = styled(ItemLink)`
    color: ${theme('colors', 'muted')};
    font-size: ${theme('fontSizes', 1)}px;
    display: block;
    text-decoration: none;
`;
