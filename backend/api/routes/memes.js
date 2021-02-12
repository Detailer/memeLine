const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { update } = require('../models/meme');

const Meme = require('../models/meme');

// Function to verify if image URL
// https://stackoverflow.com/questions/9714525/javascript-image-url-verify
function checkURL(url) {
    return(url.match(/\.(jpeg|jpg|gif|png)$/) != null);
}

router.get('/', (req, res, next) => {
    Meme
    .find()
    .sort({'_id' : -1})
    .select('name url caption')
    .limit(100)
    .exec()
    .then(result => {
        if (result.length > 0) {
            const mappedResponse = {
                result: result.map(doc => {
                            return {
                                id: doc._id,
                                name: doc.name,
                                url: doc.url,
                                caption: doc.caption
                            }
                        })
            }
            res.status(200).json(mappedResponse.result);
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

router.post('/', (req, res, next) => {
    const meme = new Meme({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        caption: req.body.caption,
        url: req.body.url
    });
    if (checkURL(meme.url)){
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
    }
    else{
        res.status(405).json({
            error: 'Provide Image URL Only!'
        })
    }
})

router.get('/:memeId', (req, res, next) => {
    const id = req.params.memeId;
    Meme
    .findById(id)
    .select('name url caption')
    .exec()
    .then(result => {
        if (result){
            res.status(200).json({
                id: result._id,
                name: result.name,
                caption: result.caption,
                url: result.url
            });
        }else{
            res.status(404).json({
                error: 'Meme Not Found'
            });
        }
    })
    .catch(err => {
        res.status(400).json({
            error: err.message
        });
    });
}); 

router.patch('/:memeId', (req, res, next) => {
    const id = req.params.memeId;
    const updateOps = {};
    for (const [key, value] of Object.entries(req.body)){
        if (key != 'name'){
            updateOps[key] = value;
        }
    }
    Meme.updateOne({_id: id}, {$set : updateOps})
    .exec()
    .then(result => {
        res.status(200).json({
            message : 'Meme ID: ' + id + ' updated'
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

module.exports = router;