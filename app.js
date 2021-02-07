const express = require('express');
const app = express();
const morgan = require('morgan');

const memeRoutes = require('./api/routes/memes');

// Enable Logging 
app.use(morgan('dev'));

// Handling CORS
app.use((res, req, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 
        'Origin, X-Requested, Content-Type, Accept, Authorization'
    );
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods',
            'PUT, POST, PATCH, DELETE, GET'
        );
        return res.status(200).json({});
    }
    next();
 });

// Route to /memes
app.use('/memes', memeRoutes);

// Handle Errors
app.use((req, res, next) => {
    const error = new Error('Not Found!');
    error.status(404);
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error : {
            message : error.message
        }
    });
});

module.exports = app;
