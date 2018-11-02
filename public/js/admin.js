
let usernameInput = $('.username');
let passwordInput = $('.password');
let loginPage = $('.login.page');
let errorPage = $('.error.page');
let chatPage = $('.chat.page');
let adminList = $('.adminList');

let inputMessage; //input message 
let messages; // messages area

let username; // store admin username
let authenticated = false; // to check if admin is authenticated.
let connected = false;

let socket = io();

usernameInput.focus();

Notification.requestPermission();

/**
 * Login event
 */

socket.on('login', (data) => {
    console.log(data);
    authenticated = data.login; //server will send either true or false in login
    if (authenticated) {
        loginPage.fadeOut();
        chatPage.show();
        socket.emit('add admin', {
            admin: username,
            isAdmin: true
        });
        console.log(username  );
        adminList.append('<li id=' + username + '>' + username + '</li>');
        connected = true;
    } else {
        alert(data.err);
        admin = null;
        usernameInput.val('');
        passwordInput.val('');
        usernameInput.focus();
    }
});

function setUsername() {
    console.log('working');
    username = usernameInput.val();
    username = username.toLowerCase();
    password = passwordInput.val();
    if (username) {
        // If the username is valid
        socket.emit('login', {
            admin: username,
            password: password
        });
    }
}

passwordInput.keypress(function (event) {
    if (event.which === 13)
        setUsername(); //on key enter press;
});

/**
 * Chat event
 */
socket.on('chat message', (data) => {

})


