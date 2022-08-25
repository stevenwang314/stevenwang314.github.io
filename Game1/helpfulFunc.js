const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
const isAtGoal = (x, y) => terrainArray[x][y].isGoal === true;
//Check if there is nothing ahead.
const isNothingAhead = (x, y) =>  
    terrainArray[x][y].isObstacle() === false &&  !terrainArray[x][y].isEnemy() &&//Can't be an obstacle (wall or rock) 
    !isAtGoal(x, y) &&  //Can't be a goal
    !terrainArray[x][y].isBag() &&  //Can't be a bag
    !terrainArray[x][y].isPotion() &&//Can't be a potion
    !terrainArray[x][y].isPotionHP() &&//Can't be a potion (HP)
    !terrainArray[x][y].isChest() &&  !terrainArray[x][y].isDollar() && 
    !terrainArray[x][y].isBomb() &&
    !terrainArray[x][y].isFirecracker() &&    !terrainArray[x][y].isLightning() &&   !terrainArray[x][y].isGoggle() &&
    !terrainArray[x][y].isDrone() &&
    !terrainArray[x][y].isPortal() && !getplayer.isAtLocation(x,y);

const isThingAhead = (x, y) =>  
    !isAtGoal(x, y) &&  //Can't be a goal
    !terrainArray[x][y].isEnemy() &&
    !terrainArray[x][y].isBag() &&  //Can't be a bag
    !terrainArray[x][y].isPotion() &&//Can't be a potion
    !terrainArray[x][y].isPotionHP() &&//Can't be a potion (HP)
    !terrainArray[x][y].isChest() &&  !terrainArray[x][y].isDollar() && 
    !terrainArray[x][y].isBomb() &&
    !terrainArray[x][y].isFirecracker() &&    !terrainArray[x][y].isLightning() &&   !terrainArray[x][y].isGoggle() &&
    !terrainArray[x][y].isDrone() &&
    !terrainArray[x][y].isPortal()  && !getplayer.isAtLocation(x,y);
//Check if the cell is a wall (unpassable)
const isWall = (x, y) =>  terrainArray[x][y].unbreakable === true;
const pad = (x) => parseFloat(x).toFixed(1).replace(/[.,]0$/, "");
//Gets a random number between min and max (Excludes max).
const randomInteger = (min, max) => Math.floor(Math.random() * (max - min)) + min;
const randomDecimal = (min, max) => Math.random() * (max - min) + min;