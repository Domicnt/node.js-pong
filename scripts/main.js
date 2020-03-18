//set up canvas
let canvas = document.getElementById('canvas');
let context = canvas.getContext('2d');
let width = window.innerWidth;
let height = window.innerHeight;
context.canvas.width = width;
context.canvas.height = height;
//scoreboard
context.imageSmoothingEnabled = false;
let nums = new Image();
nums.src = 'images/numbers.png';
let p1win = new Image();
p1win.src = 'images/p1win.png';
let p2win = new Image();
p2win.src = 'images/p2win.png';

//set up socket
//var socket = io.connect('http://localhost/');
var socket = io.connect('https://nodejs-pong.herokuapp.com');

//local variables
let p1 = {
    x: 0,
    y: height / 2,
    w: width / 40,
    h: height / 5,
    ID: 0,
    score: 0
};
let p2 = {
    x: width,
    y: height / 2,
    w: width / 40,
    h: height / 5,
    ID: 0,
    score: 0
};
let ball = {
    x: width / 2,
    y: height / 2,
    velX: Math.round(Math.random()) * 4 - 2,
    velY: Math.round(Math.random()) * 4 - 2,
    r: 10
};

function map(value, high1, high2) {
    return high1 * value / high2;
}
function draw() {
    //clear screen
    context.fillStyle = "#000";
    context.fillRect(0, 0, width, height);
    context.fillStyle = "#FFF";
    //ball
    context.fillRect(map(ball.x, width, 480) - map(ball.r, width, 480), map(ball.y, height, 270) - map(ball.r, height, 270), 2 * map(ball.r, height, 270), 2 * map(ball.r, height, 270));
    //p1
    context.fillRect(map(p1.x, width, 480) - map(p1.w, width, 480) / 2, map(p1.y, height, 270) - map(p1.h, height, 270) / 2, map(p1.w, width, 480), map(p1.h, height, 270));
    context.drawImage(nums, p1.score * 3, 0, 3, 5, (width / 3) - width / 15 / 2, height / 10, width / 15, height / 9);
    //p2
    context.fillRect(map(p2.x, width, 480) - map(p2.w, width, 480) / 2, map(p2.y, height, 270) - map(p2.h, height, 270) / 2, map(p2.w, width, 480), map(p2.h, height, 270));
    context.drawImage(nums, p2.score * 3, 0, 3, 5, (width - width / 3) - width / 15 / 2, height / 10, width / 15, height / 9);
    //dotted line
    context.strokeStyle = "#FFF";
    context.beginPath();
    context.lineWidth = "6";
    context.setLineDash([height / 30, height / 60]);
    context.moveTo(width / 2, height / 120);
    context.lineTo(width / 2, height);
    context.stroke();
    context.setLineDash([]);
    //border
    context.beginPath();
    context.rect(0, 0, width, height);
    context.stroke();
}

//which player 'tis
let player = 0;
//if not playing position in queue
let queue = 0;

//on recieving variables from server
socket.on('player', function (data) {
    playing = true;
    player = data;
});
socket.on('queue', function (data) { queue = data; });
socket.on('ID', function (data) { ID = data; });
socket.on('ball', function (data) {
    ball = data;
    draw();
});
socket.on('p1', function (data) {
    p1 = data;
    draw();
});
socket.on('p2', function (data) {
    p2 = data;
    draw();
});
socket.on('winner', data => {
    console.log("Player " + data + " wins!");
    if (data == 1) context.drawImage(p1win, map(p1.x + p1.w * 2, width, 480), height / 2 - height / 4, width - 2 * map(p1.x + p1.w * 2, width, 480), height / 2);
    else if (data == 2) context.drawImage(p2win, map(p1.x + p1.w * 2, width, 480), height / 2 - height / 4, width - 2 * map(p1.x + p1.w * 2, width, 480), height / 2);
});

let up = false;
let down = false;
let y = 0;
let mouse = false;
window.addEventListener('keydown', event => {
    if (event.key == 'w' || event.keyCode == 38) up = true;
    if (event.key == 's' || event.keyCode == 40) down = true;
    mouse = false;
}, false);
window.addEventListener('keyup', event => {
    if (event.key == 'w' || event.keyCode == 38) up = false;
    if (event.key == 's' || event.keyCode == 40) down = false;
    mouse = false;
}, false);
window.addEventListener('mousemove', event => {
    y = Math.round(event.clientY);
    mouse = true;
}, false);

let deadzone = height / 50;
setInterval(function () {
    if (player == 1 && mouse) {
        if (map(y, 270, height) < p1.y - deadzone) socket.emit('up', ID);
        else if (map(y, 270, height) > p1.y + deadzone) socket.emit('down', ID);
    } else if (player == 2 && mouse) {
        if (map(y, 270, height) < p2.y - deadzone) socket.emit('up', ID);
        else if (map(y, 270, height) > p2.y + deadzone) socket.emit('down', ID);
    } else if (up) socket.emit('up', ID);
    else if (down) socket.emit('down', ID);
}, 10);