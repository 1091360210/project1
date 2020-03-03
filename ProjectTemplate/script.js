var contentPanels = ['logonPanel', 'homePanel'];
var testName = "test";
var testPass = "test";

var sessionUsername = "";
var usersArray;
var eventsArray;
var favoriteArray;


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

/*function displayAllEvents() {
    for (var i = 0; i < eventsArray.length; i++) {
        var tag = document.createElement("p");
        var text = document.createTextNode(eventsArray[i].eventTitle);
        tag.appendChild(text);
        var element = document.getElementById("eventsList");
        element.appendChild(tag);
        console.log(eventsArray[i].eventTitle);
    }
}*/


function displayAllEvents() {
    var element = document.getElementById("eventsList");
    for (var i = 0; i < eventsArray.length; i++) {
        
            var radioInput = document.createElement('input');
            radioInput.setAttribute('type', 'radio');
            radioInput.setAttribute('name', 'eList');
            radioInput.setAttribute('class', 'eventsClass');
            radioInput.setAttribute("value", eventsArray[i].eid);
            radioInput.setAttribute("id", eventsArray[i].eid);
            var labels = document.createElement("label");
        labels.setAttribute('for', eventsArray[i].eid);
            labels.setAttribute("class", "favoriteClass");
        labels.innerHTML = eventsArray[i].eid + ". " + eventsArray[i].eventTitle + ". " + eventsArray[i].eventDescription + ". " + eventsArray[i].uid;
            var lineBreak = document.createElement("br");
            element.appendChild(radioInput);
            element.appendChild(labels);
            element.appendChild(lineBreak);
        
    }   
}


function logOff() {
    sessionUsername = "";
    window.open("index.html", "_self");
}

function getFavorites(){
    var sessionUsername = getCookie('username');
    var webMethod = "ProjectServices.asmx/GetFavorites";
    var parameters = "{\"uid\":\"" + encodeURI(sessionUsername) + "\"}";
    $.ajax({
        type: "POST",
        url: webMethod,
        data: parameters,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            if (msg.d.length > 0) {
                favoriteArray = msg.d;
           
            }
        },
        error: function (e) {
            alert(e.type);
            
        }
    });


}


function displayFavorites() {
    var element = document.getElementById("favoritList");
    var sessionUsername = getCookie('username');
    getUsers();
    getFavorites();
    for (var i = 0; i < favoriteArray.length; i++) {
        if (sessionUsername == favoriteArray[i].uName) {
            let email;
            let uid = favoriteArray[i].contactInfo;
            console.log(uid);
            for (z = 0; z < usersArray.length; z++) {
                if (uid == usersArray[z].uid) {
                    email = usersArray[z].email;
                    
                }
            }
            
            var radioInput = document.createElement('input');
            radioInput.setAttribute('type', 'radio');
            radioInput.setAttribute('name', 'fList');
            radioInput.setAttribute('class', 'favoriteClass');
            radioInput.setAttribute("value", favoriteArray[i].eid);
            radioInput.setAttribute("id", favoriteArray[i].eid);
            var labels = document.createElement("label");
            labels.setAttribute('for', favoriteArray[i].eid);
            labels.setAttribute("class", "favoriteClass");
            labels.innerHTML = favoriteArray[i].eid + "." + favoriteArray[i].eventDescription + "." + favoriteArray[i].contactInfo + "." + email;
            var lineBreak = document.createElement("br");
            element.appendChild(radioInput);
            element.appendChild(labels);
            element.appendChild(lineBreak);
        }
    }
        document.getElementById("deleteButton").style.display = "block";
        }
      
    



function deleteFaviorite() {
    var sessionUsername = getCookie('username');
    var eid = $("input:radio[name=fList]:checked").val()
    var webMethod = "ProjectServices.asmx/Dfavorite";
    var parameters = "{\"eid\":\"" + encodeURI(eid) + "\",\"uName\":\"" + encodeURI(sessionUsername) + "\"}";
    console.log(parameters)
    $.ajax({
        type: "POST",
        url: webMethod,
        data: parameters,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
           
            alert("Favorite Removed!");
            //remove all lables and radio button in favorite list div.
            $('.favoriteClass').remove();
            //refresh the page.
            window.location.reload();
            

            
        },
        error: function (e) {
            alert(e.type);
        }
    });
}



function addFavorite() {
    var sessionUsername = getCookie('username');
    var eid = $("input:radio[name=eList]:checked").val();
    var host;
    var eventDes;
    for (var i = 0; i < eventsArray.length; i++) {
        if (eid == eventsArray[i].eid) {
            host = eventsArray[i].uid;
            eventDes = eventsArray[i].eventDescription;
        }
    }
    
    var webMethod = "ProjectServices.asmx/Afavorite";
    var parameters = "{\"eid\":\"" + encodeURI(eid) + "\",\"uName\":\"" + encodeURI(sessionUsername) +
        "\",\"eventDescription\":\"" + encodeURI(eventDes) + "\",\"contact\":\"" + encodeURI(host) + "\"}";
    
    
    $.ajax({
        type: "POST",
        url: webMethod,
        data: parameters,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function () {
            alert("Favorite Added!");
            window.location.reload();
        },
        error: function (e) {
            alert("failed to add favorite.")
        }
    });

    

    

}


/*function displayYourEvents() {
    var element = document.getElementById("yourEventList");
    var uid;
    var sessionUsername = getCookie('username');
    getUsers();
    for (var i = 0; i < usersArray.length; i++) {
        if (sessionUsername == usersArray[i].userName) {
            uid = usersArray[i].uid;
        }
    }
    
    for (var i = 0; i < eventsArray[i].length; i++) {
        if (userID == eventsArray[i].uid) {
            var radioInput = document.createElement('input');
            radioInput.setAttribute('type', 'radio');
            radioInput.setAttribute('name', 'yourList');
            radioInput.setAttribute('class', 'ownClass');
            radioInput.setAttribute("value", eventsArray[i].eid);
            radioInput.setAttribute("id", eventsArray[i].eid);
            var labels = document.createElement("label");
            labels.setAttribute('for', eventsArray[i].eid);
            labels.setAttribute("class", "favoriteClass");
            labels.innerHTML = "Event ID: " + eventsArray[i].eid + ". Event Description: " + eventsArray[i].eventDescription + ". Event Host Contact information: ";
            var lineBreak = document.createElement("br");
            element.appendChild(radioInput);
            element.appendChild(labels);
            element.appendChild(lineBreak);
        }
    }  
}*/

