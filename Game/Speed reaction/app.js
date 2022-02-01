const startBtn = document.getElementById("start");
const screens = document.querySelectorAll(".screen");
const timeList = document.querySelector(".time-list");
const timeEl = document.getElementById("time");
const board = document.getElementById("board");
const colors = ["red","blue","yellow","green"];
let time = 0;
let score = 0;

startBtn.addEventListener("click", (e) =>{
    e.preventDefault();
    screens[0].classList.add("up");
})

timeList.addEventListener("click", (e) => {
    if(e.target.classList.contains("time-btn")){
        time = parseInt( e.target.getAttribute("data-time"));
        screens[1].classList.add("up");
        startGame();
    }
})

board.addEventListener("click", (e) => {
    if(e.target.classList.contains("circle")){
        score++;
        e.target.remove();
        createRandomCricle();
    }
})

function startGame(){
    setInterval(decreaseTime, 1000);
    createRandomCricle();
    setTime(time);
}

function decreaseTime(){
    if(time === 0){
        finishGame();
    }else{
    let current = --time;
    if(current < 10){
        current = `0${current}`;
    }
    setTime(current);
    }

}

function setTime(value){
    timeEl.innerHTML = `00:${value}`;
}

function finishGame(){
    timeEl.parentNode.classList.add("hide");
    board.innerHTML = `<h1>Счёт: <span class ="primary">${score}</span></h1>`;
}

function createRandomCricle(){
    const circle = document.createElement("div");
    const size = getRandomNumber(5,30);
    const {width, height} = board.getBoundingClientRect();
    const x = getRandomNumber(0,width - size);
    const y = getRandomNumber(height - size, 0);

    circle.classList.add("circle");
    circle.style.width = `${size}px`;
    circle.style.height = `${size}px`;
    circle.style.top = `${y}px`
    circle.style.left = `${x}px`

    board.append(circle);

}

function getRandomNumber(min,max){
    return Math.round(Math.random() * (max-min) + min);
}

function getRandomColor(){
    const index =  Math.floor(Math.random() * colors.length);
    return colors[index];
}
