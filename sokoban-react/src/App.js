import './App.css';
import React, { useState } from "react";
import {Button} from './assets'

function Car() {
  const [color, setColor] = useState("red");

  return (
  <div>
    <h2>Hi, I am a {color} Car!</h2>
    <button
        type="button"
        onClick={() => setColor("blue")}
    >
      Blue
    </button>
    <button
        type="button"
        onClick={() => setColor("red")}
    >
      Red
    </button>
  </div>
    
  );
  
}

// function Counter() {
//   const [count, setCount] = useState(0);

//   let button = <Button />
//   return (
//     button
//   )
// }

function App() {
  return (
    <div className="App">
      HELLO WORLD
      <Car />
      <Button id="button" text="button" onClick={function(){console.log('clicked')}}/>
      
    </div>
    
  );
}

export default App;
