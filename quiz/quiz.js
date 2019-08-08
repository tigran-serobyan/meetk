var date = new Date();

var username;
var quiz;

socket.on('logedin', function (data) {
    if (am_i(data[0], code)) {
        username = data[1].username;
        document.getElementById('loading').style.display = 'block';
        document.getElementById('loading' + (Math.floor(Math.random() * 5) + 1)).style.display = 'block';
        socket.emit("get_quiz", [code, ((document.URL.split("?"))[1].split("="))[1].split("#")[0]]);
    }
});
socket.on('notlogedin', function (data) {
    if (am_i(data, code)) {
        window.open("../../", "_self");
    }
});
let timer = 0;
socket.on('get_quiz', function (data) {
    if (am_i(data[0], code)) {
        if (data[1].timer !== 'None') {
            timer = data[1].timer;
        }
        document.getElementById('loading').style.display = 'none';
        quiz = data[1];
        document.getElementById("top-image").style.backgroundImage = "url('" + quiz.topimage + "')";
        document.getElementById("title").innerText = quiz.title;
        document.getElementById("subtitle").innerText = quiz.subtitle;
        document.getElementById("username").innerText = quiz.username;
        document.getElementById("start").innerText = quiz.start;
        document.getElementById("endimage").style.backgroundImage = quiz.end_image;
        document.getElementById("youhave").innerText = quiz.end_youhave;
        document.getElementById("points").innerText = quiz.end_thepoints;
        let div = document.getElementById('questions');
        for (let i in quiz.questions) {
            let question = document.createElement("div");
            question.setAttribute("class", `question`);
            question.setAttribute("id", parseInt(i) + 1);

            let image = document.createElement('div');
            image.style.backgroundImage = "url('" + quiz.questions[i].image + "')";
            image.setAttribute('class', 'img');

            let questionDiv = document.createElement('div');
            questionDiv.setAttribute('class', 'questionDiv');

            if (quiz.questions[i].type.slice(0, 6) === 'answer') {
                let questionText = document.createElement("h3");
                questionText.innerText = quiz.questions[i].question;
                questionDiv.appendChild(questionText);
                let trueAnswerIndex = 0;
                for (let answerIndex in quiz.questions[i].answer) {
                    if (quiz.questions[i].answer[answerIndex].true) {
                        trueAnswerIndex = answerIndex;
                    }
                }
                for (let answerIndex in quiz.questions[i].answer) {
                    let answerButton = document.createElement('button');
                    answerButton.setAttribute('class', `answer${parseInt(i) + 1}`);
                    answerButton.setAttribute('onclick', `check(${parseInt(i) + 1},${answerIndex},${trueAnswerIndex},${quiz.questions[i].answer[answerIndex].true})`);
                    answerButton.innerText = quiz.questions[i].answer[answerIndex].text;
                    questionDiv.appendChild(answerButton);
                }
            }
            if (quiz.questions[i].type === 'typing') {
                let questionText = document.createElement("h3");
                questionText.innerText = quiz.questions[i].question;
                questionDiv.appendChild(questionText);
                let answerInput = document.createElement("input");
                answerInput.setAttribute('class', `answer${parseInt(i) + 1}`);
                let checkAnswer = document.createElement("button");
                checkAnswer.innerText = quiz.check;
                checkAnswer.setAttribute('class', `check check${parseInt(i) + 1}`);
                checkAnswer.setAttribute('onclick', `checkInput(${parseInt(i) + 1},'${quiz.questions[i].answer}')`);
                questionDiv.appendChild(answerInput);
                questionDiv.appendChild(checkAnswer);
            }
            if (quiz.questions[i].type === 'text') {
                let text = document.createElement("p");
                text.setAttribute('class', `answer${parseInt(i) + 1}`);
                text.innerText = quiz.questions[i].text;
                questionDiv.appendChild(text);
            }

            let nextButton = document.createElement('a');
            nextButton.innerText = quiz.next;
            if (quiz.questions[parseInt(i) + 1]) {
                nextButton.setAttribute('href', `#${parseInt(i) + 2}`);
            } else {
                nextButton.innerText = quiz.seepoints;
                nextButton.setAttribute('href', `#end`);
            }
            questionDiv.appendChild(nextButton);

            question.appendChild(image);
            question.appendChild(questionDiv);
            div.appendChild(question);
        }
    }
    window.scrollTo(0, 0);
    window.onscroll = function () {
        if (document.documentElement.scrollTop > 20) {
            start();
            window.onscroll = function () {
            };
        }
    };
});

function start() {
    window.scrollTo({
        top: 980,
        left: 0,
        behavior: 'smooth'
    });
    if (document.documentElement.scrollTop < 480) {
        setTimeout(function () {
            start();
        }, 500);
    } else {
        if (timer) {
            setTimeout(function () {
                document.getElementById('timer').style.width = '0%';
            }, 500);
            document.getElementById('timer').style.width = '100%';
            document.getElementById('timer').style.display = 'block';
            document.getElementById('timer').style.transition = `${parseInt(timer)}s linear`;
            setTimeout(function () {
                document.getElementById('questions').innerText = '';
            }, timer * 1000);
        }
    }
}

function check(q, a, t, b) {
    document.getElementsByClassName("answer" + q)[t].style.background = "#29a329";
    document.getElementsByClassName("answer" + q)[t].style.borderColor = "#29a329";
    document.getElementsByClassName("answer" + q)[t].style.color = "#fff";
    document.getElementById("thepoints").innerText = parseInt(document.getElementById("thepoints").innerText) + 1;
    if (b === false) {
        document.getElementsByClassName("answer" + q)[a].style.background = "#cc1211";
        document.getElementsByClassName("answer" + q)[a].style.borderColor = "#cc1211";
        document.getElementsByClassName("answer" + q)[a].style.color = "#fff";
        document.getElementById("thepoints").innerText = parseInt(document.getElementById("thepoints").innerText) - 1;
    }
    for (var i = 0; i < document.getElementsByClassName("answer" + q).length; i++) {
        document.getElementsByClassName("answer" + q)[i].disabled = true;
    }
}

function checkInput(q, t) {
    document.getElementsByClassName("answer" + q)[0].style.background = "#29a329";
    document.getElementsByClassName("answer" + q)[0].style.borderColor = "#29a329";
    document.getElementsByClassName("answer" + q)[0].style.color = "#fff";
    document.getElementById("thepoints").innerText = parseInt(document.getElementById("thepoints").innerText) + 1;
    if (document.getElementsByClassName("answer" + q)[0].value !== t) {
        document.getElementsByClassName("answer" + q)[0].style.background = "#cc1211";
        document.getElementsByClassName("answer" + q)[0].style.borderColor = "#cc1211";
        document.getElementsByClassName("answer" + q)[0].style.color = "#fff";
        document.getElementById("thepoints").innerText = parseInt(document.getElementById("thepoints").innerText) - 1;
    }
    document.getElementsByClassName("answer" + q)[0].disabled = true;
    document.getElementsByClassName("check" + q)[0].disabled = true;
}