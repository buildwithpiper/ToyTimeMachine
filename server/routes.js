/**
 * @Author: Danny Gillies
 * Routes for Toy Time Machine
 */

"use strict";

var mongoose = require("mongoose");
var Toy = require("../models/toy.js");
var User = require("../models/user.js");
var path = require("path");

// Store database connection
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));

module.exports = function(app) {
    // Index route
    app.route('/').get(function(req, res) {
        res.sendFile(path.join(__dirname + "/../views/index.html"));
        console.log("Serving index");
    });

    // Toybox route
    app.route('/toybox').get(function(req, res) {
        res.sendFile(path.join(__dirname + "/../views/toybox.html"));
    });


    // get toys
    app.route('/api/v1/toys/').get(function(req, res) {
        var year = req.query.year;
        var decade = req.query.decade;
        // sendFile(path.join(__dirname + "/toys/" + decade + "/"
        Toy.find({ decade: { $eq: decade } }, function(err, toys) {
            if (err) return handleError(err);
            res.json({ toys: toys });
        })
    });


    /* USER ROUTES */
    // Create a user
    app.route('/api/v1/users/create').get(function(req, res) {
        var user = new User({
            name: "",
            toys: []
        })

        user.save(function(err, user) {
            if (err) return console.log(err);
            res.json({ user: user });
            console.log("Stored " + user.name + ": " + user._id);
        })
    })

    // Get a user
    app.route('/api/v1/users/get').get(function(req, res) {
        var id = req.query.id;
        User.findOne({ _id: { $eq: id } }, function(err, user) {
            if (err) return console.log(err);
            res.json({ user: user });
        })
    })

    // Add a toy to a user's toybox
    app.route('/api/v1/users/addtoy').get(function(req, res) {
        var id = parseInt(req.query.id);
        var toyUrl = req.query.toyUrl;
        console.log(id + ": " + toyUrl);
        User.findOne({ _id: { $eq: id } }, function(err, user) {
            if (err) return console.log(err);
            user.toys.push(toyUrl);
            console.log(user);
            user.save();
            res.json({ user: user });
        });
    });

    // Add a name to a user for when they share
    app.route('/api/v1/users/addname').get(function(req, res) {
        var id = parseInt(req.query.id);
        var name = req.query.name;
        User.findOne({_id: { $eq: id }}, function(err, user) {
            if (err) return console.log(err);
            user.name = name;
            user.save();
            console.log("Added name: " + user.name + " to id: " + user._id);
            res.json({ user: user });
        })
    });

    // Remove a toy from a user's toy list
    app.route('/api/v1/users/removetoy').get(function(req, res) {
        var id = parseInt(req.query.id);
        var toyIndex = req.query.toyIndex;
        User.findOne({_id: {$eq: id}}, function(err, user) {
            if (err) return console.log(err);
            user.toys.splice(toyIndex, toyIndex + 1);
            user.save();
            res.json({ user: user });
            console.log("Removed " + toyIndex + " from array: " + user.toys);
        })
    })
};
