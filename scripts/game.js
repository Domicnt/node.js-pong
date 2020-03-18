function overlap(a, b) {
    let ex = 1.1;//extra range for height
    return (a.y - (a.h * ex) / 2 < b.y + b.r && a.y + (a.h * ex) / 2 > b.y - b.r && a.x - a.w / 2 < b.x + b.r && a.x + a.w / 2 > b.x - b.r);
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
    } else if (overlap(p2, ball)) {
        ball.velX = -Math.abs(ball.velX);
        ball.velY += .5 * (Math.round(Math.random()) - .5);
    }
    if (ball.x + ball.r >= width) {
        reset(p1, p2, ball, width, height);
        p1.score++;
        if (p1.score >= 7) {
            p1.score = 0;
            p2.score = 0;
            return 1;
        }
    } else if (ball.x - ball.r <= 0) {
        reset(p1, p2, ball, width, height);
        p2.score++;
        if (p2.score >= 7) {
            p1.score = 0;
            p2.score = 0;
            return 2;
        }
    }
    ball.velX *= 1.0005;
    ball.velY *= 1.0005;
    if (p1.y - p1.h / 2 < 0) {
        p1.y = p1.h / 2;
    } else if (p1.y + p1.h / 2 > height) {
        p1.y = height - p1.h / 2;
    }
    if (p2.y - p2.h / 2 < 0) {
        p2.y = p2.h / 2;
    } else if (p2.y + p2.h / 2 > height) {
        p2.y = height - p2.h / 2;
    }
    return 0;
}

function reset(p1, p2, ball, width, height) {
    p1.y = height / 2;

    p2.y = height / 2;

    ball.x = width / 2;
    ball.y = height / 2;
    ball.velX = Math.round(Math.random()) * 4 - 2;
    ball.velY = Math.round(Math.random()) * 4 - 2;
}