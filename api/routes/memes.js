const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Meme = require('../models/meme');

router.get('/', (req, res, next) => {
    Meme
    .find()
    .limit(100)
    .select('name caption url')
    .exec()
    .then(result => {
        if (!result) {
            res.status(200).json(result);
        } else {
            res.status(404);
        }
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
});

router.get('/:memeId', (req, res, next) => {
    const id = req.params.memeId;
    Meme
    .findById(id)
    .exec()
    .then(result => {
        res.status(200).json(result);
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
}); 

router.post('/', (req, res, next) => {
    // TODO add POST route for /memes
})

module.exports = router;