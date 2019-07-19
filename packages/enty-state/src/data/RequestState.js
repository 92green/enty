// @flow

type RequestStateProps = {
    isEmpty?: boolean;
    isFetching?: boolean;
    isRefetching?: boolean;
    isSuccess?: boolean;
    isError?: boolean;
};

export class RequestState<A> {
    val: A;
    isEmpty: ?boolean;
    isFetching: ?boolean;
    isRefetching: ?boolean;
    isSuccess: ?boolean;
    isError: ?boolean;

    constructor(value: A, props: RequestStateProps) {
        this.isEmpty = props.isEmpty;
        this.isFetching = props.isFetching;
        this.isRefetching = props.isRefetching;
        this.isSuccess = props.isSuccess;
        this.isError = props.isError;
        this.val = value;
    }

    value(defaultValue: any = null): mixed {
        return this.val == null ? defaultValue : this.val;
    }


    //
    // Empty

    static empty<B>(value: B): RequestState<B> {
        return new RequestState(value, {isEmpty: true});
    }
    emptyFlatMap<B>(fn: (A) => RequestState<B>): RequestState<B> {
        return this.isEmpty ? fn(this.val) : this;
    }
    emptyMap<B>(fn: (A) => B): RequestState<B> {
        return this.isEmpty ? RequestState.empty(fn(this.val)) : this;
    }


    //
    // Fetching

    static fetching<B>(value: B): RequestState<B> {
        return new RequestState(value, {isFetching: true});
    }
    fetchingFlatMap<B>(fn: (A) => RequestState<B>): RequestState<B> {
        return this.isFetching ? fn(this.val) : this;
    }
    fetchingMap<B>(fn: (A) => B): RequestState<B> {
        return this.isFetching ? RequestState.fetching(fn(this.val)) : this;
    }


    //
    // Refetching

    static refetching<B>(value: B): RequestState<B> {
        return new RequestState(value, {isRefetching: true});
    }
    refetchingFlatMap<B>(fn: (A) => RequestState<B>): RequestState<B> {
        return this.isRefetching ? fn(this.val) : this;
    }
    refetchingMap<B>(fn: (A) => B): RequestState<B> {
        return this.isRefetching ? RequestState.refetching(fn(this.val)) : this;
    }


    //
    // Success

    static success<B>(value: B): RequestState<B> {
        return new RequestState(value, {isSuccess: true});
    }
    successFlatMap<B>(fn: (A) => RequestState<B>): RequestState<B> {
        return this.isSuccess ? fn(this.val) : this;
    }
    successMap<B>(fn: (A) => B): RequestState<B> {
        return this.isSuccess ? RequestState.success(fn(this.val)) : this;
    }


    //
    // Error

    static error<B>(value: B): RequestState<B> {
        return new RequestState(value, {isError: true});
    }
    errorFlatMap<B>(fn: (A) => RequestState<B>): RequestState<B> {
        return this.isError ? fn(this.val) : this;
    }
    errorMap<B>(fn: (A) => B): RequestState<B> {
        return this.isError ? RequestState.error(fn(this.val)) : this;
    }

}

export const EmptyState = RequestState.empty;
export const FetchingState = RequestState.fetching;
export const RefetchingState = RequestState.refetching;
export const SuccessState = RequestState.success;
export const ErrorState = RequestState.error;

