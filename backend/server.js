const http = require('http');
const app = require('./app');

const port = process.env.PORT || 8081;

// create and start the server
const server = http.createServer(app);
server.listen(port);