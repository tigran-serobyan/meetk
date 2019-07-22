var username;
var date = new Date();
var id = date.getFullYear() + "" + date.getUTCMonth() + "" + date.getUTCMonth() + "" + date.getHours() + "" + date.getMinutes() + "" + date.getSeconds() + "" + date.getMilliseconds()
socket.on('logedin', function (data) {
    if (am_i(data[0], code)) {
        username = data[1].username;
        if (((document.URL.split("?")[1]))) {
            socket.emit("get_quiz", [code, ((document.URL.split("?"))[1].split("="))[1]]);
        }
    }
});
socket.on('notlogedin', function (data) {
    if (am_i(data, code)) {
        window.open("../", "_self");
    }
});
socket.on('get_quiz', function (data) {
    if (am_i(data[0], code)) {
        var quiz_info = data[1];
        if (quiz_info == "none") {
            window.open("../", "_self");
        }
        if (username != quiz_info.username) {
            window.open("../", "_self");
        }
        document.getElementById("title").value = quiz_info.title;
        document.getElementById("subtitle").value = quiz_info.subtitle;
        document.getElementById("start").value = quiz_info.start;
        if (quiz_info.topimage) {
            document.getElementById("top-img").src = quiz_info.topimage;
        }
        if (quiz_info.end_image) {
            document.getElementById("end_img").style.backgroundImage = quiz_info.end_image;
        }
        document.getElementById("end_youhave").innerText = quiz_info.end_youhave;
        document.getElementById("end_thepoints").innerText = quiz_info.end_thepoints;
        id = quiz_info.id;
        the_type = quiz_info.type;
        for (var i in document.getElementsByClassName("timer")) {
            if (quiz_info.timer == document.getElementsByClassName("timer")[i].innerText) {
                for (var j = 0; j < document.getElementsByClassName("timer").length; j++) {
                    document.getElementsByClassName("timer")[j].setAttribute("class", "timer");
                }
                document.getElementsByClassName("timer")[i].setAttribute("class", "timer timer-checked");
            }
        }
        for (var i in quiz_info.questions) {
            add(quiz_info.questions[i].type);
            var question = document.getElementsByClassName('question')[i];
            if (quiz_info.questions[i].image) {
                question.getElementsByClassName("img")[0].style.backgroundImage = "url('" + quiz_info.questions[i].image + "')";
            }
            if (quiz_info.questions[i].type != 'text') {
                question.getElementsByClassName("question_input")[0].value = quiz_info.questions[i].question;
                if (quiz_info.questions[i].type != 'typing') {
                    for (var j in quiz_info.questions[i].answer) {
                        question.getElementsByClassName("answer_button")[j].value = quiz_info.questions[i].answer[j].text;
                        if (quiz_info.questions[i].answer[j].true) {
                            is_true(question.getElementsByClassName("answer_button")[j], j)
                        }
                    }
                }
                else {
                    question.getElementsByClassName("answer_input")[0].value = quiz_info.questions[i].answer;
                }
            }
        }
    }
});
var id_num = 1;
function is_true(a, c) {
    question = a.parentElement;
    for (var i = 0; i < c; i++) {
        question.getElementsByClassName("answer_button")[i].style.background = "none";
        question.getElementsByClassName("answer_button")[i].style.color = "#000";
    }
    a.style.background = "#006622";
    a.style.color = "#fff";
}
function encodeImageFileAsURL(element, id = 1) {
    if (element.files[0].size > 7000000) { alert('File is too big!'); element.value = '' }
    else {
        var file = element.files[0];
        var reader = new FileReader();
        reader.onloadend = function () {
            img_code = reader.result;
            if (id == 0) {
                var image = document.getElementById("top-img");
                image.src = img_code;
            }
            else {
                element.style.backgroundImage = "url('" + img_code + "')";
            }
        }
        reader.readAsDataURL(file);
    }
}
function add(type) {
    var div = document.createElement("div");
    div.setAttribute("class", "question");
    var img = document.createElement("input");
    div.appendChild(img);
    img.setAttribute("class", "img");
    img.setAttribute("id", "img" + id_num);
    img.setAttribute("type", "file");
    img.setAttribute("accept", "image/*");
    img.setAttribute("onchange", "encodeImageFileAsURL(this)");
    var question = document.createElement("div");
    div.appendChild(question);
    if (type != "text") {
        var question_input = document.createElement("input");
        question.appendChild(question_input);
        question_input.setAttribute("type", "text");
        question_input.setAttribute("class", "question_input");
        question_input.setAttribute("placeholder", "Question");
        if (type == "typing") {
            var answer_input = document.createElement("input");
            question.appendChild(answer_input);
            answer_input.setAttribute("type", "text");
            answer_input.setAttribute("class", "answer_input");
            answer_input.setAttribute("placeholder", "Answer");
        }
        else if (type == "answer2") {
            var answer_button = document.createElement("input");
            question.appendChild(answer_button);
            answer_button.setAttribute("type", "text");
            answer_button.setAttribute("class", "answer_button");
            answer_button.setAttribute("placeholder", "Answer 1");
            answer_button.setAttribute("onclick", "is_true(this,2)");
            var answer_button2 = document.createElement("input");
            question.appendChild(answer_button2);
            answer_button2.setAttribute("type", "text");
            answer_button2.setAttribute("class", "answer_button");
            answer_button2.setAttribute("placeholder", "Answer 2");
            answer_button2.setAttribute("onclick", "is_true(this,2)");
        }
        else if (type == "answer3") {
            var answer_button = document.createElement("input");
            question.appendChild(answer_button);
            answer_button.setAttribute("type", "text");
            answer_button.setAttribute("class", "answer_button");
            answer_button.setAttribute("placeholder", "Answer 1");
            answer_button.setAttribute("onclick", "is_true(this,3)");
            var answer_button2 = document.createElement("input");
            question.appendChild(answer_button2);
            answer_button2.setAttribute("type", "text");
            answer_button2.setAttribute("class", "answer_button");
            answer_button2.setAttribute("placeholder", "Answer 2");
            answer_button2.setAttribute("onclick", "is_true(this,3)");
            var answer_button3 = document.createElement("input");
            question.appendChild(answer_button3);
            answer_button3.setAttribute("type", "text");
            answer_button3.setAttribute("class", "answer_button");
            answer_button3.setAttribute("placeholder", "Answer 3");
            answer_button3.setAttribute("onclick", "is_true(this,3)");
        }
        else if (type == "answer4") {
            var answer_button = document.createElement("input");
            question.appendChild(answer_button);
            answer_button.setAttribute("type", "text");
            answer_button.setAttribute("class", "answer_button");
            answer_button.setAttribute("placeholder", "Answer 1");
            answer_button.setAttribute("onclick", "is_true(this,4)");
            var answer_button2 = document.createElement("input");
            question.appendChild(answer_button2);
            answer_button2.setAttribute("type", "text");
            answer_button2.setAttribute("class", "answer_button");
            answer_button2.setAttribute("placeholder", "Answer 2");
            answer_button2.setAttribute("onclick", "is_true(this,4)");
            var answer_button3 = document.createElement("input");
            question.appendChild(answer_button3);
            answer_button3.setAttribute("type", "text");
            answer_button3.setAttribute("class", "answer_button");
            answer_button3.setAttribute("placeholder", "Answer 3");
            answer_button3.setAttribute("onclick", "is_true(this,4)");
            var answer_button4 = document.createElement("input");
            question.appendChild(answer_button4);
            answer_button4.setAttribute("type", "text");
            answer_button4.setAttribute("class", "answer_button");
            answer_button4.setAttribute("placeholder", "Answer 4");
            answer_button4.setAttribute("onclick", "is_true(this,4)");
        }
    }
    else {
        var question_input = document.createElement("textarea");
        question.appendChild(question_input)
        question_input.setAttribute("class", "question_textarea");
        question_input.setAttribute("placeholder", "Text");
    }
    var delete_button = document.createElement("b");
    question.appendChild(delete_button)
    delete_button.setAttribute("onclick", "this.parentElement.parentElement.remove()");
    delete_button.setAttribute("style", "color:red;");
    delete_button.innerHTML = "Delete";
    var freespace = document.createElement("span");
    freespace.innerHTML = ".";
    freespace.setAttribute("class", "free-space");
    question.appendChild(freespace);
    document.getElementById("questions").appendChild(div);
    id_num++;
}
for (var i in document.getElementsByClassName("timer")) {
    document.getElementsByClassName("timer")[i].onclick = function () {
        for (var j = 0; j < document.getElementsByClassName("timer").length; j++) {
            document.getElementsByClassName("timer")[j].setAttribute("class", "timer");
        }
        this.setAttribute("class", "timer timer-checked");
    }
}
function check_publish() {
    document.getElementsByClassName("publish")[0].style = "";
    for (var i = 0; i < document.getElementsByClassName("img").length; i++) {
        if (document.getElementsByClassName("img")[i].style.backgroundImage == "") {
            document.getElementsByClassName("publish")[0].style.background = "#a31200";
            document.getElementsByClassName("publish")[0].style.borderColor = "#a31200";
        }
    }
    for (var i = 0; i < document.getElementsByTagName("input").length; i++) {
        if (document.getElementsByTagName("input")[i].value == "") {
            document.getElementsByClassName("publish")[0].style.background = "#a31200";
            document.getElementsByClassName("publish")[0].style.borderColor = "#a31200";
        }
    }
    if (document.getElementById("top-img").src == document.URL) {
        document.getElementsByClassName("publish")[0].style.background = "#a31200";
        document.getElementsByClassName("publish")[0].style.borderColor = "#a31200";
    }
    setTimeout(() => {
        check_publish();
    }, 2000);
}
function publish() {
    if (document.getElementsByClassName("publish")[0].style.background == "") {
        the_type = "published";
        document.getElementsByClassName("publish")[0].innerText = "Publishing";
        save();
    }
}
var last_save = false;
function save_text() {
    if (last_save) {
        if (last_save < 5) {
            document.getElementsByClassName("save")[0].innerText = "Last save: just now (click to save)";
        }
        else {
            if (last_save <= 60) {
                if (last_save % 5 == 0) {
                    document.getElementsByClassName("save")[0].innerText = "Last save: " + last_save + " seconds ago (click to save)";
                }
            }
            else {
                if (last_save <= 600) {
                    if (last_save % 60 == 0) {
                        document.getElementsByClassName("save")[0].innerText = "Last save: " + Math.floor(last_save / 60) + " minutes ago (click to save)";
                    }
                }
                else {
                    save();
                    document.getElementsByClassName("save")[0].innerText = "Last save: more than 10 minutes ago (click to save)";
                }
            }
        }
        last_save++;
    }
    else {
        document.getElementsByClassName("save")[0].innerText = "Not saved yet (click to save)";
    }
    setTimeout(() => {
        save_text();
    }, 1000);
}
function save() {
    document.getElementsByClassName("publish")[0].innerText = "Publish";
    var timer = document.getElementsByClassName("timer-checked")[0].innerText;
    var question_divs = document.getElementsByClassName("question");
    var questions = [];
    for (var i = 0; i < question_divs.length - 1; i++) {
        var question = {};
        question.image = (question_divs[i].getElementsByClassName("img")[0].style.backgroundImage.split('"'))[1];
        if (question_divs[i].getElementsByClassName("question_textarea")[0]) {
            question.type = "text";
            question.text = question_divs[i].getElementsByClassName("question_textarea")[0].value
        }
        else if (question_divs[i].getElementsByClassName("answer_input")[0]) {
            question.type = "typing";
            question.question = question_divs[i].getElementsByClassName("question_input")[0].value;
            question.answer = question_divs[i].getElementsByClassName("answer_input")[0].value;
        }
        else {
            question.type = "answer" + question_divs[i].getElementsByClassName("answer_button").length;
            question.question = question_divs[i].getElementsByClassName("question_input")[0].value;
            var answers = [];
            answers.count = question_divs[i].getElementsByClassName("answer_button").length;
            for (var j = 0; j < question_divs[i].getElementsByClassName("answer_button").length; j++) {
                var answer = { "text": question_divs[i].getElementsByClassName("answer_button")[j].value };
                if (question_divs[i].getElementsByClassName("answer_button")[j].style.background != "rgb(0, 102, 34)") {
                    answer.true = false;
                }
                else {
                    answer.true = true;
                    answers.trueindex = j;
                }
                answers.push(answer);
            }
            question.answer = answers;
        }
        questions.push(question);
    }
    var info = {
        id: id,
        username: username,
        type: the_type,
        title: document.getElementById("title").value,
        subtitle: document.getElementById("subtitle").value,
        start: document.getElementById("start").value,
        topimage: document.getElementById("top-img").src,
        questions: questions,
        end_youhave: document.getElementById("end_youhave").value,
        end_thepoints: document.getElementById("end_thepoints").value,
        end_image: document.getElementById("end_img").style.backgroundImage,
        timer: timer
    }
    socket.emit("save_quiz", info);
    if (the_type == "published") {
        document.getElementsByClassName("publish")[0].innerText = "Published";
    }
    last_save = 1;
    document.getElementsByClassName("save")[0].innerText = "Last save: just now (click to save)";
}
save_text();
var the_type = "draft";
function logout() {
    var info = {
        username: username
    };
    socket.emit("logout", [info, code]);
}
function deleteQuiz() {
    var info = {
        id: id,
        type: "deleted",
    }
    socket.emit("save_quiz", [code, info]);
}
socket.on("quiz_deleted", function () { window.open("../myworks", "_self"); });