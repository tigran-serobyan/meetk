function no_username(the_code) {
    if (am_i(the_code, code)) {
        document.getElementById("reg-username").style.background = "#a31200";
        document.getElementById("reg-button").value = "Register";
        document.getElementById("reg-button").disabled = false
    }
}

function no_login(the_code) {
    if (am_i(the_code, code)) {
        document.getElementById("meetk-username").style.background = "#a31200";
        document.getElementById("meetk-password").style.background = "#a31200";
        document.getElementById("meetk-username").style.borderColor = "#a31200";
        document.getElementById("meetk-password").style.borderColor = "#a31200";
        document.getElementById("lin-button").value = "Log in";
        document.getElementById("lin-button").disabled = false;
        setTimeout(() => {
            document.getElementById("meetk-username").style.background = "none";
            document.getElementById("meetk-password").style.background = "none";
            document.getElementById("meetk-username").style.borderColor = "#222";
            document.getElementById("meetk-password").style.borderColor = "#222";
        }, 2000);
    }
}

function logedin(data) {
    if (am_i(data[0], code)) {
        if (!username || !password) {
            var info = {
                "username": document.getElementById("meetk-username").value,
                "password": document.getElementById("meetk-password").value
            };
        } else {
            var info = {
                username,
                password
            };
        }
        localStorage.setItem("meetk_username", JSON.stringify(info.username));
        localStorage.setItem("meetk_password", JSON.stringify(info.password));
        window.open("/home", "_self");
    }
}

function redistered(the_code) {
    if (am_i(the_code, code)) {
        document.getElementById("name").value = "";
        document.getElementById("name").style.background = "none";
        document.getElementById("surname").value = "";
        document.getElementById("surname").style.background = "none";
        document.getElementById("reg-username").value = "";
        document.getElementById("reg-username").style.background = "none";
        document.getElementById("reg-pass").value = "";
        document.getElementById("reg-pass").style.background = "none";
        document.getElementById("reg-pass-repeat").value = "";
        document.getElementById("reg-pass-repeat").style.background = "none";
        document.getElementById("day").value = "";
        document.getElementById("day").style.background = "white";
        document.getElementById("day").style.color = "#333";
        document.getElementById("month").value = "01";
        document.getElementById("month").style.background = "white";
        document.getElementById("month").style.color = "#333";
        document.getElementById("year").value = "2014";
        document.getElementById("year").style.background = "white";
        document.getElementById("year").style.color = "#333";
        document.getElementById("location").value = "";
        document.getElementById("location").style.background = "none";
        document.getElementById("reg-button").value = "You are registered";
        document.getElementById("reg-button").disabled = false;
        setTimeout(() => {
            document.getElementById("reg-button").value = "Register";
        }, 3000);
    }
}

socket.on('no_username', no_username);
socket.on('no_login', no_login);
socket.on('logedin', logedin);
socket.on('registered', redistered);

function login_() {
    var info = {
        "username": document.getElementById("meetk-username").value,
        "password": document.getElementById("meetk-password").value
    };
    document.getElementById("lin-button").value = "Wait...";
    document.getElementById("lin-button").disabled = true;
    socket.emit("login", [info, code]);
}

function check_lin() {
    if (document.getElementById("meetk-username").value != "" && document.getElementById("meetk-password").value != "") {
        document.getElementById("lin-button").style.background = "";
        document.getElementById("lin-button").style.border = "";
        document.getElementById("lin-button").disabled = false;
    } else {
        document.getElementById("lin-button").style.background = "#a31200";
        document.getElementById("lin-button").style.border = "solid 2px #a31200";
        document.getElementById("lin-button").disabled = true;
        setTimeout(() => {
            check_lin();
        }, 1000);
    }
}

var countries = ["Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Anguilla", "Antigua &amp; Barbuda", "Argentina", "Armenia", "Aruba", "Australia", "Austria", "Azerbaijan", "Bahamas"
    , "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia", "Bosnia &amp; Herzegovina", "Botswana", "Brazil", "British Virgin Islands"
    , "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Cayman Islands", "Chad", "Chile", "China", "Colombia", "Congo", "Cook Islands", "Costa Rica"
    , "Cote D Ivoire", "Croatia", "Cruise Ship", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea"
    , "Estonia", "Ethiopia", "Falkland Islands", "Faroe Islands", "Fiji", "Finland", "France", "French Polynesia", "French West Indies", "Gabon", "Gambia", "Georgia", "Germany", "Ghana"
    , "Gibraltar", "Greece", "Greenland", "Grenada", "Guam", "Guatemala", "Guernsey", "Guinea", "Guinea Bissau", "Guyana", "Haiti", "Honduras", "Hong Kong", "Hungary", "Iceland", "India"
    , "Indonesia", "Iran", "Iraq", "Ireland", "Isle of Man", "Israel", "Italy", "Jamaica", "Japan", "Jersey", "Jordan", "Kazakhstan", "Kenya", "Kuwait", "Kyrgyz Republic", "Laos", "Latvia"
    , "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Macau", "Macedonia", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Mauritania"
    , "Mauritius", "Mexico", "Moldova", "Monaco", "Mongolia", "Montenegro", "Montserrat", "Morocco", "Mozambique", "Namibia", "Nepal", "Netherlands", "Netherlands Antilles", "New Caledonia"
    , "New Zealand", "Nicaragua", "Niger", "Nigeria", "Norway", "Oman", "Pakistan", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal"
    , "Puerto Rico", "Qatar", "Reunion", "Romania", "Russia", "Rwanda", "Saint Pierre &amp; Miquelon", "Samoa", "San Marino", "Satellite", "Saudi Arabia", "Senegal", "Serbia", "Seychelles"
    , "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "South Africa", "South Korea", "Spain", "Sri Lanka", "St Kitts &amp; Nevis", "St Lucia", "St Vincent", "St. Lucia", "Sudan"
    , "Suriname", "Swaziland", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor L'Este", "Togo", "Tonga", "Trinidad &amp; Tobago", "Tunisia"
    , "Turkey", "Turkmenistan", "Turks &amp; Caicos", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "United States Minor Outlying Islands", "Uruguay"
    , "Uzbekistan", "Venezuela", "Vietnam", "Virgin Islands (US)", "Yemen", "Zambia", "Zimbabwe"];

function check_reg() {
    if (document.getElementById("name").style.background == "rgb(0, 102, 34)" && document.getElementById("surname").style.background == "rgb(0, 102, 34)"
        && document.getElementById("reg-username").style.background == "rgb(0, 102, 34)" && document.getElementById("reg-pass").style.background == "rgb(0, 102, 34)"
        && document.getElementById("reg-pass-repeat").style.background == "rgb(0, 102, 34)" && document.getElementById("day").value != "" && document.getElementById("location").style.background == "rgb(0, 102, 34)") {
        document.getElementById("reg-button").style.background = "";
        document.getElementById("reg-button").style.border = "";
        document.getElementById("reg-button").disabled = false;
    } else {
        document.getElementById("reg-button").style.background = "#a31200";
        document.getElementById("reg-button").style.border = "solid 2px #a31200";
        document.getElementById("reg-button").disabled = true;
        setTimeout(() => {
            check_reg();
        }, 1000);
    }
}

function register_() {
    var info = {
        "name": document.getElementById("name").value,
        "surname": document.getElementById("surname").value,
        "username": document.getElementById("reg-username").value,
        "password": document.getElementById("reg-pass").value,
        "age": document.getElementById("day").value + "." + document.getElementById("month").value + "." + document.getElementById("year").value,
        "gender": document.getElementsByClassName("gender_checked")[0].innerText,
        "location": document.getElementById("location").value
    };
    document.getElementById("reg-button").value = "Wait...";
    document.getElementById("reg-button").disabled = true;
    socket.emit("register", [info, code]);
}

function check(id) {
    if (id == "reg-pass") {
        document.getElementById(id).style.background = "#006622";
        var myInput = document.getElementById("reg-pass");
        var letter = document.getElementById("letter");
        var capital = document.getElementById("capital");
        var number = document.getElementById("number");
        var length = document.getElementById("length");
        document.getElementById("pass-message").style.display = "block";
        myInput.onblur = function () {
            document.getElementById("pass-message").style.display = "none";
        }
        myInput.onkeyup = function () {
            var upperCaseLetters = /[A-Z]/g;
            if (myInput.value.match(upperCaseLetters)) {
                capital.classList.remove("invalid");
                capital.classList.add("valid");
            } else {
                capital.classList.remove("valid");
                capital.classList.add("invalid");
                document.getElementById(id).style.background = "#a31200";
            }
            var numbers = /[0-9]/g;
            if (myInput.value.match(numbers)) {
                number.classList.remove("invalid");
                number.classList.add("valid");
            } else {
                number.classList.remove("valid");
                number.classList.add("invalid");
                document.getElementById(id).style.background = "#a31200";
            }
            if (myInput.value.length >= 6) {
                length.classList.remove("invalid");
                length.classList.add("valid");
            } else {
                length.classList.remove("valid");
                length.classList.add("invalid");
                document.getElementById(id).style.background = "#a31200";
            }
        }
    } else if (id == "reg-pass-repeat") {
        if (document.getElementById(id).value == document.getElementById("reg-pass").value && document.getElementById(id).value) {
            document.getElementById(id).style.background = "#006622";
        } else {
            document.getElementById(id).style.background = "#a31200";
        }

    } else if (id == "day") {
        day_f();
        document.getElementById(id).style.color = "#fff";
        document.getElementById("year").style.color = "#fff";
        document.getElementById("month").style.color = "#fff";
        if (document.getElementById(id).value != "") {
            document.getElementById(id).style.background = "#006622";
            document.getElementById("year").style.background = "#006622";
            document.getElementById("month").style.background = "#006622";
        } else {
            document.getElementById(id).style.background = "#a31200";
            document.getElementById("year").style.background = "#a31200";
            document.getElementById("month").style.background = "#a31200";
        }

    } else {
        if (id == "location") {
            document.getElementById(id).style.background = "#a31200";
            for (var i in countries) {
                if (document.getElementById(id).value.toLowerCase() == countries[i].toLowerCase()) {
                    document.getElementById(id).value = countries[i];
                    document.getElementById(id).style.background = "#006622";
                }
            }
        } else {
            if (!document.getElementById(id).value) {
                document.getElementById(id).style.background = "#a31200";
            } else {
                document.getElementById(id).style.background = "#006622";
            }
        }
    }
}

var last_month;
var last_year;

function day_f() {
    if (document.getElementById("month").value != last_month || document.getElementById("year").value != last_year) {
        last_month = document.getElementById("month").value;
        last_year = document.getElementById("year").value;
        var now_day = document.getElementById("day").value;
        document.getElementById("day").innerHTML = "";
        var month = document.getElementById("month").value;
        if (month == "January" || month == "March" || month == "May" || month == "July" || month == "August" || month == "October" || month == "December") {
            for (var day = 1; day <= 31; day++) {
                document.getElementById("day").innerHTML += '<option value="' + day + '">' + day + '</option>';
            }

        } else if (month == "February") {
            if (document.getElementById("year").value % 4) {
                for (var day = 1; day <= 28; day++) {
                    document.getElementById("day").innerHTML += '<option value="' + day + '">' + day + '</option>';
                }
            } else {
                for (var day = 1; day <= 29; day++) {
                    document.getElementById("day").innerHTML += '<option value="' + day + '">' + day + '</option>';
                }
            }
        } else {
            for (var day = 1; day <= 30; day++) {
                document.getElementById("day").innerHTML += '<option value="' + day + '">' + day + '</option>';
            }
        }
        document.getElementById("day").value = now_day;
        window.onload = day_f;
    }
    setTimeout(() => {
        day_f()
    }, 1000);
}

function autocomplete(inp, arr) {
    var currentFocus;
    inp.addEventListener("input", function (e) {
        var a, b, i, val = this.value;
        closeAllLists();
        if (!val) {
            return false;
        }
        currentFocus = -1;
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        this.parentNode.appendChild(a);
        for (i = 0; i < arr.length; i++) {
            if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                b = document.createElement("DIV");
                b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
                b.innerHTML += arr[i].substr(val.length);
                b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                b.addEventListener("click", function (e) {
                    inp.value = this.getElementsByTagName("input")[0].value;
                    check("location")
                    closeAllLists();
                });
                a.appendChild(b);
            }
        }
    });
    inp.addEventListener("keydown", function (e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            currentFocus++;
            addActive(x);
        } else if (e.keyCode == 38) {
            currentFocus--;
            addActive(x);
        } else if (e.keyCode == 13) {
            e.preventDefault();
            if (currentFocus > -1) {
                if (x) x[currentFocus].click();
            }
        }
    });

    function addActive(x) {
        if (!x) return false;
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        x[currentFocus].classList.add("autocomplete-active");
    }

    function removeActive(x) {
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }

    function closeAllLists(elmnt) {
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }

    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}

function register() {
    document.getElementById("login").style.display = "none";
    document.getElementById("register").style.display = "block";
}

function login() {
    document.getElementById("login").style.display = "block";
    document.getElementById("register").style.display = "none";
}

login();
day_f();
autocomplete(document.getElementById("location"), countries);
document.getElementById("login-button").onclick = login;
document.getElementById("register-button").onclick = register;
var year = new Date().getFullYear();
for (var i = year - 5; i >= year - 120; i--) {
    document.getElementById("year").innerHTML += '<option value="' + i + '">' + i + '</option>';
}
showPassword = function (id) {
    if (document.getElementById(id).type == 'password') {
        document.getElementById(id).type = 'text';
    } else {
        document.getElementById(id).type = 'password';
    }
}