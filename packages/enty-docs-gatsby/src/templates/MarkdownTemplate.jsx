//@flow
import React from "react";
import type {Node} from "react";
import {Text} from 'obtuse';

export default function Template({data}: Object): Node {
    const {markdownRemark} = data; // data.markdownRemark holds our post data
    const {frontmatter, html} = markdownRemark;
    return (
        <div className="blog-post-container">
            <div className="blog-post">
                <Text element="h1" modifier="sizeGiga marginGiga">{frontmatter.title}</Text>
                <div className="Typography" dangerouslySetInnerHTML={{__html: html}} />
            </div>
        </div>
    );
}

export const pageQuery = graphql`
  query BlogPostByPath($path: String!) {
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        path
        title
      }
    }
  }
`;
