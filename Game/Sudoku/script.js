const app = $('.sudoku');
let elements = [];
let nums = $('.num'); // коллекция цифр
let currentNum; 
let isGameOver = false;

function createArr(){
    for(let i = 0; i < 9; i++){
        let row = [];
        for(let j = 0; j < 9; j++){
            row[j] = 0;
        }
        elements.push(row);
    }
}

createArr();

function createRects(){
    for(let i = 0; i < 9; i++){
        for(let j = 0; j < 9; j++){
            let num = createRandomNum();
            let div = document.createElement('div');
            $(div).addClass('rect'); // el.classList.add
            div.dataset.id = `i${i}j${j}`;

            if(!hasInstance(num, i, j)){
                if(num != ''){
                    $(div).addClass('default');
                }
                elements[i][j] = num;
                $(div).text(num); // innerText
            }
            $(app).append(div);
        }
    }
}

function hasInstance(n, r, c){ // число, номер строки, номер колонки
    let col = [];
    let row = [];

    let alarm = false;

    for(let i = 0; i < 9; i++){
        for(let j = 0; j < 9; j++){
            if(typeof(elements[i][j]) == 'number' ){
                if(j == c){
                    col.push(elements[i][j]);
                }
                if(i == r){
                    row.push(elements[i][j]);
                }	
            }
        }
    }

    if(col.includes(n)){
        alarm = true;
    }
    if(row.includes(n)){
        alarm = true;
    }

    return alarm;
}

function createRandomNum(){
    let random = Math.floor(Math.random()*100);
    if(random > 70){
        let number = Math.ceil(Math.random()*9 );
        return number;
    }
    else return '';
}

createRects();


nums.click((e) => currentNum = +$(e.target).text());

function setNumber(el){
    let id = el.dataset.id; // i8j9
    let row = +id.charAt(1);
    let col = +id.charAt(3);
    $(el).text(currentNum);

    if(hasInstance(currentNum, row, col)){
        el.classList.add('false');
    }
    else{
        el.classList.remove('false');
    }
    elements[row][col] = currentNum;

    checkGameOver();
}

app.on('click', '.rect', (event) => {
    if(!$(event.target).hasClass('default')){
        setNumber(event.target);
    }
});

function checkGameOver(){
    let flatArr = elements.flat();
    let allNums = flatArr.every(item => typeof(item) == 'number');

    let rects = document.querySelectorAll('.rect');
    rects = [].slice.call(rects);
    let allCorrect = rects.every(rect => !$(rect).hasClass('false'));


    if(allNums){
        if(allCorrect){
            alert('You won!');
        }
        else{
            alert('You lost!');
        }
        let restart = confirm('Start new game?');
        if(restart){
            app.html('');
            elements = [];
            createArr();
            createRects();
        }
    }	
}
