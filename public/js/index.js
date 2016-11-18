$(document).ready(function() {

    $("#yearSelection").on("input change", function() {
        $("#yearIndicator").html($(this).val());
    })

    $("#yearSelection").change(function() {
        searchFor($(this).val());
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
        console.log(user);
        for (var i = 0; i < user.toys.length; i++) {
            console.log("url(\"" + user.toys[i] + "\")");
            $("#myToy" + (i + 1)).css("background-image", "url(\"" + user.toys[i] + "\")");
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
