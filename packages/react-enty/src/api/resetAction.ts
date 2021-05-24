type RemoveAction = {
    type: string;
    meta: {responseKey: string};
};

export default function resetAction(responseKey: string): RemoveAction {
    return {
        type: 'ENTY_RESET',
        meta: {responseKey}
    };
}
