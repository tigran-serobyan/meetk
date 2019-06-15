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
var event;

socket.on('logedin', function (data) {
    if (am_i(data[0], code)) {
        username = data[1].username;
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
        event = data[1];
        document.getElementById("top-image").style.backgroundImage = "url('" + event.topimage + "')";
        document.getElementById("title").innerText = event.name;
        document.getElementById("username").innerText = event.username;
        var dd = String(date.getDate()).padStart(2, '0');
        var mm = String(date.getMonth() + 1).padStart(2, '0');
        var yyyy = date.getFullYear();
        console.log(event.quizzes)
        for (var i in event.quizzes) {
            if (event.quizzes[i].date == yyyy + "-" + mm + "-" + dd) {
                var a = document.createElement("a");
                a.setAttribute("class", "today");
                a.setAttribute("href", "quiz/" + event.quizzes[i].link);
                a.innerText = event.quizzes[i].quiz;
                document.getElementById("list").appendChild(a);
            }
            else {
                if (event.quizzes[i].date <= yyyy + "-" + mm + "-" + dd) {
                    var a = document.createElement("a");
                    a.setAttribute("class", "past");
                    a.setAttribute("href", "quiz/" + event.quizzes[i].link);
                    a.innerText = event.quizzes[i].quiz;
                    document.getElementById("list").appendChild(a);
                }
                else {
                    var a = document.createElement("a");
                    a.setAttribute("class", "soon");
                    a.innerText = event.quizzes[i].quiz;
                    document.getElementById("list").appendChild(a);
                }
            }
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
        }
        if (event == "none") {
            window.open("../", "_self");
        }
    }
});
function logout() {
    var info = {
        username: username
    };
    socket.emit("logout", [info, code]);
}