var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var ip = require('ip');
var fs = require('fs-extra');
var users = fs.readJsonSync('./users.json').users;
var logindata = fs.readJsonSync('./logindata.json').data;
var events = fs.readJsonSync('./events.json').data;
var quiz = fs.readJsonSync('./quiz.json').data;
console.log(ip.address());
var date = new Date();
app.use(express.static("."));
app.get('/', function (req, res) {
    res.location('.');
});
app.get('/home', function (req, res) {
    req.redirect('/home.html');
});
app.get('/event/:eventlink', function (req, res) {
    res.location('/event.html?id=' + req.params.eventlink);
});
app.get('/newquiz', function (req, res) {
    res.location('/newquiz.html');
});
app.get('/newevent', function (req, res) {
    res.location('/newevent.html');
});
app.get('/profile/:username', function (req, res) {
    res.location('/profile.html?username=' + req.params.username);
});
server.listen(3000);
io.on('connection', function (socket) {
    events = fs.readJsonSync('./events.json').data;
    quiz = fs.readJsonSync('./quiz.json').data;
    socket.on("open", function (data) {
        var logedin = false;
        for (var i = logindata.length - 1; i >= 0; i--) {
            if (logindata[i].code.os == data.os && logindata[i].code.browser == data.browser && logindata[i].code.ip == data.ip) {
                if (logindata[i].login == true) {
                    io.sockets.emit("logedin", [data, logindata[i]]);
                    logedin = true;
                    break;
                }
                else {
                    io.sockets.emit("notlogedin", data);
                    break;
                }
            }
        }
        if (logedin == false) {
            io.sockets.emit("notlogedin", data);
        }
    })
    socket.on("get_events", function (data) {
        var published_events = [];
        for (var i in events) {
            if (events[i].type == "published") {
                published_events.push(events[i]);
            }
        }
        io.sockets.emit("get_events", [data, published_events]);
    })
    socket.on("data", function (data) {
        console.log(data)
    })
    socket.on("register", function (data) {
        var info = data[0];
        var code = data[1];
        var username = true;
        for (var i in users) {
            if (info.username == users[i].username) {
                io.sockets.emit("no_username", code);
                username = false;
            }
        }
        if (username) {
            users.push(info);
            io.sockets.emit("registered", code);
            fs.writeJson('./users.json', { "users": users }, err => {
                if (err) return console.error(err);
            });
        }
    })
    socket.on("login", function (data) {
        var info = data[0];
        var code = data[1];
        var username = false;
        for (var i in users) {
            if (info.username == users[i].username && info.password == users[i].password) {
                username = true;
            }
        }
        if (username) {
            info = {
                "username": info.username,
                "data": date.getFullYear() + "." + (date.getUTCMonth() + 1) + "." + date.getUTCDate() + "." + date.getDay() + "." + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds(),
                "code": code,
                "login": true
            }
            logindata.push(info);
            fs.writeJson('./logindata.json', { "data": logindata }, err => {
                if (err) return console.error(err);
            });
            io.sockets.emit("logedin", [code, info]);
        }
        else {
            io.sockets.emit("no_login", code);
        }
    })
    socket.on("logout", function (data) {
        var info = data[0];
        var code = data[1];
        info = {
            "username": info.username,
            "data": date.getFullYear() + "." + date.getUTCDate() + "." + date.getDay() + "." + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds(),
            "code": code,
            "login": false
        }
        logindata.push(info);
        fs.writeJson('./logindata.json', { "data": logindata }, err => {
            if (err) return console.error(err);
        });
        io.sockets.emit("notlogedin", code);
    })
    socket.on("get_event", function (data) {
        var the_event = "none";
        for (var i in events) {
            if (events[i].link == data[1]) {
                the_event = events[i];
                break;
            }
        }
        io.sockets.emit("get_event", [data[0], the_event]);
    })
    socket.on("get_the_quizzes", function (data) {
        var the_quizzes = [];
        for (var i in quiz) {
            if (quiz[i].username == data[1] && quiz[i].type == "published") {
                the_quizzes.push(quiz[i]);
            }
        }
        io.sockets.emit("get_the_quizzes", [data[0], the_quizzes]);
    })
    socket.on("get_the_events", function (data) {
        var the_events = [];
        for (var i in events) {
            if (events[i].username == data[1] && events[i].type == "published") {
                the_events.push(events[i]);
            }
        }
        io.sockets.emit("get_the_events", [data[0], the_events]);
    })
    socket.on("save_quiz", function (data) {
        var newquiz = true;
        for (var i in quiz) {
            if (quiz[i].id == data.id) {
                quiz[i] = data;
                newquiz = false;
            }
        }
        if (newquiz) {
            quiz.push(data);
        }
        fs.writeJson('./quiz.json', { "data": quiz }, err => {
            if (err) return console.error(err);
        });
    })
    socket.on("save_event", function (data) {
        var newevent = true;
        for (var i in events) {
            if (events[i].id == data.id) {
                events[i] = data;
                newevent = false;
            }
        }
        if (newevent) {
            events.push(data);
        }
        fs.writeJson('./events.json', { "data": events }, err => {
            if (err) return console.error(err);
        });
    })
    socket.on("get_the_profile", function (data) {
        for(var i in users){
            if(users[i].username == data[1]){
                var user_info = {};
                for(var j in users[i]){
                    if(j != "password"){
                        user_info[j] = users[i][j]
                    }
                }
                io.sockets.emit("get_the_profile",[data[0],user_info]);
            }
        }
    })
});