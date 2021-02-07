const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Meme = require('../models/meme');

router.get('/', (req, res, next) => {
    Meme
    .find()
    .select('name url caption')
    .limit(100)
    .exec()
    .then(result => {
        if (result.length > 0) {
            res.status(200).json(result);
        } else {
            res.status(404).json(result);
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
    .select('name url caption')
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
    const meme = new Meme({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        caption: req.body.caption,
        url: req.body.url
    });
    meme
    .save()
    .then(result => {
        res.status(201).json({
            id: result._id
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
})

module.exports = router;