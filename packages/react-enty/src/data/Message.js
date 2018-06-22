// @flow
import {EmptyState} from '../RequestState';

/**
 * A Message bundles up all of the information surrounding a request and response from the api.
 * It holds all the information that you would need to both make requests and render their responses
 * when they come back. You shouldn't need to worry about creating messages. They are constructed for you
 * by the RequestHock.
 */
export default class Message {

    /**
     * onRequest is a callback that will trigger your EntityRequester and start the normalizing flow.
     */
    onRequest: (payload: *) => Promise<*>;

    /**
     * The request state is a variant that exists in one of either empty, fetching, refetching, error or success states.
     * Similar to a promise it accepts functions to call at each of these states. This lets you be confident to only
     * render component when your request has successfully returned.
     *
     * @example
     * user.requestState
     *      .fetchingMap(() => <Loader />)
     *      .refetchingMap(() => <Loader />)
     *      .errorMap(() => <Error errorData={user.requestError} />)
     *      .successMap(() => <User user={user.response}>)
     *      .value();
     */
    requestState: *;

    /**
     * Response containse the denormalized version of the data that was requested by this message's
     * onRequest callback
     */
    response: *;

    /**
     * If the onRequest callback returns a rejected promise the error will be found in requestError.
     */
    requestError: *;

    /**
     * The unique key that binds the request, the normalized data and the requestState together
     */
    resultKey: string;
    constructor(props: * = {}) {
        this.resultKey = props.resultKey;
        this.response = props.response;
        this.requestState = props.requestState || EmptyState();
        this.requestError = props.requestError;
        this.onRequest = props.onRequest;
    }
}
