const fs = require('fs');
const path = require('path');
import prettier from 'prettier';
import { generateSpecAsync, getSpecInfoAsync } from 'typescript-to-swagger';

getSpecInfoAsync({ dir: ['./src/controller', './src/enum',  './src/interfaces'] }).then((res) => {
});

generateSpecAsync({ dir: ['./src/controller', './src/enum', './src/interfaces'] }).then((res) => {
    const spec = JSON.stringify(
        {
            openapi: '3.0.1',
            info: {
                title: 'youtube-bot-filter',
                description: 'download-server',
                version: '0.0.1',
            },
            ...res,
        },
        null,
        2,
    );
    const filePath = path.resolve('../spec-download-server.json')
    fs.writeFileSync(filePath, spec);
    console.log('generate spec file success ', filePath);
});
