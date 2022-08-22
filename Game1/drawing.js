


const drawRectangle = (x,y,width,height,color, size) => {
    ctx.fillStyle = color;
    ctx.lineWidth=  size;
    ctx.strokeRect(x,y,width,height);
 };
 
const fillRectangle = (x,y,width,height,color, opacity= 1) => {
    ctx.fillStyle = color;
    ctx.globalAlpha = opacity;
    ctx.fillRect(x,y,width,height);
    ctx.globalAlpha = 1;
 };

 const drawText = (x,y,text,font, fontSize, color) => {
    ctx.font = fontSize + "px "+ font;
    ctx.fillStyle = color;
    ctx.translate(0,fontSize);  
    ctx.fillText(text, x,y);
    ctx.translate(0,-fontSize); 

 };
 const drawImage = (x,y,width,height,img,rotation,opacity = 1) => {
   ctx.translate(x + width/2, y + height/2);
   ctx.rotate(rotation * Math.PI/180);
   ctx.translate(-width/2, -height/2);
   ctx.globalAlpha = opacity;
   ctx.drawImage(img, 0, 0, width, height );
   ctx.globalAlpha = 1;
   ctx.resetTransform();
 };