import './App.css';
import React, { useState, useRef, useEffect } from "react";
import {Button, Wall, Player} from './assets'
import { levels, levelsIndexMap, getNextLevelIndex, getLevelByIndex, wallSymbol, boxSymbol, playerSymbol, targetSymbol} from './levels';



let wallBlocks = [];
let moveableBoxes = [];
let targets = [];
let player;

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


function drawWalls() {
  for (let wallBlock of wallBlocks) {
      wallBlock.drawWallBlock();
  }
  player.update();
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

  player.x = newX;
  player.y = newY;

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
