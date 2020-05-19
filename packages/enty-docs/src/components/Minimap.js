// @flow
import type {Node} from 'react';
import React from 'react';
import {NavList, NavListHeading, NavListItem} from './Affordance';

export default function Minimap({headings, slug, title}): Node {
    return <NavList color="muted" fontSize=".8em">
        <NavListHeading to={slug} mt={2}>{title}</NavListHeading>
        {headings.map(({depth, value}) => {
            const anchor = value.replace(/ /g, '').toLowerCase();
            switch (depth) {
                case 1:
                case 2:
                    return <NavListHeading to={`${slug}#${anchor}`} mt={2}>{value}</NavListHeading>;

                case 3:
                default:
                    return <NavListItem to={`${slug}#${anchor}`}>{value}</NavListItem>;

            }
        })}
    </NavList>;
}

