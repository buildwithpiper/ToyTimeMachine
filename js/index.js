var decade = 0;
var toy = 0;

/** Handle text input on year box **/
$(document).on('keypress', function(event) {
    $('#year').contentEditable = true;
    $('#year').focus();
    return event.charCode >= 48 && event.charCode <= 57;
});

/** Handle clicking to change toy **/
$(".content").click(function(event) {
    nextToy();
});
$(".next-toy").click(function(event) {
    nextToy();
});

/** Enter key submits **/
$("#year").keyup(function(event){
    if(event.keyCode == 13){
        $(".gobtn").click();
    }
});

/** Choose correct decade based on year of birth **/
$(".gobtn").click(function(event) {
    $(".start-content").hide();
    var year = $("#year").val();
    if (year < 1950) {
        $("#tab-1").prop("checked", true);
        changeContent("tab-1");
    } else if (year < 1960) {
        $("#tab-2").prop("checked", true);
        changeContent("tab-2");
    } else if (year < 1970) {
        $("#tab-3").prop("checked", true);
        changeContent("tab-3");
    } else if (year < 1980) {
        $("#tab-4").prop("checked", true);
        changeContent("tab-4");
    } else if (year < 1990) {
        $("#tab-5").prop("checked", true);
        changeContent("tab-5");
    } else if (year < 2000) {
        $("#tab-6").prop("checked", true);
        changeContent("tab-6");
    } else if (year < 2010) {
        $("#tab-7").prop("checked", true);
        changeContent("tab-7");
    } else {
        $("#tab-8").prop("checked", true);
        changeContent("tab-8");
    }
});

$("input[name='tab-group-1']").change(function(event) {
    changeContent(event.target.id);
});

/** Getting the parameters from the URL and checking the correct radio button **/
var hash;
var query = document.URL.split('?')[1];
if (query != undefined) {
    query = query.split('&');
    for (var i = 0; i < query.length; i++) {
        hash = query[i].split('=');
        $("#" + hash[1]).prop('checked', true);
        changeContent(hash[1]);
    }
};

function changeContent(tab) {
    hideInitialContent();
    currentToy = 0;
    switch (tab) {
        case "tab-1":
            decade = 0;
            nextToy();
            break;
        case "tab-2":
            decade = 1;
            nextToy();
            break;
        case "tab-3":
            decade = 2;
            nextToy();
            break;
        case "tab-4":
            decade = 3;
            nextToy();
            break;
        case "tab-5":
            decade = 4;
            nextToy();
            break;
        case "tab-6":
            decade = 5;
            nextToy();
            break;
        case "tab-7":
            decade = 6;
            nextToy();
            break;
        case "tab-8":
            decade = 7;
            $("#buy").css("display", "inline-block");
            nextToy();
            break;
    }
}

function nextToy() {
    // if (contentArray[currentDecade].length == 1)
    //  $(".side-arrow").hide();
    if (toy >= content[decade].length)
        toy = 0;
    console.log("DECADE: " + decade + " TOY: " + toy);
    $(".content .title").html(content[decade][toy].title);
    $(".content .current-year").html(content[decade][toy].year);
    $(".content .share").html(content[decade][toy].share);
    $(".video-overlay").css("background-color", content[decade][toy].color);
    $("#ytplayer").prop("src", "https://www.youtube.com/embed/" + content[decade][toy].video + "?playlist=" + content[decade][toy].video + 
        "&rel=0&enablejsapi=1&autoplay=1&controls=0&showinfo=0&loop=1&iv_load_policy=3")
    toy++;
}

function hideInitialContent() {
    $(".start-content").hide();
    $(".buttons").show();
    $("#buy").hide();
    $(".side-arrow").show();
}
