//@flow
import React from "react";
import Link from 'gatsby-link';
import type {Node} from 'react';

export default function TypeLink({name}: Object): Node {
    return <Link className="Link" to={`/api/${name}`}>{name}</Link>;
}
