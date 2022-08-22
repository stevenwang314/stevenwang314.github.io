class terrainCell {
    constructor() {
        this.explore = false;
        this.hasObstacle = false;
        this.unbreakable = false;
        this.isGoal = false;
        this.directional = {enabled: false, typeOfDirection: 0};
        this.object= {enabled: false, type: "Bag"};
        this.isHazard = false;
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
    assignBomb() {
        this.object.type = "Bomb";
        this.object.enabled = true;
    }
    assignSpikes() {
        this.isHazard = true;
    }
    isObstacle() {
        return this.hasObstacle === true;
    }
    isWall() {
        return this.hasObstacle === true && this.unbreakable === true;
    }
    isBag() {
        return this.object.enabled && (this.object.type == "Bag");
    }
    isChest() {
        return this.object.enabled && (this.object.type =="Chest");
    }
    isPotion() {
        return this.object.enabled && this.object.type == "Potion";
    }
    isBomb() {
        return this.object.enabled && this.object.type == "Bomb";
    }
    isSpike() {
        return this.isHazard;
    }
    isRevealed() {
        return this.explore === true;
    }
    removeHazard() {
        this.isHazard = false;
    }
    removeTerrain() {
        this.hasObstacle = false;
        this.unbreakable = false;
        this.isHazard = false;
    }
    removeObject() {
        this.object.enabled = false;
        this.object.type = "";
    }
    revealLocation() {
        this.explore = true;
    }
}