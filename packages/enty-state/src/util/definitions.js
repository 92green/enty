// @flow

export type Observable = {
    subscribe: Function
};

export type AsyncType = Promise<*> | Observable;
export type SideEffect = (*, Object) => AsyncType;
