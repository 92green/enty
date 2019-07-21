// @flow

type RequestStateProps = {
    isEmpty?: boolean,
    isFetching?: boolean,
    isRefetching?: boolean,
    isSuccess?: boolean,
    isError?: boolean
};

export default class RequestState {
    val: any;
    isEmpty: ?boolean;
    isFetching: ?boolean;
    isRefetching: ?boolean;
    isSuccess: ?boolean;
    isError: ?boolean;

    constructor(value: any, props: RequestStateProps) {
        this.isEmpty = props.isEmpty;
        this.isFetching = props.isFetching;
        this.isRefetching = props.isRefetching;
        this.isSuccess = props.isSuccess;
        this.isError = props.isError;
        this.val = value;
    }

    value(defaultValue: any = null) {
        return this.val == null ? defaultValue : this.val;
    }


    //
    // Empty

    static empty(value: any): RequestState {
        return new RequestState(value, {isEmpty: true});
    }
    emptyFlatMap(fn: (any) => RequestState): RequestState {
        return this.isEmpty ? fn(this.val) : this;
    }
    emptyMap(fn: (any) => any): RequestState {
        return this.isEmpty ? RequestState.empty(fn(this.val)) : this;
    }


    //
    // Fetching

    static fetching(value: any): RequestState {
        return new RequestState(value, {isFetching: true});
    }
    fetchingFlatMap(fn: (any) => RequestState): RequestState {
        return this.isFetching ? fn(this.val) : this;
    }
    fetchingMap(fn: (any) => any): RequestState {
        return this.isFetching ? RequestState.fetching(fn(this.val)) : this;
    }


    //
    // Refetching

    static refetching(value: any): RequestState {
        return new RequestState(value, {isRefetching: true});
    }
    refetchingFlatMap(fn: (any) => RequestState): RequestState {
        return this.isRefetching ? fn(this.val) : this;
    }
    refetchingMap(fn: (any) => any): RequestState {
        return this.isRefetching ? RequestState.refetching(fn(this.val)) : this;
    }


    //
    // Success

    static success(value: any): RequestState {
        return new RequestState(value, {isSuccess: true});
    }
    successFlatMap(fn: (any) => RequestState): RequestState {
        return this.isSuccess ? fn(this.val) : this;
    }
    successMap(fn: (any) => any): RequestState {
        return this.isSuccess ? RequestState.success(fn(this.val)) : this;
    }


    //
    // Error

    static error(value: any): RequestState {
        return new RequestState(value, {isError: true});
    }
    errorFlatMap(fn: (any) => RequestState): RequestState {
        return this.isError ? fn(this.val) : this;
    }
    errorMap(fn: (any) => any): RequestState {
        return this.isError ? RequestState.error(fn(this.val)) : this;
    }

}

