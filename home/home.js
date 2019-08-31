var username;

socket.on('logedin', function (data) {
    if (am_i(data[0], code)) {
        username = data[1].username;
        document.getElementById('loading').style.display = 'block';
        document.getElementById('loading' + (Math.floor(Math.random() * 5) + 1)).style.display = 'block';
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
        document.getElementById('loading').style.display = 'none';
        console.log(data[1]);
        document.getElementById('name').innerText = data[1].name
    }
});
