function overlap(a, b) {
    return (a.y - a.h / 2 < b.y + b.r && a.y + a.h / 2 > b.y - b.r && a.x - a.w / 2 < b.x + b.r && a.x + a.w / 2 > b.x - b.r);
}

exports.step = function (p1, p2, ball, width, height) {
    ball.x += ball.velX;
    ball.y += ball.velY;
    if (ball.y - ball.r < 0) {
        ball.y = ball.r;
        ball.velY = Math.abs(ball.velY);
    } else if (ball.y + ball.r > height) {
        ball.y = height - ball.r;
        ball.velY = -Math.abs(ball.velY);
    }
    if (overlap(p1, ball)) {
        ball.velX = Math.abs(ball.velX);
        ball.velY += .5 * (Math.round(Math.random()) - .5);
        p1.score++;
    } else if (overlap(p2, ball)) {
        ball.velX = -Math.abs(ball.velX);
        ball.velY += .5 * (Math.round(Math.random()) - .5);
        p2.score++;
    }
    if (ball.x - ball.r <= 0 || ball.x + ball.r >= width) {
        reset(p1, p2, ball, width, height);
    }
    ball.velX *= 1.0005;
    ball.velY *= 1.0005;
    ball.r *= .9995;
}

function reset(p1, p2, ball, width, height) {
    p1.y = height / 2;
    p1.score = 0;

    p2.y = height / 2;
    p2.score = 0;

    ball.x = width / 2;
    ball.y = height / 2;
    ball.velX = Math.round(Math.random()) * 4 - 2;
    ball.velY = Math.round(Math.random()) * 4 - 2;
    ball.r = 10;
}