const BOMB = "Bomb";
const FIRECRACKER = "Firecracker";
const DRONE = "Drone";
const LIGHTNING = "Lightning";
const GOGGLE = "Goggle";
class terrainCell {
    constructor() {
        this.explore = false;
        this.hasObstacle ={ enabled: false};
        this.unbreakable = false;
        this.isGoal = false;
        this.directional = {enabled: false, typeOfDirection: 0};
        this.object= {enabled: false, type: "", item: []};
        this.hazard = {enabled : false, id : 0};
        this.portal = {enabled : false, linkedPortal : {x : 0, y: 0 }, id: 0};
        this.enemy = { id: 0};
    }
    assignRock(index) {
        this.hasObstacle = { enabled: true, type: index };
    }
    assignEnemy(index,getX , getY) {
         this.enemy = {id: index, x : getX, y: getY, turns: randomInteger(1,3)};
    }
    assignExistEnemy(attached_enemy, id) {
        this.enemy = attached_enemy;
        this.enemy.id = id;
        if (id != 5 && id !=4) {
            this.enemy.turns = randomInteger(1,3);
        } else if (id === 6) {
            this.enemy.turns = randomInteger(3,7);   
        }else {
            this.enemy.turns = 1;
        }
   }
    assignHazard(index) {
        this.hazard.enabled = true;
        this.hazard.id = index;
    }
    assignWall() {
        this.hasObstacle.enabled = true;
        this.unbreakable = true;  
    }
    assignGoal() {
        this.isGoal = true;
        this.object.enabled = false;
    }
    assignBag() {
        this.object.type = "Bag";
        this.object.enabled =  true;

    }
    assignDollar() {
        this.object.type = "Dollar";
        this.object.enabled =  true;
    }
    assignChest() {
        this.object.type = "Chest";
        this.object.enabled =  true;
    }
    assignPotion() {
        this.object.type = "Potion";
        this.object.enabled = true;
    }
    assignPotionHP() {
        this.object.type = "PotionHP";
        this.object.enabled = true;
    }
    assignBomb() {
        if (this.object.hasOwnProperty("item")) {
            this.object.item.push(BOMB);
        }
         else {
            this.object.item = [BOMB];
        }
        this.object.enabled = true;
    }
    assignFirecracker() {
        if (this.object.hasOwnProperty("item")) {
            this.object.item.push(FIRECRACKER);
        }
         else {
            this.object.item = [FIRECRACKER];
        }
        this.object.enabled = true;
    }
    assignDrone() {
        if (this.object.hasOwnProperty("item")) {
            this.object.item.push(DRONE);
        }
         else {
            this.object.item = [DRONE];
        }
        this.object.enabled = true;
    }
    assignLightning() {
        if (this.object.hasOwnProperty("item")) {
            this.object.item.push(LIGHTNING);
        }
         else {
            this.object.item = [LIGHTNING];
        }
        this.object.enabled = true;
    }
    assignGoggle() {
        if (this.object.hasOwnProperty("item")) {
            this.object.item.push(GOGGLE);
        }
         else {
            this.object.item = [GOGGLE];
        }
        this.object.enabled = true;
    }
    assignPortal(id) {
        this.portal.enabled = true;
        this.portal.id = id;
    }
    isObstacle() {
        return this.hasObstacle.enabled === true;
    }
    isEnemy() {

        return this.enemy.id > 0;
    }
    isWall() {
        return this.hasObstacle.enabled === true && this.unbreakable === true;
    }
    
    isBag() {
        return this.object.enabled === true && (this.object.type == "Bag");
    }
    isChest() {
        return this.object.enabled === true && (this.object.type =="Chest");
    }
    isDollar() {
        return this.object.enabled === true && (this.object.type =="Dollar");
    }
    isPotion() {
        return this.object.enabled === true && this.object.type == "Potion";
    }
    isPotionHP() {
        return this.object.enabled === true && this.object.type == "PotionHP";
    }
    isBomb() {
        return this.object.enabled === true &&this.object.hasOwnProperty("item") && this.object.item.includes(BOMB);
    }
    isFirecracker() {
        return this.object.enabled === true &&this.object.hasOwnProperty("item") &&  this.object.item.includes(FIRECRACKER);
    }
    isLightning() {
        return this.object.enabled === true &&this.object.hasOwnProperty("item") &&  this.object.item.includes(LIGHTNING);
    }
    isGoggle() {
        return this.object.enabled === true &&this.object.hasOwnProperty("item") &&  this.object.item.includes(GOGGLE);
    }
    isHazard() {
        return this.hazard.enabled === true;
    }
    isDrone() {
        return this.object.enabled === true &&this.object.hasOwnProperty("item") &&  this.object.item.includes(DRONE);
    }
    isRevealed() {
        return this.explore === true;
    }
    isPortal() {
        return   this.portal.enabled=== true;
    }
    getHazard() {
        if (this.hazard.enabled === true) {
            return this.hazard.id;
        }
        else {
            return 0;
        }
    }
    getEnemy() {
        if (this.enemy.id > 0) {
            return this.enemy.id;
        }
        else {
            return 0;
        }
    }
    removeEnemy() {
        //Delete enemy.
        this.enemy = { id: 0};

    }
    //Removes the item.
    removeObjectItem(item) {
        const getIndex = this.object.item.indexOf(item);
        if (getIndex != -1) {
            this.object.item.splice(getIndex,1);
            if (this.object.item.length == 0 && this.object.type == "") {
                this.object.enabled = false;
            }
        }
    }
    removeHazard() {
        this.hazard.enabled =false;
    }
    removeTerrain() {
        this.hasObstacle.enabled = false;
        this.unbreakable = false;
        this.hazard.enabled =false;
 
    }
    removeObstacles() {
        this.hasObstacle.enabled = false;
        
    }
    removeObject() {
        this.object.type = "";
        if (this.object.item.length == 0 && this.object.type == "") {

            this.object.enabled = false;
        }
    }
    revealLocation() {
        this.explore = true;
    }
}