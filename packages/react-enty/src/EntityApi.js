//@flow
import type {HockOptionsInput} from './util/definitions';
import type {SideEffect} from './util/definitions';
import type {Schema} from 'enty/lib/util/definitions';

import set from 'unmutable/lib/set';
import pipeWith from 'unmutable/lib/util/pipeWith';
import EntityApiFactory from 'enty-state/lib/EntityApiFactory';
import EntityReducerFactory from 'enty-state/lib/EntityReducerFactory';

import EntityQueryHockFactory from './EntityQueryHockFactory';
import RequestHockFactory from './RequestHockFactory';
import EntityMutationHockFactory from './EntityMutationHockFactory';
import EntityStoreFactory from './EntityStoreFactory';
import EntityProviderFactory from './EntityProviderFactory';


export default function EntityApi(schema: Schema<*>, actionMap: Object, hockOptionsInput: HockOptionsInput = {}): Object {
    const {storeKey = 'enty'} = hockOptionsInput;
    const {stateKey} = hockOptionsInput;

    const reducer = EntityReducerFactory({schema});
    const store = EntityStoreFactory({reducer});
    const provider = EntityProviderFactory({store, storeKey});

    return pipeWith(
        EntityApiFactory(
            actionMap,
            ({actionType, requestAction, generateResultKey}) => {
                const requestActionName = actionType;

                const hockMeta = {
                    generateResultKey,
                    requestActionName,
                    storeKey,
                    stateKey
                };

                const hockOptions = {
                    ...hockOptionsInput,
                    requestActionName
                };


                return {
                    _deprecated: {
                        query: EntityQueryHockFactory(requestAction, hockOptions),
                        mutation: EntityMutationHockFactory(requestAction, {...hockOptions, requestActionName})
                    },
                    request: RequestHockFactory(requestAction, hockMeta)
                };
            }
        ),
        set('_enty', {reducer, store}),
        set('EntityProvider', provider)

    );
};

