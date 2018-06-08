// @flow

export default class Message {
    resultKey: string;
    response: *;
    requestState: *;
    requestError: *;
    onRequest: (payload: *) => Promise<*>;
    constructor(props: *) {
        this.resultKey = props.resultKey;
        this.response = props.response;
        this.requestState = props.requestState;
        this.requestError = props.requestError;
        this.onRequest = props.onRequest;
    }
}
