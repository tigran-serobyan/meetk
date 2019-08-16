const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const ip = require('ip');
const fs = require('fs-extra');

const usersJson = fs.readJsonSync('./json/users.json');
if (usersJson.users) {
    users = usersJson.users;
} else {
    users = [];
}
const logInDataJson = fs.readJsonSync('./json/logindata.json');
if (logInDataJson.data) {
    logInData = logInDataJson.data;
} else {
    logInData = [];
}
const eventsJson = fs.readJsonSync('./json/events.json');
if (eventsJson.data) {
    events = eventsJson.data;
} else {
    events = [];
}
const quizJson = fs.readJsonSync('./json/quiz.json');
if (quizJson.data) {
    quiz = quizJson.data;
} else {
    quiz = [];
}
const url = ip.address();
console.log(url);
const date = new Date();
app.use(express.static("."));
app.get('/', function (req, res) {
    res.redirect('./');
});
app.get('/home', function (req, res) {
    res.redirect('./home');
});
app.get('/event/:eventlink', function (req, res) {
    res.redirect('../event?id=' + req.params.eventlink);
});
app.get('/quiz/:eventlink', function (req, res) {
    res.redirect('../quiz?id=' + req.params.eventlink);
});
app.get('/newquiz', function (req, res) {
    res.redirect('./newquiz');
});
app.get('/newquiz/:link', function (req, res) {
    res.redirect('../newquiz?id=' + req.params.link);
});
app.get('/newevent/', function (req, res) {
    res.redirect('./newevent');
});
app.get('/newevent/:link', function (req, res) {
    res.redirect('../newevent?id=' + req.params.link);
});
app.get('/myworks', function (req, res) {
    res.redirect('./myworks');
});
app.get('/profile/:username', function (req, res) {
    let profile = false;
    for (let i in users) {
        if (users[i].username === req.params.username) {
            profile = true;
            res.redirect('../profile?username=' + req.params.username);
            break;
        }
    }
    if (!profile) {
        res.redirect('../page-not-found');
    }
});
app.get('/settings', function (req, res) {
    res.redirect('./settings');
});
app.get('*', function (req, res) {
    res.redirect('../page-not-found');
});
server.listen(3000);

function saveDataOnJson() {
    fs.writeJson('./json/events.json', {"data": events}, err => {
        if (err) return console.log(err);
    });
    fs.writeJson('./json/quiz.json', {"data": quiz}, err => {
        if (err) return console.log(err);
    });
    fs.writeJson('./json/users.json', {"users": users}, err => {
        if (err) return console.log(err);
    });
    fs.writeJson('./json/logInData.json', {"data": logInData}, err => {
        if (err) return console.log(err);
    });
    console.log("All Info saved in json files");
}

setInterval(() => {
    saveDataOnJson();
}, 600000);
io.on('connection', function (socket) {
    socket.on("open", function (data) {
        let info = data[0];
        let code = data[1];
        if (info && info !== "null") {
            let username = false;
            for (let i in users) {
                if (info.username === users[i].username && info.password === users[i].password) {
                    username = true;
                }
            }
            if (username) {
                let logInInfo = {
                    "username": info.username,
                    "data": date.getFullYear() + "." + (date.getUTCMonth() + 1) + "." + date.getUTCDate() + "." + date.getDay() + "." + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds(),
                    "code": code,
                    "login": true
                };
                logInData.push(logInInfo);
                io.sockets.emit("logedin", [code, logInInfo]);
            } else {
                let logInInfo = {
                    "username": info.username,
                    "data": date.getFullYear() + "." + date.getUTCDate() + "." + date.getDay() + "." + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds(),
                    "code": code,
                    "login": false
                };
                logInData.push(logInInfo);
                io.sockets.emit("notlogedin", code);
            }
        } else {
            io.sockets.emit("notlogedin", code);
        }
    });
    socket.on("get_events", function (data) {
        let published_events = [];
        for (let i in events) {
            if (events[i].type === "published") {
                published_events.push(events[i]);
            }
        }
        io.sockets.emit("get_events", [data, published_events]);
    });
    socket.on("joinEvent", function (data) {
        let code = data[0];
        for (let i in events) {
            if (events[i].id === data[2]) {
                events[i].users.push(data[1]);
                io.sockets.emit("joinEvent", code);
            }
        }
    });
    socket.on("register", function (data) {
        let info = data[0];
        let code = data[1];
        let username = true;
        for (let i in users) {
            if (info.username === users[i].username) {
                io.sockets.emit("no_username", code);
                username = false;
            }
        }
        if (username) {
            users.push(info);
            io.sockets.emit("registered", code);
        }
    });
    socket.on("login", function (data) {
        let info = data[0];
        let code = data[1];
        let username = false;
        for (let i in users) {
            if (info.username === users[i].username) {
                username = info.password === users[i].password;
            }
        }
        if (username) {
            const info = {
                "username": info.username,
                "data": date.getFullYear() + "." + (date.getUTCMonth() + 1) + "." + date.getUTCDate() + "." + date.getDay() + "." + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds(),
                "code": code,
                "login": true
            }
            logInData.push(info);
            io.sockets.emit("logedin", [code, info]);
        } else {
            io.sockets.emit("no_login", code);
        }
    });
    socket.on("logout", function (data) {
        let info = data[0];
        let code = data[1];
        info = {
            "username": info.username,
            "data": date.getFullYear() + "." + date.getUTCDate() + "." + date.getDay() + "." + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds(),
            "code": code,
            "login": false
        }
        logInData.push(info);
        io.sockets.emit("notlogedin", code);
    });
    socket.on("get_event", function (data) {
        let the_event = "none";
        for (let i in events) {
            if (events[i].link === data[1]) {
                the_event = events[i];
                break;
            }
        }
        for (let i in the_event.quizzes) {
            for (let j in quiz) {
                if (the_event.quizzes[i].link === quiz[j].id) {
                    let the_date = the_event.quizzes[i].date;
                    the_event.quizzes[i] = quiz[j];
                    the_event.quizzes[i].date = the_date
                }
            }
        }
        io.sockets.emit("get_event", [data[0], the_event]);
    });
    socket.on("get_quiz", function (data) {
        let the_quiz = "none";
        for (let i in quiz) {
            if (quiz[i].id === data[1]) {
                let hasPoints = false;
                for (let resultI in quiz[i].results) {
                    if (quiz[i].results[resultI].username === data[2]) {
                        hasPoints = true;
                        the_quiz = "Done";
                        break;
                    }
                }
                if (!hasPoints) {
                    the_quiz = quiz[i];
                }
                break;
            }
        }
        io.sockets.emit("get_quiz", [data[0], the_quiz]);
    });
    socket.on("changeQuizResult", function (data) {
        for (let i in quiz) {
            if (quiz[i].id === data.quizId) {
                if (quiz[i].results) {
                    let hasPoints = false;
                    for (let resultI in quiz[i].results) {
                        if (quiz[i].results[resultI].username === data.username) {
                            quiz[i].results[resultI] = {username: data.username, points: data.points};
                            hasPoints = true;
                            break;
                        }
                    }
                    if (!hasPoints) {
                        quiz[i].results.push({username: data.username, points: data.points});
                    }
                } else {
                    quiz[i].results = [];
                    quiz[i].results.push({username: data.username, points: data.points});
                }
                break;
            }
        }
    });
    socket.on("get_the_quizzes", function (data) {
        let the_quizzes = [];
        for (let i in quiz) {
            if (quiz[i].username === data[1] && quiz[i].type === "published") {
                the_quizzes.push(quiz[i]);
            }
        }
        io.sockets.emit("get_the_quizzes", [data[0], the_quizzes]);
    });
    socket.on("get_the_events", function (data) {
        let the_events = [];
        for (let i in events) {
            if (events[i].username === data[1] && events[i].type === "published") {
                the_events.push(events[i]);
            }
        }
        io.sockets.emit("get_the_events", [data[0], the_events]);
    });
    socket.on("get_my_works", function (data) {
        let the_quizzes = [];
        for (let i in quiz) {
            if (quiz[i].username === data[1] && quiz[i].type !== 'deleted' && quiz[i].type !== 'published') {
                the_quizzes.push(quiz[i]);
            }
        }
        let the_events = [];
        for (let i in events) {
            if (events[i].username === data[1] && events[i].type !== 'deleted') {
                the_events.push(events[i]);
            }
        }
        io.sockets.emit("get_my_works", [data[0], the_quizzes, the_events]);
    });
    socket.on("save_quiz", function (data) {
        if (data.length > 1) {
            let code = data[0];
            let data = data[1];
        }
        let newquiz = true;
        for (let i in quiz) {
            if (quiz[i].id === data.id && quiz[i].type === data.type) {
                quiz[i] = data;
                newquiz = false;
            }
        }
        if (newquiz) {
            quiz.push(data);
        }
    });
    socket.on("save_event", function (data) {
        if (data.length > 1) {
            let code = data[0];
            let data = data[1];
        }
        let newevent = true;
        for (let i in events) {
            if (events[i].id === data.id) {
                events[i] = data;
                newevent = false;
            }
        }
        if (newevent) {
            events.push(data);
        }
        if (data.type === 'deleted') {
            io.sockets.emit('event_deleted', code);
        }
    });
    socket.on("get_the_profile", function (data) {
        let profile = false;
        for (let i in users) {
            if (users[i].username === data[1]) {
                let user_info = {};
                for (let j in users[i]) {
                    if (j != "password") {
                        user_info[j] = users[i][j]
                    }
                }
                profile = true;
                io.sockets.emit("get_the_profile", [data[0], user_info]);
            }
        }
        if (!profile) {
            io.sockets.emit("get_the_profile", [data[0], {}]);
        }
    });
    socket.on("setProfile", function (data) {
        for (let i in users) {
            if (users[i].username === data.username) {
                for (let j in data) {
                    users[i][j] = data[j];
                }
            }
        }
    });

});