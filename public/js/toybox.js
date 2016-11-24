
// Load images into boxes
/*function populateToys() {
    var param = { id: QueryString['_id'] };
    $.get("/api/v1/users/get", param, function(data)     {
        if (data.user.length != 0) {
            user = data.user;

            for (var i = 0; i < 4; i++) {
                if (user.toys[i]) {
                    $("#img" + (i + 1)).css("background-image", "url(\"" + user.toys[i] + "\")");
                } else {
                    $("#img" + (i + 1)).css("background-image", "");
                }
            }
        }
        else alert('user ' + param['id'] + ' not found');
    });
}*/

function populateToys() {
    console.log('queyr string ' + QueryString['_id'])
    var user = JSON.parse(localStorage.getItem("user"));    
    if(typeof QueryString['_id'] != undefined) {
        var param = { id: QueryString['_id'] };
        $.get("/api/v1/users/get", param, function(data)     {
            if (data.user.length != 0) {
                user = data.user;
                for (var i = 0; i < 4; i++) {
                    if (user.toys[i]) {
                        $("#img" + (i + 1)).css("background-image", "url(\"" + user.toys[i] + "\")");
                    }
                }
            }
        });
    }
        
    for (var i = 0; i < 4; i++) {
        if (user.toys[i]) {
            $("#img" + (i + 1)).css("background-image", "url(\"" + user.toys[i] + "\")");
        }
    }
}

var QueryString = function () {
  // This function is anonymous, is executed immediately and 
  // the return value is assigned to QueryString!
    var query_string = {};
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
            // If first entry with this name
        if (typeof query_string[pair[0]] === "undefined") {
          query_string[pair[0]] = decodeURIComponent(pair[1]);
            // If second entry with this name
        } else if (typeof query_string[pair[0]] === "string") {
          var arr = [ query_string[pair[0]],decodeURIComponent(pair[1]) ];
          query_string[pair[0]] = arr;
            // If third or later entry with this name
        } else {
          query_string[pair[0]].push(decodeURIComponent(pair[1]));
        }
      } 
    return query_string;
}();

$(document).ready(function()
{
  populateToys();
});
