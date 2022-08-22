const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
const isAtGoal = (x, y) => terrainArray[x][y].isGoal === true;
//Check if there is nothing ahead.
const isNothingAhead = (x, y) =>  
    terrainArray[x][y].hasObstacle === false && //Can't be an obstacle (wall or rock) 
    !isAtGoal(x, y) &&  //Can't be a goal
    !terrainArray[x][y].isBag() &&  //Can't be a bag
    !terrainArray[x][y].isPotion() &&//Can't be a potion
    !terrainArray[x][y].isChest() && 
    !terrainArray[x][y].isBomb();
//Check if the cell is a wall (unpassable)
const isWall = (x, y) =>  terrainArray[x][y].unbreakable === true;
const pad = (x) => parseFloat(x).toFixed(1).replace(/[.,]0$/, "");
//Gets a random number between min and max (Excludes max).
const randomInteger = (min, max) => Math.floor(Math.random() * (max - min)) + min;
const randomDecimal = (min, max) => Math.random() * (max - min) + min;