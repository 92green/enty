type RemoveAction = {
    type: string;
    payload: [string, string];
    meta: {
        responseKey: string;
    };
};

export default function removeAction(type: string, id: string): RemoveAction {
    return {
        type: 'ENTY_REMOVE',
        payload: [type, id],
        meta: {responseKey: 'ENTY_INTERNAL'}
    };
}
