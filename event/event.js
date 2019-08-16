var date = new Date();

var username;
var event;

socket.on('logedin', function (data) {
    if (am_i(data[0], code)) {
        username = data[1].username;
        document.getElementById('loading').style.display = 'block';
        document.getElementById('loading' + (Math.floor(Math.random() * 5) + 1)).style.display = 'block';
        socket.emit("get_event", [code, ((document.URL.split("?"))[1].split("="))[1]]);
    }
});
socket.on('joinEvent', function (data) {
    if (am_i(data, code)) {
        username = data[1].username;
        document.getElementById('loading').style.display = 'block';
        document.getElementById('loading' + (Math.round(Math.random() * 5))).style.display = 'block';
        socket.emit("get_event", [code, ((document.URL.split("?"))[1].split("="))[1]]);
    }
});
socket.on('notlogedin', function (data) {
    if (am_i(data, code)) {
        window.open("../", "_self");
    }
});
socket.on('get_event', function (data) {
    if (am_i(data[0], code)) {
        document.getElementById('loading').style.display = 'none';
        event = data[1];
        document.getElementById("top-image").style.backgroundImage = "url('" + event.topimage + "')";
        document.getElementById("title").innerText = event.name;
        document.getElementById("username").innerText = event.username;
        var dd = String(date.getDate()).padStart(2, '0');
        var mm = String(date.getMonth() + 1).padStart(2, '0');
        var yyyy = date.getFullYear();
        for (var i in event.quizzes) {
            var bigdiv = document.createElement("div");
            bigdiv.setAttribute("class", "quiz");
            var div = document.createElement("div");
            div.setAttribute("class", "gray");
            bigdiv.appendChild(div);
            bigdiv.style.backgroundImage = "url('" + event.quizzes[i].topimage + "')";
            var title = document.createElement("h2");
            title.innerText = event.quizzes[i].title;
            var day = document.createElement("p");
            day.innerText = event.quizzes[i].date;
            var open = document.createElement("a");
            open.innerText = "OPEN";
            open.setAttribute("class", "open");
            div.appendChild(title);
            div.appendChild(day);
            if (event.quizzes[i].date == yyyy + "-" + mm + "-" + dd) {
                bigdiv.setAttribute("class", "quiz today");
                open.setAttribute("onclick", `openQuiz(${event.quizzes[i].id})`);
                div.appendChild(open);
            }
            else {
                if (event.quizzes[i].date <= yyyy + "-" + mm + "-" + dd) {
                    bigdiv.setAttribute("class", "quiz past");
                    open.setAttribute("onclick", `openQuiz(${event.quizzes[i].id})`);
                    div.appendChild(open);
                }
                else {
                    bigdiv.setAttribute("class", "quiz soon");
                    var soon = document.createElement("a");
                    soon.innerText = "SOON";
                    soon.setAttribute("class", "soon-button");
                    div.appendChild(soon);
                }
            }
            document.getElementById("list").appendChild(bigdiv);
        }
        var join = true;
        for (var i in event.users) {
            if (event.users[i] == username) {
                join = false;
            }
        }
        document.getElementById("join").innerText = "START";
        if (join) {
            document.getElementById("join").innerText = "JOIN";
            document.getElementById("join").onclick = function () { socket.emit("joinEvent", [code, username, event.id]); };
        }
        if (event == "none") {
            window.open("../", "_self");
        }
    }
});
function logout() {
    localStorage.clear();
    var info = {
        username: username
    };
    socket.emit("logout", [info, code]);
}