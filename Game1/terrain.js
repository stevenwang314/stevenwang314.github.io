class terrainCell {
    constructor() {
        this.explore = false;
        this.hasObstacle ={ enabled: false, type: 0};
        this.unbreakable = false;
        this.isGoal = false;
        this.directional = {enabled: false, typeOfDirection: 0};
        this.object= {enabled: false, type: ""};
        this.isHazard = false;
        this.portal = {enabled : false, linkedPortal : {x : 0, y: 0 }, id: 0};
    }
    assignRock(index) {
        this.hasObstacle = { enabled: true, type: index };
    }
    assignGoal() {
        this.isGoal = true;
        this.object.enabled = false;
    }
    assignBag() {
        this.object.type = "Bag";
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
            this.object.item.push("Bomb");
        }
         else {
            this.object.item = ["Bomb"];
        }
        this.object.enabled = true;
    }
    assignFirecracker() {
        if (this.object.hasOwnProperty("item")) {
            this.object.item.push("Firecracker");
        }
         else {
            this.object.item = ["Firecracker"];
        }
        this.object.enabled = true;
    }
    assignSpikes() {
        this.isHazard = true;
    }
    assignPortal(id) {
        this.portal.enabled = true;
        this.portal.id = id;
    }
    isObstacle() {
        return this.hasObstacle.enabled === true;
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
    isPotion() {
        return this.object.enabled === true && this.object.type == "Potion";
    }
    isPotionHP() {
        return this.object.enabled === true && this.object.type == "PotionHP";
    }
    isBomb() {
        return this.object.enabled === true &&this.object.hasOwnProperty("item") && this.object.item.includes("Bomb");
    }
    isFirecracker() {
        return this.object.enabled === true &&this.object.hasOwnProperty("item") &&  this.object.item.includes("Firecracker");
    }
    isSpike() {
        return this.isHazard;
    }
    isRevealed() {
        return this.explore === true;
    }
    isPortal() {
        return   this.portal.enabled=== true;
    }
    removeHazard() {
        this.isHazard = false;
    }
    removeTerrain() {
        this.hasObstacle.enabled = false;
        this.unbreakable = false;
        this.isHazard = false;
    }
    removeObject() {
        this.object.enabled = false;
        this.object.type = "";
        delete this.object.item;
    }
    revealLocation() {
        this.explore = true;
    }
}