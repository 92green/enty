const ghpages = require('gh-pages');
const path = require('path');

ghpages.publish(path.resolve(__dirname, '../'), {
    src: ['index.html', 'docs/**/*', 'example/dist/**/*', 'example/index.html', 'circle.yml'],
    logger: function(message) {
        console.log(message);
    }
}, function(err){
    if(err) {
        console.error(err);
        process.exit(1);
    }
});
