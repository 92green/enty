---
id: glossary
title: Glossary
---

## Api
An EntityApi is a collection of promise returning functions that get bound to [RequestHoc]'s.
It's called an Api becuase it most often is the binding between an API and a client.

## Child Schema
Any schema that requires a definition on a single child.
See: [EntitySchema], [ArraySchema], [DynamicSchema]

## Definition
Definitions are the ke peice of information required by a schema. For an [EntitySchema] it is 
[Structural Schema], for an [ObjectSchema] it is an object literal describing its relationships.

## Denormalize
The process of taking a normalized result structure and replacing all the id strings with their
current entity.

## Keyed Schema
A schema that describes a keyed data type.
See: [ObjectSchema], [MapSchema]

## Normalize
The process of traversing a data structure to find entities. These entities are then stored by 
a unique type and id.

## Schema
A stand alone class that can normalize and denormalize a single layer of data.

## Structural Schema
A schema that describes how to traverse a specific shape of data. 
See: [ObjectSchema], [MapSchema], [ArraySchema], [ListSchema]

## Tainted Entity
An entity that can't be normalized becuase it has been mixed with specific data from another entity.
See: [CompositeEntitySchema]

[ArraySchema]: /docs/schemas/ArraySchema
[CompositeEntitySchema]: /docs/schemas/composite-entity-schema
[DynamicSchema]: /docs/schemas/DynamicSchema
[EntitySchema]: /docs/schemas/EntitySchema
[MapSchema]: /docs/schemas/MapSchema
[ListSchema]: /docs/schemas/ListSchema
[ObjectSchema]: /docs/schemas/ObjectSchema
[Structural Schema]: #structural-schema
[RequestHoc]: /docs/data/RequestHoc