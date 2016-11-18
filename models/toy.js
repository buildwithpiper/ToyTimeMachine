var mongoose = require("mongoose")

var toySchema = mongoose.Schema({
	year: Number,
	raw: JSON,
	imageUrl: String,
	image: JSON,
	decade: Number
})

module.exports = mongoose.model("Toy", toySchema)