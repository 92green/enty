import styled from 'styled-components';
import {
    space,
    color,
    layout,
    flexbox,
    position,
    typography,
    textStyle,
    border,
    compose
} from 'styled-system';
const styledProps = compose(border, color, flexbox, layout, position, space, textStyle, typography);

export const Box = styled.div({display: 'block'}, styledProps, border);
export const Flex = styled.div({display: 'flex'}, styledProps);
export const Fixed = styled.div({position: 'fixed'}, styledProps);
export const Absolute = styled.div({position: 'absolute'}, styledProps);
export const Sticky = styled.div({position: 'sticky', top: 0}, styledProps);
export const Wrapper = styled.div({maxWidth: '1400px', margin: 'auto'}, styledProps);
