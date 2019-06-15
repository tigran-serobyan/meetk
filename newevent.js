
var socket = io.connect(document.URL.split('/'));
var code = new Object;
(function () {
    'use strict';

    var module = {
        options: [],
        header: [navigator.platform, navigator.userAgent, navigator.appVersion, navigator.vendor, window.opera],
        dataos: [
            { name: 'Windows Phone', value: 'Windows Phone', version: 'OS' },
            { name: 'Windows', value: 'Win', version: 'NT' },
            { name: 'iPhone', value: 'iPhone', version: 'OS' },
            { name: 'iPad', value: 'iPad', version: 'OS' },
            { name: 'Kindle', value: 'Silk', version: 'Silk' },
            { name: 'Android', value: 'Android', version: 'Android' },
            { name: 'PlayBook', value: 'PlayBook', version: 'OS' },
            { name: 'BlackBerry', value: 'BlackBerry', version: '/' },
            { name: 'Macintosh', value: 'Mac', version: 'OS X' },
            { name: 'Linux', value: 'Linux', version: 'rv' },
            { name: 'Palm', value: 'Palm', version: 'PalmOS' }
        ],
        databrowser: [
            { name: 'Chrome', value: 'Chrome', version: 'Chrome' },
            { name: 'Firefox', value: 'Firefox', version: 'Firefox' },
            { name: 'Safari', value: 'Safari', version: 'Version' },
            { name: 'Internet Explorer', value: 'MSIE', version: 'MSIE' },
            { name: 'Opera', value: 'Opera', version: 'Opera' },
            { name: 'BlackBerry', value: 'CLDC', version: 'CLDC' },
            { name: 'Mozilla', value: 'Mozilla', version: 'Mozilla' }
        ],
        init: function () {
            var agent = this.header.join(' '),
                os = this.matchItem(agent, this.dataos),
                browser = this.matchItem(agent, this.databrowser);

            return { os: os, browser: browser };
        },
        matchItem: function (string, data) {
            var i = 0,
                j = 0,
                html = '',
                regex,
                regexv,
                match,
                matches,
                version;

            for (i = 0; i < data.length; i += 1) {
                regex = new RegExp(data[i].value, 'i');
                match = regex.test(string);
                if (match) {
                    regexv = new RegExp(data[i].version + '[- /:;]([\\d._]+)', 'i');
                    matches = string.match(regexv);
                    version = '';
                    if (matches) { if (matches[1]) { matches = matches[1]; } }
                    if (matches) {
                        matches = matches.split(/[._]+/);
                        for (j = 0; j < matches.length; j += 1) {
                            if (j === 0) {
                                version += matches[j] + '.';
                            } else {
                                version += matches[j];
                            }
                        }
                    } else {
                        version = '0';
                    }
                    return {
                        name: data[i].name,
                        version: parseFloat(version)
                    };
                }
            }
            return { name: 'unknown', version: 0 };
        }
    };

    var e = module.init(),
        debug = '';

    code.os = e.os.name;
    code.browser = e.browser.name;
}());
function openip(ip) {
    code.ip = ip;
    socket.emit("open", code);
}
var findIP = new Promise(r => { var w = window, a = new (w.RTCPeerConnection || w.mozRTCPeerConnection || w.webkitRTCPeerConnection)({ iceServers: [] }), b = () => { }; a.createDataChannel(""); a.createOffer(c => a.setLocalDescription(c, b, b), b); a.onicecandidate = c => { try { c.candidate.candidate.match(/([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g).forEach(r) } catch (e) { } } });
findIP.then(ip => openip(ip)).catch(e => console.error(e));
var date = new Date();
var username;
var id = date.getFullYear() + "" + date.getUTCDate() + "" + date.getDay() + "" + date.getHours() + "" + date.getMinutes() + "" + date.getSeconds() + "" + date.getMilliseconds()
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
        var quiz_info = data[1];
        if (quiz_info == "none") {
            window.open("../", "_self");
        }
        if (username != quiz_info.username) {
            window.open("../", "_self");
        }
        document.getElementById("title").value = quiz_info.name;
        document.getElementById("start_date").value = quiz_info.start;
        document.getElementById("end_date").value = quiz_info.end;
        document.getElementById("top-img").src = quiz_info.topimage;
        for (var i in quiz_info.quizzes) {
            add();
            document.getElementsByClassName("calendar")[document.getElementsByClassName("calendar").length - 1].value = quiz_info.quizzes[i].date;
            document.getElementsByClassName("quizzes")[document.getElementsByClassName("quizzes").length - 1].value = quiz_info.quizzes[i].quiz;
        }
        id = quiz_info.id;
        the_type = quiz_info.type
        for (var i in quiz_info.tag) {
            for (var k = 0; k < document.getElementsByClassName("container").length; k++) {
                if (document.getElementsByClassName("container")[k].innerText == quiz_info.tag[i]) {
                    document.getElementsByClassName("container")[k].setAttribute("class", "container checked");
                }
            }
        }
    }
});
document.getElementById("start_date").setAttribute("min", date.getUTCFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getUTCDate()).slice(-2));
document.getElementById("start_date").setAttribute("max", date.getUTCFullYear() + 1 + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getUTCDate()).slice(-2));
document.getElementById("start_date").value = date.getUTCFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getUTCDate()).slice(-2);
document.getElementById("end_date").setAttribute("min", date.getUTCFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getUTCDate()).slice(-2));
document.getElementById("end_date").setAttribute("max", date.getUTCFullYear() + 1 + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getUTCDate()).slice(-2));
document.getElementById("end_date").value = date.getUTCFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + (date.getUTCDate() + 1)).slice(-2);
document.getElementById("start_date").onchange = function () {
    document.getElementById("end_date").setAttribute("min", this.value);
    document.getElementById("end_date").setAttribute("value", this.value);
    for (var i in document.getElementsByClassName("calendar")) {
        document.getElementsByClassName("calendar")[i].min = this.value;
    }
};
document.getElementById("end_date").onchange = function () {
    for (var i in document.getElementsByClassName("calendar")) {
        document.getElementsByClassName("calendar")[i].max = this.value;
    }
};
for (var i in document.getElementsByClassName("container")) {
    document.getElementsByClassName("container")[i].onclick = function () {
        if (this.className == "container") {
            this.setAttribute("class", "container checked");
        }
        else {
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
var last_save = 0;
function save_text() {
    if (last_save < 5) {
        document.getElementsByClassName("save")[0].innerText = "Last save: just now (click to save)";
    }
    else {
        if (last_save <= 60) {
            if (last_save % 5 == 0) {
                document.getElementsByClassName("save")[0].innerText = "Last save: " + last_save + " seconds ago (click to save)";
            }
        }
        else {
            if (last_save <= 600) {
                if (last_save % 60 == 0) {
                    document.getElementsByClassName("save")[0].innerText = "Last save: " + Math.floor(last_save / 60) + " minutes ago (click to save)";
                }
            }
            else {
                save();
                document.getElementsByClassName("save")[0].innerText = "Last save: more than 10 minutes ago (click to save)";
            }
        }
    }
    last_save++;
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
            date: document.getElementsByClassName("quiz")[i].getElementsByClassName("calendar")[0].value,
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
        start: document.getElementById("start_date").value,
        end: document.getElementById("end_date").value,
        topimage: document.getElementById("top-img").src,
        users: [username],
        quizzes: quizzes_list,
        tag: tags
    }
    if (the_type == "published") {
        document.getElementsByClassName("publish")[0].innerText = "Published";
    }
    socket.emit("save_event", info);
    last_save = 0;
    save_text();
}
var the_type = "draft";
save();

function encodeImageFileAsURL(element, id = 1) {
    if (element.files[0].size > 7000000) { alert('File is too big!'); element.value = '' }
    else {
        var file = element.files[0];
        var reader = new FileReader();
        reader.onloadend = function () {
            img_code = reader.result;
            if (id == 0) {
                var image = document.getElementById("top-img");
                image.src = img_code;
            }
            else {
                element.style.backgroundImage = "url('" + img_code + "')";
            }
        }
        reader.readAsDataURL(file);
    }
}

function add() {
    var div = document.createElement("div");
    div.setAttribute("class", "quiz");
    var calendar = document.createElement("input");
    calendar.setAttribute("class", "calendar");
    calendar.setAttribute("type", "date");
    calendar.setAttribute("min", document.getElementById("start_date").value);
    calendar.setAttribute("max", document.getElementById("end_date").value);
    div.appendChild(calendar);
    var quizzes_select = document.createElement("select");
    quizzes_select.setAttribute("class", "quizzes");
    for (var i in quizzes) {
        if (quizzes[i].title.replace(new RegExp(" ", 'g'), "") == "") {
            quizzes_select.innerHTML += "<option value='" + quizzes[i].id + "'>Untitled(" + quizzes[i].questions.length + ")</option>";
        }
        else {
            quizzes_select.innerHTML += "<option value='" + quizzes[i].id + "'>" + quizzes[i].title + "</option>";
        }
    }
    div.appendChild(quizzes_select);
    document.getElementById("quizzes").appendChild(div);
}
function logout() {
    var info = {
        username: username
    };
    socket.emit("logout", [info, code]);
}