const mongoose = require('mongoose');

const memeSchema = mongoose.Schema({
    id: mongoose.Schema.Types.ObjectId,
    name: {type: String, required: true},
    url: {type: String, required: true},
    caption: {type: String, required: true},
});

module.exports = mongoose.model('Meme', memeSchema);