// @flow
import {useEffect} from 'react';

export default function useAutoRequest(fn: Function, deps: Array<mixed> = []) {
    return useEffect(() => {
        fn();
    }, deps);
}

