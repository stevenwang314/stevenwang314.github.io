function drawGameOverHUD(x,y,width,height) {
 //Game over section.
 if (getplayer.isAlive() === false) {
    fillRectangle(x,y,width,height, "orange", 0.5);
    drawText(x, y, "Game Over", "DynaPuff", 36, "black");
    drawText(x, y+64, "Stage: " + currentStage.toLocaleString("en-US"), "Verdana", 24, "black");
    drawText(x, y+64+32, "Score: " + score.toLocaleString("en-US"), "Verdana", 24, "black");
    let stringData = "Loot Collected: ";
    if (getplayer.stats.bag > 0) {
        stringData += "Bags: " + getplayer.stats.bag.toLocaleString("en-US");
    }
    if (getplayer.stats.dollar > 0) {
        stringData += " Dollars: " + getplayer.stats.dollar.toLocaleString("en-US");
    }
    if (getplayer.stats.chest > 0) {
        stringData += " Chests: " + getplayer.stats.chest.toLocaleString("en-US");
    }
    drawText(x, y+64+32+32, stringData, "Verdana", 14, "black");
    stringData = "Rocks Destroyed: ";
    for (let i = 0; i < getplayer.stats.rocksDestroyed.length; i++) {
        if (getplayer.stats.rocksDestroyed[i] > 0) {
            stringData += " T" + (i + 1) + ": " + getplayer.stats.rocksDestroyed[i].toLocaleString("en-US");
        }
    }
    drawText(x, y+64+32+46, stringData, "Verdana", 14, "black");
    stringData = "Enemies Defeated: ";
    for (let i = 0; i < getplayer.stats.enemies.length; i++) {
        if (getplayer.stats.enemies[i] > 0) {
            stringData += " T" + (i + 1) + ": " + getplayer.stats.enemies[i].toLocaleString("en-US");
        }
    }
    drawText(x, y+64+32+60, stringData, "Verdana", 14, "black");
    fillRectangle(x+160, y+height-64, 160, 64, "red", 0.5);
    drawRectangle(x+160, y+height-64, 160, 64, "black", 2);
    drawText(x+160, y+height-64, "Play Again!", "Verdana", 24, "black");
}
}