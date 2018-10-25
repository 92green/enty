//@flow
import identity from 'unmutable/lib/identity';
import PropChangeHoc from './PropChangeHoc';
import type {AutoHockConfig} from './definitions';

export default function AutoHockFactory(config: AutoHockConfig & {name: string}): * {
    // eslint-disable-next-line
    const {shouldComponentAutoRequest = (_) => true} = config;
    const {name} = config;
    const {auto} = config;

    if(auto) {
        return PropChangeHoc({
            paths: typeof auto === 'boolean' ? [] : auto,
            onPropChange: (props: *): * => {
                if(shouldComponentAutoRequest(props)) {
                    props[name].onRequest(props);
                }
            }
        });
    }

    return identity();
}
