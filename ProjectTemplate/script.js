var contentPanels = ['logonPanel', 'homePanel'];
var testName = "test";
var testPass = "test";

var sessionUsername = "";
var usersArray;
var eventsArray;

// This function will be used when using database credentials
function LogOn(username, pass) {
    var webMethod = "ProjectServices.asmx/LogOn";
    var parameters = "{\"uid\":\"" + encodeURI(username) + "\",\"pass\":\"" + encodeURI(pass) + "\"}";

    $.ajax({
        type: "POST",
        url: webMethod,
        data: parameters,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            document.getElementById("error").innerHTML = "";
            var responseFromServer = msg.d;
            if (responseFromServer == true) {
                sessionUsername = document.getElementById("logonId").value;
                setCookie("username", sessionUsername, 1);
                window.open("home.html", "_self");
            }
            else {
                document.getElementById("error").innerHTML = "Incorrect Credentials";
            }
        },
        error: function () {
            alert("Error");
        }
    })

}

function showPanel(panelId) {
    for (var i = 0; i < contentPanels.length; i++) {
        if (panelId == contentPanels[i]) {
            $("#" + contentPanels[i].css('visibility', 'visible'));
        }
        else {
            $("#" + contentPanels[i].css('visibility', 'hidden'));
        }
    }
}

function welcome(name) {

    document.getElementById(id).innerHTML = "Welcome, " + name + "!";
}


function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function checkCookie() {
    var user = getCookie("username");
    if (user != "") {
        alert("Welcome again " + user);
    } else {
        user = prompt("Please enter your name:", "");
        if (user != "" && user != null) {
            setCookie("username", user, 365);
        }
    }
} 

function test() {
    var sessionUsername = getCookie('username');
    document.getElementById('welcome').innerHTML = "Welcome, " + sessionUsername + "!";
}

//this function grabs accounts and loads our account window
function getUsers() {
    var webMethod = "ProjectServices.asmx/getUsers";
    $.ajax({
        type: "POST",
        url: webMethod,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            if (msg.d.length > 0) {
                usersArray = msg.d;
            }
        },
        error: function (e) {
            alert("Error");
        }
    });
}

function getEvents() {
    var webMethod = "ProjectServices.asmx/getEvents";
    $.ajax({
        type: "POST",
        url: webMethod,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            if (msg.d.length > 0) {
                eventsArray = msg.d;
            }
        },
        error: function (e) {
            alert("Error");
        }
    });
}

function displayAllEvents() {
    for (var i = 0; i < eventsArray.length; i++) {
        var tag = document.createElement("p");
        var text = document.createTextNode(eventsArray[i].eventTitle);
        tag.appendChild(text);
        var element = document.getElementById("eventsList");
        element.appendChild(tag);
        console.log(eventsArray[i].eventTitle);
    }
}

function logOff() {
    sessionUsername = "";
    window.open("index.html", "_self");
}