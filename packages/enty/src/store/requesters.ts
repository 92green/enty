import Store, {EntityRequestArgs} from '../store/Store';

export function asyncRequest(config: {args: EntityRequestArgs; store: Store; ttl: number}) {
    const {store, args, ttl} = config;
    if (args.method === 'list') throw new Error('Cannot use asyncRequest for list method');
    const {schema, id} = args;

    if (!id) throw new Error('asdas');

    return async function* (request: Function) {
        const [entity, meta] = store.get(schema, id);

        if (entity && Date.now() - meta.normalizeTime <= ttl * 1000) return yield;

        yield store.setMeta(schema, id, {pending: true});
        try {
            const data = await request(config);
            yield store.update(schema, data, {
                pending: false,
                normalizeTime: Date.now()
            });
        } catch (error) {
            yield store.setMeta(schema, id, {pending: false, error});
        }
        return;
    };
}
