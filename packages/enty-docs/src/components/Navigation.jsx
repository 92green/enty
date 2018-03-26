//@flow
import React from "react";
import type {Node} from 'react';
import Link from 'gatsby-link';

import {ListItem} from 'obtuse';
import {Text} from 'obtuse';

export default function Navigation(props: Object): Node {

    function NavItem(props: Object): Node {
        return <ListItem>
            <Link to={props.to} className="Link">{props.children}</Link>
        </ListItem>;
    }

    const NavHeading = (props) => <ListItem style={{marginTop: '1rem'}}><Text modifier="muted">{props.children}</Text></ListItem>;

    return <ul className="Navigation">
        <NavHeading>Enty</NavHeading>
        <NavItem to="/">Introduction</NavItem>
        <NavItem to="/getting-started">Getting Started</NavItem>
        <NavItem to="/entity-flow">Entity Flow</NavItem>
        <NavItem to="/faq">FAQ</NavItem>

        <NavHeading>Schemas</NavHeading>
        <NavItem to="/api/EntitySchema">EntitySchema</NavItem>
        <NavItem to="/api/ObjectSchema">ObjectSchema</NavItem>
        <NavItem to="/api/ArraySchema">ArraySchema</NavItem>
        <NavItem to="/api/MapSchema">MapSchema</NavItem>
        <NavItem to="/api/ListSchema">ListSchema</NavItem>
        <NavItem to="/api/DynamicSchema">DynamicSchema</NavItem>
        <NavItem to="/api/ValueSchema">ValueSchema</NavItem>
        <NavItem to="/api/CompositeEntitySchema">CompositeEntitySchema</NavItem>


        <NavHeading>React Entity</NavHeading>
        <NavItem to="/api/EntityApi">EntityApi</NavItem>
        <NavItem to="/api/EntityQueryHock">EntityQueryHock</NavItem>
        <NavItem to="/api/EntityMutationHock">EntityMutationHock</NavItem>

        <NavHeading>React Entity - Internal</NavHeading>
        <NavItem to="/api/EntityQueryHockFactory">EntityQueryHockFactory</NavItem>
        <NavItem to="/api/EntityMutationHockFactory">EntityMutationHockFactory</NavItem>
        <NavItem to="/api/MultiQueryHockFactory">MultiQueryHockFactory</NavItem>
        <NavItem to="/api/MultiMutationHockFactory">MultiMutationHockFactory</NavItem>

        <NavItem to="/api/selectEntityByResult">selectEntityByResult</NavItem>
        <NavItem to="/api/selectEntityById">selectEntityById</NavItem>
        <NavItem to="/api/selectEntityByType">selectEntityByType</NavItem>
        <NavItem to="/api/selectRequestState">selectRequestState</NavItem>


        <NavHeading>Misc</NavHeading>
        <NavItem to="/types">All Types</NavItem>
    </ul>;
}

