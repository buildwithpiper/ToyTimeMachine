var mongoose = require("mongoose")
var autoIncrement = require("mongoose-auto-increment");

var userSchema = mongoose.Schema({
	name: String,
	toys: Array
})

autoIncrement.initialize(mongoose.connection);
userSchema.plugin(autoIncrement.plugin, "User");

module.exports = mongoose.model("User", userSchema)