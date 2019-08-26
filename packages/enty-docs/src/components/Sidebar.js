// @flow
import type {Node} from 'react';
import React from 'react';
import {NavList, NavListHeading, NavListItem} from './Affordance';

export default function Sidebar({allFile}): Node {
    return <NavList>
        {allFile.group.map(group => {
            const key = group.fieldValue;
            return <>
                <NavListHeading key={`${key}title`} as="h3" textStyle="strong">{key}</NavListHeading>
                <NavList key={`${key}list`}>{group.nodes.map(ii => {
                    const {title} = ii.childMdx.frontmatter;
                    const {slug} = ii.childMdx.fields;
                    return <NavListItem key={slug} to={slug}>{title}</NavListItem>;
                })}</NavList>
            </>
        })}
    </NavList>;
}

