var monsterShot=0,//儲存被擊中的怪物數
       keysDown={},     //用來儲存被按下的按鈕
       FPS=30,               //畫布更新率
       heroBullets=[],        //定義一個集合來儲存子彈
       monsters=[],            //定義一個集合來儲存怪物
       monsterCaught=0;
       monsterShoot=0;   //計算擊中的怪物數
  //宣告射擊及擊中音效物件
       var hitsound=new Audio("images/Hit.wav");
       var shootsound=new Audio("images/Shoot.wav");
gameCanvas=$("#gameCanvas")[0];

//背景圖片載入
var bgImage=new Image();
bgImage.src="images/background.png";

if(gameCanvas&&gameCanvas.getContext){
	gameCtx=gameCanvas.getContext("2d");
}

//英雄圖片
var heroImage=new Image();
var heroReady=false;
heroImage.onload=function(){
	heroReady=true;
}
heroImage.src="images/hero.png";

//怪物圖片
var monsterImage=new Image();
var monsterReady=false;
monsterImage.onload=function(){
	monsterReady=true;
}
monsterImage.src="images/monster.png"

//GameObject
var hero={
		life:3,
		x:gameCanvas.width/2,
		y:gameCanvas.height/2,
		width:32,
		height:32,
		speedX:5,
        speedY:5,
        draw:function(){
        	 if(heroReady){
        		 gameCtx.drawImage(heroImage,this.x,this.y);
        	 }
        }
}


function Monster(){
	monster={};                        //建立一個物件表示怪物
	//決定怪物是否處於活動狀態，據此決定是否要重繪該圖形
	monster.active=true;
	//決定怪物物件的寬高
	monster.width=monster.height=32;
	//給一個表示怪物成長量的屬性
	monster.age=Math.floor(Math.random()*12);
	//怪物初始位置
	monster.x=32+(Math.random()*(gameCanvas.width-64));
	monster.y=32+(Math.random()*(gameCanvas.height-64));
	
   monster.xVelocity=3;
   monster.yVeloctiy=3;
   
   //繪製怪物
   monster.draw=function(){
		   gameCtx.drawImage(monsterImage,this.x,this.y);
   };
   
 //X方向移動函式
   function moving_xdirection(){
	   if(monster.x>=gameCtx.width-64||monster.x<=32){
		   monster.xVelocity=-monster.xVelocity;
	   }
	   monster.x+=monster.xVelocity*Math.sin(monster.age*Math.PI/64);
	   monster.age++;
   }
   //Y方向移動函式
   function moving_ydirection(){
	   if(monster.y>gameCtx.height-664&&monster.y<=32){
		   monster.yVelocity=-monster.yVelocity;
	   }
	   monster.y+=monster.yVelocity*Math.cos(monster.age*Math.PI/64);
	   monster.age++;
   };
   //更新怪物的屬性
   monster.moveMode=Math.floor(Math.random()*2+1);
   monster.update=function(){
	   /*if(monster.moveMode==1){
		   moving_xdirection();
	   }
	   else if(monster.moveMode==2){
		   moving_ydirection();
	   }*/
   }
  //怪物被消滅後爆炸，也就不再處於活動狀態了
   monster.explode=function(){
	   this.active=false;
   };
   
   return monster;
};


//子彈
//var heroBullets=[];                                  //定義一個陣列用來存放子彈

//定義一個函式建立子彈
function Bullet(bullet){
	bullet.width=7;;
	bullet.height=14;
	bullet.active=true;
	bullet.xVelocity=3;
	bullet.yVelocity=3;
	
	//檢察子彈是否還在畫布範圍內
	bullet.inCanvas=function(){
		return bullet.x>=0&&bullet.x<=gameCanvas.width
		      &&bullet.y>=0&&bullet.y<=gameCanvas.height;
	};
	
	//繪製子彈
	bullet.draw=function(){
		/*var gld=gameCtx.createLinearGradient(bullet.x+9,bullet.y,bullet.x+9+bullet.width,bullet.y+bullet.height);
		gld.addColorStop(0,"purple");
		gld.addColorStop(1,"#ffd700");
	    gameCtx.fillStyle=gld;*/
		
		//gameCtx.fillStyle="purple";
		gameCtx.beginPath();
		//gameCtx.fillRect(this.x,this.y,16,14);
		gameCtx.fillStyle="#ffd700";
		gameCtx.arc(bullet.x,bullet.y,7,1/4*Math.PI*2,3/4*Math.PI*2,true);
		gameCtx.closePath();
		gameCtx.fill();
	};
	//更新子彈屬性                     //要再修改
	bullet.update=function(){
			bullet.x+=bullet.xVelocity;
			bullet.y+=0;
		
		/*if(bullet.y==monster.y){
			if(bullet.x>monster.x){
			   bullet.x-=bullet.xVelocity;
			}
			else{
				bullet.x+=bullet.xVelocity;
			}
			bullet.y+=0;
		}
		else if(bullet.x==monster.x){
			if(bullet.y>monster.y){
				bullet.y-=bullet.yVelocity;
			}
			else{
				bullet.y+=bullet.yVelocity;
			}
			bullet.x+=0;
		}
		else{
			if(bullet.x<monster.x&&bullet.y<monster.y){
				bullet.x+=bullet.xVelocity;
				bullet.y+=bullet.yVelocity;
			}
			else if(bullet.x>monster.x&&bullet.y<monster.y){
				bullet.x-=bullet.xVelocity;
				bullet.y+=bullet.yVelocity;
			}
			else if(bullet.x<monster.x&&bullet.y>monster.y){
				bullet.x+=bullet.xVelocity;
				bullet.y-=bullet.yVelocity;
			}
			else{
				bullet.x-=bullet.xVelocity;
				bullet.y-=bullet.yVelocity;
			}
		}*/
		bullet.active=bullet.active&&bullet.inCanvas();
	};
	
	//子彈撞敵人後爆炸 也就不再處於活動狀態了
	bullet.explode=function(){
		this.active=false;
	};
	
	return bullet;
}

//分數
sCanvas=$("#scoreandtimeCanvas")[0];
if(sCanvas&&sCanvas.getContext){
	sCtx=sCanvas.getContext("2d");
}

//倒數計時器
//var timecount={
//		gameTime:60,
//		draw:function(){
//            sCtx.fillStyle="white"; 
//            sCtx.font="24px Helvetica";
//  		  sCtx.textAlign="center";
//  		  sCtx.textBaseline="top";
//          sCtx.fillText("00:"+timecount.gameTime,16,16);
//		},
//		update:function(){
//			timecount.gameTime-=1;
//		},
//}

var Score={
		draw:function(){
		  sCtx.fillStyle="blue";
		  sCtx.font="24px Helvetica";
		  sCtx.textAlign="left";
		  sCtx.textBaseline="top";
		  sCtx.fillText("Goblins shoot: " + monsterShoot, 32, 32);
		  
		  sCtx.fillStyle="purple";
		  sCtx.textAlign="left";
		  sCtx.textBaseline="bottom";
		  sCtx.fillText("Goblins caught: " + monsterCaught, 32, 32);
		}
};

//heroLife
var heroLifeImage=new Image();
heroLifeImage.src="images/heroLife.png";

var heroLife={
		width:172,
		height:35,
		draw:function(){
			sCtx.drawImage(heroLifeImage,340,0);
			sCtx.lineWidth=5;
			sCtx.lineCap="round";
			sCtx.strokeStyle="#00FFFF";
			sCtx.moveTo(372,12);
			sCtx.lineTo(512-141/3*(3-hero.life),12);
			sCtx.stroke();
			
		},
}



//網頁載入完成
window.onload=function(){
	//註冊事件
	window.addEventListener("keydown",function(e){
		keysDown[e.keyCode]=true;
	},false);
	
	window.addEventListener("keyup",function(e){
		delete keysDown[e.keyCode];
	},false);
}

//下面是重繪畫布,依據的是每個物件的新屬性
function draw(){
	gameCtx.clearRect(0,0,gameCanvas.width,gameCanvas.height);
	
	gameCtx.drawImage(bgImage,0,0);
	
	hero.draw();
	
	//檢查子彈集合,依據子彈的新屬性繪製每個子彈
	heroBullets.forEach(function(bullet){
		bullet.draw();
	});
	
	//檢查怪物集合,依據怪物的新屬性繪製每個怪物
	monsters.forEach(function(monster){
		monster.draw();
	});
	sCtx.clearRect(0,0,scoreandtimeCanvas.width,scoreandtimeCanvas.height);
	Score.draw();
	//heroLife.draw();
}

//更新各個圖形物件的屬性
function update(){
	if(37 in keysDown){                           //如果點擊左鍵
		hero.x-=hero.speedX;
		if(hero.x<=32){
			hero.x=32;
		}
	}
	if(39 in keysDown){                       //如果點擊右鍵
		hero.x+=hero.speedX;
		if(hero.x>=448){
			hero.x=448;
		}
	}
	if(38 in keysDown){                   //如果點擊上鍵
		hero.y-=hero.speedY;
		if(hero.y<=32){
			hero.y=32;
		}
	}
	if(40 in keysDown){               //如果點擊下鍵
		hero.y+=hero.speedY;
		if(hero.y>=416){
			hero.y=416;
		}
	}
	if(13 in keysDown){           //如果按下Enter鍵
		hero.shoot();
	}
	
	//檢查子彈集合,更新子彈屬性
	heroBullets.forEach(function(bullet){
		bullet.update();
	});
	
	//刪除子彈集合中那些active屬性為false的子彈
	heroBullets=heroBullets.filter(function(bullet){
		return bullet.active;
	});
	
	//檢查怪物集合,更新怪物屬性
	monsters.forEach(function(monster){
		monster.update();
	});
	
	//刪除怪物集合中那些active屬性為false的怪物
	monsters=monsters.filter(function(monster){
		return monster.active;
	});
	
	//檢測碰撞，為下一次更新做準備
	handleCollisions();
	
	//往怪物集合中隨機的增加一個怪物
	if(Math.random()<0.025){
		monsters.push(Monster());
	}
}

//定義玩家發射子彈方法
hero.shoot=function(){
	var bulletPosition=this.shootpoint();    //取得射擊點
	//新增一個子彈，並加到子彈集合,注意定義了子彈的速度和初始座標
	heroBullets.push(Bullet({
		x:bulletPosition.x,
	   y:bulletPosition.y,
	}));
	shootsound.play();
}	
	//定義一個方法取得射擊點
hero.shootpoint=function(){
	 return{
		 x:this.x+32,
		 y:this.y+12,
	 };
 };
 //檢查任意兩物件是否相交,如果相交就是碰撞在一起
function collides(a,b){
	return a.x<=b.x+b.width&&
	             a.x+a.width>=b.x&&
	             a.y<=b.y+b.height&&
	             a.y+a.height>=b.y;             
}

//該函式用來檢測碰撞，包含子彈和敵人的碰撞、玩家和敵ㄖ人的碰撞
function handleCollisions(){
	/**
	 子彈和敵人的碰撞
	 檢察子彈和敵人集合,確認他們受否存再碰撞
	 如果存再碰撞，那麼就讓敵人和子彈的active屬性值為false
	 那樣，下一次重繪畫布時就不會再繪製他們
	 */
	heroBullets.forEach(function(bullet){
		monsters.forEach(function(monster){
			if(collides(bullet,monster)){
				hitsound.play();
				bullet.active=false;
				monster.active=false;
				++monsterShoot;
			}
		});
	});
	
	/**
	*玩家換敵人的碰撞
	*檢查玩家和敵人集合,確定是否他們存再碰撞
	*如果存再碰撞,再做處理
	 */
	monsters.forEach(function(monster){
		if(collides(hero,monster)){
			//code
			monster.active=false;
			++monsterCaught;
			--hero.life
			console.log(hero.life);
//			if(hero.life==0){
//				gameOver();
//			}
		}
	});
}	

var gameLoop;
function game(){
//每隔一段時間就更新一次畫布
 gameLoop=setInterval(function(){
	update();
	draw();
},1000/FPS);
//setInterval(function(){
//	timecount.update();
//	timecount.draw();
//},1000);
};

var playagainImage=new Image();
playagainImage.src="images/playagainbtn_sm.png";
//結束遊戲
function gameOver(){
	clearInterval(gameLoop);
//	gameCtx.clearRect(0,0,gameCanvas.width,gameCanvas.height);
//	sCtx.clearRect(0,0,gameCanvas.width,gameCanvas.height);
//	gameCtx.fillStyle="purple";
//	shadowBlur="15";
//	gameCtx.drawImage(playagainImage,gameCanvas.width/2,gameCanvas.height/2);
}

game();
