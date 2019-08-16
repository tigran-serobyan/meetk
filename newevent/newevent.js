var username;
var date = new Date();
var id = date.getFullYear() + "" + date.getUTCMonth() + "" + date.getUTCDate() + "" + date.getHours() + "" + date.getMinutes() + "" + date.getSeconds() + "" + date.getMilliseconds()
socket.on('logedin', function (data) {
    if (am_i(data[0], code)) {
        username = data[1].username;
        socket.emit("get_the_quizzes", [code, username]);
        if (((document.URL.split("?")[1]))) {
            socket.emit("get_event", [code, ((document.URL.split("?"))[1].split("="))[1]]);
        }
    }
});
socket.on('notlogedin', function (data) {
    if (am_i(data, code)) {
        window.open("../", "_self");
    }
});
var quizzes = [];
socket.on('get_the_quizzes', function (data) {
    if (am_i(data[0], code)) {
        quizzes = data[1];
    }
});
socket.on('get_event', function (data) {
    if (am_i(data[0], code)) {
        var event_info = data[1];
        if (event_info == "none") {
            window.open("../", "_self");
        }
        if (username != event_info.username) {
            window.open("../", "_self");
        }
        document.getElementById("title").value = event_info.name;
        document.getElementById("top-img").src = event_info.topimage;
        for (var i in event_info.quizzes) {
            add();
            for (var j of document.getElementsByClassName("quizzes")[document.getElementsByClassName("quizzes").length - 1].getElementsByTagName("option")) {
                if (j.innerText == event_info.quizzes[i].quiz) {
                    document.getElementsByClassName("quizzes")[document.getElementsByClassName("quizzes").length - 1].value = j.value;
                }
            }
        }
        id = event_info.id;
        the_type = event_info.type
        for (var i in event_info.tag) {
            for (var k = 0; k < document.getElementsByClassName("container").length; k++) {
                if (document.getElementsByClassName("container")[k].innerText == event_info.tag[i]) {
                    document.getElementsByClassName("container")[k].setAttribute("class", "container checked");
                }
            }
        }
    }
});
for (var i in document.getElementsByClassName("container")) {
    document.getElementsByClassName("container")[i].onclick = function () {
        if (this.className == "container") {
            this.setAttribute("class", "container checked");
        } else {
            this.setAttribute("class", "container");
        }
    }
}

function check_publish() {
    document.getElementsByClassName("publish")[0].style = "";
    if (document.getElementById("top-img").src == document.URL) {
        document.getElementsByClassName("publish")[0].style.background = "#a31200";
        document.getElementsByClassName("publish")[0].style.borderColor = "#a31200";
    }
    for (var i = 0; i < document.getElementsByTagName("input").length; i++) {
        if (document.getElementsByTagName("input")[i].getAttribute("id") != "top-img-input") {
            if (document.getElementsByTagName("input")[i].value == "") {
                document.getElementsByClassName("publish")[0].style.background = "#a31200";
                document.getElementsByClassName("publish")[0].style.borderColor = "#a31200";
            }
        }
    }
    setTimeout(() => {
        check_publish();
    }, 2000);
}

function publish() {
    if (document.getElementsByClassName("publish")[0].style.background == "") {
        the_type = "published";
        document.getElementsByClassName("publish")[0].innerText = "Publishing";
        save();
    }
}

var last_save = false;

function save_text() {
    if (last_save) {
        if (last_save < 5) {
            document.getElementsByClassName("save")[0].innerText = "Last save: just now (click to save)";
        } else {
            if (last_save <= 60) {
                if (last_save % 5 == 0) {
                    document.getElementsByClassName("save")[0].innerText = "Last save: " + last_save + " seconds ago (click to save)";
                }
            } else {
                if (last_save <= 600) {
                    if (last_save % 60 == 0) {
                        document.getElementsByClassName("save")[0].innerText = "Last save: " + Math.floor(last_save / 60) + " minutes ago (click to save)";
                    }
                } else {
                    save();
                    document.getElementsByClassName("save")[0].innerText = "Last save: more than 10 minutes ago (click to save)";
                }
            }
        }
        last_save++;
    } else {
        document.getElementsByClassName("save")[0].innerText = "Not saved yet (click to save)";
    }
    setTimeout(() => {
        save_text();
    }, 1000);
}

function save() {
    var checked = document.getElementsByClassName("checked");
    var tags = [];
    for (var i = 0; i < checked.length; i++) {
        tags.push(checked[i].innerText);
    }
    var quizzes_list = [];
    for (var i = 0; i < document.getElementsByClassName("quiz").length; i++) {
        quizzes_list.push({
            link: document.getElementsByClassName("quiz")[i].getElementsByClassName("quizzes")[0].value,
            quiz: document.getElementsByClassName("quiz")[i].getElementsByClassName("quizzes")[0].innerText,
        });
    }

    var info = {
        id: id,
        link: id,
        username: username,
        type: the_type,
        name: document.getElementById("title").value,
        topimage: document.getElementById("top-img").src,
        users: [username],
        quizzes: quizzes_list,
        tag: tags
    }
    if (the_type == "published") {
        document.getElementsByClassName("publish")[0].innerText = "Published";
    }
    socket.emit("save_event", info);
    last_save = 1;
    document.getElementsByClassName("save")[0].innerText = "Last save: just now (click to save)";
}

save_text();
var the_type = "draft";

function encodeImageFileAsURL(element, id = 1) {
    if (element.files[0].size > 7000000) {
        alert('File is too big!');
        element.value = ''
    } else {
        var file = element.files[0];
        var reader = new FileReader();
        reader.onloadend = function () {
            img_code = reader.result;
            if (id == 0) {
                var image = document.getElementById("top-img");
                image.src = img_code;
            } else {
                element.style.backgroundImage = "url('" + img_code + "')";
            }
        }
        reader.readAsDataURL(file);
    }
}

function add() {
    var div = document.createElement("div");
    div.setAttribute("class", "quiz");
    var quizzes_select = document.createElement("select");
    quizzes_select.setAttribute("class", "quizzes");
    for (var i in quizzes) {
        if (quizzes[i].title.replace(new RegExp(" ", 'g'), "") == "") {
            quizzes_select.innerHTML += "<option value='" + quizzes[i].id + "'>Untitled(" + quizzes[i].questions.length + ")</option>";
        } else {
            quizzes_select.innerHTML += "<option value='" + quizzes[i].id + "'>" + quizzes[i].title + "</option>";
        }
    }
    div.appendChild(quizzes_select);
    var deleteButton = document.createElement("span");
    deleteButton.innerText = "Delete";
    deleteButton.setAttribute("class", "delete");
    deleteButton.setAttribute("onclick", "this.parentElement.remove()");
    div.appendChild(deleteButton);
    document.getElementById("quizzes").appendChild(div);
}

function logout() {
localStorage.clear();
var info = {
        username: username
    };
    socket.emit("logout", [info, code]);
}

function deleteEvent() {
    var info = {
        id: id,
        type: "deleted",
    }
    socket.emit("save_event", [code, info]);
}

socket.on("event_deleted", function () {
    window.open("../myworks", "_self");
});