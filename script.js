const rulesBtn = document.getElementById("rules-btn");
const closeBtn = document.getElementById("close-btn");
const rules = document.getElementById("rules");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d"); //check canvas doc

//NOTE: Check Canvas Documentation For More Information

let score = 0;

const brickRowCount = 9;
const brickColumnCount = 5;

//Create Ball Props
const ball = {
  //x,y are position of the ball inside the canvas
  x: canvas.width / 2,
  y: canvas.height / 2,
  size: 10,
  //animation --> dx is direction of ball on x axis; dy is... y axis
  speed: 4,
  dx: 4,
  dy: -4
};
//Create Paddle Props
const paddle = {
  x: canvas.width / 2 - 40,
  y: canvas.height - 20,
  w: 80,
  h: 10,
  speed: 8,
  dx: 0
};
//Create Brick Props
const brickInfo = {
  w: 70,
  h: 20,
  padding: 10,
  offsetX: 45,
  offsetY: 60,
  visible: true
};
//Create Bricks
const bricks = [];
for (let i = 0; i < brickRowCount; i++) {
  bricks[i] = [];
  for (let j = 0; j < brickColumnCount; j++) {
    const x = i * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX;
    const y = j * (brickInfo.h + brickInfo.padding) + brickInfo.offsetY;
    bricks[i][j] = { x, y, ...brickInfo };
  }
}

// console.log(bricks)

//Draw Ball On Canvas
function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
  ctx.fillStyle = "c";
  ctx.fill();
  ctx.closePath();
}
//Draw Paddle On Canvas
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
  ctx.fillStyle = "#a068e0";
  ctx.fill();
  ctx.closePath();
}
//Draw Score On Canvas
function drawScore() {
  ctx.font = "20px Arial";
  ctx.fillText(`Score: ${score}`, canvas.width - 100, 30); //width is canvas.width - 100, height is 30
}
//Draw Bricks On Canvas
function drawBricks() {
  bricks.forEach(column => {
    column.forEach(brick => {
      ctx.beginPath();
      ctx.rect(brick.x, brick.y, brick.w, brick.h);
      ctx.fillStyle = brick.visible ? "#a068e0" : "transparent";
      ctx.fill();
      ctx.closeBtn;
    });
  });
}

//Move Paddle On Canvas
function movePaddle() {
  paddle.x += paddle.dx;

  //Wall detection(so paddle does not move past the canvas)
  if (paddle.x + paddle.w > canvas.width - 10) {
    paddle.x = canvas.width - paddle.w - 10;
  }
  if (paddle.x < 10) {
    paddle.x = 10;
  }
}
//Move Ball On Canvas
function moveBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;

  //Wall collision(right/left)
  if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0) {
    // time its by its negative value so if it hits the wall it bounces in the opposite direction
    ball.dx *= -1; //ball.dx = ball.dx * -1
  }
  //Wall collision(top/bottom)
  if (ball.y + ball.size > canvas.height || ball.y - ball.size < 0) {
    // time its by its negative value so if it hits the wall it bounces in the opposite direction
    ball.dy *= -1; //ball.dy = ball.dy * -1
  }

  //console.log(ball.x, ball.y)

  //Paddle collision
  if (
    ball.x - ball.size > paddle.x &&
    ball.x + ball.size < paddle.x + paddle.w &&
    ball.y + ball.size > paddle.y
  ) {
    //then reverse the ball
    ball.dy = -ball.speed;
  }

  //Brick collision
  bricks.forEach(column => {
    column.forEach(brick => {
      //check brick is there
      if (brick.visible) {
        if (
          ball.x - ball.size > brick.x && // left brick side check
          ball.x + ball.size < brick.x + brick.w && // right brick side check
          ball.y + ball.size > brick.y && // top brick side check
          ball.y - ball.size < brick.y + brick.h // bottom brick side check
        ) {
          ball.dy *= -1; //bounce off the brick
          brick.visible = false; //hides brick

          increaseScore(); //increase score
        }
      }
    });
  });

  //Hit Bottom wall -LOSE
  if (ball.y + ball.size > canvas.height) {
    showAllBricks();
    score = 0;
  }
}

//Increase Score
function increaseScore() {
  score++;

  //Checks if all blocks have been eliminated
  if (score % (brickColumnCount * brickColumnCount === 0)) {
    showAllBricks();
  }
}

//Make All Bricks Appear
function showAllBricks() {
  bricks.forEach(column => {
    column.forEach(brick => (brick.visible = true));
  });
}

//DRAW EVERTHING
function draw() {
  //clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBall();
  drawPaddle();
  drawScore();
  drawBricks();
}

//Update Canvas Drawing And Animation
function update() {
  movePaddle();
  moveBall();
  //draw everthing
  draw();

  requestAnimationFrame(update);
}

update();

//Keydown event
function keyDown(e) {
  // console.log(e.key)
  if (e.key === "Right" || e.key === "ArrowRight") {
    paddle.dx = paddle.speed;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    paddle.dx = -paddle.speed;
  }
}
//Keyup event
function keyUp(e) {
  if (
    e.key === "Right" ||
    e.key === "ArrowRight" ||
    e.key === "Left" ||
    e.key === "ArrowLeft"
  ) {
    paddle.dx = 0;
  }
}

//Keyboard event handlers
document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

//Rules and close event listeners
rulesBtn.addEventListener("click", () => rules.classList.add("show"));

closeBtn.addEventListener("click", () => rules.classList.remove("show"));
