$(document).ready(function() {

    $(window).resize(function() {
        handleSlide();
    })

    $("#yearSelection").on("input", function() {
        handleSlide();
        $("#yearIndicator").html($(this).val());
    })

    $("#yearSelection").change(function() {
        searchFor($(this).val());
        $("#yearIndicator").html($(this).val());
    })

    $(".deleteOverlay").click(function() {
        console.log(($(this)[0].parentElement.id).substr(-1));
        removeToy(($(this)[0].parentElement.id).substr(-1));
    })

    $(".hamburger").click(function() {
        $(".left").fadeToggle();
        $("#white").fadeToggle();
        $("#black").fadeToggle();

    })

    lightbox.option({
        'showImageNumberLabel': false,
        'wrapAround': true
    })

    // Load images into boxes
    populateToys();

});

// Load images into boxes
function populateToys() {
    if (localStorage.getItem("user") != null) {
        var user = JSON.parse(localStorage.getItem("user"));
        // console.log(user);
        for (var i = 0; i < 4; i++) {
            console.log("url(\"" + user.toys[i] + "\")");
            if (user.toys[i]) {
                $("#myToy" + (i + 1)).css("background-image", "url(\"" + user.toys[i] + "\")");
            } else {
                $("#myToy" + (i + 1)).css("background-image", "");
            }
        }
    }
}

function createUser() {
    // if (!localStorage.getItem("_id")) {
    var param = {};
    $.get("/api/v1/users/create", param, function(data) {
            if (data.user.length != 0) {
                // console.log(data.user);
                localStorage.setItem("user", JSON.stringify(data.user));
                console.log(JSON.parse(localStorage.getItem("user")));
            }
        })
        // }
}

function addToy(toyUrl) {
    // Check if we are at max toys
    if (JSON.parse(localStorage.getItem("user")).toys.length < 4) {
        // IF the user doesnt exist, create the user and add the toy
        if (localStorage.getItem("user") == null) {
            createAndAdd(toyUrl);
        } else {
            var param = {
                toyUrl: $(toyUrl).data("url"),
                id: JSON.parse(localStorage.getItem("user"))._id
            };
            $.get("/api/v1/users/addtoy", param, function(data) {
                if (data.user.length != 0) {
                    console.log(data.user);
                    localStorage.setItem("user", JSON.stringify(data.user));
                    console.log(JSON.parse(localStorage.getItem("user")));
                    populateToys();
                }
            });
        }
    } else {
        alert("You have reached the maximum number of toys");
    }
}

function createAndAdd(toyUrl) {
    $.get("/api/v1/users/create", {}, function(data) {
        if (data.user.length != 0) {
            // console.log(data.user);
            localStorage.setItem("user", JSON.stringify(data.user));
            var param = {
                toyUrl: $(toyUrl).data("url"),
                id: JSON.parse(localStorage.getItem("user"))._id
            };
            $.get("/api/v1/users/addtoy", param, function(data) {
                if (data.user.length != 0) {
                    localStorage.setItem("user", JSON.stringify(data.user));
                    console.log(JSON.parse(localStorage.getItem("user")));
                    populateToys();
                }
            });
        }
    })
}

function clearLocalUser() {
    localStorage.removeItem("user");
    console.log(localStorage.getItem("user"));
}


function searchFor(query) {
    console.log("Searching for toys...");
    var param = {
        decade: query
    };
    $("#toys").html("");
    $.get("/api/v1/toys/", param, function(data) {
        if (data.toys.length != 0) {
            // console.log(data.toys);
            for (var i = 0; i < data.toys.length; i++) {
                $("#toys").append("<a href=\"" + data.toys[i].imageUrl + "\" data-lightbox=\"toy\" data-title=\"<input type='button' data-url='" + data.toys[i].imageUrl + "' onclick='addToy(this)' class='addToybox'>\"</a><img onerror=\"this.style.display='none'\" src=\"" + data.toys[i].imageUrl + "\"/></a>")
            }
        }
    })
}

function removeToy(index) {
    var param = {
        id: JSON.parse(localStorage.getItem("user"))._id,
        toyIndex: (index - 1)
    };
    $.get("/api/v1/users/removetoy", param, function(data) {
        // if (data.toys.length != 0) {
        localStorage.setItem("user", JSON.stringify(data.user));
        populateToys();
        // }
    });
}

function getSliderWidth() {
    var slider = $("#yearSelection");
    var pointDistance = slider.width() / slider.prop("step");
    console.log(pointDistance);
    console.log(slider);
}

function handleSlide() {
    var slider = $("#yearSelection");
    var text = $("#yearIndicator");

    var currentPosition = (slider.val() - slider.prop("min")) / 10;
    var difference = slider.prop("max") - slider.prop("min");
    var numSteps = difference / slider.prop("step");
    var interval = (slider.width() - slider.width() * .03) / numSteps;

    var newPos = currentPosition * interval;
    text.css("left", (newPos - 10) + "px");
    console.log(currentPosition);
}
