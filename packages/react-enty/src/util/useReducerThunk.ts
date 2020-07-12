import {useRef, useState} from 'react';

export default function useThunkReducer<State>(
    reducer: Function,
    initialState: State
): [State, Function] {
    const [hookState, setHookState] = useState(initialState);

    // State management.
    const state = useRef(hookState);
    const getState = () => state.current;
    const setState = (newState: State) => {
        state.current = newState;
        setHookState(newState);
    };

    // Reducer and augmented dispatcher.
    const reduce = (action) => reducer(getState(), action);
    const dispatch = (action) =>
        typeof action === 'function' ? action(dispatch, getState) : setState(reduce(action));

    return [hookState, dispatch];
}
