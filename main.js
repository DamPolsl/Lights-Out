//zmienna z lista ruchow albo jako slownik
//rozwiazania odwrotnie

function scrambleBoard(amount = 20){
    clearBoard();
    // console.log("scrambling..");
    for(let i = 0; i < amount; i++){
        x = Math.round(Math.random() * (boardSize - 1)) + 1;
        y = Math.round(Math.random() * (boardSize - 1)) + 1;
        toggleDivs(x, y, true);
    }
    // console.log(moveList);
    if (showSolution) toggleSolution();
}

function showShapesDivs(){
    for (let i = 0; i < shapes.length; i++){
        currentShapeDiv = controlPanelDiv.children[i];
        for (let y = 0; y < shapes[i].length; y++){
            for (let x = 0; x < shapes[i].length; x++){
                currentTileDiv = currentShapeDiv.children[y].children[x];
                if(shapes[i][y][x]) currentTileDiv.classList.add("filled");
            }
        }
    }
}

function createBoardDivs(size){
    let boardDiv = document.querySelector("#board");
    for (let i = 0; i < size; i++){
        let tempRow = document.createElement("div");
        tempRow.classList.add("row");
        boardDiv.appendChild(tempRow);
        for (let j = 0; j < size; j++){
            let tempDiv = document.createElement("div");
            tempDiv.classList.add("tile");
            tempDiv.setAttribute("onclick", `toggleDivs(${j + 1}, ${i + 1})`);
            tempRow.appendChild(tempDiv);
        }
    }
    return boardDiv;
}

function createBoard(size){
    let board = Array(size).fill(0).map(x => Array(size).fill(0))
    //printBoard(board);
    return board;
}

function printBoard(){
    console.log(board);
}

function clearBoard(){
    //clear matrix
    board = createBoard(boardSize);
    //clear bg color of tile divs
    for (let i = 0; i < boardDiv.childElementCount; i++){
        for (let j = 0; j < boardDiv.children[i].childElementCount; j++){
			let currentDiv = boardDiv.children[i].children[j];
            currentDiv.style.background = colors[0];
			currentDiv.innerHTML = "";
        }
    }
}

function toggleLight(y, x, scrambling = false){
    x -= 1;
    y -= 1;
    let offset = 0;
    if (shape.length % 2 == 0){
        offset = Math.floor((shape.length - 1) / 2);
    } else {
        offset = Math.floor(shape.length / 2);
    }
    for (let i = 0; i < shape.length; i++){
        for (let j = 0; j < shape[0].length; j++){
            xn = x + i - offset;
            yn = y + j - offset;
            if (xn >= 0 && xn < board.length){
                if (yn >= 0 && yn < board.length){
                    board[xn][yn] += shape[i][j];
                    board[xn][yn] = board[xn][yn] % (states);
                    toggleDiv(xn, yn, colors[board[xn][yn]]);
                }
            }
        }
    }
    if (!scrambling){
        for (let i = 0; i < states; i++){
            if(checkBoard(i)){
                promptDiv.classList.remove("hidden");
                promptDiv.classList.add("visible");
                boardDiv.children[x].children[y].innerHTML = "";
                setTimeout(function(){
                    promptDiv.classList.remove("visible");
                    promptDiv.classList.add("hidden");
                    scrambleBoard();
                }, 3000);
                break;
            }
        }
    }
}

function checkBoard(sign){
    let size = board.length;
    let filled = true;
    for (let i = 0; i < size; i++){
        for (let j = 0; j < size; j++){
            if (board[i][j] != sign){
                filled = false;
            }
        }
    }
    if (filled) {
        return true;
    }
    return false;
}

function toggleDivs(x, y, scrambling = false){
    if (`[${x}, ${y}]` in moveList){
        moveList[`[${x}, ${y}]`] += 1;
    } else {
        moveList[`[${x}, ${y}]`] = 1;
    }
    toggleLight(x, y, scrambling);
    if (!scrambling && showSolution) printSolution();
    if (!scrambling) moves++;
}

function toggleDiv(x, y, color){
    boardDiv.children[x].children[y].style.background = color;
}

function changeShape(index){
    if(index < shapes.length)
        shape = shapes[index];
    if (shapeIndex != index){
        controlPanelDiv.children[index].classList.add("selected");
        if (!firstTime)
            controlPanelDiv.children[shapeIndex].classList.remove("selected");
        else
            firstTime = false;
        shapeIndex = index;
    }
	moveList = [];
    scrambleBoard();
}

function printSolution(){
    if (showSolution){
        let solution = "Solution: ";
        for (let i = 0; i < Object.keys(moveList).length; i++){
            let amount = moveList[Object.keys(moveList)[i]];
            if (amount % 3 != 0){
                boardDiv.children[Object.keys(moveList)[i][4] - 1].children[Object.keys(moveList)[i][1] - 1].innerHTML = `${3 - (amount % 3)}`;
                solution += `${Object.keys(moveList)[i]}x${3 - (amount % 3)} `;
            } else {
                boardDiv.children[Object.keys(moveList)[i][4] - 1].children[Object.keys(moveList)[i][1] - 1].innerHTML = "";
            }
        }
    } else {
        for (let i = 0; i < Object.keys(moveList).length; i++){
            boardDiv.children[Object.keys(moveList)[i][4] - 1].children[Object.keys(moveList)[i][1] - 1].innerHTML = "";
        }
    }
}

function toggleSolution(){
    // console.log(`toggled to: ${!showSolution}`)
    if (showSolution){
        showSolution = false;
    } else {
        showSolution = true;
    }
    printSolution();
}

const colors = ["rgb(78, 78, 78)", "rgb(243, 255, 75)", "rgb(3, 176, 60)"];
const states = 3;
const boardSize = 6;
const shapes = [
    // first shape
    [
        [1, 0, 1],
        [1, 1, 1],
        [1, 0, 1]
    ],
    // second shape
    [
        [0, 1, 0],
        [1, 1, 1],
        [1, 0, 1]
    ],
    // third shape
    [
        [0, 1, 0],
        [1, 1, 1],
        [1, 0, 0]
    ]
];
let firstTime = true;
let shapeIndex;
let moves = 0;
let moveList = {};
let board = createBoard(boardSize);
let boardDiv = createBoardDivs(boardSize);
let controlPanelDiv = document.querySelector("#shapes");
let promptDiv = document.querySelector("#prompt");

let solutionButton = document.querySelector("#solutionButton");
let showSolution = false;
solutionButton.addEventListener("click", toggleSolution);

changeShape(0);
showShapesDivs();