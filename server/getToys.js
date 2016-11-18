var mongoose = require("mongoose");
var request = require("request");
var Toy = require("../models/toy.js");

var googleapi = "https://www.googleapis.com/customsearch/v1?";
// var key = "AIzaSyBSC-BmtPcfWvmvR7Ipup6QFKPeePzxAwk"; // REAL
var key = "AIzaSyAOGB17VAhj2fVyJ-Mro6IqvBKho2edzpM";
var cx = "009344729547910633028:45-qfbml7lk";

mongoose.connect("mongodb://localhost/test");

var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"))
db.once("open", function() {
    console.log("Connected to database, fetching images...");
    getToysDecade(db);
});

function getToys(db) {
    var collection = db.collection("toys");

    // Loop through every year
    for (var i = 1940; i < 2011; i++) {
        request(googleapi + "key=" + key + "&cx=" + cx + "&q=toys in " + i + "&searchType=image&start=1",
            function(error, response, body) {
                if (response.statusCode == 200 && !error) {
                    var res = JSON.parse(body);
                    for (var ii = 0; ii < res.items.length; ii++) {
                        // Create a new toy object
                        var year = parseInt(res.queries.request[0].searchTerms.split(" ").splice(-1)[0]);
                        var toy = new Toy({
                            year: year,
                            raw: res,
                            imageUrl: res.items[ii].link,
                            image: res.items[ii].image,
                            decade: year - (year % 10)
                        });

                        // Store toy object in database
                        toy.save(function(err, toy) {
                            if (err) return console.error(err);
                            console.log("Stored " + toy.year + ": " + toy.imageUrl);
                        });

                    }
                } else {
                    console.log(response.statusCode);
                    console.log(error);
                }
            });
        }
    }


function getToysDecade(db) {
    var collection = db.collection("toys");

    for (var i = 1940; i < 2011; i+=10) {
        request(googleapi + "key=" + key + "&cx=" + cx + "&q=" + i + "'s toys&searchType=image&start=21",
            function(error, response, body) {
                if (response.statusCode == 200 && !error) {
                    var res = JSON.parse(body);
                    for (var ii = 0; ii < res.items.length; ii++) {
                        // Create a new toy object
                        var year = 0;
                        var toy = new Toy({
                            year: year,
                            raw: res,
                            imageUrl: res.items[ii].link,
                            image: res.items[ii].image,
                            decade: parseInt(res.queries.request[0].searchTerms.split("'")[0])
                        });

                        // Store toy object in database
                        toy.save(function(err, toy) {
                            if (err) return console.error(err);
                            console.log("Stored " + toy.decade + ": " + toy.imageUrl);
                        });

                    }
                } else {
                    console.log(response.statusCode);
                    console.log(error);
                }
            });
        }
}