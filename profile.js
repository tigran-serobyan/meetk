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
            open_text.setAttribute("href", "event/" + events[i].link);
            open_text.onclick = function () { socket.emit("event", [code, (this.href.split("/"))[4]]) };
            open_text.innerText = "OPEN";
            div.appendChild(open_text);
        }
    }
});
socket.on('get_the_profile', function (data) {
    if (am_i(data[0], code)) {
        document.getElementById("name_surname").innerText = data[1].name + " " + data[1].surname;
        document.getElementById("username").innerText = "@" + data[1].username;
        document.getElementById("location").innerText = data[1].location;
        if (data[1].pic) {
            document.getElementById("profile_image").src = data[1].pic;
        }
        else {
            if (data[1].gender == "male") {
                document.getElementById("profile_image").src = "style/male.jpg";
            }
            else {
                document.getElementById("profile_image").src = "style/female.jpg";
            }
        }
        if (data[1].backpic) {
            document.getElementById("top").style.backgroundImage = "url('" + data[1].backpic + "')";
        }
        else {
            document.getElementById("top").style.backgroundImage = "url('style/profile_background.png')";
        }
        socket.emit("get_the_events", [code, document.URL.split("?")[1].split("=")[1]]);
    }
});