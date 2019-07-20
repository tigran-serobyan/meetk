var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var ip = require('ip');
var fs = require('fs-extra');
var usersJson = fs.readJsonSync('./json/users.json');
if (usersJson.users) {
    var users = usersJson.users;
}
else {
    var users = [];
}
var logindataJson = fs.readJsonSync('./json/logindata.json');
if (logindataJson.data) {
    var logindata = logindataJson.data;
}
else {
    var logindata = [];
}
var eventsJson = fs.readJsonSync('./json/events.json');
if (eventsJson.data) {
    var events = eventsJson.data;
}
else {
    var events = [];
}
var quizJson = fs.readJsonSync('./json/quiz.json');
if (quizJson.data) {
    var quiz = quizJson.data;
}
else {
    var quiz = [];
}
var url = ip.address();
var date = new Date();
app.use(express.static("."));
app.get('/', function (req, res) {
    res.redirect('./');
});
app.get('/home', function (req, res) {
    res.redirect('./home');
});
app.get('/event/:eventlink', function (req, res) {
    res.redirect('./event?id=' + req.params.eventlink);
});
app.get('/newquiz', function (req, res) {
    res.redirect('./newquiz');
});
app.get('/newquiz/:link', function (req, res) {
    res.redirect('./newquiz?id=' + req.params.link);
});
app.get('/newevent/', function (req, res) {
    res.redirect('./newevent');
});
app.get('/newevent/:link', function (req, res) {
    res.redirect('./newevent?id=' + req.params.link);
});
app.get('/myworks', function (req, res) {
    res.redirect('./myworks');
});
app.get('/profile/:username', function (req, res) {
    res.redirect('./profile?username=' + req.params.username);
});
app.get('/settings', function (req, res) {
    res.redirect('./settings');
});
app.get('*', function (req, res) {
    res.redirect('../page-not-found');
});
server.listen(3000);
function saveDataOnJson() {
    for (var i in events) {
        if (events[i].type == "published") {
            if (events[i].end < date.getUTCFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getUTCDate()).slice(-2)) {
                events[i].type = "ended";
            }
        }
    }
    fs.writeJson('./json/events.json', { "data": events }, err => {
        if (err) return console.error(err);
    });
    fs.writeJson('./json/quiz.json', { "data": quiz }, err => {
        if (err) return console.error(err);
    });
    fs.writeJson('./json/users.json', { "users": users }, err => {
        if (err) return console.error(err);
    });
    fs.writeJson('./json/logindata.json', { "data": logindata }, err => {
        if (err) return console.error(err);
    });
    console.log("All Info saved in json files");
    setTimeout(() => {
        saveDataOnJson();
    }, 120000);
}
saveDataOnJson();
io.on('connection', function (socket) {
    socket.on("open", function (data) {
        let info = data[0];
        let code = data[1];
        if (info && info != "null") {
            let username = false;
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
                io.sockets.emit("logedin", [code, info]);
            }
            else {
                info = {
                    "username": info.username,
                    "data": date.getFullYear() + "." + date.getUTCDate() + "." + date.getDay() + "." + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds(),
                    "code": code,
                    "login": false
                }
                logindata.push(info);
                io.sockets.emit("notlogedin", code);
            }
        }
        else {
            io.sockets.emit("notlogedin", code);
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
        for (var i in the_event.quizzes) {
            for (var j in quiz) {
                if (the_event.quizzes[i].link == quiz[j].id) {
                    var the_date = the_event.quizzes[i].date;
                    the_event.quizzes[i] = quiz[j];
                    the_event.quizzes[i].date = the_date
                }
            }
        }
        io.sockets.emit("get_event", [data[0], the_event]);
    })
    socket.on("get_quiz", function (data) {
        var the_quiz = "none";
        for (var i in quiz) {
            if (quiz[i].id == data[1]) {
                the_quiz = quiz[i];
                break;
            }
        }
        io.sockets.emit("get_quiz", [data[0], the_quiz]);
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
    socket.on("get_my_works", function (data) {
        var the_quizzes = [];
        for (var i in quiz) {
            if (quiz[i].username == data[1]) {
                the_quizzes.push(quiz[i]);
            }
        }
        var the_events = [];
        for (var i in events) {
            if (events[i].username == data[1]) {
                the_events.push(events[i]);
            }
        }
        io.sockets.emit("get_my_works", [data[0], the_quizzes, the_events]);
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
    })
    socket.on("get_the_profile", function (data) {
        for (var i in users) {
            if (users[i].username == data[1]) {
                var user_info = {};
                for (var j in users[i]) {
                    if (j != "password") {
                        user_info[j] = users[i][j]
                    }
                }
                io.sockets.emit("get_the_profile", [data[0], user_info]);
            }
        }
    })
});