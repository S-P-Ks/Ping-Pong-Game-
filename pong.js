const canvas = document.getElementById('pong');
const context = canvas.getContext('2d');

//Create user
const user = {
    x : 0,
    y : (canvas.height - 100)/2,
    width : 10,
    height : 100,
    color : 'White',
    score : 0
} 

//Create com
const com = {
    x : canvas.width -10,
    y : (canvas.height - 100)/2,
    width : 10,
    height : 100,
    color : 'White',
    score : 0
} 

//Create Ball
const ball =  { 
    x : canvas.width/2,
    y : canvas.height/2,
    radius : 10,
    speed : 5,
    velocityX : 5,
    velocityY : 5,
    color : 'White'
}

//Draw the Net
const net = {
    x : canvas.width/2 - 1,
    y : 0,
    width : 2,
    height : 10,
    color : 'White'
}

//Function to draw the Net
function drawNet(){
    for(i=0;i <= canvas.height;i += 15){
        drawRect(net.x,net.y + i,net.width,net.height,'White');
    }
}


function drawRect(x,y,w,h,color){
    context.fillStyle = color;
    context.fillRect(x,y,w,h);
}

// drawRect(0,0,canvas.width,canvas.height,'Black');

function drawCircle(x,y,r,color){
    context.fillStyle = color;
    context.beginPath();
    context.arc(x,y,r,0,Math.PI*2,false);
    context.closePath();
    context.fill();
}

// drawCircle(100,100,50,'white');

function drawText(text,x,y,color){
    context.fillStyle = color;
    context.font = '45px fantasy';
    context.fillText(text,x,y);
}

// drawText('Something',300,200,'white');

canvas.addEventListener('mousemove',movePaddle);

function movePaddle(evt){
    let react = canvas.getBoundingClientRect();

    user.y = evt.clientY - react.top - 50;
}

function moveTheBall(){

}

function render(){
    //Clear the canvas
    drawRect(0,0,canvas.width,canvas.height,'Black');

    //Draw the net
    drawNet();

    //Draw the score
    drawText(user.score,canvas.width/4,canvas.height/5,'White');
    drawText(com.score,3*(canvas.width/4),canvas.height/5,'White');

    //Draw the Ball
    drawCircle(ball.x,ball.y,ball.radius,ball.color);

    //Draw the user and the com
    drawRect(user.x,user.y,user.width,user.height,"White");
    drawRect(com.x,com.y,com.width,com.height,'White');    

}

function resetBall(){
    ball.x = canvas.width/2;
    ball.y = canvas.height/2;
    ball.velocityX = -ball.velocityX;
    ball.speed = 7;
}

function collision(b,p){
    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.right = b.x + b.radius;
    b.left = b.x - b.radius;

    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x + p.width;
    p.right = p.x;

    return b.right > p.left && b.bottom > p.top && b.left < p.right && b.top < p.bottom;
}

function update(){

    if(ball.x  < 0){
        com.score++;
        resetBall();
    }else if(ball.x > canvas.width){
        user.score++;
        resetBall();
    }

    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    //Simple AI to control the com paddle
    let computerLevel = 0.1;
    com.y += (ball.y - (com.y + com.height/2))*computerLevel;
    
    if(ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0){
        ball.velocityY = - ball.velocityY;
    }

    let player = (ball.x < canvas.width/2) ? user : com;

    if(collision(ball,player)){
        
        let collidePoint = (ball.y - (player.y + player.height/2));

        collidePoint = collidePoint/player.height/2;

        let angleRad = collidePoint * Math.PI/4;

        let direction = (ball.x + ball.radius < canvas.width/2)? 1 : -1;
        ball.velocityX = direction*ball.speed*Math.cos(angleRad);
        ball.velocityY = ball.speed*Math.sin(angleRad);

        ball.speed += 0.1;

    }
}

function game(){
    update();
    render();
}

let framesPerSecond = 50;

setInterval(game,1000/framesPerSecond);