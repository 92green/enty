import express from 'express';
import graphqlHTTP from 'express-graphql';
import {Reddit} from 'graphqlhub-schemas';
import {GraphQLSchema, graphql} from 'graphql';

import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpack from 'webpack';
import path from 'path';

const schema = new GraphQLSchema({
  query: Reddit.QueryObjectType
});

const app = express();

app.use('/graphql', graphqlHTTP(() => ({
    schema: schema,
    graphiql: true
})));


var compiler = webpack({
    cache: true,
    entry: [
        'webpack-hot-middleware/client?http://0.0.0.0:3000',
        './example/client.js'
    ],
    output: {
        path: __dirname,
        filename: 'example.js',
        publicPath: '/'
    },
    resolve: {
        extensions: ['', '.js', '.jsx'],
        alias: {
            'redux-blueflag': path.resolve(__dirname, '../lib/index.js'),
            'example': __dirname
        }
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
    ],
    module: {
        loaders: [{
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: 'babel?presets[]=blueflag'
        }]
    }
});

const middleware = webpackDevMiddleware(compiler,{
  publicPath: '/',
  noInfo: true,
  contentBase: 'src'
});

app.use(middleware);
app.use(webpackHotMiddleware(compiler));
app.get('/', function response(req, res,next) {
  if(req.url == '/') {
    res.send(`
        <html>
            <head></head>
            <body>
               <div id="app"></div>
                <script src="example.js"></script>
            </body>
        </html>
    `);
  }
});


app.get('/', function (req, res) {
    res.send(`
        <html>
            <head></head>
            <body>
                <h1>Rad</h1>
            </body>
        </html>
    `);
});

app.listen(3000, function (err) {
    if(err) {
    console.log(err);
  }
    console.log('Example app listening on port 3000!');
});
