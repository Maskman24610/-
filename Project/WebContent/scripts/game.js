c=$("#gameCanvas")[0];
ctx=c.getContext("2d");
//ctx.drawImage(bgImg,0,0); 
/*document.body.appendChild(c);*/
//背景图片
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
    bgReady = true;
};
bgImage.src = "images/background.png";
//英雄圖片
var heroReady=false;
var heroImage=new Image();
heroImage.onload=function(){
	heroReady=true;
};
heroImage.src="images/hero.png";

//怪物圖片載入
var monsterReady=false;
var monsterImage=new Image();
monsterImage.onload = function () {
	monsterReady=true;
};
monsterImage.src="images/monster.png";
monsterImage.id="monsterImage";

//子彈圖片載入
//var bulletImage=new Image();
//bulletImage.src="images/bullet.png";

//Game Objects
var hero={
	speed:256,
}
var monster={
    speed:256,
    speedY:256,
}
var bullet={
	draw:function(){
		ctx.save();
		ctx.fillStyle="purple";
		ctx.beginPath();
		ctx.fillRect(hero.x+32,hero.y,16,14);
		ctx.fillStyle="#ffd700";
		ctx.arc(hero.x+48,hero.y+7,7,1/4*Math.PI*2,3/4*Math.PI*2,true);
		ctx.closePath();
		ctx.fill();
		ctx.restore();
	},				 				
	speed:300,
}
var monstersCaught=0;
var gameTime=60;
var moveXloop=0;
//Handle keyboard control s
var keysDown={};

addEventListener("keydown",function(e){
	keysDown[e.keyCode]=true;
},false);

addEventListener("keyup",function(e){
	delete keysDown[e.keyCode];
},false);

//reset the game when the player catch a monster
var reset=function(){
	hero.x=c.width/2;
	hero.y=c.height/2;
	
	//Throw the monster somewhere on the screen randomly
	monster.x=32+(Math.random()*(c.width-64));
	monster.y=32+(Math.random()*(c.height-64));
	
	//Moveloop歸零
	moveXloop=0;
	//加上monster X方向速度
	monster.speed=256;
};

//sleep()
function sleep(ms){
	var nowtime=new Date().getTime();
	while((new Date().getTime())-nowtime<ms){
		
	}
}

//Update Game Objects
var update=function(modifier){
	if(13 in keysDown){

		//ctx.globalCompositeOperation=source-atop;
		//ctx.fillRect(hero.x+32,hero.y,50,50);
    	//ctx.clip();
		//ctx.drawImage(bulletImage,hero.x+32,hero.y);
		bullet.draw();
	}
	if(38 in keysDown){             //player holding up
		hero.y-=hero.speed*modifier;
	    if(hero.y<=32){
	    	hero.y=32;
	    }
	}
	if(40 in keysDown){            //player holeing down
		hero.y+=hero.speed*modifier;
	    if(hero.y>=416){
	    	hero.y=416;
	    }
	}
	if(37 in keysDown){          //player holding left
		hero.x-=hero.speed*modifier;
	   if(hero.x<=32){
		   hero.x=32;
	   }
	}
	if(39 in keysDown){         //player holding right
		hero.x+=hero.speed*modifier;
	    if(hero.x>448){
	    	hero.x=448;
	    }
	}
	
	//monster moving
	monster.prototype={
			dx:0,
			dy:0,
	};
	
	function monster_moving(modifier){
		
		if((monster.x<=32||(monster.x>=448))&&moveXloop<4){
			sleep(100);
		  monster.speed=-monster.speed;
		  moveXloop++;
		}
		if(moveXloop==4&&monster.x>=c.width/2){
			monster.speed=0;
			monster.speedY=monster.speedY;
			if(monster.y>c.height-64||monster.y<32){
				monster.speedY=-monster.speedY;
			}
			monster.dy=monster.speedY*modifier;;
			monster.y+=monster.dy;
		}
		monster.dx=monster.speed*modifier;
		monster.x+=monster.dx;		
		console.log(moveXloop);
	};

	monster_moving(modifier);
	//setTimeout(monster_moving(),200);
	//Are they touch?
	if(hero.x<=(monster.x+32)
	    && monster.x<=(hero.x+32)
		&&hero.y<=(monster.y+32)
		&&monster.y<=(hero.y+32)){
		  ++monstersCaught;
		  reset();
	}
};

//Draw everything
var render=function(){
	if(bgReady){
		ctx.drawImage(bgImage,0,0);
	}
	ctx.save();
	if(heroReady){
		
		ctx.drawImage(heroImage,hero.x,hero.y);
	}
	
	if(monsterReady){
		  ctx.drawImage(monsterImage,monster.x,monster.y);
		
	}
	
	//Score
	ctx.fillStyle="blue";
	ctx.font="24px Helvetica";
	ctx.textAlign="left";
	ctx.textBaseline="top";
	ctx.fillText("Goblins caught: " + monstersCaught, 32, 32);
	
	ctx.restore();
};

//The main game loop
var main=function(){
	var now=Date.now();
	var delta=now-then;
	
	update(delta/1000);
	render();
	//  這為可放monster_moving的一個位置 但呈現效果不夠好

	then=now;
	
	// Request to do this again ASAP
	requestAnimationFrame(main);
};

//Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
var then = Date.now();
reset();
main();


//GameTime
/*var canvasT=$("#timeCanvas")[0];
var ctxSmall=canvasT.getContext("2d");
ctxSmall.fillStyle="purple";
ctxSmall.font="24px Helvetica"
ctxSmall.textAlign="right";
ctxSmall.textBaseline="top";
function drawGameTime(){
  ctxSmall.fillText("00 :"+gameTime,0,0);
  sleep(990);
  gameTime-=1;
  //var gameagain=new Image();
  //gameagain.src="images/playagainbtn_sm.png";
  if(gameTime==0){
	reset();
  }
};

drawGameTime();
setInterval(drawGameTime,1000);*/