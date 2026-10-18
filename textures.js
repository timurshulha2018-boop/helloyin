// ===== Процедурные хеллоуин-текстуры =====
function makeTex(fn){
  let c=document.createElement('canvas');c.width=c.height=128;fn(c.getContext('2d'));
  let t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;return t;
}
function grain(g,n,a){for(let i=0;i<n;i++){g.fillStyle=`rgba(${(Math.random()*255)|0},${(Math.random()*255)|0},${(Math.random()*255)|0},${a})`;g.fillRect(Math.random()*128,Math.random()*128,2,2);}}
const TEX = {
  ground: makeTex(g=>{g.fillStyle='#1d2b16';g.fillRect(0,0,128,128);
    for(let i=0;i<350;i++){g.fillStyle=`rgb(${25+Math.random()*40|0},${60+Math.random()*50|0},${20+Math.random()*30|0})`;g.fillRect(Math.random()*128,Math.random()*128,3,4);}
    g.fillStyle='rgba(255,117,24,.25)';g.font='18px serif';g.fillText('🎃',8,24);g.fillText('🍂',90,110);grain(g,120,.15);}),
  wall: makeTex(g=>{g.fillStyle='#2b2140';g.fillRect(0,0,128,128);g.fillStyle='#3a2d55';
    for(let y=0;y<4;y++)for(let x=0;x<4;x++)g.fillRect(x*32+(y%2?16:0)-16+2,y*32+2,28,28);
    g.fillStyle='rgba(0,0,0,.4)';g.font='22px serif';g.fillText('🕸',2,26);g.fillText('🦇',96,120);grain(g,120,.15);}),
  candy: makeTex(g=>{g.fillStyle='#ff5722';g.fillRect(0,0,128,128);g.fillStyle='#ffcc80';
    for(let i=0;i<6;i++){g.beginPath();g.arc(20+i*20,64+Math.sin(i)*20,9,0,7);g.fill();}grain(g,80,.1);}),
  ghost: makeTex(g=>{g.fillStyle='#ede7f6';g.fillRect(0,0,128,128);
    g.fillStyle='#311b92';g.beginPath();g.arc(45,55,12,0,7);g.arc(83,55,12,0,7);g.fill();
    g.fillStyle='#000';g.beginPath();g.arc(45,55,5,0,7);g.arc(83,55,5,0,7);g.fill();
    g.fillStyle='#311b92';g.fillRect(40,90,48,8);grain(g,60,.08);}),
  bolt: makeTex(g=>{let gr=g.createLinearGradient(0,0,128,0);gr.addColorStop(0,'#ffeb3b');gr.addColorStop(1,'#ff5722');g.fillStyle=gr;g.fillRect(0,0,128,128);})
};
