$(document).ready(function() {

    $(window).resize(function() {
        handleSlide();
    });

    $("#yearSelection").on("input", function() {
        handleSlide();
        $("#yearIndicator").html($(this).val());
    });

    $("#yearSelection").change(function() {
        searchFor($(this).val());
        $("#yearIndicator").html($(this).val());
    });

    $(".left .cover").on("click", function()
    {
        $(".left").fadeToggle();
        //$("#white").fadeToggle();
        $("#black").fadeToggle();
    });

    if(isMobile())
    {
        $(".myToyImage").on("click", function(event) {
            removeToy($(this)[0].id.substr(-1));
            if(JSON.parse(localStorage.getItem("user")).toys.length <= ($(this)[0].parentElement.id).substr(-1))
            {
                $(".left").fadeToggle();
                //$("#white").fadeToggle();
                $("#black").fadeToggle();
            }

            event.preventDefault();
            return false;
        });
    }
    else
    {
        $(".deleteOverlay").click(function() {

            removeToy(($(this)[0].parentElement.id).substr(-1));
            if(isMobile() && JSON.parse(localStorage.getItem("user")).toys.length <= ($(this)[0].parentElement.id).substr(-1) - 1)
            {
                $(".left").fadeToggle();
                //$("#white").fadeToggle();
                $("#black").fadeToggle();
            }

            /*if(isMobile())
            {
                $(this).hide();
            }*/
        });
    }

    $(".hamburger").click(function() {
        $(".left").fadeToggle();
        //$("#white").fadeToggle();
        $("#black").fadeToggle();

    });

    lightbox.option({
        'showImageNumberLabel': false,
        'wrapAround': true
    });

    // Do initial load
    searchFor(1940);
    $("#yearIndicator").html(1940);

    // Load images into boxes
    populateToys();

    // Adds user id to share url
    updateShareUrl();

    //$('.fbshare').click(generateImage);

    if(isMobile()) { // Instructions for mobile users/other mobile setup
        $("body").append("<div id='instructCover'><div class='instructContainer'><h4>Instructions:</h4><ul><li>Scroll through the decades.</li><li>Add 4 toys that changed your life to your toy box.</li><li>Share your collection with your loved ones.</li></ul><div class='instructButtonContainer'><button id='instructClose'>Ok got it!</button></div></div></div>");
    
        $('#instructClose').on("click", function()
        {
            $('#instructCover').fadeOut(300, function()
            {
                $(this).remove();
            });
        });
    }

    $(document).on("scroll", function()
    {
        checkScroll();
    });
});

var imagePaths = {1940: [], 1950: [], 1960: [], 1970: [], 1980: [], 1990: [], 2000: []};
var loadCount = 0;
var currentDecade = 0;
var imagesLoading = 0;
var TOY_LOAD_LIMIT = 30;

function isMobile()
{
    return (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
}

function generateImage()
{
    var user = JSON.parse(localStorage.getItem("user"));
    if(user.toys.length == 4)
    {
        param = {
            id: user._id
        };
        $.get("/api/v1/toys/collage", param, function(data) {
            //$('meta[property="og:image"]').remove();
            //$('head').append( '<meta property="og:image" content="toytimemachine.us/collages/' + user._id  + '.jpg"/>' );
        });
    }
}

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
        $('.lb-close').trigger("click");

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
            $('.lb-close').trigger("click");
        } else {
            alert("You have reached the maximum number of toys");
        }
    }
    if(isMobile())
    {

        $(".left").fadeToggle();
        //$("#white").fadeToggle();
        $("#black").fadeToggle();
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

function checkScroll()
{
    if($(window).scrollTop() >= $(document).height() - 70 - $(window).height())
    {
        if(!$('#loading').is(":visible") && imagesLoading == 0)
        {
            loadNewToys();
        }
    }
}

function searchFor(query) {
    var param = {
        decade: query
    };
    $("#toys").html("");
    $.get("/api/v1/toys/", param, function(data) {
        if (data.toys.length != 0) {
            if(imagePaths[query].length == 0)
            {
                imagePaths[query] = data.toys;
            }

            currentDecade = query;
            loadCount = 0;

            //console.log(data.toys);

            loadNewToys();
        }
    })
}

function loadNewToys()
{
    if(loadCount * TOY_LOAD_LIMIT < imagePaths[currentDecade].length)
    {
        $("#loading").show();

        for (var i = loadCount * TOY_LOAD_LIMIT; i < Math.min((loadCount + 1) * TOY_LOAD_LIMIT, imagePaths[currentDecade].length); i++) {
            $("#toys").append("<a href=\"" + imagePaths[currentDecade][i] + "\" data-lightbox=\"toy\" data-title=\"<button data-url='" + imagePaths[currentDecade][i] + "' onclick='addToy(this)' class='addToybox'><div>+</div> Add this Toy</button>\"</a><img onerror=\"this.style.display='none'; imageLoaded()\" onload='imageLoaded()' src=\"" + imagePaths[currentDecade][i] + "\"/></a>")
            imagesLoading++;
        }

        loadCount++;
    }
}

function lastToyCreatesScrollbar()
{
    return $("#toys a:last-child").offset().top > $(window).height();
}

function imageLoaded()
{
    imagesLoading--;

    if(imagesLoading == 0)
    {
        $("#loading").hide();

        if(!lastToyCreatesScrollbar())
        {
            loadNewToys();
        }
        else
        {
            checkScroll();
        }
    }
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
    if (localStorage.getItem("user") != null) {
        var user = JSON.parse(localStorage.getItem("user"));
        $(".fbshare").attr("href", "https://www.facebook.com/sharer/sharer.php?u=http%3A%2F%2Fwww.toytimemachine.us/toybox?_id=" + user._id + "&amp;src=sdkpreparse");
    }
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
