import './App.css';
import React, { useState, useRef, useEffect } from "react";
import { Wall, Player, MoveableBox, Target} from './assets'
import { levels, levelsIndexMap, getNextLevelIndex, getLevelByIndex, wallSymbol, boxSymbol, playerSymbol, targetSymbol} from './levels';
import {Button, Popup, LevelSelector} from "./components"


let wallBlocks = [];
let moveableBoxes = [];
let targets = [];
let player;

const gridSize = 30;

function GameArea({incrementMove, gameRef, level, setMoveCount, setSelectedLevel}) {
  const canvasRef = useRef(null);
  const gameInitialized = useRef(false);
  // let hasPlayerWon = useRef(false);
  let [hasPlayerWon, setHasPlayerWon] = useState(false);
  const [showPopup, setShowPopup] = useState(false)

  const hasPlayerWonRef = useRef(hasPlayerWon);
  // update tracking of player status
  useEffect(() => {
    hasPlayerWonRef.current = hasPlayerWon;

  }, [hasPlayerWon])

  useEffect(() => {
    // return anything if the game is already initialized to prevent re-render
    if (gameInitialized.current) return;
    const canvas = canvasRef.current;
    const context = canvasRef.current.getContext('2d');
    // let gridSize = 20;

    function startGame(level){
      canvas.width = gameRef.current.level.canvasWidth * gridSize;
      canvas.height = gameRef.current.level.canvasHeight * gridSize;
      loadWallsFromTemplate(level.template, context).then(() => {
        setHasPlayerWon(false)
        updateGameArea(context);
      });
    }

    function restartGame() {
      setMoveCount(0)
      setShowPopup(false);
      gameInitialized.current = false;
      startGame(gameRef.current.level);
    }

    function startNextLevel() {
      const nextLevelIndex = getNextLevelIndex(gameRef.current.level.levelName);
      // const isLastLevel = nextLevelIndex >= levels.length;
      let newLevel = getLevelByIndex(nextLevelIndex)
      setMoveCount(0)
      setShowPopup(false);
      gameInitialized.current = false;
      setSelectedLevel(newLevel)
      gameRef.current.level = newLevel
      startGame(newLevel);
    }

    if (gameRef) {
      // assign methods to the reference object
      // use updated level
      gameRef.current = { restartGame, startGame: () => startGame(gameRef.current.level), level, startNextLevel};

    }

    function updateGameArea(context){
      clearCanvas();
      let playerMoved = movePlayer(context);
      if (playerMoved){         
          for(let target of targets){
            for (let box of moveableBoxes){
                if (box.x == target.x && box.y == target.y){
                    box.markBox();
                    continue;
                }
            }
          }
      } 
      
      
      drawWalls();
      return playerMoved;
      // disableCurrentLevelButton();
    }

    function clearCanvas() {
      context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clear the entire canvas
    }

    window.addEventListener("keydown", function(event){
      if(!hasPlayerWonRef.current){
          context.key = event.key;
      }
    });

    window.addEventListener("keyup", function(){

      if(!hasPlayerWonRef.current){
        const playerMoved = updateGameArea(context);
        if (playerMoved){
          incrementMove()
        }

        const winCondition = checkWin();
       
        if (winCondition) {
          setHasPlayerWon(true);
          setShowPopup(true) // Trigger the popup when player wins
          context.key = false;
          console.log(getNextLevelIndex(gameRef.current.level.levelName))
        }
      }
    })

    startGame(level);
    gameInitialized.current = true;

    drawWalls();

  }, [])

  const hideWinScreen = () => {
    setShowPopup(false);
  }

  // const goToNextLevel = () => {
    
    
  //   {gameRef.current.startNextLevel}
  // }

  return (
    <div className='gameArea'>
      <canvas ref={canvasRef}>GA</canvas>

      {/* Conditionally render the popup when the player wins */}
      {hasPlayerWon && showPopup &&(
        <Popup
          header="You Won!"
          message="Congratulations, you have won the game!"
          buttonLeftText="Play Again"
          buttonRightText={
            getNextLevelIndex(gameRef.current.level.levelName) >= levels.length
              ? "Exit"
              : "Next Level"
          }
          function1={gameRef.current.restartGame}
          function2={
            getNextLevelIndex(gameRef.current.level.levelName) >= levels.length
              ? hideWinScreen
              : gameRef.current.startNextLevel
          }
          onClose={hideWinScreen}
        />
      )}
    </div>
  );
}

const playAgain = () => {
  console.log('play again')
}

function loadWallsFromTemplate(template, context) {
  wallBlocks = [];
  moveableBoxes = [];
  targets = [];
  const rows = template.split('\n')

  player = new Player(context, 0, 0, null, gridSize)
  
  return preloadImages().then((images) => {

    rows.forEach((row, rowIndex) => {
      const columns = row.split(',');
      columns.forEach((cell, colIndex) => {
        const x = colIndex * gridSize;
        const y = rowIndex * gridSize;
        const trimmed = cell.trim();
  
        if (trimmed === wallSymbol) {
          wallBlocks.push(new Wall(context, colIndex*gridSize, rowIndex*gridSize, "red", gridSize, images.wall));
        } else if (trimmed === playerSymbol) {
          player = new Player(context, colIndex*gridSize, rowIndex*gridSize, "blue", gridSize, images.player);
        } else if (trimmed === boxSymbol) {
          moveableBoxes.push(new MoveableBox(context, colIndex*gridSize, rowIndex*gridSize, "green", gridSize, "white", images.box, images.box))
        } else if (trimmed === targetSymbol) {
          targets.push(new Target(context, colIndex*gridSize, rowIndex*gridSize, "yellow", gridSize, images.target))

        }
      });
    });
    
  });
}

function preloadImages(){
  const imagePaths = {
    wall: '/img/wall.png',
    box: '/img/block.png',
    player: '/img/char.png',
    target: '/img/mark.png',
  };

  const loadedImages = {};

  const promises = Object.entries(imagePaths).map(([key, src]) => {
    return new Promise ((resolve, reject) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loadedImages[key] = img;
        resolve();
      }
      img.onerror = reject;

    })
  })

  return Promise.all(promises).then(() => loadedImages)
}

// function updateGameArea(context) {
//   clearCanvas(context);
//   let playerMoved = movePlayer(context);
//   if (playerMoved){
//     console.log("player moved")
      
//       for(let target of targets){
//         for (let box of moveableBoxes){
//             if (box.x == target.x && box.y == target.y){
//                 box.markBox();
//                 continue;
//             }
//         }
//       }

//   }
  
//   drawWalls();
//   return playerMoved;
//   // disableCurrentLevelButton();
// } 

function checkWin(){
  let score = 0;
  
  for(let target of targets){
      for (let box of moveableBoxes){
          if (box.x == target.x && box.y == target.y){
              score = score + 1
              continue;
          }
      }
  }
  if (score == targets.length){
    console.log("player won");
    return true;
  }

  return false

}

function movePlayer(context){
  let playerMoved = false;
  let initialX = player.x;
  let initialY = player.y;
  let newX = player.x;
  let newY = player.y;

  let movement = ""

  if (context.key && context.key == "ArrowLeft") {newX -= player.speedX; movement = "left"}
  if (context.key && context.key == "ArrowRight") {newX += player.speedX; movement = "right"}
  if (context.key && context.key == "ArrowUp") {newY -= player.speedY; movement = "up"}
  if (context.key && context.key == "ArrowDown") {newY += player.speedY; movement = "down"}

  // Check for collisions with blocks (walls)
  let isWallHit = isHittingWall(newX, newY)
  if (!isWallHit) {
    // Check if next move hits box
    let boxHit = isHittingBox(newX, newY);
    if (boxHit){
      //predict next box position
      let newBoxState = pushBox(context, movement, boxHit);
      if(boxHit && newBoxState.isBoxMoved){
          player.x = newX;
          player.y = newY;
          moveBox(context, boxHit, newBoxState.newX, newBoxState.newY)
      }
    }else{
        player.x = newX;
        player.y = newY;
    }
  }
  
  player.x = Math.max(0, Math.min(player.x, context.canvas.width - player.size))
  player.y = Math.max(0, Math.min(player.y, context.canvas.height - player.size))

  player.update();

  if(initialX != player.x || initialY != player.y){
    playerMoved = true;
  }else{
      playerMoved = false;
  }
  return playerMoved


    
}

function moveBox(context, box, newX, newY){
  box.x = newX;
  box.y = newY;
  box.x = Math.max(0, Math.min(box.x, context.canvas.width - box.size))
  box.y = Math.max(0, Math.min(box.y, context.canvas.height - box.size))


  box.update()
}

function pushBox(context, movement, box){
  let newX = box.x;
  let newY = box.y;
  let boxMoved = false;
  
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
  if(newX<0 || newY<0 || newX>=context.canvas.width || newY>=context.canvas.height){
      newX = Math.max(0, Math.min(newX, context.canvas.width - box.size))
      newY = Math.max(0, Math.min(newY, context.canvas.height - box.size))
  }else if (!isHittingWall(newX, newY) && !isHittingOtherBox(box, newX, newY)) {
      boxMoved = true;
  }
  return {
      isBoxMoved : boxMoved,
      newX: newX,
      newY: newY
  }

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

function MoveCounter({moveCount}) {

  return (
    <div className='divMoveCounter'>
      <div>Moves</div>
      <div>{moveCount}</div>
    </div>
  )
}

function NavBar() {
  return (
    <div className='navBar'></div>
  )
}

function NavLeft({gameRef, setSelectedLevel, currentLevel}) {
  const [showChangeLevelPopup, setShowChangeLevelPopup] = useState(false);
  const [pendingLevel, setPendingLevel] = useState(null);
  // let oldLevel = gameRef.current.level
  // console.log(currentLevel)
  let newLevel;

  const handleSelectLevel = (selectedLevel) => {
    setPendingLevel(selectedLevel);
    if(selectedLevel!=gameRef.current.level){
      setShowChangeLevelPopup(true);
    }
  }

  const confirmChangeLevel = () => {
    if (gameRef.current && gameRef.current.startGame && pendingLevel) {
      //pass level here
      setSelectedLevel(pendingLevel)
      gameRef.current.level = pendingLevel
      gameRef.current.startGame(pendingLevel)
    }
    setShowChangeLevelPopup(false);
  }

  const cancelChangeLevel = () => {
    setShowChangeLevelPopup(false);
    setPendingLevel(null)
  }

  return (
    <div className='navVertical navLeft'>
      <LevelSelector options={levels} selectLevel={handleSelectLevel} currentLevel={currentLevel}/>
      {showChangeLevelPopup && (
        <Popup
          header="Change Level?"
          message="Are you sure you want to change levels? Your progress will be lost."
          buttonLeftText="Yes"
          buttonRightText="No"
          function1={confirmChangeLevel}
          function2={cancelChangeLevel}
          onClose={cancelChangeLevel}
        />
      )}
    </div>
    
  )
}

function NavRight({moveCount, gameRef, setMoveCount}) {

  const [showRestartPopup, setShowRestartPopup] = useState(false);

  const handleRestartClick = () => {
    setShowRestartPopup(true);
  };

  const confirmRestart = () => {
    if (gameRef.current && gameRef.current.restartGame) {
      gameRef.current.restartGame(); // Call GameArea's restart function
      setShowRestartPopup(false);
    }
  }

  const cancelRestart = () => {
    setShowRestartPopup(false);
  }

  return (
    <div className='navVertical navRight'>
      <MoveCounter moveCount={moveCount}/>
      <Button text={"Restart"} id={"restart"} onclick={handleRestartClick} className="marginTop"/>

      {showRestartPopup && (
        <Popup
          header="Restart Level?"
          message="Are you sure you want to restart? Your progress will be lost."
          buttonLeftText="Yes"
          buttonRightText="No"
          function1={confirmRestart}
          function2={cancelRestart}
          onClose={cancelRestart}
        />
      )}

    </div>
  )
}

function MainContainer() {
  
  // State for move count
  const gameRef = useRef(null);
  const [moveCount, setMoveCount] = useState(0);
  const incrementMove = () => setMoveCount(prev => prev + 1);
  const [selectedLevel, setSelectedLevel] = useState(levels[0])

  return (
    <div className='mainContainer'>
      <NavBar />
      <div class="flexRow mainArea">
        <NavLeft 
          gameRef={gameRef}
          setSelectedLevel={setSelectedLevel}
          currentLevel={selectedLevel}
        />
        <GameArea incrementMove={incrementMove} gameRef={gameRef} level={selectedLevel} setMoveCount={setMoveCount} setSelectedLevel={setSelectedLevel}/>
        {/* <div> */}
          {/* <MoveCounter moveCount={moveCount}/> */}
          {/* <button onClick = {restartLevel}>Restart</button> */}
          {/* <Button text="Restart" id="restart" onclick={restartLevel} /> */}
        {/* </div> */}
        <NavRight
          moveCount={moveCount}
          gameRef={gameRef}
          setMoveCount={setMoveCount}
        />
      </div>
    </div>
    
  )
}

// Function to load walls (blocks) from CSV


function App() {
  
  return (
    <div className="App">
      <MainContainer />
      
    </div>
    
  );
}

export default App;
