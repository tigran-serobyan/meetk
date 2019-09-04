const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const ip = require('ip');
const fs = require('fs-extra');
var users = [];
var logInData = [];
var quiz = [];
const usersJson = fs.readJsonSync('./json/users.json');
if (usersJson.users) {
    users = usersJson.users;
} else {
    users = [];
}
const logInDataJson = fs.readJsonSync('./json/logInData.json');
if (logInDataJson.data) {
    logInData = logInDataJson.data;
} else {
    logInData = [];
}
const quizJson = fs.readJsonSync('./json/quiz.json');
if (quizJson.data) {
    quiz = quizJson.data;
} else {
    quiz = [];
}
let realtime = [];
const url = ip.address();
console.log('App is availabe with this url: ' + url + ':3000' + ', in devices that connected this network.');
const date = new Date();
app.use(express.static("."));
app.get('/', function (req, res) {
    res.redirect('./');
});
app.get('/home', function (req, res) {
    res.redirect('./home');
});
app.get('/quizzes', function (req, res) {
    res.redirect('./quizzes');
});
app.get('/realtime', function (req, res) {
    res.redirect('./realtime');
});
app.get('/realtime/play/:gameCode', function (req, res) {
    res.redirect('../../../realtime/play?code=' + req.params.gameCode);
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
server.listen(3001);

function saveDataOnJson() {
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

function logInInfo(code, username, login = true) {
    return {
        "username": username,
        "data": date.getFullYear() + "." + (date.getUTCMonth() + 1) + "." + date.getUTCDate() + "." + date.getDay() + "." + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds(),
        "code": code,
        "login": login
    };
}

setInterval(() => {
    saveDataOnJson();
}, 300000);
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
                logInData.push(logInInfo(code, info.username));
                io.sockets.emit("logedin", [code, logInInfo(code, info.username)]);
            } else {
                logInData.push(logInInfo(code, info.username, false));
                io.sockets.emit("notlogedin", code);
            }
        } else {
            io.sockets.emit("notlogedin", code);
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
        if (username && info) {
            logInData.push(logInInfo(code, info.username));
            io.sockets.emit("logedin", [code, logInInfo(code, info.username)]);
        } else {
            io.sockets.emit("no_login", code);
        }
    });
    socket.on("logout", function (data) {
        let info = data[0];
        let code = data[1];
        logInData.push(logInInfo(code, info.username, false));
        io.sockets.emit("notlogedin", code);
    });
    socket.on("get_my_works", function (data) {
        let the_quizzes = [];
        for (let i in quiz) {
            if (quiz[i].username === data[1] && quiz[i].type !== 'deleted' && quiz[i].type !== 'published') {
                the_quizzes.push(quiz[i]);
            }
        }
        io.sockets.emit("get_my_works", [data[0], the_quizzes]);
    });
    socket.on("get_quizzes", function (data) {
        let published_quizzes = [];
        for (let i in quiz) {
            if (quiz[i].type === "published") {
                published_quizzes.push({
                    title: quiz[i].title,
                    username: quiz[i].username,
                    id: quiz[i].id,
                    results: quiz[i].results,
                    topimage: quiz[i].topimage
                });
            }
        }
        io.sockets.emit("get_quizzes", [data, published_quizzes]);
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
    socket.on("get_quiz", function (data) {
        let the_quiz = "none";
        for (let i in quiz) {
            if (quiz[i].id === data[1]) {
                let hasPoints = false;
                if (typeof quiz[i].results == 'object') {
                    for (let result of quiz[i].results) {
                        if (result.username === data[2]) {
                            hasPoints = true;
                            the_quiz = "Done";
                            break;
                        }
                    }
                    if (!hasPoints) {
                        the_quiz = quiz[i];
                    }
                } else {
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
                    for (let j in quiz[i].results) {
                        if (quiz[i].results[j].username === data.username) {
                            quiz[i].results[j] = {username: data.username, points: data.points};
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
                for (let j in users) {
                    if (users[j].username === data.username) {
                        if (!(users[j].points)) {
                            users[j].points = [];
                        }
                        let hasPoints = false;
                        for (let k in users[j].points) {
                            if (users[j].points[k].quiz === data.quizId) {
                                users[j].points[k].points = data.points;
                                hasPoints = true;
                            }
                        }
                        if (!hasPoints) {
                            users[j].points.push({quiz: data.quizId, points: data.points});
                        }
                        console.log(users[j].points);
                    }
                }
                break;
            }
        }
    });
    socket.on("save_quiz", function (data) {
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
    socket.on("get_the_profile", function (data) {
        let profile = false;
        for (let i in users) {
            if (users[i].username === data[1]) {
                let user_info = {};
                for (let j in users[i]) {
                    if (j !== "password") {
                        user_info[j] = users[i][j];
                    }
                }
                profile = true;
                io.sockets.emit("get_the_profile", [data[0], user_info]);
                break;
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

    socket.on("new_realtime_game", function (data) {
        for (let i of quiz) {
            if (i.id == data.id) {
                const game = {
                    quiz: i,
                    id: data.id,
                    code: data.gameCode,
                    creator: data.username,
                    users: [data.username],
                };
                realtime.push(game);
                socket.emit('join_realtime_game', data);
            }
        }
    });
    socket.on("get_realtime_game", function (data) {
        let notFound = true;
        for (let i in realtime) {
            if (realtime[i].code === data.gameCode) {
                for (let j in realtime[i].users) {
                    if (realtime[i].users[j] === data.username) {
                        socket.emit('get_realtime_game', {code: data.code, game: realtime[i]});
                        notFound = false;
                        break;
                    }
                }
            }
        }
        if (notFound) {
            socket.emit('get_realtime_game', {
                code: data.code,
                gameCode: 'notFound'
            });
        }
    });
    socket.on("join_realtime_game", function (data) {
        let notFound = true;
        for (let i in realtime) {
            if (realtime[i].code === data.gameCode) {
                let joined = false;
                for (let user of realtime[i].users) {
                    if (user === data.username) {
                        joined = true;
                        socket.emit('join_realtime_game', data);
                    }
                }
                if (joined) {
                    socket.emit('join_realtime_game', data);
                    notFound = false;
                } else {
                    realtime[i].users.push(data.username);
                    socket.emit('join_realtime_game', data);
                    notFound = false;
                }
                break;
            }
        }
        if (notFound) {
            socket.emit('join_realtime_game', {
                code: data.code,
                gameCode: 'notFound'
            });
        }
    });
    socket.on("leave_realtime_game", function (data) {
        for (let i in realtime) {
            if (realtime[i].code === data.gameCode) {
                for (let j in realtime[i].users) {
                    if (realtime[i].users[j] === data.username) {
                        realtime[i].users.splice(j, 1);
                        break;
                    }
                }
                break;
            }
        }
    });
    socket.on("set_points_realtime_game", function (data) {
        for (let i in realtime) {
            if (realtime[i].code === data.gameCode) {
                if (!realtime[i].results) {
                    realtime[i].results = {};
                }
                realtime[i].results[data.username] = data.points;
                break;
            }
        }
    });
    socket.on("start_realtime_game", function (data) {
        for (let game in realtime) {
            if (realtime[game].code === data) {
                realtime[game].status = 'started';
                for (let i of quiz) {
                    if (parseInt(i.id) === parseInt(realtime[game].id) && i.type === 'published') {
                        let timer = 0;
                        io.sockets.emit('start_realtime_game', data);
                        for (let question of i.questions) {
                            setTimeout(function () {
                                io.sockets.emit('get_realtime_game_question', {gameCode: data, question: question});
                            }, (15000 * timer) + 5000);
                            setTimeout(function () {
                                io.sockets.emit('check_realtime_game_answer', data);
                            }, (15000 * timer) + 15000);
                            ++timer;
                        }
                        setTimeout(function () {
                            io.sockets.emit('realtime_game_end', data);
                        }, (15000 * timer) + 5000);
                    }
                }
                break;
            }
        }
    });
});
