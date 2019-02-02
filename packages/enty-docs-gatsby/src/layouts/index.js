// @flow
import React from "react";
import type {Node} from "react";
import PropTypes from "prop-types";
import Helmet from "react-helmet";
import {Wrapper} from 'obtuse';
import Navigation from '../components/Navigation';

import "./index.scss";

function TemplateWrapper(props: Object): Node {
    const {allSitePage} = props.data;
    return <div>
        <Helmet
            title="Enty"
            meta={[
                //{name: "description", content: "Sample"},
                //{name: "keywords", content: "sample, something"}
            ]}
        />
        <Navigation allSitePage={allSitePage}/>
        <Wrapper>
            {props.children()}
        </Wrapper>
    </div>;
}


export const query = graphql`
    query NavigationQuery {
      allSitePage(filter: {context: {kind: {eq: "api"}}}) {
        edges {
          node {
            id
            path
            context {
              slug
              name
              kind
            }
          }
        }
      }
    }
`;

TemplateWrapper.propTypes = {
    children: PropTypes.func
};

export default TemplateWrapper;
