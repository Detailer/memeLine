const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    // TODO GET route for /memes
    res.status(200).json({
        message: 'Recieved at /memes'
    });
});

router.get('/:memeId', (req, res, next) => {
    // TODO GET route for /memesId
}); 

router.post('/', (req, res, next) => {
    // TODO add POST route for /memes
})

module.exports = router;