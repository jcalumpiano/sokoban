
const wallSymbol = "W"
const boxSymbol = "B"
const playerSymbol = "P"
const targetSymbol = "T"

function Level(template, name){
    this.template = template;
    this.rows = this.template.split('\n');
    this.canvasWidth = this.rows[0].split(',').length;
    this.canvasHeight = this.rows.length;
    this.levelName = name
}

level1 = new Level(
`-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-
-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-
-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-
W,W,W,-,-,-,-,-,-,-,-,-,-,-,-,-,-
T,B,P,-,-,-,-,-,-,-,-,-,-,-,-,-,-
W,W,W,-,B,-,-,-,-,-,-,-,-,-,-,-,-
W,-,W,W,B,-,-,-,-,-,-,-,-,-,-,-,-
W,-,W,-,-,-,-,-,-,-,-,-,-,-,-,-,-
W,B,-,B,B,B,-,-,-,-,-,-,-,-,-,-,-
-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-
-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-
-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-
-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-
-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-
-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-
-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-
`,
"Level 1"
)

level2 = new Level(
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
`,
"Level 2"
)

const levels = [level1, level2]
const levelsIndexMap = new Map();

for (const [index, level] of levels.entries()) {
    levelsIndexMap.set(level.levelName, index)
}

function getNextLevelIndex(levelName){
    let levelIndex = levelsIndexMap.get(levelName)
    return levelIndex + 1
}

function getLevelByIndex(index){
    return levels[index]
}