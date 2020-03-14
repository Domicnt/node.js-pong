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

//set up socket
var socket = io.connect('http://localhost');

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
    context.drawImage(nums, p1.score * 3, 0, 3, 5, (width / 3) - width / 15/2, height / 10, width / 15, height / 9);
    //p2
    context.fillRect(map(p2.x, width, 480) - map(p2.w, width, 480) / 2, map(p2.y, height, 270) - map(p2.h, height, 270) / 2, map(p2.w, width, 480), map(p2.h, height, 270));
    context.drawImage(nums, p2.score * 3, 0, 3, 5, (width - width / 3) - width / 15/2, height / 10, width / 15, height / 9);
    //dotted line
    context.strokeStyle = "#FFF";
    context.beginPath();
    context.setLineDash([height / 20, height / 20]);
    context.moveTo(width / 2, 0);
    context.lineTo(width / 2, height);
    context.stroke();
}

//on recieving variables from server
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

let up = false;
let down = false;
window.addEventListener('keydown', event => {
    if (event.key == 'w') {
        up = true;
    }
    if (event.key == 's') {
        down = true;
    }
}, false);
window.addEventListener('keyup', event => {
    if (event.key == 'w') up = false;
    if (event.key == 's') down = false;
}, false);

setInterval(function () {
    if (up) socket.emit('up', ID);
    if (down) socket.emit('down', ID);
}, 10);