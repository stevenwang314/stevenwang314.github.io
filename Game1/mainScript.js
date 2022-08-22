let getCanvas = document.getElementById("gameplay");
let grassImg = document.getElementById("grass");
let playerImg = document.getElementById("player");
let img_playerCry = document.getElementById("playerCry");
let rockImg = document.getElementById("rock");
let flagImg = document.getElementById("flag");
let wallImg = document.getElementById("wall");
let bagImg = document.getElementById("bag");
let directionImg = document.getElementById("arrow");
let img_potion = document.getElementById("potionEnergy");
let img_treasureChest = document.getElementById("chest");
let img_bomb = document.getElementById("bomb");
let img_spikes = document.getElementById("spikes");
var ctx = getCanvas.getContext("2d");

let interactX = -1;
let interactY = -1;
let keyState = {};
let grassArray = [];
let terrainArray = [];
let goalPoint = { x: 0, y: 0 };
let page = { x: 0, y: 0 };
let client = { x: 0, y: 0 };
let mousePos = { x: 0, y: 0 };
let score = 0;
let replay_button = { x: 400, y: 496, width: 160, height: 64 };
let getplayer = new player(playerImg);
let castMode = {};
var isBuilding = true;
var currentStage = 1;
const boardSize = { width: 25, height: 25 };
const obstacleAmount = boardSize.width * boardSize.height * 0.25;
const uiWidth = 160;
const navigationChance = 10;
const wallChance = 20;
const bagChance = 5;
const chestChance = 0.2;
const potionChance = 1;
const bombChance = 1.5;
const spikeChance = 1;
function setup() {
    getCanvas.width = boardSize.width * 32 + uiWidth;
    getCanvas.height = boardSize.height * 32;
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
            data.push(new terrainCell());
        }
        terrainArray.push(data);
    }
    let maxAmount = clamp(obstacleAmount + boardSize.width * boardSize.height * 0.01 * (currentStage - 1), 0, boardSize.width * boardSize.height * 0.75);
    for (let i = 0; i < (maxAmount < boardSize.width * boardSize.height - 1 ? maxAmount : boardSize.width * boardSize.height - 1); i++) {
        let terrainPosition = { x: randomInteger(0, boardSize.width), y: randomInteger(0, boardSize.height) };
        //Check if that rock doesn't exist.
        if (terrainArray[terrainPosition.x][terrainPosition.y].hasObstacle === false && (getplayer.x != terrainPosition.x || getplayer.y != terrainPosition.y)) {
            terrainArray[terrainPosition.x][terrainPosition.y].hasObstacle = true;
            if (randomDecimal(0, 100) < wallChance) {
                terrainArray[terrainPosition.x][terrainPosition.y].unbreakable = true;
            }
        } else {
            i--;
        }
    }
    let decay = 0;
    let decay2 = 0;
    for (let i = 0; i < boardSize.width; i++) {
        for (let j = 0; j < boardSize.height; j++) {
            //Ignore if the starting position is the player's position.
            if (getplayer.x == i && getplayer.y == j) {
                continue;
            }
            if (!terrainArray[i][j].unbreakable) {
                if (randomDecimal(0, 100) < (clamp(potionChance / (1 + 0.1 * (currentStage - 1))), 0.2, potionChance) / (1 + decay * 0.35)) {
                    terrainArray[i][j].assignPotion();
                    decay++;
                }
                if (randomDecimal(0, 100) < (clamp(bombChance / (1 + 0.1 * (currentStage - 1))), 0.2, bombChance) / (1 + decay2 * 0.35)) {
                    terrainArray[i][j].assignBomb();
                    decay2++;
                }
                if (randomDecimal(0, 100) < chestChance) {
                    terrainArray[i][j].assignChest();
                }
                else if (randomDecimal(0, 100) < bagChance) {
                    terrainArray[i][j].assignBag();
                }
                if (currentStage > 3) {
                    if (randomDecimal(0, 100) < (clamp(spikeChance * (1 + 0.25 * (Math.max(currentStage - 3, 0) / 2))), spikeChance, 10)) {
                        terrainArray[i][j].assignSpikes();
                    }
                }
            }
            /*else { //Higher chance if behind a rock.
                if (randomInteger(0,100) < bagChance * 2) {
                    terrainArray[i][j].assignBag();
                }
            }*/
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
        if (!isWall(x, y) && !isAtGoal(x, y) && randomDecimal(0, 100) < clamp(navigationChance / (1 + 0.2 * (currentStage - 1)), 0.005, navigationChance)) {
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

function interactObject(x, y) {
    if (interactX === x && interactY === y) {
        //Destroy rocks but not brick walls.
        if (terrainArray[interactX][interactY].hasObstacle === true && terrainArray[interactX][interactY].unbreakable === false) {
            terrainArray[interactX][interactY].hasObstacle = false;
            getplayer.performCost(1);
            addScore(5);
        }
        else if (terrainArray[interactX][interactY].isBag()) {
            addScore(10);
            terrainArray[interactX][interactY].removeObject();
        }
        else if (terrainArray[interactX][interactY].isChest()) {
            addScore(100);
            terrainArray[interactX][interactY].removeObject();
        }
        else if (terrainArray[interactX][interactY].isPotion()) {
            addScore(3);
            getplayer.restoreEnergy(10);
            terrainArray[interactX][interactY].removeObject();
        }
        else if (terrainArray[interactX][interactY].isBomb()) {
            addScore(3);
            getplayer.addBomb(1);
            terrainArray[interactX][interactY].removeObject();
        }
        else if (isAtGoal(interactX, interactY)) {
            generateMap();
            getplayer.restoreEnergy(clamp(10 - Math.floor(currentStage / 3) * 0.5, 1, 10));
            addScore(100);
            currentStage += 1;
        }
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
                if (terrainArray[x][y].hasObstacle === true) {
                    if (terrainArray[x][y].unbreakable === false)
                        ctx.drawImage(rockImg, x * 32, y * 32, 32, 32);
                    else
                        ctx.drawImage(wallImg, x * 32, y * 32, 32, 32);
                }
                else {
                    if (terrainArray[x][y].directional.enabled === true) {
                        if (terrainArray[x][y].directional.typeOfDirection === 0) { //Horizontal direction
                            if (x > goalPoint.x) { //Right
                                drawImage(x * 32, y * 32, 32, 32, directionImg, 180);
                            }
                            else if (x < goalPoint.x) { //Left
                                drawImage(x * 32, y * 32, 32, 32, directionImg, 0);
                            }
                        }
                        else if (terrainArray[x][y].directional.typeOfDirection === 1) { //Vertical
                            if (y > goalPoint.y) {
                                drawImage(x * 32, y * 32, 32, 32, directionImg, 270);
                            } else if (y < goalPoint.y) {
                                drawImage(x * 32, y * 32, 32, 32, directionImg, 90);
                            }
                        }
                    }
                    if (terrainArray[x][y].isBag()) {
                        drawImage(x * 32, y * 32, 32, 32, bagImg, 0);
                    }
                    if (terrainArray[x][y].isChest()) {
                        drawImage(x * 32, y * 32, 32, 32, img_treasureChest, 0);
                    }
                    if (terrainArray[x][y].isPotion()) {
                        drawImage(x * 32, y * 32, 32, 32, img_potion, 0);
                    }
                    if (terrainArray[x][y].isBomb()) {
                        drawImage(x * 32, y * 32, 32, 32, img_bomb, 0);
                    }
                    if (terrainArray[x][y].isSpike()) {
                        drawImage(x * 32, y * 32, 32, 32, img_spikes, 0);
                    }
                }
                //Show the goal object
                if (terrainArray[x][y].isGoal === true) {
                    ctx.drawImage(flagImg, x * 32, y * 32, 32, 32,);
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

    fillRectangle(boardSize.width * 32, 0, uiWidth, boardSize.height * 32, "lightgreen");
    drawText(boardSize.width * 32, 0, "Stage " + currentStage, "Arial", 32, "black");

    fillRectangle(boardSize.width * 32, 64, clamp(getplayer.energy / getplayer.maxEnergy * uiWidth, 0, uiWidth), 32, "yellow");
    drawRectangle(boardSize.width * 32, 64, uiWidth, 32);
    drawText(boardSize.width * 32, 64, "Energy " + pad(getplayer.energy) + "/" + getplayer.maxEnergy, "Arial Narrow", 16, "black");

    fillRectangle(boardSize.width * 32, 96, clamp(getplayer.health / getplayer.maxHealth * uiWidth, 0, uiWidth), 32, "red");
    drawRectangle(boardSize.width * 32, 96, uiWidth, 32, "black");
    drawText(boardSize.width * 32, 96, "Health " + pad(getplayer.health) + "/" + getplayer.maxHealth, "Arial Narrow", 16, "black");

    drawText(boardSize.width * 32, 160, "Score: " + score.toLocaleString("en-US"), "Trebuchet", 16, "black");
    drawText(boardSize.width * 32, 224, "Bombs: " + getplayer.bag.bomb.toLocaleString("en-US"), "Trebuchet", 24, "black");

    if (castMode.hasOwnProperty('usingBomb')) {
        drawText(boardSize.width * 32, 32 * boardSize.height - 32, "Choose Bomb Location", "Trebuchet", 12, "black");
        drawImage(castMode["usingBomb"].x * 32, castMode["usingBomb"].y * 32, 32, 32, img_bomb, 0, 0.4);
    }

    if (getplayer.isAlive() === false) {
        fillRectangle(240, 240, 400, 320, "orange", 0.5);
        drawText(240, 240, "Game Over", "Verdana", 36, "black");
        drawText(240, 304, "Stage: " + currentStage, "Verdana", 24, "black");
        drawText(240, 336, "Score: " + score, "Verdana", 24, "black");

        fillRectangle(400, 496, 160, 64, "red", 0.5);
        drawRectangle(400, 496, 160, 64, "black", 2);
        drawText(400, 496, "Play Again!", "Verdana", 24, "black");
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
function moveUp() {
    if (getplayer.y > 0) {
        if (isNothingAhead(getplayer.x, getplayer.y - 1)) {
            getplayer.movePlayer(0, -1);
            interactX = -1;
            interactY = -1;
            revealNearby();
            if (terrainArray[getplayer.x][getplayer.y].isSpike()) {
                getplayer.health -= 3;
                terrainArray[getplayer.x][getplayer.y].removeHazard();
            }
        } else {
            interactObject(getplayer.x, getplayer.y - 1);
        }

    }
}
function moveDown() {
    if (getplayer.y < boardSize.height - 1) {
        if (isNothingAhead(getplayer.x, getplayer.y + 1)) {
            getplayer.movePlayer(0, 1);
            interactX = -1;
            interactY = -1;
            revealNearby();
            if (terrainArray[getplayer.x][getplayer.y].isSpike()) {
                getplayer.health -= 3;
                terrainArray[getplayer.x][getplayer.y].removeHazard();
            }
        } else {
            interactObject(getplayer.x, getplayer.y + 1);
        }
    }
}
function moveLeft() {
    if (getplayer.x > 0) {
        if (isNothingAhead(getplayer.x - 1, getplayer.y)) {
            getplayer.movePlayer(-1, 0);
            interactX = -1;
            interactY = -1;
            revealNearby();
            if (terrainArray[getplayer.x][getplayer.y].isSpike()) {
                getplayer.health -= 3;
                terrainArray[getplayer.x][getplayer.y].removeHazard();
            }
        } else {
            interactObject(getplayer.x - 1, getplayer.y);
        }
    }
}
function moveRight() {
    if (getplayer.x < boardSize.width - 1) {
        if (isNothingAhead(getplayer.x + 1, getplayer.y)) {
            getplayer.movePlayer(1, 0);
            interactX = -1;
            interactY = -1;
            revealNearby();
            if (terrainArray[getplayer.x][getplayer.y].isSpike()) {
                getplayer.health -= 3;
                terrainArray[getplayer.x][getplayer.y].removeHazard();
            }
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
                    if (terrainArray[x][y].isObstacle() || terrainArray[x][y].isSpike()) {
                        addScore(5);
                    }
                    terrainArray[x][y].removeTerrain();
                    revealLocation(x, y);
                });
            delete castMode.usingBomb;
            getplayer.bag.bomb -= 1;
        }
    }
}
function keyPressed(key) {
    if (getplayer.isAlive() === true) {
        if (key == "Q" || key == "q") {
            if (getplayer.bag.bomb > 0)
                castMode["usingBomb"] = { x: getplayer.x, y: getplayer.y };
        }
        if (castMode.hasOwnProperty('usingBomb') == false) {
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
        if (key == "r" || key == "R") {
            generateMap();
            currentStage = 1;
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
        if (castMode.hasOwnProperty('usingBomb') == false) {
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

        } else {
            castMode["usingBomb"] = { x: Math.floor(mousePos.x / 32), y: Math.floor(mousePos.y / 32) };
            activateBomb();
        }
        let r = { x: boardSize.width * 32, y: 224, width: uiWidth, height: 32 };
        if (mousePos.x >= r.x && mousePos.x <= r.x + r.width && mousePos.y >= r.y && mousePos.y <= r.y + r.height) {
            if (!castMode.hasOwnProperty("usingBomb")) {
                if (getplayer.bag.bomb > 0)
                    castMode["usingBomb"] = { x: getplayer.x, y: getplayer.y };
            } else {
                delete castMode.usingBomb;
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

});
function Input(event) {
    mousePos = getMousePos(getCanvas, event);
    if (event.button == 0) {
        leftClickEvent();
    }
}
document.addEventListener('click', Input);
//for mobile users
document.addEventListener('touchstart', Input);
setup();
generateMap();
update();
draw();