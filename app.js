const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const { urlencoded, json } = require('express');

const memeRoutes = require('./api/routes/memes');

// Connecting to MongoDB
mongoose.connect('mongodb+srv://firstSample:'
    + process.env.MONGODB_ATLAS_PW
    + '@cluster0.dcnnt.mongodb.net/testDB?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

// Enable Logging 
app.use(morgan('dev'));

// Enable URL and JSON Parser
app.use(urlencoded({extended: false}));
app.use(json());

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
