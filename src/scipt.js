const socket = io('https://s3qjbfqq-3000.asse.devtunnels.ms/'); // Change with url of server
const tempLoginChat = document.querySelector('.chat-container').innerHTML;
const chatContainer = document.querySelector('.chat-container');
const loginContainer = document.querySelector('.login-container');

let username = '';
let login = false;
let usersOnline = [];

socket.on('connect', () => {
    console.log('Connected to the Socket.IO server');
});

socket.on('dc', data => {
    if (data.name === username){
        window.location.reload();
    };
});

socket.on('users', (data) => {
    const userCount = document.querySelector('#users-count');

    usersOnline = data;
    userCount.innerHTML = data.length;
    let usersElement = '';
    
    usersOnline.forEach((e) => usersElement += `
    <div class='dot'></div> <a href='#'>${e.name}</a> <br>
    `);

    document.querySelector('#list-users').innerHTML = 
    `
    <a href="javascript:void(0)" class="closebtn" onclick="closeNav()">×</a>
    ${usersElement}
    `;
});

socket.on('chat', (data) => {
    const chatBody = document.getElementById('chat');

    chatBody.innerHTML += `
    <div class='message'>
        <span class = 'message other'> 
            <b>${data.name}</b> ${data.text}
          </span>
    </div>
    `;

    chatBody.scroll(0, 999999);
    document.querySelector('#receive-audio').play();
});

if (!login) {
    loginContainer.innerHTML = `
    <h1>Welcome to Another Chat Room!</h1>
    <h3>Enter your username </h3>
    <form action="javascript:loginUser()">
        <input type="text" class="input-field" placeholder="@username" id="get-username">
        <input type="submit" class="send-button" value="Login">
    </form>
        `;
};

function loginUser() {
    username = document.getElementById('get-username').value;
    document.querySelector('.chat-container').innerHTML = tempLoginChat;
    document.querySelector('#title-name').innerHTML = username;
    // document.querySelector('.users-container').removeAttribute('hidden');
    document.querySelector('.chat-container').removeAttribute('hidden');
    loginContainer.remove();
    socket.emit('users', username);
}

function send() {
    const getText = document.getElementById('get-text');
    const chatBody = document.getElementById('chat');

    chatBody.innerHTML += `
    <div class='message'>
        <span class = 'message self'> 
            ${getText.value}
          </span>
    </div>
    `;

    const data = {
        name: username,
        text: getText.value
    }
    socket.emit('chat', data);
    chatBody.scroll(0, 999999);
    getText.value = '';
}

function openNav() {
    document.getElementById("list-users").style.width = "215px";
}
  
function closeNav() {
    document.getElementById("list-users").style.width = "0";
}
