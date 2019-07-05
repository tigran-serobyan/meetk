var date = new Date();

var username;

socket.on('logedin', function (data) {
    if (am_i(data[0], code)) {
        username = data[1].username;
        socket.emit("get_the_profile", [code, username]);
    }
});
socket.on('notlogedin', function (data) {
    if (am_i(data, code)) {
        window.open("../", "_self");
    }
});
socket.on('get_the_profile', function (data) {
    if (am_i(data[0], code)) {
        document.getElementById("name").value = data[1].name;
        document.getElementById("surname").value = data[1].surname;
        document.getElementById("username").innerText = "@" + data[1].username;
        document.getElementById("location").innerText = data[1].location;
        if (data[1].pic) {
            document.getElementById("profile_image").style.background = "url('" + data[1].pic + "')";
        }
        else {
            if (data[1].gender == "male") {
                document.getElementById("profile_image").src = "style/male.jpg";
            }
            else {
                document.getElementById("profile_image").src = "style/female.jpg";
            }
        }
        if (data[1].backpic) {
            document.getElementById("top").style.backgroundImage = "url('" + data[1].backpic + "')";
        }
        else {
            document.getElementById("top").style.backgroundImage = "url('style/profile_background.png')";
        }
    }
});
function encodeImageFileAsURL(element, bigElement) {
    if (element.files[0].size > 7000000) { alert('File is too big!'); element.value = '' }
    else {
        var file = element.files[0];
        var reader = new FileReader();
        reader.onloadend = function () {
            img_code = reader.result;
            if(bigElement){
                bigElement.style.backgroundImage = "url('" + img_code + "')";
            }
            else{
                element.style.backgroundImage = "url('" + img_code + "')";
            }
        }
        reader.readAsDataURL(file);
    }
}