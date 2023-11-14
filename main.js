
//start game when level is selected
const numOfBlocks = 400;
const mySel = (sel) => document.querySelector(sel);
const mySelAll = (sel) => document.querySelectorAll(sel);
const numOfRow = Math.sqrt(numOfBlocks);

// const randomNum = () => Math.floor(Math.random() * numOfBlocks);
const randomRow = () => Math.floor(Math.random() * numOfRow);
var level = ""
var scoreCounterUpto = 1;
var snakeSpeed;
var score = 0;


if (!localStorage.getItem("snakeEasy")) {
    mySel(".high1").innerText = '0';
} else {
    mySel(".high1").innerText = localStorage.getItem("snakeEasy");
}
if (!localStorage.getItem("snakeMedium")) {
    mySel(".high2").innerText = '0';
} else {
    mySel(".high2").innerText = localStorage.getItem("snakeMedium");
}
if (!localStorage.getItem("snakeHard")) {
    mySel(".high3").innerText = '0';
} else {
    mySel(".high3").innerText = localStorage.getItem("snakeHard");
}
if (!localStorage.getItem("snakeVHard")) {
    mySel(".high4").innerText = '0'

} else {
    mySel(".high4").innerText = localStorage.getItem("snakeVHard");
}
//default hide the game
mySel(".div").classList.add("d-none");
mySelAll(".sbtn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
        if (e.target.classList.contains("easy")) {
            level = "easy"
            scoreCounterUpto = 5;
            snakeSpeed = 900;
        }
        else if (e.target.classList.contains("medium")) {
            level = "medium"
            scoreCounterUpto = 7;
            snakeSpeed = 400;
        }
        else if (e.target.classList.contains("hard")) {
            level = "hard"
            scoreCounterUpto = 10;
            snakeSpeed = 100;
        }
        else if (e.target.classList.contains("vhard")) {
            level = "vhard"
            scoreCounterUpto = 15;
            snakeSpeed = 40;
        }

        startGame()
    })
})

function startGame() {


    //hide level block and show snake box
    mySel(".div").classList.remove("d-none")
    mySel(".body").classList.add("d-none")

    var foodX = 0;
    var foodY = 0;
    var scoreCounter = 1;


    mySel(".score").innerText += score;
    //insert table tr and td
    let newBlocks = "<table>";
    let count = 0;
    for (let i = 0; i < Math.sqrt(numOfBlocks); i++) {
        newBlocks += `<tr>`;
        for (let j = 0; j < Math.sqrt(numOfBlocks); j++) {
            newBlocks += `<td class="r${i} c${j} "></td>`;
            count++;
        }
        newBlocks += `</tr>`;
    }
    newBlocks += `</table>`;

    const container = mySel(".container");
    container.innerHTML = newBlocks;


    //disable tab key
    document.onkeydown = function (t) {
        if (t.which == 9)
            return false;
    }

    var width = document.body.clientWidth;

    if(width > 576){
    //onclick focus
        document.onclick = function (e) {
            mySel("#txt").focus();
        }
    }
    

    //checkMove
    var curKey = ""
    function checkMove() {
        document.addEventListener("keydown", (e) => { curKey = e.key })

        //for mobile users
        mySelAll(".arrowBtns").forEach((btn) => {
            btn.addEventListener("click", () => {
                
                if(btn.classList.contains("left")){
                    curKey = "ArrowLeft"
                }
                else if(btn.classList.contains("right")){
                    curKey =  "ArrowRight"
                }
                else if(btn.classList.contains("up")){
                    curKey = "ArrowUp"
                }
                else if(btn.classList.contains("down")){
                    curKey = "ArrowDown"
                }
            })
        })

        return curKey;
    }


    var snake = [[0, 0], [0, 1], [0, 2], [0, 3]];

    //remove All Effect (of previous active td(s))
    removeAllEfect = () => {
        let allTd = mySelAll("td");

        allTd.forEach((td) => {
            td.classList.remove("active")
        })
    }

    //change the direction
    changeDirection = () => {
        removeAllEfect()
        snake.forEach((cur, index) => {

            //if snake eat food
            if (snake[snake.length - 1][0] == foodX && snake[snake.length - 1][1] == foodY) {

                //increase score 
                if (scoreCounter == scoreCounterUpto && score != 0) {
                    score = score + 5
                    mySel(".sc").innerHTML = `<h1 class="effect">+ 5</h1>`;
                    setTimeout(() => {
                        mySel(".sc").innerHTML = ``;
                    }, 1200)
                    scoreCounter = 1;
                }
                else {
                    ++scoreCounter;
                    ++score;
                }

                //show score
                mySel(".score").innerText = score;

                // remove old food
         mySel("table").children[0].children[parseInt(foodX)].children[parseInt(foodY)].classList.remove("food")
                snake.push([foodX, foodY])
                food();
                // snake.unshift([])
            }

            //gameover
            if (snake[snake.length - 1][0] == numOfRow || snake[snake.length - 1][1] == numOfRow || snake[snake.length - 1][0] == -1 || snake[snake.length - 1][1] == -1) {
                gameOver();
            }

            mySel("table").children[0].children[cur[0]].children[cur[1]].classList.add("active")
          
        })

    }

    var lastMoves = [""];



    const changeMove = setInterval(() => {
        let move = checkMove() || "ArrowRight";

        //last
        let row = snake[snake.length - 1][0];
        let col = snake[snake.length - 1][1];
        // let len = snake.length;

        //insert unique last pressed keys
        if (lastMoves[lastMoves.length - 1] != move) {
            lastMoves.push(move)
        }

        // lastMoves[lastMoves.length-2] != "ArrowUp" This is block the unidirectoin move
        if (move == "ArrowDown" && lastMoves[lastMoves.length - 2] != "ArrowUp") {
            down(row)
        }
        if (move == "ArrowRight" && lastMoves[lastMoves.length - 2] != "ArrowLeft") {
            right(col)
        }
        if (move == "ArrowUp" && lastMoves[lastMoves.length - 2] != "ArrowDown") {
            up(row)
        }

        if (move == "ArrowLeft" && lastMoves[lastMoves.length - 2] != "ArrowRight") {
            left(col)
        }

        changeDirection()
        checkOverride();
    }, snakeSpeed)


    //movement
    function up(row) {
        snake[snake.length - 1][0] = row;
        snake.push([snake[snake.length - 1][0] - 1, snake[snake.length - 1][1]])
        snake.shift();
    }
    function down(row) {
        snake[snake.length - 1][0] = row;
        snake.push([snake[snake.length - 1][0] + 1, snake[snake.length - 1][1]])
        snake.shift();
    }
    function right(col) {
        snake[snake.length - 1][1] = col;
        snake.push([snake[snake.length - 1][0], snake[snake.length - 1][1] + 1])
        snake.shift();
    }
    function left(col) {
        snake[snake.length - 1][1] = col;
        snake.push([snake[snake.length - 1][0], snake[snake.length - 1][1] - 1])
        snake.shift();
    }


    food()

    //generate random food
    function food() {
        foodX = randomRow();
        foodY = randomRow();

        //add food at random place
        mySel("table").children[0].children[parseInt(foodX)].children[parseInt(foodY)].classList.add("food")
    }

    function gameOver() {
        let ii = 0;
        clearInterval(changeMove);
        if ((parseInt(localStorage.getItem("snakeEasy")) < score || !localStorage.getItem("snakeEasy")) && level == "easy") {
            localStorage.setItem("snakeEasy", score)
            alert("Game over!!\n\n congrats\n You did new high score :) ");
            ii++;
        }
        if ((parseInt(localStorage.getItem("snakeMedium")) < score || !localStorage.getItem("snakeMedium")) && level == "medium") {
            localStorage.setItem("snakeMedium", score)
            ii++;
            alert("Game over!!\n\n congrats\n You did new high score :) ");

        }
        if ((parseInt(localStorage.getItem("snakeHard")) < score || !localStorage.getItem("snakeHard")) && level == "hard") {
            localStorage.setItem("snakeHard", score)
            ii++;
            alert("Game over!!\n\n congrats\n You did new high score :) ");

        }
        if ((parseInt(localStorage.getItem("snakeVHard")) < score || !localStorage.getItem("snakeVHard")) && level == "vhard") {
            localStorage.setItem("snakeVHard", score)
            ii++;
            alert("Game over!!\n\n congrats\n You did new high score :) ");
        }

        if (ii == 0){
            alert("Game over !!\n\n This is not easy as you imagine :( ")
            // window.location.reload()
        }
            
    }


    //fix override snake
    function checkOverride() {
        for (let i = 0; i < snake.length - 2; i++) {

            if ((snake[i][0] == snake[snake.length - 1][0]) && (snake[i][1] == snake[snake.length - 1][1])) {
                gameOver(); i = snake.length-2
            }
        }
    }
}