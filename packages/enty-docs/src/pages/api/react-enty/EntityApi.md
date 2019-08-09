---
id: EntityApi
title: Entity Api
---

The EntityApi provides a declarative way to turn a series of promise returning functions into hoc's
that fetch your data.

## Params
```js
EntityApi(
    schema: Schema,
    actionMap: {[key: string]: () => Promise<*>}
);
```

### schema
**type:** `StructuralSchema`

When data is returned from an api function Enty will use this schema to start the normalizing 
process. This schema functions similarly to the [graphql] root resolver and works like a small
namespace for your specific schemas. _There is no required type of schema, but in most cases an 
ObjectSchema makes the most sense.`_


```js
const user = EntitySchema('user');
const course = EntitySchema('course');
const course = EntitySchema('course');
const rootSchema = ObjectSchema({
    user,
    course,
    location
});

EntityApi(rootSchema, actionMap);
```

### actionMap
**type:** ` actionMap: {[key: string]: () => Promise<*>} `  
**returns:** `actionMap: {[key: string]: {request: RequestHoc}}`

Action map is an aribtarily nested set of promise returning functions. Enty returns wraps these
functions into a [RequestHoc] bound to the schema provided.

```js
const Api = EntityApi(ApplicationSchema, {
    currentUser: (payload) => get('/currentUser', payload)
    course: {
        get: (payload) => get('/user', payload),
        create: (payload) => post('/user', payload)
    }
});

export const CurrentUserHoc = Api.currentUser.request;
export const CourseGetHoc = Api.course.get.request;
export const CourseCreateHoc = Api.course.create.request;
```


## Examples

### Merging Multiple Apis
```js
// UserApi.js
export default {
    get: payload => request.get('/user', payload),
    create: payload => request.post('/user', payload),
    save: payload => request.post(`/user/${payload.id}`, payload)
};


// EntityApi.js
import UserApi from './UserApi';
import CourseApi from './CourseApi';
const Api = EntityApi(RootSchema, {
    user: UserApi,
    course: CourseApi
}

export const UserGetHoc = Api.user.get.request;
export const UserCreateHoc = Api.user.create.request;
export const UserSaveHoc = Api.user.save.request;
```
