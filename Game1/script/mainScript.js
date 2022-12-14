var ctx = getCanvas.getContext("2d");
//HUD on different displays.
var ctx2 = getCanvas2.getContext("2d");
var ctx3 = getCanvas3.getContext("2d");
//Current Stage (aka Level)
var currentStage = 1;
//Player's score.
let score = 0;

let interactX = -1;
let interactY = -1;
let keyState = {};
let grassArray = [];
let terrainArray = [];
let goalPoint = { x: 0, y: 0 };
let page = { x: 0, y: 0 };
let client = { x: 0, y: 0 };
let mousePos = { x: 0, y: 0 };
let mousePos2 = {x: 0 ,y:0}

let replay_button = { x: 400, y: 496, width: 160, height: 64 };
let getplayer = new player(playerImg);
let castMode = {};
var isBuilding = true;


function setup() {
    getCanvas.width = boardSize.width * 32;
    getCanvas.height = boardSize.height * 32;
}
function decideTypeOfRock() {
    if (currentStage > 20) {
        if (randomDecimal(0, 100) < clamp(5 * (1.15 * Math.max(currentStage - 20, 0)), 5, 25)) {
            return 2;
        }
    }
    if (currentStage > 10) {
        if (randomDecimal(0, 100) < clamp(10 * (1.1 * Math.max(currentStage - 10, 0)), 5, 50)) {
            return 1;
        }
    }
    return 0;

}
function decideTypeOfEnemy() {
    if (currentStage > 20) {
        if (randomDecimal(0, 100) < clamp(7.5 * (1.1 * Math.max(currentStage - 20, 0)), 10, 20)) {
            return 4;
        }
    }
    if (currentStage > 15) {
        if (randomDecimal(0, 100) < clamp(10 * (1.05 * Math.max(currentStage - 15, 0)), 5, 25)) {
            return 7;
        }
    }
    if (currentStage > 10) {
        if (randomDecimal(0, 100) < clamp(10 * (1.075 * Math.max(currentStage - 10, 0)), 10, 25)) {
            return 3;
        }
    }
    if (currentStage > 8) {
        if (randomDecimal(0, 100) < clamp(10 * (1.05 * Math.max(currentStage - 8, 0)), 5, 25)) {
            return 6;
        }
    }
    if (currentStage > 5) {
        if (randomDecimal(0, 100) < clamp(10 * (1.03 * Math.max(currentStage - 5, 0)), 5, 30)) {
            return 2;
        }
    }
    if (currentStage > 3) {
        if (randomDecimal(0, 100) < clamp(15 * (1.03 * Math.max(currentStage - 3, 0)), 5, 30)) {
            return 5;
        }
    }
    return 1;

}
function decideHazard() {
    if (currentStage > 10) {
        if (randomDecimal(0, 100) < clamp(10 * (1.1 * Math.max(currentStage - 15, 0)), 10, 40)) {
            return 2;
        }
    }
   
    return 1;

}
function generateMap() {
    isBuilding = true;
    grassArray = [];
    terrainArray = [];
    interactX = -1;
    interactY = -1;
    getplayer.setRandomPosition();
    for (let i = 0; i < boardSize.width; i++) {
        let data = [];
        for (let j = 0; j < boardSize.height; j++) {
            data.push({ x: randomInteger(0, 8), y: randomInteger(0, 8) });
        }
        grassArray.push(data);
    }

    for (let i = 0; i < boardSize.width; i++) {
        let data = [];
        for (let j = 0; j < boardSize.height; j++) {
            let tc = new terrainCell();
            //tc.explore = true;
            data.push(tc);
        }
        terrainArray.push(data);
    }
    //Start with 20% of the obstacles and keep scaling until 50% (Stage 40 - maximum)
    let maxAmount = clamp(obstacleAmount + boardSize.width * boardSize.height * 0.01 * (currentStage - 1), 0, boardSize.width * boardSize.height * 0.6);
    for (let i = 0; i < (maxAmount < boardSize.width * boardSize.height - 1 ? maxAmount : boardSize.width * boardSize.height - 1); i++) {
        let terrainPosition = { x: randomInteger(0, boardSize.width), y: randomInteger(0, boardSize.height) };
        //Check if that rock doesn't exist.
        if (terrainArray[terrainPosition.x][terrainPosition.y].isObstacle() === false && terrainArray[terrainPosition.x][terrainPosition.y].isEnemy() === false
            && (getplayer.x != terrainPosition.x || getplayer.y != terrainPosition.y)) {
            //8% ~ 24% chance for enemy
            if (randomDecimal(0, 100) < clamp(enemyChance * (1 + 0.05 * (currentStage - 1)), enemyChance, 24)) {

                terrainArray[terrainPosition.x][terrainPosition.y].assignEnemy(decideTypeOfEnemy(), terrainPosition.x, terrainPosition.y);
            }
            //20% for a wall
            else if (randomDecimal(0, 100) < wallChance) {
                terrainArray[terrainPosition.x][terrainPosition.y].assignWall();
            }        
            else {
                terrainArray[terrainPosition.x][terrainPosition.y].assignRock(decideTypeOfRock());
            }

        }
        else {
            i--;
        }
    }
    let decay = 0;
    let decay2 = 0;
    let decay3 = 0;
    let decay4 = 0;
    let decay5 = 0;
    let decay6 = 0;
    let decay7 = 0;
    //Create Portals (Up to 2 maximum)
    for (let i = 0; i < 3; i++) {
        if (randomDecimal(0, 100) < portalChance) {
            let first = { x: 0, y: 0 };
            let second = { x: 0, y: 0 };
            do {
                let getX = randomInteger(0, boardSize.width);
                let getY = randomInteger(0, boardSize.height);
                if (terrainArray[getX][getY].unbreakable === false && terrainArray[getX][getY].isPortal() === false) {
                    terrainArray[getX][getY].assignPortal(i);
                    first = { x: getX, y: getY };
                    break;
                }
            }
            while (true);
            do {
                let getX = randomInteger(0, boardSize.width);
                let getY = randomInteger(0, boardSize.height);
                if (terrainArray[getX][getY].unbreakable === false && terrainArray[getX][getY].isPortal() === false &&
                    Math.abs(getX - first.x) + Math.abs(getY - first.y) > 15) {
                    terrainArray[getX][getY].assignPortal(i);
                    second = { x: getX, y: getY };
                    break;
                }
            }
            while (true);
            terrainArray[first.x][first.y].portal.linkedPortal = second;
            terrainArray[second.x][second.y].portal.linkedPortal = first;


        }
    }
    for (let i = 0; i < boardSize.width; i++) {
        for (let j = 0; j < boardSize.height; j++) {
            //Ignore if the starting position is the player's position.
            if (getplayer.x == i && getplayer.y == j) {
                continue;
            }

            if (!terrainArray[i][j].unbreakable && !terrainArray[i][j].isPortal()) {
                if (randomDecimal(0, 100) < (potionChance / (1 + decay * clamp(0.35 + (currentStage - 1) * 0.069, 0.35, 3.14))) * ((terrainArray[i][j].isObstacle()) ? 1.75 : 1)) {
                    terrainArray[i][j].assignPotion();
                    decay++;
                }
                if (randomDecimal(0, 100) < (healthPotionChance / (1 + decay4 * clamp(0.35 + (currentStage - 1) * 0.069, 0.35, 3.14))) * ((terrainArray[i][j].isObstacle()) ? 1.75 : 1)) {
                    terrainArray[i][j].assignPotionHP();
                    decay4++;
                }
                if (randomDecimal(0, 100) < (clamp(bombChance / (1 + 0.25 * (currentStage - 1))), bombChance / 75, bombChance) / (1 + decay2 * 0.35) * ((terrainArray[i][j].isObstacle()) ? 1.75 : 1)) {
                    terrainArray[i][j].assignBomb();
                    decay2++;
                }
                if (randomDecimal(0, 100) < (clamp(firecrackerChance / (1 + 0.25 * (currentStage - 1))), firecrackerChance / 75, firecrackerChance) / (1 + decay3 * 0.35) * ((terrainArray[i][j].isObstacle() ? 1.75 : 1))) {
                    terrainArray[i][j].assignFirecracker();
                    decay3++;
                }
                if (randomDecimal(0, 100) < (clamp(droneChance / (1 + 0.25 * (currentStage - 1))), droneChance / 75, droneChance) / (1 + decay5 * 0.35) * ((terrainArray[i][j].isObstacle()) ? 1.75 : 1)) {
                    terrainArray[i][j].assignDrone();
                    decay5++;
                }
                if (randomDecimal(0, 100) < (clamp(lightningChance / (1 + 0.25 * (currentStage - 1))), lightningChance / 75, lightningChance) / (1 + decay6 * 0.35) * ((terrainArray[i][j].isObstacle() ? 1.75 : 1))) {
                    terrainArray[i][j].assignLightning();
                    decay6++;
                }
                if (randomDecimal(0, 100) < (clamp(goggleChance / (1 + 0.25 * (currentStage - 1))), goggleChance / 75, goggleChance) / (1 + decay7 * 0.35) * ((terrainArray[i][j].isObstacle()) ? 1.75 : 1)) {
                    terrainArray[i][j].assignGoggle();
                    decay7++;
                }
                //0.2% ~ 0.4% chest
                if (randomDecimal(0, 100) < clamp(chestChance * (1 + 0.03 * (Math.max(currentStage - 1, 0) / 2)), chestChance, 0.4) * ((terrainArray[i][j].isObstacle()) ? 1.75 : 1)) {
                    terrainArray[i][j].assignChest();
                }
                //2% ~ 4.5% dollar.
                else if (randomDecimal(0, 100) < clamp(dollarChance * (1 + 0.03 * (Math.max(currentStage - 1, 0) / 2)), dollarChance, 4.5) * ((terrainArray[i][j].isObstacle()) ? 1.75 : 1)) {
                    terrainArray[i][j].assignDollar();
                }
                //5%~10% bag
                else if (randomDecimal(0, 100) < clamp(bagChance * (1 + 0.03 * (Math.max(currentStage - 1, 0) / 2)), bagChance, 10) * ((terrainArray[i][j].isObstacle()) ? 1.75 : 1)) {
                    terrainArray[i][j].assignBag();
                }
                if (randomDecimal(0, 100) < fireChance && currentStage >= 6 &&  terrainArray[i][j].isPortal() === false) {
                    terrainArray[i][j].removeObstacles();
                    terrainArray[i][j].removeObject();
                         terrainArray[i][j].removeObjectItem();
                    terrainArray[i][j].assignHazard(3);
                }
                else if (randomDecimal(0, 100) < acidChance && currentStage >= 12 &&   terrainArray[i][j].isPortal() === false) {
                    terrainArray[i][j].removeObstacles();
                    terrainArray[i][j].removeObject();
                    terrainArray[i][j].removeObjectItem();
                    terrainArray[i][j].assignHazard(4);
                }
                //Create new spikes (Between 2.5% to 18%)
                if (randomDecimal(0, 100) < clamp(spikeChance * (1 + 0.25 * (Math.max(currentStage - 3, 0) / 2)), spikeChance, 18)) {
                    terrainArray[i][j].assignHazard(decideHazard());
                }
            }
        }
    }
    //Create a goal location.
    let chosenX, chosenY;
    do {
        chosenX = randomInteger(0, boardSize.width);
        chosenY = randomInteger(0, boardSize.height);
    }
    while (getplayer.x == chosenX && getplayer.y == chosenY || isWall(chosenX, chosenY));
    goalPoint.x = chosenX;
    goalPoint.y = chosenY;
    terrainArray[chosenX][chosenY].assignGoal();

    revealNearby();
    isBuilding = false;
}
function addScore(amount) {
    score += amount * (1 + (currentStage - 1) * 0.5);
}
function revealLocation(x, y) {
    if (terrainArray[x][y].explore === false) {
        if (isBuilding === false) {
            addScore(1);
        }
        terrainArray[x][y].explore = true;
        //Only put signs on non-walls or goals
        if (!isWall(x, y) && !isAtGoal(x, y) && !terrainArray[x][y].isLiquidHazard()&& randomDecimal(0, 100) < clamp(navigationChance / (1 + 0.2 * (currentStage - 1)), 0.005, navigationChance)) {
            terrainArray[x][y].directional.enabled = true;
            if (x == goalPoint.x && y != goalPoint.y) {
                terrainArray[x][y].directional.typeOfDirection = 1;
            } else if (y == goalPoint.y && x != goalPoint.x) {
                terrainArray[x][y].directional.typeOfDirection = 0;
            } else {
                terrainArray[x][y].directional.typeOfDirection = randomInteger(0, 2);
            }
        }
    }
}
function revealNearby() {


    revealNeighbors(getplayer.x, getplayer.y, 1, (x, y) => {
        revealLocation(x, y);
    });


}
function destroyEnemy(x, y, hasCost = true) {
    if (terrainArray[x][y].isEnemy()) {
        //Slime
        if (terrainArray[x][y].getEnemy() === 1) {
            if (hasCost) {
                getplayer.performCost(SLIME.energy)
                getplayer.reduceHealth(SLIME.health);
            }
            addScore(SLIME.score);
            getplayer.stats.enemies[0] += 1;
        }
        //bat
        else if (terrainArray[x][y].getEnemy() === 2) {
            if (hasCost) {
                getplayer.performCost(BAT.energy);
                getplayer.reduceHealth(BAT.health);
            }
            addScore(BAT.score);
            getplayer.stats.enemies[1] += 1;
        }
        //SNAKE
        else if (terrainArray[x][y].getEnemy() === 3) {
            if (hasCost) {
                getplayer.performCost(SNAKE.energy);
                getplayer.reduceHealth(SNAKE.health);
            }
            addScore(SNAKE.score);
            getplayer.stats.enemies[2] += 1;
        }

        //Wolf
        else if (terrainArray[x][y].getEnemy() === 4) {
            if (hasCost) {
                getplayer.performCost(WOLF.energy);
                getplayer.reduceHealth(WOLF.health);
            }
            addScore(WOLF.score);
            getplayer.stats.enemies[3] += 1;
        }
        else if (terrainArray[x][y].getEnemy() === 5) { //Rat
            if (hasCost) {
                getplayer.performCost(RAT.energy);
                getplayer.reduceHealth(RAT.health);
            }
            addScore(RAT.score);
            getplayer.stats.enemies[4] += 1;
        }
        else if (terrainArray[x][y].getEnemy() === 6) { //Frog
            if (hasCost) {
                getplayer.performCost(FROG.energy);
                getplayer.reduceHealth(FROG.health);
            }
            addScore(FROG.score);
            getplayer.stats.enemies[5] += 1;
        }
        else if (terrainArray[x][y].getEnemy() === 7) { //Hawk
            if (hasCost) {
                getplayer.performCost(HAWK.energy);
                getplayer.reduceHealth(HAWK.health);
            }
            addScore(HAWK.score);
            getplayer.stats.enemies[6] += 1;
        }
        terrainArray[x][y].removeEnemy();
        return true;
    }
    return false;
}
function destroyObstacles(x, y, hasCost = true) {
    //Destroy rocks but not brick walls.
    if (terrainArray[x][y].isObstacle() && terrainArray[x][y].unbreakable === false) {


        if (terrainArray[x][y].hasObstacle.type == 0) {
            if (hasCost)
                getplayer.performCost(ROCK1.energy);
            addScore(ROCK1.score);
            getplayer.stats.rocksDestroyed[0] += 1;
        } else if (terrainArray[x][y].hasObstacle.type == 1) {
            if (hasCost)
                getplayer.performCost(ROCK2.energy);
            addScore(ROCK2.score);
            getplayer.stats.rocksDestroyed[1] += 1;
        }
        else if (terrainArray[x][y].hasObstacle.type == 2) {
            if (hasCost)
                getplayer.performCost(ROCK3.energy);
            addScore(ROCK3.score);
            getplayer.stats.rocksDestroyed[2] += 1;
        }

        terrainArray[x][y].removeObstacles();
        return true;
    }
    return false;
}
function activateObject(x, y) {
    if (getplayer.ghost > 0) {
        if (destroyEnemy(x, y))
            return;
    }
    else if (getplayer.ghost <= 0) {
        if (destroyObstacles(x, y) === true)
            return;
        if (destroyEnemy(x, y) === true)
            return;
    }
    //Collect bomb
    if (terrainArray[x][y].isBomb()) {
        addScore(3);
        getplayer.addBomb(1);
        terrainArray[x][y].removeObjectItem(BOMB);
    }
    //Collect firecracker.
    if (terrainArray[x][y].isFirecracker()) {
        addScore(3);
        getplayer.addFirecracker(1);
        terrainArray[x][y].removeObjectItem(FIRECRACKER);
    }
    //Collect drone.
    if (terrainArray[x][y].isDrone()) {
        addScore(3);
        getplayer.addDrone(1);
        terrainArray[x][y].removeObjectItem(DRONE);
    }
    //Collect lightning.
    if (terrainArray[x][y].isLightning()) {
        addScore(3);
        getplayer.addLightning(1);
        terrainArray[x][y].removeObjectItem(LIGHTNING);
    }
    //Collect goggle.
    if (terrainArray[x][y].isGoggle()) {
        addScore(3);
        getplayer.addGoggle(1);
        terrainArray[x][y].removeObjectItem(GOGGLE);
    }

    if (terrainArray[x][y].isBag()) {
        addScore(BAG1.score);
        getplayer.stats.bag += 1;
        terrainArray[x][y].removeObject();
    }
    if (terrainArray[x][y].isDollar()) {
        addScore(BAG2.score);
        getplayer.stats.dollar += 1;
        terrainArray[x][y].removeObject();
    }
    if (terrainArray[x][y].isChest()) {
        addScore(BAG3.score);
        getplayer.stats.chest += 1;
        terrainArray[x][y].removeObject();
    }

    if (terrainArray[x][y].isPotion()) {
        addScore(3);
        getplayer.restoreEnergy(25);
        terrainArray[x][y].removeObject();
    }
    if (terrainArray[x][y].isPotionHP()) {
        addScore(3);
        getplayer.restoreHealth(20);
        terrainArray[x][y].removeObject();
    }
    if (isAtGoal(x, y)) {
        generateMap();
        getplayer.restoreEnergy(clamp(10 - Math.floor(currentStage / 3), 1, 10));
        getplayer.restoreHealth(clamp(5 - Math.floor(currentStage / 3), 0.5, 10));
        addScore(100);
        currentStage += 1;
    } else if (terrainArray[x][y].isPortal()) {
        //Move to the other portal.
        getplayer.x = terrainArray[x][y].portal.linkedPortal.x;
        getplayer.y = terrainArray[x][y].portal.linkedPortal.y;
        revealLocation(getplayer.x, getplayer.y);
        revealNeighbors(getplayer.x, getplayer.y, 1, (x, y) => {
            revealLocation(x, y);
        });
        getplayer.performCost(0.2);
    }

}
function interactObject(x, y) {
    if (interactX === x && interactY === y) {
        activateObject(interactX, interactY);
        interactX = -1;
        interactY = -1;
    }
    else {
        interactX = x;
        interactY = y;


    }
}

function update() {


    setTimeout(update, 10);
}
function draw() {
    //Request the browesr to draw the animation once again. This will only call once. To make it a infinite loop, we call the same function again.
    requestAnimationFrame(draw);

    fillRectangle(0, 0, getCanvas.width, getCanvas.height, "white");
    for (let y = 0; y < boardSize.height; y++) {
        for (let x = 0; x < boardSize.width; x++) {
            if (terrainArray[x][y].explore) {
                //Draw the plain old grass tile
                ctx.drawImage(grassImg,
                    32 * grassArray[x][y].x, 32 * grassArray[x][y].y, 32, 32, x * 32, y * 32, 32, 32,
                );

                //Show the rock object.
                if (terrainArray[x][y].isObstacle()) {

                    if (terrainArray[x][y].unbreakable === false) {

                        if (terrainArray[x][y].hasObstacle.hasOwnProperty("type")) {
                            if (terrainArray[x][y].hasObstacle.type === 0)
                                ctx.drawImage(img_rock, x * 32, y * 32, 32, 32);
                            else if (terrainArray[x][y].hasObstacle.type === 1)
                                ctx.drawImage(img_rock2, x * 32, y * 32, 32, 32);
                            else if (terrainArray[x][y].hasObstacle.type === 2)
                                ctx.drawImage(img_rock3, x * 32, y * 32, 32, 32);
                        }

                    }

                    else if (terrainArray[x][y].isWall())
                        ctx.drawImage(wallImg, x * 32, y * 32, 32, 32);
                    if (getplayer.ghost > 0) { //Reveal items on the inside if truesiht active
                        drawItems(x, y, 0.5);
                    }
                }
                else {
                    drawItems(x, y);
                }
                if (terrainArray[x][y].isEnemy()) {
                    if (terrainArray[x][y].getEnemy() === 1)
                        drawImage(x * 32, y * 32, 32, 32, img_enemy, 0);
                    if (terrainArray[x][y].getEnemy() === 2)
                        drawImage(x * 32, y * 32, 32, 32, img_enemy2, 0);
                    if (terrainArray[x][y].getEnemy() === 3)
                        drawImage(x * 32, y * 32, 32, 32, img_enemy3, 0);
                    if (terrainArray[x][y].getEnemy() === 4)
                        drawImage(x * 32, y * 32, 32, 32, img_enemy4, 0);
                    if (terrainArray[x][y].getEnemy() === 5)
                        drawImage(x * 32, y * 32, 32, 32, img_rat, 0);
                    if (terrainArray[x][y].getEnemy() === 6)
                        drawImage(x * 32, y * 32, 32, 32, img_frog, 0);
                    if (terrainArray[x][y].getEnemy() === 7)
                        drawImage(x * 32, y * 32, 32, 32, img_hawk, 0);
                }

                //Show the goal object
                if (terrainArray[x][y].isGoal === true) {
                    ctx.drawImage(flagImg, x * 32, y * 32, 32, 32,);
                }
                if (!getplayer.isNearPlayer(x,y)) {
                    fillRectangle(x * 32, y * 32, 32, 32, "white", 0.25);
                }
            }
            else { //Obscure the tile if not seen.
                fillRectangle(x * 32, y * 32, 32, 32, "#46C03F", 0.75);
            }
            //Add a interact area where the player could interact with the tile.
            if (interactX == x && interactY == y) {
                fillRectangle(x * 32, y * 32, 32, 32, "#CBCD32", 0.6);
            }
           
        }

    }

    getplayer.draw(ctx);
    //Check we have invisibility.
    if (window.getComputedStyle( document.getElementById("gameplayHUD")).visibility != "hidden") {
        drawGui();
    } 
    else {
        drawGui2();
    }

    drawGameOverHUD(240, 240, 400, 320);

}
function drawGui() {
      //Fill the background
      fillRectangle2(ctx2,0, 0, 800, 96, "lightgreen");
      //Draw stage
      drawText2(ctx2,0, 0, "Stage " + currentStage, "Arial", 24, "black");
      //Draw Energy
      fillRectangle2(ctx2,0, 32, clamp(getplayer.energy / getplayer.maxEnergy * 160, 0, 160), 32, "blue", 0.6);
      drawRectangle2(ctx2,0, 32, 160, 32);
      drawText2(ctx2,0, 32, "Energy " + pad(getplayer.energy) + "/" + getplayer.maxEnergy, "Arial Narrow", 16, "black");
      //Draw health bar
      fillRectangle2(ctx2,0, 64, clamp(getplayer.health / getplayer.maxHealth * 160, 0, 160), 32, "red", 0.6);
      drawRectangle2(ctx2,0, 64, 160, 32, "black");
      drawText2(ctx2,0, 64, "Health " + pad(getplayer.health) + "/" + getplayer.maxHealth, "Arial Narrow", 16, "black");
  
      if (getplayer.ghost > 0) {
          drawImage2(ctx2,420, 0,32,32,img_goggles,0);
           drawText2(ctx2,452, 0, getplayer.ghost + " turns", "Arial Narrow", 16, "black");
      }
      //Draw score
      drawText2(ctx2,160, 0, "Score: " + score.toLocaleString("en-US"), "DynaPuff", 24, "black");
      //Draw bomb count
      if (getplayer.bag.bomb > 0) {
          drawImage2(ctx2,160, 32, 32, 32, img_bomb, 0);
          drawText2(ctx2,192, 32, "x" + getplayer.bag.bomb.toLocaleString("en-US"), "DynaPuff", 18, "black");
      }
      //Draw firecracker
      if (getplayer.bag.firecracker > 0) {
          drawImage2(ctx2,224, 32, 32, 32, img_firecracker, 0);
          drawText2(ctx2,256, 32, "x" + getplayer.bag.firecracker.toLocaleString("en-US"), "DynaPuff", 18, "black");
      }
      //Draw drone
      if (getplayer.bag.drone > 0) {
          drawImage2(ctx2,288, 32, 32, 32, img_drone, 0);
          drawText2(ctx2,320, 32, "x" + getplayer.bag.drone.toLocaleString("en-US"), "DynaPuff", 18, "black");
      }
      //Draw lightning
      if (getplayer.bag.lightning > 0) {
          drawImage2(ctx2,352, 32, 32, 32, img_lightning, 0);
          drawText2(ctx2,384, 32, "x" + getplayer.bag.lightning.toLocaleString("en-US"), "DynaPuff", 18, "black");
      }
      //Draw goggles
      if (getplayer.bag.goggle > 0) {
          drawImage2(ctx2,416, 32, 32, 32, img_goggles, 0);
          drawText2(ctx2,448, 32, "x" + getplayer.bag.goggle.toLocaleString("en-US"), "DynaPuff", 18, "black");
      }
  
      if (castMode.hasOwnProperty('usingBomb')) {
        fillRectangle2(ctx2,160, 32, 64, 32, "yellow", 0.5);
        drawImage(castMode["usingBomb"].x * 32, castMode["usingBomb"].y * 32, 32, 32, img_bomb, 0, 0.4);
    }
    else if (castMode.hasOwnProperty('usingFirecracker')) {
        fillRectangle2(ctx2,224, 32, 64, 32, "yellow", 0.5);
        //Display firecracker direction
        if (castMode.usingFirecracker.direction === "vertical") {
            for (let i = 0; i < boardSize.height; i++) {
                drawImage(getplayer.x * 32, i * 32, 32, 32, img_firecracker, 0, 0.4);
            }


        } else if (castMode.usingFirecracker.direction === "horizontal") {
            for (let i = 0; i < boardSize.width; i++) {
                drawImage(i * 32, getplayer.y * 32, 32, 32, img_firecracker, 0, 0.4);
            }
        }
    }

    else if (castMode.hasOwnProperty('usingDrone')) {
        fillRectangle2(ctx2,288, 32, 64, 32, "yellow", 0.5);
        drawImage(castMode["usingDrone"].x * 32, castMode["usingDrone"].y * 32, 32, 32, img_drone, 0, 0.4);
    }
    else if (castMode.hasOwnProperty('usingLightning')) {
        fillRectangle2(ctx2,352, 32, 64, 32, "yellow", 0.5);
    }
    else if (castMode.hasOwnProperty('usingGoggle')) {
        fillRectangle2(ctx2,416, 32, 64, 32, "yellow", 0.5);
    }
}
function drawGui2() {
    //Fill the background
    fillRectangle2(ctx3, 0, 0, 192, 800, "lightgreen");
    //Draw stage
    drawText2(ctx3, 0, 0, "Stage " + currentStage, "Arial", 24, "black");
    //Draw Energy
    fillRectangle2(ctx3, 0, 32, clamp(getplayer.energy / getplayer.maxEnergy * 160, 0, 160), 32, "blue", 0.6);
    drawRectangle2(ctx3, 0, 32, 160, 32);
    drawText2(ctx3, 0, 32, "Energy " + pad(getplayer.energy) + "/" + getplayer.maxEnergy, "Arial Narrow", 16, "black");
    //Draw health bar
    fillRectangle2(ctx3,0, 64, clamp(getplayer.health / getplayer.maxHealth * 160, 0, 160), 32, "red", 0.6);
    drawRectangle2(ctx3,0, 64, 160, 32, "black");
    drawText2(ctx3,0, 64, "Health " + pad(getplayer.health) + "/" + getplayer.maxHealth, "Arial Narrow", 16, "black");

    if (getplayer.ghost > 0) {
        drawImage2(ctx3, 0, 96 ,32,32,img_goggles,0);
         drawText2(ctx3, 32, 96, getplayer.ghost + " turns", "Arial Narrow", 16, "black");
    }
    //Draw score
    drawText2(ctx3, 0, 128, "Score: " + score.toLocaleString("en-US"), "DynaPuff", 24, "black");
    //Draw bomb count
    if (getplayer.bag.bomb > 0) {
        drawImage2(ctx3, 0, 200, 32, 32, img_bomb, 0);
        drawText2(ctx3, 32, 200, "x" + getplayer.bag.bomb.toLocaleString("en-US"), "DynaPuff", 18, "black");
    }
    
    //Draw firecracker
    if (getplayer.bag.firecracker > 0) {
        drawImage2(ctx3, 64, 200, 32, 32, img_firecracker, 0);
        drawText2(ctx3, 96, 200, "x" + getplayer.bag.firecracker.toLocaleString("en-US"), "DynaPuff", 18, "black");
    }
    
    //Draw drone
    if (getplayer.bag.drone > 0) {
        drawImage2(ctx3,128, 200, 32, 32, img_drone, 0);
        drawText2(ctx3,160, 200, "x" + getplayer.bag.drone.toLocaleString("en-US"), "DynaPuff", 18, "black");
    }
    
    //Draw lightning
    if (getplayer.bag.lightning > 0) {
        drawImage2(ctx3,0, 232, 32, 32, img_lightning, 0);
        drawText2(ctx3,32, 232, "x" + getplayer.bag.lightning.toLocaleString("en-US"), "DynaPuff", 18, "black");
    }
    //Draw goggles
    if (getplayer.bag.goggle > 0) {
        drawImage2(ctx3,64, 232, 32, 32, img_goggles, 0);
        drawText2(ctx3, 96, 232, "x" + getplayer.bag.goggle.toLocaleString("en-US"), "DynaPuff", 18, "black");
    }

    if (castMode.hasOwnProperty('usingBomb')) {
        fillRectangle2(ctx3, 0, 200, 64, 32, "yellow", 0.5);
        drawImage(castMode["usingBomb"].x * 32, castMode["usingBomb"].y * 32, 32, 32, img_bomb, 0, 0.4);
    }
    else if (castMode.hasOwnProperty('usingFirecracker')) {
        fillRectangle2(ctx3, 64, 200, 64, 32, "yellow", 0.5);
        //Display firecracker direction
        if (castMode.usingFirecracker.direction === "vertical") {
            for (let i = 0; i < boardSize.height; i++) {
                drawImage(getplayer.x * 32, i * 32, 32, 32, img_firecracker, 0, 0.4);
            }


        } else if (castMode.usingFirecracker.direction === "horizontal") {
            for (let i = 0; i < boardSize.width; i++) {
                drawImage(i * 32, getplayer.y * 32, 32, 32, img_firecracker, 0, 0.4);
            }
        }
    }

    else if (castMode.hasOwnProperty('usingDrone')) {
        fillRectangle2(ctx3, 128, 200, 64, 32, "yellow", 0.5);
        drawImage(castMode["usingDrone"].x * 32, castMode["usingDrone"].y * 32, 32, 32, img_drone, 0, 0.4);
    }
    else if (castMode.hasOwnProperty('usingLightning')) {
        fillRectangle2(ctx3,0, 232, 64, 32, "yellow", 0.5);
    }
    else if (castMode.hasOwnProperty('usingGoggle')) {
        fillRectangle2(ctx3,64, 232, 64, 32, "yellow", 0.5);
    }
}
function drawItems(x, y, opacity = 1.0) {
    if (terrainArray[x][y].directional.enabled === true) {
        if (terrainArray[x][y].directional.typeOfDirection === 0) { //Horizontal direction
            if (x > goalPoint.x) { //Right
                drawImage(x * 32, y * 32, 32, 32, directionImg, 180, opacity);
            }
            else if (x < goalPoint.x) { //Left
                drawImage(x * 32, y * 32, 32, 32, directionImg, 0, opacity);
            }
        }
        else if (terrainArray[x][y].directional.typeOfDirection === 1) { //Vertical
            if (y > goalPoint.y) {
                drawImage(x * 32, y * 32, 32, 32, directionImg, 270, opacity);
            } else if (y < goalPoint.y) {
                drawImage(x * 32, y * 32, 32, 32, directionImg, 90, opacity);
            }
        }
    }
    if (terrainArray[x][y].isBag()) {

        drawImage(x * 32, y * 32, 32, 32, bagImg, 0, opacity);
    }
    else if (terrainArray[x][y].isChest()) {
        drawImage(x * 32, y * 32, 32, 32, img_treasureChest, 0, opacity);
    }
    else if (terrainArray[x][y].isDollar()) {
        drawImage(x * 32, y * 32, 32, 32, img_dollar, 0, opacity);
    }
    if (terrainArray[x][y].isPotion()) {
        drawImage(x * 32, y * 32, 32, 32, img_potion, 0, opacity);
    }
    if (terrainArray[x][y].isPotionHP()) {
        drawImage(x * 32, y * 32, 32, 32, img_potion_hp, 0, opacity);
    }
    if (terrainArray[x][y].isBomb()) {
        drawImage(x * 32, y * 32, 32, 32, img_bomb, 0, opacity);
    }
    if (terrainArray[x][y].isFirecracker()) {
        drawImage(x * 32, y * 32, 32, 32, img_firecracker, 0, opacity);
    }
    if (terrainArray[x][y].isDrone()) {
        drawImage(x * 32, y * 32, 32, 32, img_drone, 0, opacity);
    }
    if (terrainArray[x][y].isLightning()) {
        drawImage(x * 32, y * 32, 32, 32, img_lightning, 0, opacity);
    }
    if (terrainArray[x][y].isGoggle()) {
        drawImage(x * 32, y * 32, 32, 32, img_goggles, 0, opacity);
    }
    if (terrainArray[x][y].isHazard()) {
        if (terrainArray[x][y].getHazard() === 1)
            drawImage(x * 32, y * 32, 32, 32, img_spikes, 0, opacity);
        if (terrainArray[x][y].getHazard() === 2)
            drawImage(x * 32, y * 32, 32, 32, img_chainSaw, 0, opacity);
            if (terrainArray[x][y].getHazard() === 3)
            drawImage(x * 32, y * 32, 32, 32, img_fire, 0, opacity);
        if (terrainArray[x][y].getHazard() === 4)
            drawImage(x * 32, y * 32, 32, 32, img_acid, 0, opacity);
    }

    if (terrainArray[x][y].isPortal()) {
        if (terrainArray[x][y].portal.id == 0)
            drawImage(x * 32, y * 32, 32, 32, img_portal, 0, opacity);
        else if (terrainArray[x][y].portal.id == 1)
            drawImage(x * 32, y * 32, 32, 32, img_portal2, 0, opacity);
        else if (terrainArray[x][y].portal.id == 2)
            drawImage(x * 32, y * 32, 32, 32, img_portal3, 0, opacity);
    }
}
function revealNeighbors(startX, startY, range, func) {
    for (let x = -range; x <= range; x++) {
        for (let y = -range; y <= range; y++) {
            //Reveal all items at location
            if (startX + x >= 0 && startX + x <= boardSize.width - 1 && startY + y >= 0 && startY + y <= boardSize.height - 1)
                func(startX + x, startY + y);
        }
    }
}
function postMove() {
    interactX = -1;
    interactY = -1;
    revealNearby();
    if (getplayer.ghost > 0) {
        getplayer.ghost--;
    }
    else {
        //Hurt the player is they are on top of a hazard. But not when they are given truesight!
        if (terrainArray[getplayer.x][getplayer.y].isHazard()) {
            //Spikes
            if (terrainArray[getplayer.x][getplayer.y].getHazard() === 1) {
                getplayer.reduceHealth(SPIKE.health);
                terrainArray[getplayer.x][getplayer.y].removeHazard();
                //Chainsaw
            } else if (terrainArray[getplayer.x][getplayer.y].getHazard() === 2) {
                getplayer.reduceHealth(CHAINSAW.health);
            }
            //Fire
            else if (terrainArray[getplayer.x][getplayer.y].getHazard() === 3) {
                getplayer.reduceHealth(FIRE.health);
                getplayer.performCost(FIRE.energy);
            }
            //Acid
            else if (terrainArray[getplayer.x][getplayer.y].getHazard() === 4) {
                getplayer.performCost(ACID.energy);
            }
        }
    }
    //Perform movement on each enemy.
    const data = [].concat(...terrainArray).filter(c => c.isEnemy()).forEach(c => {

        c.enemy.turns--;
        //Move
        if (c.enemy.turns <= 0) {
            let getE = c.enemy;
            let choose = [[0, 0], [0, 1], [1, 0], [0, -1], [-1, 0]];
            while (choose.length > 0) {
                let behavior = randomInteger(0, choose.length);
                //enemy moves at a different location.
                if (getE.x + choose[behavior][0] > 0 && getE.x + choose[behavior][0] < boardSize.width - 1 && getE.y + choose[behavior][1] > 0 && getE.y + choose[behavior][1] < boardSize.height - 1) {
                    if (isNothingAhead(getE.x + choose[behavior][0], getE.y + choose[behavior][1]) || getE.id == 7) {
                        getE.x += choose[behavior][0];
                        getE.y += choose[behavior][1];
                        let id = getE.id;
                        c.removeEnemy();

                        terrainArray[getE.x][getE.y].assignExistEnemy(getE, id);
                        break;
                    }
                    else {
                        choose.splice(behavior, 1);
                    }
                }
                else {
                    choose.splice(behavior, 1);
                }
            }

        }
        //Attack the player
        if (getplayer.ghost <= 0 && getplayer.isNearPlayer(c.enemy.x, c.enemy.y)) {

            if (c.enemy.id == 1) {//Slime
                getplayer.reduceHealth(SLIME.health);
            }
            if (c.enemy.id == 2) { //Bat
                getplayer.reduceHealth(BAT.health);
            }
            if (c.enemy.id == 3) { //Snake
                getplayer.reduceHealth(SNAKE.health);
            }
            if (c.enemy.id == 4) { //wolf
                getplayer.reduceHealth(WOLF.health);
            }
            if (c.enemy.id == 5) { //Rat
                getplayer.reduceHealth(RAT.health);
            }
            if (c.enemy.id == 6) { //Frog
                getplayer.reduceHealth(FROG.health);
            }
            if (c.enemy.id == 7) { //Hawk
                getplayer.reduceHealth(HAWK.health);
            }
        }
    });

}
function moveUp() {
    if (getplayer.y > 0) {
        if (isNothingAhead(getplayer.x, getplayer.y - 1) || (isThingAhead(getplayer.x, getplayer.y - 1) && getplayer.ghost > 0)) {
            getplayer.movePlayer(0, -1);
            postMove();
        } else {
            interactObject(getplayer.x, getplayer.y - 1);
        }

    }
}
function moveDown() {
    if (getplayer.y < boardSize.height - 1) {
        if (isNothingAhead(getplayer.x, getplayer.y + 1) || (isThingAhead(getplayer.x, getplayer.y + 1) && getplayer.ghost > 0)) {
            getplayer.movePlayer(0, 1);
            postMove();
        } else {
            interactObject(getplayer.x, getplayer.y + 1);
        }
    }
}
function moveLeft() {
    if (getplayer.x > 0) {
        if (isNothingAhead(getplayer.x - 1, getplayer.y) || (isThingAhead(getplayer.x - 1, getplayer.y) && getplayer.ghost > 0)) {
            getplayer.movePlayer(-1, 0);
            postMove();
        } else {
            interactObject(getplayer.x - 1, getplayer.y);
        }
    }
}
function moveRight() {
    if (getplayer.x < boardSize.width - 1) {
        if (isNothingAhead(getplayer.x + 1, getplayer.y) || (isThingAhead(getplayer.x + 1, getplayer.y) && getplayer.ghost > 0)) {
            getplayer.movePlayer(1, 0);
            postMove();
        } else {
            interactObject(getplayer.x + 1, getplayer.y);
        }
    }
}
function activateBomb() {
    if (castMode["usingBomb"].x > 0 && castMode["usingBomb"].x < boardSize.width - 1 && castMode["usingBomb"].y > 0 && castMode["usingBomb"].y < boardSize.height - 1) {
        if (terrainArray[castMode["usingBomb"].x][castMode["usingBomb"].y].isRevealed()) {
            revealNeighbors(castMode["usingBomb"].x, castMode["usingBomb"].y, 2,
                (x, y) => {
                    destroyObstacles(x, y, false);
                    terrainArray[x][y].removeEnemy();
                    revealLocation(x, y);
                    terrainArray[x][y].removeHazard();
                });
            delete castMode.usingBomb;
            getplayer.bag.bomb -= 1;
        }
    }
}
//Drone lets us reveal a 3x3 area (with no restrictions).
function activateDrone() {

    if (castMode["usingDrone"].x > 0 && castMode["usingDrone"].x < boardSize.width - 1 && castMode["usingDrone"].y > 0 && castMode["usingDrone"].y < boardSize.height - 1) {
        revealNeighbors(castMode["usingDrone"].x, castMode["usingDrone"].y, 1,
            (x, y) => {
                revealLocation(x, y);
            });
        delete castMode.usingDrone;
        getplayer.bag.drone -= 1;

    }
}
function activateFirecracker() {
    if (castMode["usingFirecracker"].direction === "horizontal") {
        for (let i = 0; i < boardSize.width; i++) {
            destroyObstacles(i, getplayer.y, false);
            revealLocation(i, getplayer.y);
            terrainArray[i][getplayer.y].removeEnemy();
            terrainArray[i][getplayer.y].removeHazard()
        }
        delete castMode.usingFirecracker;
        getplayer.bag.firecracker -= 1;

    }
    else if (castMode["usingFirecracker"].direction === "vertical") {
        for (let i = 0; i < boardSize.height; i++) {

            destroyObstacles(getplayer.x, i, false);
            revealLocation(getplayer.x, i);
            terrainArray[getplayer.x][i].removeEnemy();
            terrainArray[getplayer.x][i].removeHazard()
        }
        delete castMode.usingFirecracker;
        getplayer.bag.firecracker -= 1;

    }
}
function activateLightning(maxCount = 20) {
    if (castMode["usingLightning"].x > 0 && castMode["usingLightning"].x < boardSize.width - 1 && castMode["usingLightning"].y > 0 && castMode["usingLightning"].y < boardSize.height - 1) {
        if (castMode.hasOwnProperty("usingLightning") === true) {
            const data = [].concat(...terrainArray).filter(c => c.explore === false || c.isHazard() || c.isEnemy()).sort(() => 0.5 - Math.random()).slice(0, maxCount);
            for (let i = 0; i < data.length; i++) {
                data[i].explore = true;
                data[i].removeEnemy();
                data[i].removeHazard();
            }
        }
        delete castMode.usingLightning;
        getplayer.bag.lightning -= 1;
    }
}
function activateGoggles() {
    if (castMode["usingGoggle"].x > 0 && castMode["usingGoggle"].x < boardSize.width - 1 && castMode["usingGoggle"].y > 0 && castMode["usingGoggle"].y < boardSize.height - 1) {
        if (castMode.hasOwnProperty("usingGoggle") === true) {
            getplayer.ghost = 50;
        }
        delete castMode.usingGoggle;
        getplayer.bag.goggle -= 1;
    }
}
function keyPressed(key) {
    if (getplayer.isAlive() === true) {
        if (key == "Q" || key == "q") {
            if (getplayer.bag.bomb > 0)
                castMode["usingBomb"] = { x: getplayer.x, y: getplayer.y };
        }
        if (key == "W" || key == "w") {
            if (getplayer.bag.firecracker > 0)
                castMode["usingFirecracker"] = { direction: "vertical" };
        }
        if (key == "E" || key == "e") {
            if (getplayer.bag.drone > 0)
                castMode["usingDrone"] = { x: getplayer.x, y: getplayer.y };
        }
        if (key == "R" || key == "r") {
            if (getplayer.bag.lightning > 0)
                castMode["usingLightning"] = { x: getplayer.x, y: getplayer.y };
        }
        if (key == "T" || key == "t") {
            if (getplayer.bag.goggle > 0)
                castMode["usingGoggle"] = { x: getplayer.x, y: getplayer.y };
        }
        if (castMode.hasOwnProperty('usingBomb') == false && castMode.hasOwnProperty('usingFirecracker') == false &&
            castMode.hasOwnProperty('usingDrone') == false && castMode.hasOwnProperty('usingLightning') == false && castMode.hasOwnProperty('usingGoggle') == false) {
            if (key == "ArrowUp") {
                moveUp();
            } else if (key == "ArrowDown") {
                moveDown();
            }
            else if (key == "ArrowLeft") {
                moveLeft();
            }
            else if (key == "ArrowRight") {
                moveRight();
            }
        }
        else if (castMode.hasOwnProperty('usingBomb') == true) {
            if (key == "ArrowUp") {
                if (castMode["usingBomb"].y > 0)
                    castMode["usingBomb"].y -= 1;

            } else if (key == "ArrowDown") {
                if (castMode["usingBomb"].y < boardSize.height - 1)
                    castMode["usingBomb"].y += 1;
            }
            else if (key == "ArrowLeft") {
                if (castMode["usingBomb"].x > 0)
                    castMode["usingBomb"].x -= 1;
            }
            else if (key == "ArrowRight") {
                if (castMode["usingBomb"].x < boardSize.width - 1)
                    castMode["usingBomb"].x += 1;
            }
            else if (key == "Enter") {
                //Explode in a 5x5 radius.
                activateBomb();
            } else if (key == "Escape") {
                delete castMode.usingBomb;
            }
        }
        else if (castMode.hasOwnProperty('usingFirecracker') == true) {
            if (key == "ArrowUp" || key == "ArrowDown") {

                castMode["usingFirecracker"].direction = "vertical";
            }
            else if (key == "ArrowLeft" || key == "ArrowRight") {
                castMode["usingFirecracker"].direction = "horizontal";
            }
            else if (key == "Enter") {
                //Explode in a 5x5 radius.
                activateFirecracker();
            }
            else if (key == "Escape") {
                delete castMode.usingFirecracker;
            }
        }
        else if (castMode.hasOwnProperty('usingDrone') == true) {
            if (key == "ArrowUp") {
                if (castMode["usingDrone"].y > 0)
                    castMode["usingDrone"].y -= 1;

            } else if (key == "ArrowDown") {
                if (castMode["usingDrone"].y < boardSize.height - 1)
                    castMode["usingDrone"].y += 1;
            }
            else if (key == "ArrowLeft") {
                if (castMode["usingDrone"].x > 0)
                    castMode["usingDrone"].x -= 1;
            }
            else if (key == "ArrowRight") {
                if (castMode["usingDrone"].x < boardSize.width - 1)
                    castMode["usingDrone"].x += 1;
            }
            else if (key == "Enter") {
                //Explode in a 5x5 radius.
                activateDrone();
            } else if (key == "Escape") {
                delete castMode.usingDrone
            }
        }
        else if (castMode.hasOwnProperty('usingLightning') == true) {

            if (key == "Enter") {
                //Explode in a 5x5 radius.
                activateLightning();
            } else if (key == "Escape") {
                delete castMode.usingLightning
            }
        }
        else if (castMode.hasOwnProperty('usingGoggle') == true) {

            if (key == "Enter") {
                //Explode in a 5x5 radius.
                activateGoggles();
            } else if (key == "Escape") {
                delete castMode.usingGoggle;
            }
        }
        if (key == "p" || key == "P") {
            currentStage = 1;
            generateMap();

            score = 0;
            getplayer.reset();
        }
    }
}
const getMousePos = (canvas, evt) => {
    const rect = canvas.getBoundingClientRect();
    return {
        x: ((evt.clientX - rect.left) / (rect.right - rect.left)) * canvas.width,
        y: ((evt.clientY - rect.top) / (rect.bottom - rect.top)) * canvas.height,
    };
};

function leftClickEvent() {

    if (getplayer.isAlive() === false) {

        if (mousePos.x >= replay_button.x && mousePos.x <= replay_button.x + replay_button.width && mousePos.y >= replay_button.y && mousePos.y <= replay_button.y + replay_button.height) {
            generateMap();
            currentStage = 1;
            score = 0;
            getplayer.reset();
        }
    } else {
        if (castMode.hasOwnProperty('usingBomb') == false && castMode.hasOwnProperty('usingFirecracker') == false && castMode.hasOwnProperty('usingLightning') == false && castMode.hasOwnProperty('usingGoggle') == false && castMode.hasOwnProperty('usingDrone') == false) {
            let tileX = Math.floor(mousePos.x / 32);
            let tileY = Math.floor(mousePos.y / 32);

            if (getplayer.x - tileX == 1 && getplayer.y - tileY == 0) { //Move Left
                moveLeft();
            }
            else if (getplayer.x - tileX == -1 && getplayer.y - tileY == 0) { //Move Right
                moveRight();
            }
            else if (getplayer.y - tileY == 1 && getplayer.x - tileX == 0) { //Move Up
                moveUp();
            }
            else if (getplayer.y - tileY == -1 && getplayer.x - tileX == 0) { //Move Down
                moveDown();
            }

        } else if (castMode.hasOwnProperty('usingBomb') == true) {
            castMode["usingBomb"] = { x: Math.floor(mousePos.x / 32), y: Math.floor(mousePos.y / 32) };
            activateBomb();
        } else if (castMode.hasOwnProperty('usingFirecracker') == true) {
            let touch = { x: Math.floor(mousePos.x / 32), y: Math.floor(mousePos.y / 32) };
            if (touch.x === getplayer.x && touch.y != getplayer.y) {
                castMode["usingFirecracker"] = { direction: "vertical" };

            } else if (touch.y === getplayer.y && touch.x != getplayer.x) {

                castMode["usingFirecracker"] = { direction: "horizontal" };
            } else {
                castMode["usingFirecracker"] = { direction: "none" };
            }
            activateFirecracker();
        }
        else if (castMode.hasOwnProperty('usingDrone') == true) {
            castMode["usingDrone"] = { x: Math.floor(mousePos.x / 32), y: Math.floor(mousePos.y / 32) };
            activateDrone();
        }
        else if (castMode.hasOwnProperty('usingLightning') == true) {
            castMode["usingLightning"] = { x: Math.floor(mousePos.x / 32), y: Math.floor(mousePos.y / 32) };
            activateLightning();
        }
        else if (castMode.hasOwnProperty('usingGoggle') == true) {
            castMode["usingGoggle"] = { x: Math.floor(mousePos.x / 32), y: Math.floor(mousePos.y / 32) };
            activateGoggles();
        }
        
        //Draw lightning
        if (getplayer.bag.lightning > 0) {
            drawImage2(ctx3,0, 232, 32, 32, img_lightning, 0);
            drawText2(ctx3,32, 232, "x" + getplayer.bag.lightning.toLocaleString("en-US"), "DynaPuff", 18, "black");
        }
        //Draw goggles
        if (getplayer.bag.goggle > 0) {
            drawImage2(ctx3,64, 232, 32, 32, img_goggles, 0);
            drawText2(ctx3, 96, 232, "x" + getplayer.bag.goggle.toLocaleString("en-US"), "DynaPuff", 18, "black");
        }

        let r =  window.getComputedStyle( document.getElementById("gameplayHUD")).visibility != "hidden" ? { x: 160, y: 32, width: 64, height: 32 } : {  x: 0, y:200, width: 64, height: 32};

        if (mousePos2.x >= r.x && mousePos2.x <= r.x + r.width && mousePos2.y >= r.y && mousePos2.y <= r.y + r.height) {
            if (castMode.hasOwnProperty('usingBomb') == false && castMode.hasOwnProperty('usingFirecracker') == false && castMode.hasOwnProperty('usingLightning') == false && castMode.hasOwnProperty('usingGoggle') == false && castMode.hasOwnProperty('usingDrone') == false) {
                if (getplayer.bag.bomb > 0)
                    castMode["usingBomb"] = { x: getplayer.x, y: getplayer.y };
            } else {
                delete castMode.usingBomb;
            }
        }
        r = window.getComputedStyle( document.getElementById("gameplayHUD")).visibility != "hidden" ?  { x: 224, y: 32, width: 64, height: 32 } : {  x: 64, y:200, width: 64, height: 32};
        if (mousePos2.x >= r.x && mousePos2.x <= r.x + r.width && mousePos2.y >= r.y && mousePos2.y <= r.y + r.height) {
            if (castMode.hasOwnProperty('usingBomb') == false && castMode.hasOwnProperty('usingFirecracker') == false && castMode.hasOwnProperty('usingLightning') == false && castMode.hasOwnProperty('usingGoggle') == false && castMode.hasOwnProperty('usingDrone') == false) {
                if (getplayer.bag.firecracker > 0)
                    castMode["usingFirecracker"] = { direction: "vertical" };
            } else {
                delete castMode.usingFirecracker;
            }
        }
        r =  window.getComputedStyle( document.getElementById("gameplayHUD")).visibility != "hidden" ?{ x: 288, y: 32, width: 64, height: 32 }: {  x: 128, y:200, width: 64, height: 32};
        if (mousePos2.x >= r.x && mousePos2.x <= r.x + r.width && mousePos2.y >= r.y && mousePos2.y <= r.y + r.height) {
            if (castMode.hasOwnProperty('usingBomb') == false && castMode.hasOwnProperty('usingFirecracker') == false && castMode.hasOwnProperty('usingLightning') == false && castMode.hasOwnProperty('usingGoggle') == false && castMode.hasOwnProperty('usingDrone') == false) {
                if (getplayer.bag.drone > 0)
                    castMode["usingDrone"] = { x: getplayer.x, y: getplayer.y };
            } else {
                delete castMode.usingDrone;
            }
        }
        r = window.getComputedStyle( document.getElementById("gameplayHUD")).visibility != "hidden" ?{ x: 352, y: 32, width: 64, height: 32 }: {  x: 0, y:232, width: 64, height: 32};
        if (mousePos2.x >= r.x && mousePos2.x <= r.x + r.width && mousePos2.y >= r.y && mousePos2.y <= r.y + r.height) {
            if (castMode.hasOwnProperty('usingBomb') == false && castMode.hasOwnProperty('usingFirecracker') == false && castMode.hasOwnProperty('usingLightning') == false && castMode.hasOwnProperty('usingGoggle') == false && castMode.hasOwnProperty('usingDrone') == false) {
                if (getplayer.bag.lightning > 0)
                    castMode["usingLightning"] = { x: getplayer.x, y: getplayer.y };
            } else {
                delete castMode.usingLightning;
            }
        }
        r =  window.getComputedStyle( document.getElementById("gameplayHUD")).visibility != "hidden" ?{ x: 352, y: 32, width: 64, height: 32 }:  { x: 64, y: 232, width: 64, height: 32 };
        if (mousePos2.x >= r.x && mousePos2.x <= r.x + r.width && mousePos2.y >= r.y && mousePos2.y <= r.y + r.height) {
            if (castMode.hasOwnProperty('usingBomb') == false && castMode.hasOwnProperty('usingFirecracker') == false && castMode.hasOwnProperty('usingLightning') == false && castMode.hasOwnProperty('usingGoggle') == false && castMode.hasOwnProperty('usingDrone') == false) {
                if (getplayer.bag.goggle > 0)
                    castMode["usingGoggle"] = { x: getplayer.x, y: getplayer.y };
            } else {
                delete castMode.usingGoggle
            }
        }

    }
}
//Keyboard Input
document.addEventListener('keydown', function (event) {
    if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(event.code) > -1) {
        event.preventDefault();
    }
    if (!keyState[event.key]) {
        keyState[event.key] = true;
        keyPressed(event.key);
    }
});

document.addEventListener('keyup', function (event) {
    keyState[event.key] = false;
});
document.addEventListener('mousemove', function (event) {
    page.x = event.pageX;
    page.y = event.pageY;
    client.x = event.clientX;
    client.y = event.clientY;
    mousePos = getMousePos(getCanvas, event);
    mousePos2 = getMousePos( window.getComputedStyle( document.getElementById("gameplayHUD")).visibility != "hidden" ? getCanvas2 : getCanvas3, event);
});
function Input(event) {
    mousePos = getMousePos(getCanvas, event);
    mousePos2 = getMousePos( window.getComputedStyle( document.getElementById("gameplayHUD")).visibility != "hidden" ? getCanvas2 : getCanvas3, event);
    if (event.button == 0) {
        leftClickEvent();
    }
}


//Starting point of code execution
document.addEventListener('click', Input);
//for 'touch' users
document.addEventListener('touchstart', Input);

setup();
generateMap();
update();
draw();
