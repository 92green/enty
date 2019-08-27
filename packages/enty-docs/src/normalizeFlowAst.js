const readfiles = require('node-readfiles');
const flow = require('flow-parser');
const getIn = require('unmutable/getIn');
const {EntitySchema, ObjectSchema, DynamicSchema, ArraySchema} = require('enty');

const body = new DynamicSchema();
const params = new ArraySchema(body);


const typeAnnotation = new EntitySchema('typeAnnotation', {
    idAttribute: data => {
        const type = getIn(data, ['typeAnnotation', 'type']);
        const name = getIn(data, ['typeAnnotation', 'id', 'name']);
        return `${type}${name ? `:${name}` : ''}`
    },
});
typeAnnotation.shape = {typeAnnotation};

const Identifier = new EntitySchema('Identifier', {
    idAttribute: data => data.name,
    shape: new ObjectSchema({
        typeAnnotation
    })
});

const AssignmentPattern = new ObjectSchema({left: body});
const VariableDeclarator = new ObjectSchema({id: Identifier});

const VariableDeclaration = new ObjectSchema({
    declarations: new ArraySchema(VariableDeclarator)
});

const ExportDefaultDeclaration = new ObjectSchema({
    declaration: body
});

const ExportNamedDeclaration = new ObjectSchema({});
const ExpressionStatement = new ObjectSchema({});
const ReturnStatement = new ObjectSchema({});

function ast(name, shape = {}) {
    return new EntitySchema(name, {
        idAttribute: data => data.id ? data.id.name : 'anonymous',
        shape: new ObjectSchema({
            body,
            params,
            returnType: typeAnnotation,
            ...shape
        })
    });
}

const astObject = new ObjectSchema({body});
const astBodyArray = new ObjectSchema({body: new ArraySchema(body)});
const ClassBody = astBodyArray;

const ClassProperty = new EntitySchema('ClassProperty', {
    idAttribute: data => data.key.name,
    shape: new ObjectSchema({typeAnnotation})
});

const MethodDefinition = new EntitySchema('MethodDefinition', {
    idAttribute: data => data.key.name,
    shape: new ObjectSchema({
        value: new ObjectSchema({
            params,
            returnType: typeAnnotation
        })
    })
});

const ClassDeclaration = ast('ClassDeclaration', {
    body: ClassBody
});

const FunctionDeclaration = ast('FunctionDeclaration');
const ImportDeclaration = ast('ImportDeclaration');

const TypeAlias = ast('TypeAlias');

const BlockStatement = astObject;

const Program = new ObjectSchema({
    body: new ArraySchema(body)
});

const BodySchemaTypes = {
    AssignmentPattern,
    BlockStatement,
    ClassDeclaration,
    ClassProperty,
    ExportDefaultDeclaration,
    ExportNamedDeclaration,
    ExpressionStatement,
    FunctionDeclaration,
    Identifier,
    ImportDeclaration,
    MethodDefinition,
    ReturnStatement,
    TypeAlias,
    VariableDeclaration
}


body.shape = data => {
    const schema = BodySchemaTypes[data.type];
    if(schema) {
        return schema;
    }

    console.log('No schema found for ', data.type);
    return new ObjectSchema({body});
};



module.exports = async function normalizeFlowAst() {
    console.log('Normalize Flow');
    const contentList = [];
    await readfiles('../enty/src', (err, filename, content) => {
        if (err) throw err;
        contentList.push([filename, Program.normalize(flow.parse(content))]);
    });

    //const entities = contentList.reduce((state, flow) => {
        //return Program.normalize(flow, state);
    //}, {});
    //console.log(entities);
    return contentList;

}
