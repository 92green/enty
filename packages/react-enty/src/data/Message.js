// @flow


/**
 * A Message bundles up all of the information surrounding a request and response from the api.
 * It holds all the information that you would need to both make requests and render their responses
 * when they come back.
 */
export default class Message {

    /**
     * a callback to trigger the api function
     */
    onRequest: (payload: *) => Promise<*>;

    /**
     * a requestState variant at the current state of the request.
     */
    requestState: *;

    /**
     * the denormalized version of the data bound to the resultKey
     */
    response: *;

    /**
     * Any errors that the request threw.
     */
    requestError: *;

    /**
     * The unique key that binds the request, the normalized data and the requestState together
     */
    resultKey: string;
    constructor(props: *) {
        this.resultKey = props.resultKey;
        this.response = props.response;
        this.requestState = props.requestState;
        this.requestError = props.requestError;
        this.onRequest = props.onRequest;
    }
}
