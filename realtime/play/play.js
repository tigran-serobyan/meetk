var username;
var width = 0;
var gameCode = '';
var quiz = {};

socket.on('logedin', function (data) {
    if (am_i(data[0], code)) {
        username = data[1].username;
        document.getElementById('loading').style.display = 'block';
        document.getElementById('loading' + (Math.floor(Math.random() * 5) + 1)).style.display = 'block';
        document.getElementById('startingTimer').style.display = 'none';
        socket.emit("get_realtime_game", {
            code,
            username,
            gameCode: (document.URL.split("?"))[1].split("=")[1].split("#")[0]
        });
    }
});
socket.on('notlogedin', function (data) {
    if (am_i(data, code)) {
        window.open("../../../", "_self");
    }
});

socket.on('get_realtime_game', function (data) {
    if (am_i(data.code, code)) {
        if (data.gameCode === 'notFound') {
            window.open('../', '_self');
        } else {
            document.getElementById("question").style.display = 'none';
            gameCode = data.game.code;
            quiz = data.game.quiz;
            document.getElementById('loading').style.display = 'none';
            document.getElementById('users').innerHTML = '';
            document.getElementById('code').innerText = 'Code: ' + data.game.code;
            document.getElementById("top-image").style.backgroundImage = "url('" + data.game.quiz.topimage + "')";
            document.getElementById("title").innerText = data.game.quiz.title;
            document.getElementById("subtitle").innerText = data.game.quiz.subtitle;
            document.getElementById("endimage").style.backgroundImage = quiz.end_image;
            if (data.game.creator === username) {
                document.getElementById("start").innerText = data.game.quiz.start;
            } else {
                document.body.removeChild(document.getElementById("start"));
            }
            for (let i of data.game.users) {
                let user = document.createElement('div');
                user.innerText = i;
                user.setAttribute('class', 'user');

                if (data.game.creator === username) {
                    user.setAttribute('class', 'user me');
                }
                if (data.game.creator === i) {
                    user.setAttribute('class', 'user creator');
                }
                if (data.game.creator === username && data.game.creator === i) {
                    user.setAttribute('class', 'user creator me');
                }

                document.getElementById('users').appendChild(user);
            }
            if (data.game.status) {
                if (data.game.status === 'waiting') {
                    document.getElementById('headerDiv').style.display = 'block';
                } else {
                    window.open('../', '_self');
                }
            }
        }
    }
});


function startGame() {
    socket.emit("start_realtime_game", gameCode);
}

socket.on("get_realtime_game_question", function (data) {
    if (data.gameCode === gameCode) {
        document.getElementById('startingTimer').style.display = 'none';
        document.getElementById('headerDiv').style.display = 'none';
        document.getElementById('timer').style.display = 'block';
        document.getElementById('timer').style.transitionDuration = '0.1s';
        document.getElementById('timer').style.width = '100%';
        setTimeout(function () {
            document.getElementById('timer').style.transitionDuration = '10s';
            document.getElementById('timer').style.width = '0%';
        }, 500);

        let question = document.getElementById("question");
        question.style.display = 'block';
        question.innerHTML = '';

        let image = document.createElement('div');
        image.style.backgroundImage = "url('" + data.question.image + "')";
        image.setAttribute('class', 'img');

        let questionDiv = document.createElement('div');
        questionDiv.setAttribute('class', 'questionDiv');

        if (data.question.type.slice(0, 6) === 'answer') {
            questionType = 'answer';
            let questionText = document.createElement("h3");
            questionText.innerText = data.question.question;
            questionDiv.appendChild(questionText);
            let trueAnswerIndex = 0;
            for (let answerIndex in data.question.answer) {
                if (data.question.answer[answerIndex].true) {
                    trueAnswerIndex = answerIndex;
                }
            }
            for (let answerIndex in data.question.answer) {
                let answerButton = document.createElement('button');
                answerButton.setAttribute('onclick', `check(${answerIndex},${trueAnswerIndex})`);
                answerButton.innerText = data.question.answer[answerIndex].text;
                questionDiv.appendChild(answerButton);
            }
        }
        if (data.question.type === 'typing') {
            questionType = 'typing';
            let questionText = document.createElement("h3");
            questionText.innerText = data.question.question;
            questionDiv.appendChild(questionText);
            let answerInput = document.createElement("input");
            let checkAnswer = document.createElement("button");
            checkAnswer.innerText = quiz.check;
            checkAnswer.setAttribute('class', `check`);
            checkAnswer.setAttribute('onclick', `checkInput('${data.question.answer}')`);
            questionDiv.appendChild(answerInput);
            questionDiv.appendChild(checkAnswer);
        }
        if (data.question.type === 'text') {
            questionType = 'text';
            let text = document.createElement("p");
            text.setAttribute('class', `answer${parseInt(i) + 1}`);
            text.innerText = data.question.text;
            questionDiv.appendChild(text);
        }

        question.appendChild(image);
        question.appendChild(questionDiv);
    }
});

socket.on("start_realtime_game", function (data) {
    if (data === gameCode) {
        document.getElementById('startingTimer').style.display = 'block';
        for (let i = 0; i < 5; i++) {
            setTimeout(function () {
                document.getElementById('startingTimerSeconds').innerText = 5 - i;
            }, i * 1000);
        }
    }
});

let questionType;
let answerTrue;
let points = 0;

socket.on("check_realtime_game_answer", function (data) {
    if (data === gameCode) {
        if (questionType === 'answer') {
            if (document.getElementsByClassName('clicked')[0]) {
                document.getElementsByClassName('clicked')[0].setAttribute('class', answerTrue ? 'true' : 'false');
                points += answerTrue ? 1 : -1;
            } else {
                points--;
                let question = document.getElementById('question');
                for (let i of question.getElementsByTagName('button')) {
                    i.disabled = true;
                    i.setAttribute('class', 'false');
                }
            }
        } else if (questionType === 'typing') {
            if (document.getElementsByTagName('input')[0].value) {
                document.getElementsByTagName('input')[0].setAttribute('class', answerTrue ? 'true' : 'false');
                points += answerTrue ? 1 : -1;
            } else {
                points--;
                document.getElementsByTagName('input')[0].disabled = true;
                document.getElementsByTagName('input')[0].setAttribute('class', 'false');
            }
        }
    }
});


socket.on("realtime_game_end", function (data) {
    if (data === gameCode) {
        document.getElementById("question").style.display = 'none';

    }
});

function checkInput(trueAnswer) {
    document.getElementsByTagName('input')[0].setAttribute('class', 'clicked');
    document.getElementsByTagName('input')[0].disabled = true;
    answerTrue = document.getElementsByTagName('input')[0].value === trueAnswer;
}

function check(answerIndex, trueAnswer) {
    let question = document.getElementById('question');
    let index = 0;
    for (let i of question.getElementsByTagName('button')) {
        i.disabled = true;
        if (answerIndex === index) {
            i.setAttribute('class', 'clicked');
        }
        index++;
    }
    answerTrue = answerIndex === trueAnswer;
}

function leave() {
    socket.emit("leave_realtime_game", {gameCode, username});
    window.open('../', '_self');
}
