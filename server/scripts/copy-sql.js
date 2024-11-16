const cpx = require('cpx');

cpx.copy('src/**/*.sql', 'dist/server/src', function (err) {
    if (err) {
        console.error(err);
    } else {
        console.log('SQL files copied to dist');
    }
});
