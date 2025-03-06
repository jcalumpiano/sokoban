const gridSize = 30;
let wallBlocks = [];
let moveableBoxes = [];
let targets = [];
var currentLevel;
hasPlayerWon = false;

function GameArea () {
    
    this.canvas = document.createElement("canvas")
    this.context = this.canvas.getContext("2d");
    this.start = function(level) {
        hasPlayerWon = false
        //set canvas dimensions
        this.canvas.width = level.canvasWidth*gridSize;
        this.canvas.height = level.canvasHeight*gridSize;
        // this.interval = setInterval(updateGameArea, 20);
        loadWallsFromTemplate(level.template);
        updateGameArea();
        window.addEventListener("keydown", function(event){
            if(!hasPlayerWon){
                updateGameArea()
                gameArea.key = event.key;
            }
        });
        window.addEventListener("keyup", function(){
            if(!hasPlayerWon){
                updateGameArea()
                gameArea.key = false;
            }
        })
        
    },
    this.clear = function(){
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    this.restart = function(level){
        this.canvas.width = level.canvasWidth*gridSize;
        this.canvas.height = level.canvasHeight*gridSize;
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        loadWallsFromTemplate(level.template);
        updateGameArea()
        hasPlayerWon = false
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
    disableCurrentLevelButton();
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

    // check if pushing the box moves it outside the border
    if(newX<0 || newY<0 || newX>=gameArea.canvas.width || newY>=gameArea.canvas.height){
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


function checkWin(){
    let score = 0;
    // hasPlayerWon = false;
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
    let nextLevelIndex = getNextLevelIndex(currentLevel.levelName)
    let nextLevelButton;
    
    if(nextLevelIndex >= levels.length){
        nextLevelButton = "Exit"
        nextLevelFunction = function(){
            hidePopup()
        }
    }else{
        nextLevelButton = "Next Level"
        nextLevelFunction = function(){
            selectLevel(getLevelByIndex(nextLevelIndex))
            hidePopup()
        }
    }

    createPopup(
        "You won!", "It took you "+moveCount+" moves to win this level", "Play Again", nextLevelButton, 
        function(){
            gameArea.restart(currentLevel);
            moveCounter.setMoveCount(0)
            updateGameArea()
            hidePopup()
        }, 
        nextLevelFunction
    )
}

function startGame(level) { 
    gameArea.start(level);
    moveCounter.setMoveCount(0)
    currentLevel = level
    updateGameArea()
}

function restartLevel(level) {
    createPopup(
        "Reset level?", "Your progress will be lost", "Yes", "Cancel", 
        function(){
            gameArea.restart(level);
            moveCounter.setMoveCount(0)
            updateGameArea()
            hidePopup()
        }, 
        function(){
            hidePopup()
        }
    )
}

function selectLevel(chosenLevel) { 
    if (!currentLevel){
        gameArea.start(chosenLevel);
    }else {
        gameArea.restart(chosenLevel);
    }
    moveCounter.setMoveCount(0);
    currentLevel = chosenLevel    
    updateGameArea();  
}

function disableCurrentLevelButton() {
    let levelSelectorButtons = document.getElementById("levelSelector").children
    if(levelSelectorButtons){
        for (let button of levelSelectorButtons){
            button.disabled=false;
        }
    }
    if (currentLevel){
        let button = document.getElementById(currentLevel.levelName);
        button.disabled = true;
    }
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
            restartLevel(currentLevel);
        });
    restartButton.getButton.classList.add("marginTop")
        
    let levelSelector = createLevelSelector();

    
    navRight.append(divMoveCounter);
    navRight.append(restartButton.getButton);
    navLeft.append(levelSelector.getDropdownArea);
    
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
    button.onclick = function(){
        onclick()
        // remove keyboard focus from button after clicking
        button.blur()
    };

    return {
        getButton: button
    }
}

function createLevelSelector(){
    let dropdownArea = document.createElement("div");
    let dropdownButton = createButton("buttonLevelSelect", "Select Level", function()
        {
            document.getElementById("levelSelector").classList.toggle("show");
        });

    let dropdownContent = document.createElement("div");
    dropdownContent.id = "levelSelector";
    dropdownContent.classList.add("dropdownContent");

    levels.forEach((level) => {
        let levelButton = createButton(level.levelName, level.levelName, function(){selectLevel(level)})
        levelButton.getButton.classList.add("marginTop")
        dropdownContent.appendChild(levelButton.getButton)
    });

    dropdownArea.append(dropdownButton.getButton);
    dropdownArea.append(dropdownContent);
    
    return{
        getDropdownArea: dropdownArea
    }

}

function createPopup(header, message, buttonLeftText, buttonRightText, function1, function2) {
    let background = document.createElement("div");
    background.classList.add("overlay");
    background.id = "popupContainer";

    let popupDiv = document.createElement("div");
    popupDiv.classList.add("divPopup")
    popupDiv.id = "popupBox";

    let popupCloseButton = createButton("popupCloseButton", "&times;", function(){hidePopup()}).getButton;
    popupCloseButton.classList.add("buttonClose");
    popupCloseButton.classList.add("topRight");

    let popupHeaderDiv = document.createElement("div");
    popupHeaderDiv.classList.add("popupHeaderDiv");
    popupHeaderDiv.innerHTML = header;

    let popupMessageDiv = document.createElement("div");
    popupMessageDiv.classList.add("divPopupMessage");
    popupMessageDiv.innerHTML = message;

    let buttonContainer = document.createElement("div");
    buttonContainer.classList.add("divPopupButtonContainer");

    let button1 = createButton(buttonLeftText, buttonLeftText, function1)
    button1.getButton.classList.add("popupButton");
    let button2 = createButton(buttonRightText, buttonRightText, function2)
    button2.getButton.classList.add("popupButton");

    if(buttonLeftText){
        buttonContainer.append(button1.getButton);
    }

    if(buttonRightText){
        buttonContainer.append(button2.getButton);
    }

    popupDiv.append(popupCloseButton);
    popupDiv.append(popupHeaderDiv);
    popupDiv.append(popupMessageDiv);
    popupDiv.append(buttonContainer);
    // background.classList.toggle("hide")
    
    document.body.append(background);
    document.body.append(popupDiv);

}

function hidePopup() {
    let popupContainer = document.getElementById("popupContainer");
    let popupBox = document.getElementById("popupBox");

    document.body.removeChild(popupContainer);
    document.body.removeChild(popupBox)
}




createGameScreeen();
// createPopup("Reset?")
startGame(levels[0]);
