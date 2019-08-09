// @flow
import styled from 'styled-components';
import {space, color, layout, flexbox, position} from 'styled-system';


export const Box = styled.div.attrs(props => {
    if(props.bounded) {
        props.p = 3;
    }
    return props;
})`
    ${layout} ${space} ${color} ${flexbox}
    ${props => props.bounded ? `border: 1px solid ${props.theme.colors.yellow};` : ''}
`;

export const Flex = styled.div({display: 'flex'}, space, color, layout, flexbox);

export const Fixed = styled.div({position: 'fixed'}, space, layout, position);

