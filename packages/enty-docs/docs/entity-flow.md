---
path: /entity-flow
title: Entity Flow
---

1. **Props Change / OnMutate Triggered**  
The Enty data flow begins when either a QueryHocked components props change or a MutationHocked component fires its onMutate callback. When this happens the corresponding promise creator in the API is fired. 

2. **Data Request / Recieve**  
The data request actions is triggered and the corresponding queryRequestState becomes a FetchingState. If the promise rejects the Error action is triggered, the requestState becomes an error and the flow finishes. 
If the promise resolves the receive action is triggered, the requestState becomes a SuccessState. 

3. **Normalize**    
The payload is passed into schema.normalize, which will in turn call schema.normalize recursively on its children as defined. Entities are stored under their schema type key and the result of their id attribute. Each entity is also passed through their constructor function which is given the current entity and the previous version if it exists. 

4. **Results & Entities Stored**  
The normalised entities are shallow merged with the previous state. The normalised result object is stored under its resultKey.

5. **Views Updated**  
The update in state triggers a rerender. All hocked views select their data based on their result key. 
Schema.denormalize is given the new entity state and the normalised result object that matches their result key. As the result object is traversed denormalizeFilter is called on each entity. Any that fail the test will not be returned. 




