const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { update } = require("../models/meme");

const Meme = require("../models/meme");

// Function to verify if image URL
// https://stackoverflow.com/questions/9714525/javascript-image-url-verify
function checkURL(url) {
	return url.match(/\.(jpeg|jpg|gif|png)$/) != null;
}

// GET Route at memes/
router.get("/", (req, res, next) => {
    // Find and display latest 100 memes from DB
	Meme.find()
		.sort({ _id: -1 })
		.select("name url caption")
		.limit(100)
		.exec()
		.then((result) => {
			if (result.length > 0) {
                // Parse them as required output
                const mappedResponse = {
					result: result.map((doc) => {
						return {
							id: doc._id,
							name: doc.name,
							url: doc.url,
							caption: doc.caption,
						};
					}),
				};
				res.status(200).json(mappedResponse.result);
			} else {
                // return 200 if no memes found
				res.status(200).json(result);
			}
		})
		.catch((err) => {
			res.status(500).json({
				error: err,
			});
		});
});

// POST Route at memes/
router.post("/", (req, res, next) => {
    // Create Object to Send
	const meme = new Meme({
		_id: new mongoose.Types.ObjectId(),
		name: req.body.name,
		caption: req.body.caption,
		url: req.body.url,
	});

	// Check if Object with Same Payload Exists
	Meme.countDocuments({name: req.body.name, caption: req.body.caption, url: req.body.url}, function(err, count){
		// Catch Errors
		if (err){
			console.log(err);
			res.status(500).json({
				error: err
			});
		}
		// Data already exist in DB
		if (count != 0){
			// Return with Status 409
			res.status(409).json({
				message: 'Same Meme Already Exists'
			});
		}else {
			// Insert data in DB
			meme
				.save()
				.then((result) => {
					res.status(201).json({
						id: result._id,
					});
				})
				.catch((err) => {
					if (err.name === 'ValidationError'){
						res.status(400).json();
					}else {
						res.status(500).json({
							error: err,
						});
					}
				});
		}
	});
});

// GET Route at memes/memeID
router.get("/:memeId", (req, res, next) => {
    // find meme from DB from provided ID
	const id = req.params.memeId;

	// check if ID exists
	Meme.count({_id: id}, function (err, count){ 
		if(count > 0){
			//ID exists, Query Result
			Meme.findById(id)
			.select("name url caption")
			.exec()
			.then((result) => {
				if (result) {
					res.status(200).json({
						id: result._id,
						name: result.name,
						caption: result.caption,
						url: result.url,
					});
				} else {
					res.status(404).json({
						error: "Meme Not Found",
					});
				}
			})
			.catch((err) => {
				res.status(400).json({
					error: err.message,
				});
			});
		}else {
			res.status(404).json();
		}
	}); 
});

// PATCH Route at memes/memeID
router.patch("/:memeId", (req, res, next) => {
	const id = req.params.memeId;

    // Create Object to update but omit name key if passed
	const updateOps = {};
	for (const [key, value] of Object.entries(req.body)) {
		if (key != "name") {
			updateOps[key] = value;
		}
	}

	// check if ID exists
	Meme.count({_id: id}, function (err, count){ 
		if(count > 0){
			//ID exists, Update DB
			Meme.updateOne({ _id: id }, { $set: updateOps })
			.exec()
			.then((result) => {
				res.status(200).json();
			})
			.catch((err) => {
				console.log(err);
				res.status(500).json({
					error: err,
				});
			});
		}else {
			res.status(404).json();
		}
	}); 
});

module.exports = router;
