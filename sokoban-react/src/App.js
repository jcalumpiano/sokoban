import './App.css';
import React, { useState, useRef, useEffect } from "react";
import {Button, Wall, Player} from './assets'
import { levels, levelsIndexMap, getNextLevelIndex, getLevelByIndex, wallSymbol, boxSymbol, playerSymbol, targetSymbol} from './levels';



let wallBlocks = [];
let moveableBoxes = [];
let targets = [];
let player;

const gridSize = 30;

function GameArea() {
  const canvasRef = useRef(null);
  const gameInitialized = useRef(false);
  let [hasPlayerWon, setHasPlayerWon] = useState(false);
  
  useEffect(() => {
    if (gameInitialized.current) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    // let gridSize = 20;

    function startGame(){
      setHasPlayerWon(false);
      canvas.width = levels[0].canvasWidth * gridSize;
      canvas.height = levels[0].canvasHeight * gridSize;
      loadWallsFromTemplate(levels[0].template, context);
      updateGameArea(context);
    }

    window.addEventListener("keydown", function(event){
      if(!hasPlayerWon){
          updateGameArea(context)
          context.key = event.key;

      }
    });
    window.addEventListener("keyup", function(){
        if(!hasPlayerWon){
            updateGameArea(context)
            context.key = false;
        }
    })
    startGame();
    gameInitialized.current = true;

    drawWalls();

  }, [])
  return (
    <canvas ref={canvasRef}>GA</canvas>
  )
}

function loadWallsFromTemplate(template, context) {
  wallBlocks = [];
  moveableBoxes = [];
  targets = [];
  const rows = template.split('\n')

  rows.forEach((row, rowIndex) => {
    const columns = row.split(','); // Split each row by commas
    columns.forEach((cell, colIndex) => {
        if (cell.trim() === wallSymbol) {
            // Create a block at the rowIndex, colIndex position
            wallBlocks.push( new Wall(context, colIndex*gridSize, rowIndex*gridSize, "red", gridSize));
        }else if(cell.trim() === playerSymbol){
            player = new Player(context, colIndex*gridSize, rowIndex*gridSize, "blue", gridSize);
        }
    });
  });

}

function updateGameArea(context) {
  clearCanvas(context);
  let playerMoved = movePlayer(context);
  if (playerMoved){
    console.log("player moved")
      // moveCounter.incrementMove()
  }
  drawWalls();
  // checkWin();
  // disableCurrentLevelButton();
} 

function clearCanvas(context) {
  context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clear the entire canvas
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
  player.update();
}


function NavBar() {
  return (
    <div>Nav</div>
  )
}

function NavLeft() {
  return (
    <div>NavL</div>
  )
}

function NavRight() {
  return (
    <div>NavR</div>
  )
}

function MainArea() {
  return (
    <div class="flexRow mainArea">
      <NavLeft />
      <GameArea />
      <NavRight />
    </div>
  )
}

function MainContainer() {
  return (
    <div>
      <NavBar />
      <MainArea />
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
