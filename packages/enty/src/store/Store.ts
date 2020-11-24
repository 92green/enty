import {EntitySchema} from '../index';
import {State, SchemasUsed, NormalizeReturn} from '../util/definitions';

const ListEventId = '~enty~list~event~';

type LoadArgs = {
    schema: EntitySchema<any>;
    id: string;
    method: 'load';
    loadData?: any;
    respond?: Respond;
};

type SaveArgs = {
    schema: EntitySchema<any>;
    id: string;
    method: 'save';
    saveData?: any;
    respond?: Respond;
};

type ListArgs = {
    schema: EntitySchema<any>;
    method: 'list';
    respond?: Respond;
};

export type EntityRequestArgs = LoadArgs | SaveArgs | ListArgs;

export type Respond = (
    update: Function,
    args: EntityRequestArgs,
    store: Store
) => AsyncGenerator<NormalizeReturn>;

export type Meta = {
    pending?: boolean;
    success?: boolean;
    error?: Error;
    normalizeTime?: number;
};

export default class Store {
    _events: Record<string, Record<string, Function[]>>;
    _respond: Respond;
    _state: State;
    _schemasUsed: SchemasUsed;

    constructor(respond: Respond, initialState: State = {}, schemasUsed: SchemasUsed = {}) {
        this._events = {};
        this._state = initialState;
        this._schemasUsed = schemasUsed;
        this._respond = respond;
    }

    //
    // Private

    _getStateTuple(schema: EntitySchema<any>, id: string): [any, Meta] {
        return this._state[schema.name]?.[id] || [null, {}];
    }

    _ensureEventShape(schema: EntitySchema<any>, id = ListEventId) {
        this._events[schema.name] = this._events[schema.name] || {};
        this._events[schema.name][id] = this._events[schema.name][id] || [];
    }

    _getEvents(schema: EntitySchema<any>, id = ListEventId) {
        return this._events[schema.name]?.[id] || [];
    }

    _addEvent(schema: EntitySchema<any>, id = ListEventId, cb: Function) {
        this._ensureEventShape(schema, id);
        this._events[schema.name][id].push(cb);
    }

    _removeEvent(schema: EntitySchema<any>, id = ListEventId, cb: Function) {
        this._ensureEventShape(schema, id);
        this._events[schema.name][id] = this._events[schema.name][id].filter((i) => i !== cb);
    }

    _forEachEvent(process: (cb: Function, type: string, id: string) => void) {
        for (const type in this._events) {
            for (const id in this._events[type] || {}) {
                (this._events[type][id] || []).forEach((cb) => process(cb, type, id));
            }
        }
    }

    //
    // Public

    get(schema: EntitySchema<any>, id: string): [any, Meta] {
        const entity = schema.denormalize({
            state: this._state,
            output: id
        });
        return [entity, this._getStateTuple(schema, id)[1]];
    }

    getList(schema: EntitySchema<any>) {
        return Object.keys(this._state[schema.name]).map((id) => this.get(schema, id));
    }

    setMeta(schema: EntitySchema<any>, id: string, meta: Meta) {
        const type = schema.name;
        this._state[type] = this._state[type] || {};
        this._state[type][id] = this._state[type][id] || [null, {}];
        this._state[type][id][1] = {...this._state[type][id][1], ...meta};
        this._getEvents(schema, id).forEach((cb) => cb(this.get(schema, id)));
        this._getEvents(schema, ListEventId).forEach((cb) => cb(this.getList(schema)));
        return this;
    }

    update(schema: EntitySchema<any>, input: any, meta: Meta) {
        const value = schema.normalize({state: this._state, changes: {}, input, meta});
        this._state = value.state;
        this._schemasUsed = value.schemasUsed;

        this._forEachEvent((cb, type, id) => {
            if (value.changes[type]) {
                console.log({type, id});
                const schema = value.schemasUsed[type];
                if (id === ListEventId) return cb(this.getList(schema));
                if (value.changes[type][id]) return cb(this.get(schema, id));
            }
        });
        return this;
    }

    async trigger(args: EntityRequestArgs) {
        const update = (data: any, meta: Meta) => this.update(args.schema, data, meta);
        const responder = args.respond || this._respond;
        for await (const _ of responder(update, args, this)) {
        }
    }

    subscribe(args: EntityRequestArgs, callback: Function) {
        const {schema, id} = args;
        this._addEvent(schema, id, callback);
        this.trigger(args);
        return () => {
            this._removeEvent(schema, id, callback);
        };
    }
}
