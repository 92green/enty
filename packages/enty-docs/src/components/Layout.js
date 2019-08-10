// @flow
import styled from 'styled-components';
import {space, color, layout, flexbox, position, typography, textStyle, border} from 'styled-system';

const props = [space, flexbox, layout, position, color, typography, textStyle, border];


export const Box = styled.div.attrs(props => {
    if(props.bounded) {
        props.p = 3;
    }
    return props;
})`
    ${layout} ${space} ${color} ${flexbox}
    ${props => props.bounded ? `border: 1px solid ${props.theme.colors.yellow};` : ''}
`;

export const Flex = styled.div({display: 'flex'}, ...props);

export const Fixed = styled.div({position: 'fixed'}, ...props);
export const Sticky = styled.div({position: 'sticky', top: 0}, ...props)
export const Wrapper = styled.div({maxWidth: '1400px', margin: 'auto'});
