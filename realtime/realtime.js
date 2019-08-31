var username;
var all_quizzes;
var width = 0;

socket.on('logedin', function (data) {
    if (am_i(data[0], code)) {
        username = data[1].username;
        document.getElementById('loading').style.display = 'block';
        document.getElementById('loading' + (Math.floor(Math.random() * 5) + 1)).style.display = 'block';
        socket.emit("get_quizzes", code);
    }
});
socket.on('notlogedin', function (data) {
    if (am_i(data, code)) {
        window.open("../", "_self");
    }
});

socket.on('join_realtime_game', function (data) {
    if (am_i(data.code, code)) {
        if (data.gameCode === 'notFound') {
            document.getElementById('error').innerText = 'Game not found'
        } else {
            window.open('/realtime/play/' + data.gameCode, '_self');
        }
    }
});

function joinRealtimeGame() {
    socket.emit('join_realtime_game', {
        gameCode: document.getElementById('realtimeCode').value,
        code, username
    });
}

function chooseQuiz(id) {
    socket.emit('new_realtime_game', {
        code,
        gameCode: makeid(10, "QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm1234567890"),
        id,
        username,
        status: 'waiting'
    });
}

function show_quizzes(data) {
    document.getElementById("all").innerHTML = "<h3>Create</h3>";
    document.getElementById("all").style.display = "none";
    quizzes = data;
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
        var creator = document.createElement("h3");
        creator.innerText = quizzes[i].username;
        div.appendChild(creator);
        document.getElementById("all").appendChild(bigdiv);
        document.getElementById("all").style.display = "block";
        var play_button = document.createElement("a");
        play_button.innerText = "CHOOSE";
        play_button.setAttribute("class", "play_button");
        play_button.setAttribute("onclick", "chooseQuiz(" + quizzes[i].id + ")");
        div.appendChild(play_button);
    }
}

socket.on('get_quizzes', function (data) {
    if (am_i(data[0], code)) {
        document.getElementById('loading').style.display = 'none';
        all_quizzes = data[1];
        show_quizzes(all_quizzes);
    }
});



function searchInput() {
    input = document.getElementById("search-input");
    var search_text = input.value.replace(new RegExp("  ", 'g'), " ");
    search_text = search_text.toLowerCase();
    while (search_text.indexOf('  ') != -1) search_text = search_text.replace(new RegExp("  ", 'g'), " ");
    if (input.value.replace(new RegExp(" ", 'g'), "") == "") {
        show_quizzes(all_quizzes);
    } else {
        var searched_quizzes = [];
        for (var i in all_quizzes) {
            var is_searched = false;
            if (all_quizzes[i].title) {
                for (var k = 0; k <= all_quizzes[i].title.length - search_text.length; k++) {
                    if (search_text == (all_quizzes[i].title.slice(k, k + search_text.length)).toLowerCase()) {
                        is_searched = true;
                    }
                }
            }
            if (all_quizzes[i].username) {
                for (var k = 0; k <= all_quizzes[i].username.length - search_text.length; k++) {
                    if (search_text == (all_quizzes[i].username.slice(k, k + search_text.length)).toLowerCase()) {
                        is_searched = true;
                    }
                }
            }
            if (is_searched == true) {
                searched_quizzes.push(all_quizzes[i]);
            }
        }
        show_quizzes(searched_quizzes);
    }
}
