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

    // Adds user id to share url
    updateShareUrl();

});

// Load images into boxes
function populateToys() {
    if (localStorage.getItem("user") != null) {
        var user = JSON.parse(localStorage.getItem("user"));
        for (var i = 0; i < 4; i++) {
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
                localStorage.setItem("user", JSON.stringify(data.user));
            }
        })
        // }
}

function addToy(toyUrl) {
    // IF the user doesnt exist, create the user and add the toy
    if (localStorage.getItem("user") == null) {
        createAndAdd(toyUrl);
    } else {
        // Check if we are at max toys
        if (JSON.parse(localStorage.getItem("user")).toys.length < 4) {
            var param = {
                toyUrl: $(toyUrl).data("url"),
                id: JSON.parse(localStorage.getItem("user"))._id
            };
            $.get("/api/v1/users/addtoy", param, function(data) {
                if (data.user.length != 0) {
                    localStorage.setItem("user", JSON.stringify(data.user));
                    populateToys();
                }
            });
        } else {
            alert("You have reached the maximum number of toys");
        }
    }
}

function createAndAdd(toyUrl) {
    $.get("/api/v1/users/create", {}, function(data) {
        if (data.user.length != 0) {
            localStorage.setItem("user", JSON.stringify(data.user));
            var param = {
                toyUrl: $(toyUrl).data("url"),
                id: JSON.parse(localStorage.getItem("user"))._id
            };
            $.get("/api/v1/users/addtoy", param, function(data) {
                if (data.user.length != 0) {
                    localStorage.setItem("user", JSON.stringify(data.user));
                    populateToys();
                    updateShareUrl();
                }
            });
        }
    })
}

function clearLocalUser() {
    localStorage.removeItem("user");
}


function searchFor(query) {
    var param = {
        decade: query
    };
    $("#toys").html("");
    $.get("/api/v1/toys/", param, function(data) {
        if (data.toys.length != 0) {
            console.log(data.toys);
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

function updateShareUrl() {
    $(".fbshare").attr("href", "https://www.facebook.com/sharer/sharer.php?u=http%3A%2F%2Fwww.toytimemachine.us/toybox?_id=" + data.user._id + "%2F&amp;src=sdkpreparse");

}

function getSliderWidth() {
    var slider = $("#yearSelection");
    var pointDistance = slider.width() / slider.prop("step");
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
}
