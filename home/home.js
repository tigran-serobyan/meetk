var date = new Date();

var username;
var all_events;
var width = 0;

socket.on('logedin', function (data) {
    if (am_i(data[0], code)) {
        username = data[1].username;
        document.getElementById('loading').style.display = 'block';
        document.getElementById('loading' + (Math.floor(Math.random() * 5) + 1)).style.display = 'block';
        socket.emit("get_events", code);
    }
});
socket.on('notlogedin', function (data) {
    if (am_i(data, code)) {
        window.open("../", "_self");
    }
});
function show_events(data) {
    document.getElementById("going").innerHTML = "<h3>Now going</h3>";
    document.getElementById("joined").innerHTML = "<h3>Soon will start</h3>";
    document.getElementById("worldwide").innerHTML = "<h3>Worldwide</h3>";
    document.getElementById("all").innerHTML = "<h3>All events</h3>";
    document.getElementById("going").style.display = "none";
    document.getElementById("joined").style.display = "none";
    document.getElementById("worldwide").style.display = "none";
    document.getElementById("all").style.display = "none";
    events = data;
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
        var year = parseInt(events[i].start.slice(0, 4));
        var month = parseInt(events[i].start.slice(5, 7));
        var day = parseInt(events[i].start.slice(8, 10));
        var all_date = (date.getFullYear() * 10000) + ((date.getMonth() + 1) * 100) + date.getUTCDate();
        if (all_date < ((year * 10000) + (month * 100) + day)) {
            var joined = false;
            for (var j in events[i].users) {
                if (events[i].users[j] == username) {
                    joined = true;
                    document.getElementById("joined").appendChild(bigdiv);
                    document.getElementById("joined").style.display = "block";
                    var start_text = document.createElement("p");
                    start_text.innerHTML = "<span>Starting at: <br>" + events[i].start + "</span>";
                    div.appendChild(start_text);
                }
            }
            if (joined == false) {
                if (events[i].username == "Worldwide") {
                    document.getElementById("worldwide").appendChild(bigdiv);
                    document.getElementById("worldwide").style.display = "block";
                    var start_text = document.createElement("p");
                    start_text.innerHTML = "<span>Starting at: <br>" + events[i].start + "</span>";
                    var join_button = document.createElement("a");
                    join_button.innerText = "JOIN";
                    join_button.setAttribute("class", "join_button");
                    join_button.setAttribute("href", "event/" + events[i].link);
                    start_text.appendChild(join_button);
                    div.appendChild(start_text);
                }
                else {
                    document.getElementById("all").appendChild(bigdiv);
                    document.getElementById("all").style.display = "block";
                    var start_text = document.createElement("p");
                    start_text.innerHTML = "<span>Starting at: <br>" + events[i].start + "</span>";
                    var join_button = document.createElement("a");
                    join_button.innerText = "JOIN";
                    join_button.setAttribute("class", "join_button");
                    join_button.setAttribute("href", "event/" + events[i].link);
                    join_button.onclick = function () { socket.emit("event", [code, (this.href.split("/"))[4]]) };
                    start_text.appendChild(join_button);
                    div.appendChild(start_text);
                }
            }
        }
        else {
            for (var j in events[i].users) {
                if (events[i].users[j] == username) {
                    document.getElementById("going").style.display = "block";
                    document.getElementById("going").appendChild(bigdiv);
                    var open_text = document.createElement("a");
                    open_text.setAttribute("class", "open_button");
                    open_text.setAttribute("href", "event/" + events[i].link);
                    open_text.onclick = function () { socket.emit("event", [code, (this.href.split("/"))[4]]) };
                    open_text.innerText = "OPEN";
                    div.appendChild(open_text);
                }
            }
        }
    }
}
socket.on('get_events', function (data) {
    if (am_i(data[0], code)) {
        document.getElementById('loading').style.display = 'none';
        all_events = data[1];
        show_events(all_events);
    }
});
function logout() {
    var info = {
        username: username
    };
    socket.emit("logout", [info, code]);
}
function search_event() {
    input = document.getElementById("search-input");
    var search_text = input.value.replace(new RegExp("  ", 'g'), " ");
    search_text = search_text.toLowerCase();
    while (search_text.indexOf('  ') != -1) search_text = search_text.replace(new RegExp("  ", 'g'), " ");
    if (input.value.replace(new RegExp(" ", 'g'), "") == "") {
        show_events(all_events);
    }
    else {
        var searched_events = [];
        for (var i in all_events) {
            var is_searched = false;
            for (var j in all_events[i].tag) {
                for (var k = 0; k <= all_events[i].tag[j].length - search_text.length; k++) {
                    if (search_text == (all_events[i].tag[j].slice(k, k + search_text.length)).toLowerCase()) {
                        is_searched = true;
                    }
                }
            }
            for (var k = 0; k <= all_events[i].name.length - search_text.length; k++) {
                if (search_text == (all_events[i].name.slice(k, k + search_text.length)).toLowerCase()) {
                    is_searched = true;
                }
            }
            for (var k = 0; k <= all_events[i].username.length - search_text.length; k++) {
                if (search_text == (all_events[i].username.slice(k, k + search_text.length)).toLowerCase()) {
                    is_searched = true;
                }
            }
            if (is_searched == true) {
                searched_events.push(all_events[i]);
            }
        }
        show_events(searched_events);
    }
}