const express = require("express");
const app = express();
const mongoose = require("mongoose");
const { urlencoded, json } = require("express");
const cors = require("cors");


// Dependency for Testing
// require('dotenv').config();
// const morgan = require("morgan");
// app.use(morgan("dev"));

const memeRoutes = require("./api/routes/memes");

// Connecting to MongoDB
mongoose.connect(
	"mongodb+srv://firstSample:" +
		process.env.MONGODB_ATLAS_PW +
		"@samplecluster.dcnnt.mongodb.net/sampleDB?retryWrites=true&w=majority",
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
	}
);

// Enable URL and JSON Parser
app.use(urlencoded({ extended: false }));
app.use(json());

// Handling CORS
app.use(cors());

// Enable Swagger UI for API Documentation
const swaggerUi = require('swagger-ui-express');
swaggerDocument = require('./swagger.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// const swaggerApp = express();
// const swaggerPort = 8080;
// swaggerApp.use(cors());
// swaggerApp.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// swaggerApp.listen(swaggerPort, () => {
// 	console.log('Swagger up and running on port: '+swaggerPort)
// });

// Route to /memes
app.use("/memes", memeRoutes);

// Handle Errors
app.use((req, res, next) => {
	const error = new Error("Not Found!");
	error.status = 404;
	next(error);
});

app.use((error, req, res, next) => {
	res.status(error.status || 500);
	res.json({
		error: {
			message: error.message,
		},
	});
});

module.exports = app;
