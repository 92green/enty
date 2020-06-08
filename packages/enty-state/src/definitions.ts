import EntityStore from './EntityStore';

export type Observable = {subscribe: Function};
export type AsyncType = Promise<any> | Observable | AsyncGenerator<any, any, any>;
export type SideEffect = <A, B>(
    payload: A,
    meta: {key: string; store: EntityStore<B>}
) => AsyncType;
