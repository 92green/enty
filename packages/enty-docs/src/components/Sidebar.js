// @flow
import type {Node} from 'react';
import React from 'react';
import {NavList, NavListHeading, NavListItem} from './Affordance';

export default function Sidebar({allFile}): Node {
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

