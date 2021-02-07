const express = require('express');
const app = express();

const memeRoutes = require('./api/routes/memes');

app.use('/memes', memeRoutes);

module.exports = app;
