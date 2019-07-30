var date = new Date();

var username;
var quiz;

socket.on('logedin', function (data) {
    if (am_i(data[0], code)) {
        username = data[1].username;
        document.getElementById('loading').style.display = 'block';
        document.getElementById('loading' + (Math.floor(Math.random() * 5) + 1)).style.display = 'block';
        socket.emit("get_quiz", [code, ((document.URL.split("?"))[1].split("="))[1]]);
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
        document.getElementById("start").innerText = quiz.start;
        document.getElementById("endimage").style.backgroundImage = quiz.end_image;
        document.getElementById("youhave").innerText = quiz.end_youhave;
        document.getElementById("points").innerText = quiz.end_thepoints;
        document.getElementById("username").innerText = quiz.username;
        for (let i in quiz.questions) {
            var quiestions = document.getElementById("questions");
            var quistion = document.createElement("div");
            quistion.setAttribute("class", "question");
            quiestions.appendChild(div);
            quiestions.style.backgroundImage = "url('" + quiz.questions[i].image + "')";
            var quistionText = document.createElement("h2");
            title.innerText = quiz.quizzes[i].title;
            var day = document.createElement("p");
            day.innerText = quiz.quizzes[i].date;
            var open = document.createElement("a");
            open.innerText = "OPEN";
            open.setAttribute("class", "open");
            div.appendChild(title);
            div.appendChild(day);
            if (quiz.quizzes[i].date == yyyy + "-" + mm + "-" + dd) {
                bigdiv.setAttribute("class", "quiz today");
                div.appendChild(open);
            }
            else {
                if (quiz.quizzes[i].date <= yyyy + "-" + mm + "-" + dd) {
                    bigdiv.setAttribute("class", "quiz past");
                    div.appendChild(open);
                }
                else {
                    bigdiv.setAttribute("class", "quiz soon");
                    var soon = document.createElement("a");
                    soon.innerText = "SOON";
                    soon.setAttribute("class", "soon-button");
                    div.appendChild(soon);
                }
            }
            document.getElementById("list").appendChild(bigdiv);
        }
        if (quiz == "none") {
            window.open("../", "_self");
        }
    }
});