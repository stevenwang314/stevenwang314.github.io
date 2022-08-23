class player {
    
    constructor(image) {
     this.energy = 100;
     this.maxEnergy = 100;
     this.health = 100;
     this.maxHealth = 100;
     this.x = 0;
     this.y = 0;
     this.playerImg = image;
     this.bag = {bomb: 0, firecracker: 0};
    }
    getEnergyRatio() {
         return this.energy/this.maxEnergy;
    }
    getHealthRatio() {
     return this.health/this.maxHealth;
    }
    draw(context) {
        context.translate(this.x * 32 + 16, this.y * 32 + 16);
        context.rotate(0 * Math.PI/180);
        context.translate(-16, -16);
        if (this.isAlive())
            context.drawImage(this.playerImg, 0, 0, 32, 32 );
        else
            context.drawImage(img_playerCry,0,0,32,32);
        context.resetTransform();
    }
    movePlayer(x, y) {
        this.x += x;
        this.y += y;
        this.performCost(0.2);
    }
    setRandomPosition() {
        this.x = randomInteger(0, boardSize.width);
        this.y = randomInteger(0, boardSize.height);
    }
    performCost(cost) {
        if (this.energy > 0) {
            this.energy -= cost;
            cost -= cost;
          
            //Insufficient energy, set it to 0 and remove it from health instead.
            if (this.energy < 0) {
                cost = -this.energy;
                this.energy = 0;
            }
        } 
       
        if (cost > 0) {
            this.health -= cost * 2;
            this.health = clamp(this.health, 0, 100);
        }
    }
    restoreEnergy(energy) {
        this.energy += energy;
        this.energy = clamp(this.energy, 0, 100);
    }
    reduceHealth(health) {
        this.health -= 3;
    }
    restoreHealth(health) {
        this.health += health;
        this.health = clamp(this.health, 0, 100);
    }
    addBomb(amount) {
        this.bag.bomb += amount;
    }
    addFirecracker(amount) {
        this.bag.firecracker += amount;
    }
    
    reset() {
        this.health = 100;
        this.energy = 100;
        this.bag = {bomb: 0, firecracker: 0};
    }
    isAlive() {
        return this.health > 0;
    }
 }
