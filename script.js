const gridSize = 30;
let wallBlocks = [];
let moveableBoxes = [];
let targets = [];


function GameArea () {
    
    this.canvas = document.createElement("canvas")
    this.start = function(level) {
        //set canvas dimensions
        this.canvas.width = level.canvasWidth*gridSize;
        this.canvas.height = level.canvasHeight*gridSize;
        this.context = this.canvas.getContext("2d");
        // this.interval = setInterval(updateGameArea, 20);
        loadWallsFromTemplate(level.template);
        window.addEventListener("keydown", function(event){
            updateGameArea()
            gameArea.key = event.key;
        });
        window.addEventListener("keyup", function(){
            updateGameArea()
            gameArea.key = false;
        })
        
        
    },
    this.clear = function(){
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    this.restart = function(level){
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        loadWallsFromTemplate(level.template);
    }
}

// Function to load walls (blocks) from CSV
function loadWallsFromTemplate(template) {
    wallBlocks = [];
    moveableBoxes = [];
    targets = [];
    const rows = template.split('\n')

    rows.forEach((row, rowIndex) => {
        const columns = row.split(','); // Split each row by commas
        columns.forEach((cell, colIndex) => {
            if (cell.trim() === wallSymbol) {
                // Create a block at the rowIndex, colIndex position
                wallBlocks.push( new Wall(colIndex*gridSize, rowIndex*gridSize, "red", gridSize, "img/wall.png"));
            }else if(cell.trim() === boxSymbol){
                moveableBoxes.push(new MoveableBox(colIndex*gridSize, rowIndex*gridSize, "green", gridSize, "img/block.png", "white", "img/blockmarked.png"))
            }else if(cell.trim() === targetSymbol){
                targets.push(new Target(colIndex*gridSize, rowIndex*gridSize, "yellow", gridSize, "img/mark.png"))
            }else if(cell.trim() === playerSymbol){
                player = new Player(colIndex*gridSize, rowIndex*gridSize, "blue", gridSize, "img/char.png")
            }
        });
    });

}

function Wall(x, y, color, size, image){
    this.x=x;
    this.y=y;  
    this.color=color;
    this.size=size;
    this.drawWallBlock = function (){
        ctx = gameArea.context;
        if (image != null) {
            this.image = new Image();
            this.image.src = image;
            ctx.drawImage(this.image, this.x, this.y, this.size, this.size);
        }else{
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.size, this.size);
        }
    }
}

function Target(x, y, color, size, image){
    this.x=x;
    this.y=y;  
    this.color=color;
    this.size=size;
    this.drawTarget = function (){
        if (image != null) {
            this.image = new Image();
            this.image.src = image;
            ctx.drawImage(this.image, this.x, this.y, this.size, this.size);
        }else{
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.size, this.size);
        }
    }
}

function Player(x, y, color, size, image){
    this.x=x;
    this.y=y;
    this.speedX = gridSize;
    this.speedY = gridSize;   
    this.color=color;
    if (image != null) {
        this.image = new Image();
        this.image.src = image;
    }
    this.size=size;
    this.update = function(){
        ctx = gameArea.context;
        if (image != null) {
            ctx.drawImage(this.image, this.x, this.y, this.size, this.size);
        }else{
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.size, this.size);    
        }
    }
}

function MoveableBox(x, y, color, size, image, markedColor, markedImage){
    this.x=x;
    this.y=y;
    this.speedX = gridSize;
    this.speedY = gridSize;   
    this.color=color;
    this.size=size;
    this.id = Date.now()*(Math.floor(Math.random() * 100))
    if (image != null) {
        this.image = new Image();
        this.image.src = image;
    }
    if (markedImage != null) {
        this.markedImage = new Image();
        this.markedImage.src = markedImage;
    }
    this.update = function(){
        ctx = gameArea.context;
        if (image != null) {
            ctx.drawImage(this.image, this.x, this.y, this.size, this.size);
        }else{
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.size, this.size);    
        }
    };
    this.markBox = function(){
        if (markedImage != null) {
            ctx.drawImage(this.markedImage, this.x, this.y, this.size, this.size);
        }else{
            ctx.fillStyle = markedColor;
            ctx.fillRect(this.x, this.y, this.size, this.size);    
        }
    }
}

function updateGameArea() {
    gameArea.clear();
    let playerMoved = movePlayer();
    if (playerMoved){
        moveCounter.incrementMove()
    }
    drawWalls();
    checkWin();
} 

function drawWalls() {
    for (let wallBlock of wallBlocks) {
        wallBlock.drawWallBlock();
    }
    
    for (let target of targets) {
        target.drawTarget();
    }

    for (let box of moveableBoxes) {
        box.update();
    }

    player.update();
}

function movePlayer(){
    playerMoved = false;
    let initialX = player.x;
    let initialY = player.y;
    let newX = player.x;
    let newY = player.y;

    let movement = ""

    if (gameArea.key && gameArea.key == "ArrowLeft") {newX -= player.speedX; movement = "left"}
    if (gameArea.key && gameArea.key == "ArrowRight") {newX += player.speedX; movement = "right"}
    if (gameArea.key && gameArea.key == "ArrowUp") {newY -= player.speedY; movement = "up"}
    if (gameArea.key && gameArea.key == "ArrowDown") {newY += player.speedY; movement = "down"}


    // Check for collisions with blocks (walls)
    if (!isHittingWall(newX, newY)) {
        // Check if next move hits box
        boxHit = isHittingBox(newX, newY);
        if (boxHit){
            //predict next box position
            newBoxState = pushBox(movement, boxHit);
            if(boxHit && newBoxState.isBoxMoved){
                player.x = newX;
                player.y = newY;
                moveBox(boxHit, newBoxState.newX, newBoxState.newY)
            }
        }else{
            player.x = newX;
            player.y = newY;
        }
        
    }
    player.x = Math.max(0, Math.min(player.x, gameArea.canvas.width - player.size))
    player.y = Math.max(0, Math.min(player.y, gameArea.canvas.height - player.size))

    player.update();

    if(initialX != player.x || initialY != player.y){
        playerMoved = true;
    }else{
        playerMoved = false;
    }

    return playerMoved;
}

function checkWin(){
    let score = 0;
    let hasPlayerWon = false;
    for(let target of targets){
        for (let box of moveableBoxes){
            if (box.x == target.x && box.y == target.y){
                score = score + 1
                box.markBox();
                continue;
            }
        }
    }
    
    if (score == targets.length){
        hasPlayerWon = true;
        showWinScreen();
    }

}

function showWinScreen(){
    loadWallsFromTemplate(winTemplate)
    gameArea.clear();
    drawWalls();
}


function isHittingWall(newX, newY){
    for(let wallBlock of wallBlocks){
        if (newY == wallBlock.y && newX == wallBlock.x){
            return true;
        }
    }
    return false;
}

function isHittingBox(newX, newY){
    for(let box of moveableBoxes){
        if (newX == box.x && newY == box.y){
            return box;
        }
    }
    return false;
}

function isHittingOtherBox(box, newX, newY){
    for(let otherbox of moveableBoxes){
        if(box.id == otherbox.id){
            continue
        }else if (newX == otherbox.x && newY == otherbox.y){
            return true;
        }
    }
    return false;
}

function moveBox(box, newX, newY){
    box.x = newX;
    box.y = newY;
    box.x = Math.max(0, Math.min(box.x, gameArea.canvas.width - box.size))
    box.y = Math.max(0, Math.min(box.y, gameArea.canvas.height - box.size))


    box.update()
}

function pushBox(movement, box){
    newX = box.x;
    newY = box.y;
    boxMoved = false;
    
    switch (movement){
        case "left":
            newX -= player.speedX
            break;
        case "right":
            newX += player.speedX
            break;
        case "up":
            newY -= player.speedY
            break;
        case "down":
            newY += player.speedY
            break;
        default:
            return;
    }
    if(newX<0 || newY<0){
        newX = Math.max(0, Math.min(newX, gameArea.canvas.width - box.size))
        newY = Math.max(0, Math.min(newY, gameArea.canvas.height - box.size))
    }else if (!isHittingWall(newX, newY) && !isHittingOtherBox(box, newX, newY)) {
        boxMoved = true;
    }
    return {
        isBoxMoved : boxMoved,
        newX: newX,
        newY: newY
    }

}

let round1 = new Template(round1Template)

function startGame() {   
    gameArea.start(round1);
    moveCounter.setMoveCount(0)
    updateGameArea()
}

function restartLevel(level) {
    gameArea.restart(round1);
    moveCounter.setMoveCount(0)
    updateGameArea()
}


// =====================================================================================================

function MoveCounter(){
    let container = document.createElement("div");
    container.classList.add("divMoveCounter");
    
    this.movesTitle = document.createElement("div");
    this.movesTitle.innerHTML = "Moves"
    
    this.movesText = document.createElement("div");   
    
    container.append(this.movesTitle);
    container.append(this.movesText);

    this.container = container
    this.setMoveCount = function(moveCount){
            this.movesText.innerHTML = moveCount;
        }
    this.incrementMove = function() {
        moveCount = parseInt(this.movesText.innerHTML) + 1
        this.movesText.innerHTML = moveCount;
    }
    this.getMoveCount = this.movesText
}

function createGameScreeen(){
    let container = document.createElement("div");
    container.classList.add("mainContainer")
    container.id = "mainContainer";

    let navBar = document.createElement("div");
    navBar.classList.add("navBar")

    let mainArea = document.createElement("div");
    mainArea.classList.add("mainArea")
    mainArea.id = "mainArea";

    let navRight = document.createElement("div");
    navRight.classList.add("navVertical");
    navRight.classList.add("navRight");

    gameArea = new GameArea();

    let navLeft = document.createElement("div");
    navLeft.classList.add("navVertical");
    navLeft.classList.add("navLeft");

    moveCounter = new MoveCounter();
    divMoveCounter = moveCounter.container
    divMoveCounter.id = "divMoveCounter";

    let restartButton = createButton("buttonResetLevel", "Reset", 
        function(){
            restartLevel();
        });
    
    navRight.append(divMoveCounter);
    navRight.append(restartButton.getButton);
    
    mainArea.append(navLeft)
    mainArea.append(gameArea.canvas);
    mainArea.append(navRight)

    container.appendChild(navBar);
    container.appendChild(mainArea);

    document.body.appendChild(container);
}

function createButton(id, text, onclick) {
    let button = document.createElement("button");
    button.id = id;
    button.innerHTML = text;
    button.onclick = onclick;

    return {
        getButton: button
    }
}

createGameScreeen();

startGame();
