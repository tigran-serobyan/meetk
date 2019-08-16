var date = new Date();

var username;

socket.on('logedin', function (data) {
    if (am_i(data[0], code)) {
        username = data[1].username;
        if (document.URL.split("?")[1]) {
            socket.emit("get_the_profile", [code, document.URL.split("?")[1].split("=")[1]]);
        }
    }
});
socket.on('notlogedin', function (data) {
    if (am_i(data, code)) {
        window.open("../", "_self");
    }
});
socket.on('get_the_events', function (data) {
    if (am_i(data[0], code)) {
        document.getElementById("events").innerHTML = "<h3 id='events-title'>Events</h3>";
        document.getElementById("events").display = "none";
        events = data[1];
        for (var i = events.length - 1; i >= 0; i--) {
            var bigdiv = document.createElement("div");
            bigdiv.setAttribute("class", "event");
            var div = document.createElement("div");
            div.setAttribute("class", "gray");
            bigdiv.appendChild(div);
            bigdiv.style.backgroundImage = "url('" + events[i].topimage + "')";
            var title = document.createElement("h2");
            title.innerText = events[i].name;
            div.appendChild(title);
            var creator = document.createElement("h3");
            creator.innerText = events[i].username;
            div.appendChild(creator);
            document.getElementById("events").style.display = "block";
            document.getElementById("events").appendChild(bigdiv);
            var open_text = document.createElement("a");
            open_text.setAttribute("class", "open_button");
            console.log( "../event/" + events[i].id);
            open_text.setAttribute("href", "../event/" + events[i].id);
            open_text.onclick = function () { socket.emit("event", [code, (this.href.split("/"))[4]]) };
            open_text.innerText = "OPEN";
            div.appendChild(open_text);
        }
    }
});
socket.on('get_the_profile', function (data) {
    if (am_i(data[0], code)) {
        if(!data[1].username){
            window.open('../page-not-found','_self');
        }
        document.getElementById("name_surname").innerText = data[1].name + " " + data[1].surname;
        document.getElementById("username").innerText = "@" + data[1].username;
        document.getElementById("location").innerText = data[1].location;
        if (data[1].pic) {
            document.getElementById("profile_image").src = data[1].pic;
        }
        else {
            if (data[1].gender == "Male") {
                document.getElementById("profile_image").src = "../style/male.jpg";
            }
            else {
                document.getElementById("profile_image").src = "../style/female.jpg";
            }
        }
        if (data[1].backpic) {
            document.getElementById("top").style.backgroundImage = "url('" + data[1].backpic + "')";
        }
        else {
            document.getElementById("top").style.backgroundImage = "url('../style/profile_background.png')";
        }
        socket.emit("get_the_events", [code, document.URL.split("?")[1].split("=")[1]]);
    }
});
function logout() {
localStorage.clear();
var info = {
        username: username
    };
    socket.emit("logout", [info, code]);
}