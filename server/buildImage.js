var gm = require("gm");
var request = require("request");
var fs = require("fs")

var images = ["toys/1960/67ff0be1a86f70fd94c0a0379416c7d3.jpg", "toys/1980/enhanced-buzz-4383-1386887686-5.png", "border.png", "images4.jpg"];
var cropped = [];

var numFinished = 0;

function preCreateImage(input, id)
{
    cropped = [];
    numFinished = 0;
    var result = null;
    for (var i = 0; i < 4; i++) {
        // console.log(images[i]);
        var filename = 'public/' + input[i]
        ///var filename = 'public/' + input[i].replace(/^.*[\\\/]/, '');
        var outname = "tmp-" + input[i].replace(/^.*[\\\/]/, '');
        cropped.push(outname);
        gm(filename)
            .resize('70', '70', '^')
            .gravity('Center')
            .crop('70', '70')
            .write(outname, function(err) {
                if (err) console.log(err);
                // console.log(cropped[i]);
                numFinished++;
                // ONLY ACTUALLY RUNS WHEN ALL 4 IMAGES ARE MADE
                createImage(id);
            });
    }
}

module.exports = {
    preCreateImage: preCreateImage
};

function createImage(id) {
    if (numFinished < 4)
        return;

    gm("server/border.png")
        .command("composite")
        .in("-geometry", "70x70+109+84")
        .in(cropped[0])

    .write("public/collages/" + id + ".jpg", function(err) {
        if (err) console.log(err);
        gm("public/collages/" + id + ".jpg")
            .command("composite")
            .in("-geometry", "70x70+180+84")
            .in(cropped[1])

        .write("public/collages/" + id + ".jpg", function(err) {
            if (err) console.log(err);
            gm("public/collages/" + id + ".jpg")
                .command("composite")
                .in("-geometry", "70x70+109+157")
                .in(cropped[2])

            .write("public/collages/" + id + ".jpg", function(err) {
                if (err) console.log(err);
                gm("public/collages/" + id + ".jpg")
                    .command("composite")
                    .in("-geometry", "70x70+180+157")
                    .in(cropped[3])

                .write("public/collages/" + id + ".jpg", function(err) {
                    if (err) console.log(err);
                    deleteTempImages();
                    console.log('done');
                    return "public/collages/" + id + ".jpg";
                })
            })
        })
    })
}

function deleteTempImages() {
	cropped.forEach(function(filename) {
		fs.unlink(filename);
	})
}

/*
var Canvas = require("canvas");
var fs = require("fs");
var http = require("http");
var Image = Canvas.Image;
var canvas = new Canvas(358, 277);
var ctx = canvas.getContext("2d");

border = new Image()
border.src = fs.readFileSync('border.png');
ctx.drawImage(border, 0, 0);

toy1 = new Image();
toy1.src = fs.readFile('images.jpg', function(err, data) {
    if (err) console.log(err);
    ctx.drawImage(toy1, 109, 86, 64, 64);

});

toy2 = new Image();
toy2.src = fs.readFileSync('test.png');
ctx.drawImage(toy2, 185, 159, 64, 64);

toy3 = new Image();
toy3.src = fs.readFileSync('test.png');
ctx.drawImage(toy3, 109, 159, 64, 64);

toy4 = new Image();
toy4.src = fs.readFileSync('test.png');
ctx.drawImage(toy4, 185, 86, 64, 64);


canvas.createPNGStream().pipe(fs.createWriteStream('image-src.png'));
*/
