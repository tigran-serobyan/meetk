var username;
var all_events;
var all_quizzes;

socket.on('logedin', function (data) {
    if (am_i(data[0], code)) {
        username = data[1].username;
        document.getElementById('loading').style.display = 'block';
        document.getElementById('loading' + (Math.floor(Math.random() * 5) + 1)).style.display = 'block';
        socket.emit("get_my_works", [code, username]);
    }
});
socket.on('notlogedin', function (data) {
    if (am_i(data, code)) {
        window.open("../", "_self");
    }
});
function show_events(data) {
    events = data;
    var eventsDiv = document.getElementById("events");
    eventsDiv.innerHTML = "<p>Your events: <b id='events-count'>0</b>";
    document.getElementById("events-count").innerHTML = events.length;
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
        var start_text = document.createElement("p");
        start_text.innerHTML = "Starting: " + events[i].start + "<br> Ending:" + events[i].end;
        var edit_button = document.createElement("a");
        edit_button.innerText = "Edit";
        edit_button.setAttribute("class", "edit_button");
        edit_button.setAttribute("href", "../newevent/" + events[i].link);
        div.appendChild(start_text);
        div.appendChild(edit_button);
        eventsDiv.appendChild(bigdiv);
    }
}
function show_quizzes(data) {
    quizzes = data;
    var quizzesDiv = document.getElementById("quizzes");
    quizzesDiv.innerHTML = "<p>Your quizzes: <b id='quizzes-count'>0</b>";
    document.getElementById("quizzes-count").innerHTML = quizzes.length;
    for (var i = quizzes.length - 1; i >= 0; i--) {
        var bigdiv = document.createElement("div");
        bigdiv.setAttribute("class", "quiz");
        var div = document.createElement("div");
        div.setAttribute("class", "gray");
        bigdiv.appendChild(div);
        bigdiv.style.backgroundImage = "url('" + quizzes[i].topimage + "')";
        var title = document.createElement("h2");
        title.innerText = quizzes[i].title;
        div.appendChild(title);
        var edit_button = document.createElement("a");
        edit_button.innerText = "Edit";
        edit_button.setAttribute("class", "edit_button");
        edit_button.setAttribute("href", "../newquiz/" + quizzes[i].id);
        div.appendChild(edit_button);
        quizzesDiv.appendChild(bigdiv);
    }
}
socket.on('get_my_works', function (data) {
    if (am_i(data[0], code)) {
        document.getElementById('loading').style.display = 'none';
        all_quizzes = data[1];
        all_events = data[2];
        show_events(all_events);
        show_quizzes(all_quizzes);
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
        show_quizzes(all_quizzes);
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
            if (is_searched == true) {
                searched_events.push(all_events[i]);
            }
        }
        show_events(searched_events);
        var searched_quizzes = [];
        for (var i in all_quizzes) {
            var is_searched = false;
            for (var k = 0; k <= all_quizzes[i].title.length - search_text.length; k++) {
                if (search_text == (all_quizzes[i].title.slice(k, k + search_text.length)).toLowerCase()) {
                    is_searched = true;
                }
            }
            if (is_searched == true) {
                searched_quizzes.push(all_quizzes[i]);
            }
        }
        show_quizzes(searched_quizzes);
    }
}