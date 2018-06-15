//@flow
import identity from 'unmutable/lib/identity';
import PropChangeHock from 'stampy/lib/hock/PropChangeHock';
import type {RequestHockConfig} from './definitions';
import type {MultiRequestHockConfig} from './definitions';

export default function AutoHockFactory(config: RequestHockConfig|MultiRequestHockConfig): * {
    // eslint-disable-next-line
    const {shouldComponentAutoRequest = (_) => true} = config;
    const {name} = config;
    const {auto} = config;

    if(auto) {
        return PropChangeHock(() => ({
            paths: typeof auto === 'boolean' ? [] : auto,
            onPropChange: (props: *): * => {
                if(shouldComponentAutoRequest(props)) {
                    props[name].onRequest(props);
                }
            }
        }));
    }

    return identity();
}
