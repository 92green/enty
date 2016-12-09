import {Map} from 'immutable';


/**
 * merge entities only three layers deep
 * + merges all entity types to state
 * + merged all entity items into each entity type
 * + merges the top-level items on each entity item
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
        const previousEntityTypeKeys = state.keySeq().toSet();
        const nextEntityTypeKeys = entities.keySeq().toSet();

        // Compare those sets to figure out which keys
        // need to be merged and which need to be created
        //
        // Merged: Do already exist on state
        // Created: Don't already exist on state
        const entityTypeKeysToMerge = previousEntityTypeKeys.intersect(nextEntityTypeKeys);
        const entityTypeKeysToCreate = nextEntityTypeKeys.subtract(previousEntityTypeKeys);


        // These two reduce take a list of entityTypeKeys
        // and turn it into a map of the new state

        // createdEntityTypes dont already exist and so
        // can just be mapped through the afterNormalize function
        const createdEntityTypes = entityTypeKeysToCreate
            .reduce((newState, key) => {
                const created = entities
                    .get(key)
                    .map(ii => afterNormalize(ii, key))
                return newState.set(key, created);
            }, Map());

        // mergedEntityTypes entities do exist. We therefore have to
        // take the previous entityType and the next entityType
        // and merge them together. We use a mergeWith to allow us to
        // merge one layer into every entityItem then send that through afterNormalize
        const mergedEntityTypes = entityTypeKeysToMerge
            .reduce((entityTypes, entityTypeKey) => {
                const merged = state
                    .get(entityTypeKey)
                    .mergeWith((prevEntityItem, nextEntityItem) => {
                        return afterNormalize(prevEntityItem.merge(nextEntityItem), entityTypeKey);
                    }, entities.get(entityTypeKey))

                return entityTypes.set(entityTypeKey, merged);
            }, Map());

        // Merge all three states togther
        return state
            .merge(createdEntityTypes)
            .merge(mergedEntityTypes);
    }
}
