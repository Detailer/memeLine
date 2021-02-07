const http = require('http');
const app = require('./app');

const port = process.envPORT || 8080;

const server = http.createServer(app);

server.listen(port);