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
socket.on('get_quiz', function (data) {
    console.log(data);
    if (am_i(data[0], code)) {
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
            let questionText = document.createElement("h3");
            questionText.innerText = quiz.questions[i].question;
            questionDiv.appendChild(questionText);

            if (quiz.questions[i].type.slice(0, 6) === 'answer') {
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
});


function check(q, a, t, b) {
    document.getElementsByClassName("answer" + q)[t].style.background = "#29a329";
    document.getElementsByClassName("answer" + q)[t].style.borderColor = "#29a329";
    document.getElementsByClassName("answer" + q)[t].style.color = "#fff";
    document.getElementById("thepoints").innerText = parseInt(document.getElementById("thepoints").innerText) + 1;
    if (b == false) {
        document.getElementsByClassName("answer" + q)[a].style.background = "#cc1211";
        document.getElementsByClassName("answer" + q)[a].style.borderColor = "#cc1211";
        document.getElementsByClassName("answer" + q)[a].style.color = "#fff";
        document.getElementById("thepoints").innerText = parseInt(document.getElementById("thepoints").innerText) - 1;
    }
    for (var i = 0; i < 4; i++) {
        document.getElementsByClassName("answer" + q)[i].disabled = true;
    }
}