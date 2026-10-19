// ===== Halloween Candy Battle — логика =====
var scene,cam,ren,me,foe,candies=[],ghosts=[];
var keys={},vy=0,onG=true,yaw=0,pitch=.3;
var myScore=0,foeScore=0,timeLeft=99,over=false,started=false;
var foeData={x:0,z:-18,s:0},tick=0;
function $(id){return document.getElementById(id);}
function show(t,ms){var m=$('msg');m.textContent=t;m.style.display='block';
setTimeout(function(){m.style.display='none';},ms||1500);}
$('hostB').onclick=function(){var r=$('room').value.trim().toUpperCase()||'Q7WX';
$('status').textContent='Создаю '+r+'... жди друга';
Net.onOpen=function(){$('status').textContent='Комната '+r+' готова! Друг заходит...';};
Net.onData=onNet;Net.host(r);waitFoe();};
$('joinB').onclick=function(){var r=$('room').value.trim().toUpperCase()||'Q7WX';
$('status').textContent='Подключаюсь к '+r+'...';
Net.onOpen=function(){startGame();};Net.onData=onNet;
Net.onClose=function(){if(!over)show('Друг отключился!');};Net.join(r);};
$('soloB').onclick=function(){startGame();};
function waitFoe(){var t=setInterval(function(){
if(Net.conn&&Net.conn.open){clearInterval(t);startGame();}},500);}
function onNet(d){if(d.t==='pos'){foeData=d;}
else if(d.t==='end'){endGame('Ты проиграл! 👻');}}
function endGame(t){over=true;try{Net.send({t:'end'});}catch(e){}
show(t,4000);if(document.exitPointerLock)document.exitPointerLock();}
function startGame(){
if(started)return;started=true;
$('menu').style.display='none';$('hud').style.display='flex';
if('ontouchstart' in window)$('touch').style.display='flex';
buildWorld();show('Собирай конфеты! 🎃');
setInterval(function(){if(over)return;timeLeft--;$('pTime').textContent='⏱ '+timeLeft;
if(timeLeft<=0)endGame(myScore>=foeScore?'ТЫ ВЫИГРАЛ! 🎃':'Ты проиграл! 👻');},1000);
requestAnimationFrame(loop);}
function buildWorld(){
scene=new THREE.Scene();scene.background=new THREE.Color(0x1a0b2e);
cam=new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,.1,500);
ren=new THREE.WebGLRenderer({antialias:true});
ren.setSize(window.innerWidth,window.innerHeight);
ren.domElement.className='game';document.body.appendChild(ren.domElement);
scene.add(new THREE.AmbientLight(0xffffff,.7));
var sun=new THREE.DirectionalLight(0xffcc80,.9);sun.position.set(20,30,10);scene.add(sun);
var gnd=new THREE.Mesh(new THREE.PlaneGeometry(60,60),
new THREE.MeshLambertMaterial({map:TEX.ground}));
gnd.rotation.x=-Math.PI/2;scene.add(gnd);
var wm=new THREE.MeshLambertMaterial({map:TEX.wall});
[[0,-24,52,1],[0,24,52,1],[-24,0,1,52],[24,0,1,52]].forEach(function(a){
var m=new THREE.Mesh(new THREE.BoxGeometry(a[2],5,a[3]),wm);
m.position.set(a[0],2.5,a[1]);scene.add(m);});
var i,pump;
for(i=0;i<6;i++){pump=new THREE.Mesh(new THREE.SphereGeometry(1.5,10,10),
new THREE.MeshLambertMaterial({color:0xff7518,emissive:0x662200}));
pump.position.set((Math.random()-.5)*36,1.5,(Math.random()-.5)*36);scene.add(pump);}
me=new THREE.Mesh(new THREE.BoxGeometry(.9,1.4,.9),
new THREE.MeshLambertMaterial({color:0xff7518}));
me.position.set(0,1,18);scene.add(me);
foe=new THREE.Mesh(new THREE.BoxGeometry(.9,1.4,.9),
new THREE.MeshLambertMaterial({color:0x9c27b0}));
foe.position.set(0,1,-18);scene.add(foe);
for(i=0;i<15;i++)spawnCandy();
for(i=0;i<3;i++){var gh=new THREE.Mesh(new THREE.BoxGeometry(1.2,1.6,1.2),
new THREE.MeshLambertMaterial({map:TEX.ghost}));
gh.position.set((Math.random()-.5)*36,1,(Math.random()-.5)*36);
scene.add(gh);ghosts.push({m:gh,a:Math.random()*6});}
document.addEventListener('keydown',function(e){keys[e.code]=true;});
document.addEventListener('keyup',function(e){keys[e.code]=false;});
document.addEventListener('mousemove',function(e){
if(document.pointerLockElement){yaw-=e.movementX*.0026;pitch-=e.movementY*.0022;
pitch=Math.max(-1,Math.min(1,pitch));}});
ren.domElement.addEventListener('click',function(){ren.domElement.requestPointerLock();});
bindTouch();}
function bindTouch(){
var joy=$('joy'),stick=$('stick'),jx=0,jy=0;
window._joy={x:0,y:0};
function setStick(dx,dy){stick.style.left=(37+dx)+'px';stick.style.top=(37+dy)+'px';}
joy.addEventListener('touchstart',touch,{passive:false});
joy.addEventListener('touchmove',touch,{passive:false});
joy.addEventListener('touchend',function(){jx=0;jy=0;window._joy.x=0;window._joy.y=0;setStick(0,0);});
function touch(e){e.preventDefault();
var r=joy.getBoundingClientRect(),t=e.touches[0];
var dx=t.clientX-(r.left+r.width/2),dy=t.clientY-(r.top+r.height/2);
var m=Math.sqrt(dx*dx+dy*dy),max=40;
if(m>max){dx=dx/m*max;dy=dy/m*max;}
jx=dx/max;jy=dy/max;window._joy.x=jx;window._joy.y=jy;setStick(dx,dy);}
var tj=$('tJump');
tj.addEventListener('touchstart',function(e){e.preventDefault();keys['Space']=true;});
tj.addEventListener('touchend',function(){keys['Space']=false;});
var camB=$('tCam'),lastX=0,drag=false;
camB.addEventListener('touchstart',function(e){drag=true;lastX=e.touches[0].clientX;});
camB.addEventListener('touchmove',function(e){if(!drag)return;
var x=e.touches[0].clientX;yaw-=(x-lastX)*.01;lastX=x;});
camB.addEventListener('touchend',function(){drag=false;});
ren.domElement.addEventListener('touchmove',function(e){
if(e.touches.length===1&&!drag){yaw-=e.touches[0].clientX%5*.02;}});}
function spawnCandy(){var c=new THREE.Mesh(new THREE.OctahedronGeometry(.5),
new THREE.MeshLambertMaterial({color:0xffd600,emissive:0x663300}));
c.position.set((Math.random()-.5)*40,1,(Math.random()-.5)*40);
scene.add(c);candies.push(c);}
function loop(){requestAnimationFrame(loop);if(over)return;tick++;
var sp=.16,fx=-Math.sin(yaw),fz=-Math.cos(yaw);
var jx=(window._joy&&window._joy.x)||0,jy=(window._joy&&window._joy.y)||0;
if(Math.abs(jx)>.15||Math.abs(jy)>.15){
me.position.x+=(-fz*jx-fx*jy)*sp*1.5;me.position.z+=(fx*jx-fz*jy)*sp*1.5;}
if(keys['KeyW']||keys['ArrowUp']){me.position.x+=fx*sp;me.position.z+=fz*sp;}
if(keys['KeyS']||keys['ArrowDown']){me.position.x-=fx*sp;me.position.z-=fz*sp;}
if(keys['KeyA']||keys['ArrowLeft']){me.position.x+=fz*sp;me.position.z-=fx*sp;}
if(keys['KeyD']||keys['ArrowRight']){me.position.x-=fz*sp;me.position.z+=fx*sp;}
me.position.x=Math.max(-22,Math.min(22,me.position.x));
me.position.z=Math.max(-22,Math.min(22,me.position.z));
if(keys['Space']&&onG){vy=.26;onG=false;}
me.position.y+=vy;vy-=.013;
if(me.position.y<=1){me.position.y=1;vy=0;onG=true;}
cam.position.set(me.position.x+Math.sin(yaw)*6,me.position.y+2.5+Math.sin(pitch)*5,
me.position.z+Math.cos(yaw)*6);
cam.lookAt(me.position.x,me.position.y,me.position.z);
if(tick%6===0){try{Net.send({t:'pos',x:+me.position.x.toFixed(2),
z:+me.position.z.toFixed(2),s:myScore});}catch(e){}}
foe.position.x=foeData.x;foe.position.z=foeData.z;foeScore=foeData.s||0;
$('pMe').textContent='🎃 '+myScore+'🍬';$('pFoe').textContent='👻 '+foeScore+'🍬';
var i;for(i=candies.length-1;i>=0;i--){candies[i].rotation.y+=.06;
if(candies[i].position.distanceTo(me.position)<1.4){
scene.remove(candies[i]);candies.splice(i,1);myScore++;spawnCandy();
if(myScore>=15){endGame('ТЫ ВЫИГРАЛ! 🎃');return;}}}
ghosts.forEach(function(o){o.a+=.02;o.m.position.x+=Math.sin(o.a)*.05;
o.m.position.z+=Math.cos(o.a)*.05;
if(o.m.position.distanceTo(me.position)<1.4&&tick%40===0){
myScore=Math.max(0,myScore-2);show('👻 -2!');}});
ren.render(scene,cam);}

