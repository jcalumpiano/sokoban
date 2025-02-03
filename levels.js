
const wallSymbol = "W"
const boxSymbol = "B"
const playerSymbol = "P"
const targetSymbol = "T"

function level1(){
this.levelTemplate=
`-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-
-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-
-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-
W,W,W,-,-,-,-,-,-,-,-,-,-,-,-,-,-
T,P,B,-,-,-,-,-,-,-,-,-,-,-,-,-,-
W,W,W,-,B,T,-,-,-,-,-,-,-,-,-,-,-
W,T,W,W,B,-,-,-,-,-,-,-,-,-,-,-,-
W,-,W,-,T,-,-,-,-,-,-,-,-,-,-,-,-
W,B,-,B,B,B,T,-,-,-,-,-,-,-,-,-,-
-,-,-,-,T,-,-,-,-,-,-,-,-,-,-,-,-
-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-
-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-
-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-
-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-
-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-
-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-
`;
this.levelName="Level 1";
}

function level2(){
this.levelTemplate=`-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-
-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-
-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-
W,W,W,W,W,W,W,-,-,-,-,-,-,-,-,-,-
T,P,B,-,-,-,-,-,-,-,-,-,-,-,-,-,-
W,W,W,-,B,T,-,-,-,-,-,-,-,-,-,-,-
W,T,W,W,B,-,-,-,-,-,-,-,-,-,-,-,-
W,-,W,-,T,-,-,-,-,-,-,-,-,-,-,-,-
W,B,-,B,B,B,T,-,-,-,-,-,-,-,-,-,-
-,-,-,-,T,-,-,-,-,-,-,-,-,-,-,-,-
-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-
-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-
-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-
-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-
-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-
-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-
`;
this.levelName="Level 2";
}

const levels = [new level1, new level2]