import {Map, List} from 'immutable';
import Logger from '../Logger';

// Reduce data object to
function toKeyPaths(data) {
    return data
        .reduce((paths, entityType, entityTypeKey) => {
            var path = entityType
                .reduce((entityTypePaths, entity, entityKey) => {
                    return entityTypePaths.push(List.of(entityTypeKey, entityKey));
                }, List())
            return paths.concat(path);
        }, List())
        .toSet();
}
/*
 * merge entities only three layers deep
 * - merges all entity types to state
 * - merged all entity items into each entity type
 * - merges the top-level items on each entity item
 * but will not merge any deeper contents of entities themselves
 *
 * @param {Map} entities - Entities to merge.
 * @param {function} afterNormalize - called when a new or merged entity is stored in state.
 */
export default function MergeEntities(entities, afterNormalize) {
    // return an immutable updater
    return state => {

        // Create sets of the keys from the previous state
        // new normalized entites
        const previousEntityTypeKeys = toKeyPaths(state);
        const nextEntityTypeKeys = toKeyPaths(entities);

        // Compare those sets to figure out which keys
        // need to be merged and which need to be created
        //
        // Created: Don't already exist on state
        // Merged: Do already exist on state
        const entityKeysToCreate = nextEntityTypeKeys.subtract(previousEntityTypeKeys);
        const entityKeysToMerge = previousEntityTypeKeys.intersect(nextEntityTypeKeys);

        // These two reduce take a list of entityKeysPaths
        // and turn it into a map of the new state

        // createdEntityTypes dont already exist and so
        // can just be setIn through the afterNormalize function
        const createdEntityTypes = entityKeysToCreate
            .reduce((newState, entityKeyPath) => {
                Logger.verbose(`  Creating entity ${entityKeyPath}`, entities.getIn(entityKeyPath));
                Logger.warnIf(entityKeyPath.get(1) == "undefined", `Warning: An entity of type "${entityKeyPath.get(0)}" was created with an id of undefined!`);

                return newState.setIn(entityKeyPath, afterNormalize(entities.getIn(entityKeyPath), entityKeyPath.get(0)));
            }, Map());

        // mergedEntityTypes entities do exist. We therefore have to
        // take the previous state and the next state and merge them together.
        // As they already exist we dont need to perform after normalize
        const mergedEntityTypes = entityKeysToMerge
            .reduce((newState, entityKeyPath) => {
                const existingEntity = state.getIn(entityKeyPath);
                const newEntity = entities.getIn(entityKeyPath);
                const merged = existingEntity.merge(newEntity);

                Logger.verbose(`  Merging entity ${entityKeyPath}`);
                if(Logger.willLog('silly')) {
                    if(existingEntity.equals(merged)) {
                        Logger.silly(`    Merged entity is identical to existing entity`);
                    } else {
                        Logger.silly(`    Existing entity entity`, existingEntity);
                        Logger.silly(`    New entity entity`, newEntity);
                        Logger.silly(`    Merged entity`, merged);
                    }
                }

                return newState.setIn(entityKeyPath, merged);
            }, Map());


        // Deep merge is okay here as the data is normalized so there cant
        // be any of the same id
        const newData = createdEntityTypes.mergeDeep(mergedEntityTypes);

        // Merge two layers in
        return state
            .mergeWith((prevEntityType, nextEntityType) => {
                return prevEntityType.merge(nextEntityType);
            }, newData);
    }
}
