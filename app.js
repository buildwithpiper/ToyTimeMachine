/**
 * @Author: Danny Gillies
 *
 * Starts the server
 */

"use strict";

var express = require("express");
var mongoose = require("mongoose");
var toy = require("./models/toy.js");
var path = require("path");
var app = express();
var http = require("http");
var server = http.createServer(app);

// Connect to database
mongoose.connect("mongodb://localhost/test");

// Setup server
require("./server/routes")(app);

app.use(express.static(path.join(__dirname, "public/")));

// Start server
server.listen(80);
console.log("Listening on port 80");

//Expose app
exports = module.exports = app;