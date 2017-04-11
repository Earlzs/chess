
//获取chess对象
var chess = document.querySelector('#chess');
var context = chess.getContext('2d');

//设定初始为黑子先下
var me=true;




//水印的实现
var logo = new Image();
logo.src = "./image/8.jpg";
logo.onload = function () {
    context.drawImage(logo, 0, 0, 450, 450);
    drawChess();

}



//下棋
function onStep(i, j, me) {
    context.beginPath();
    context.arc(15 + i * 30, 15 + j * 30, 14, 0, 2 * Math.PI);
    context.closePath();
    //如果是黑棋
    if (me) {
        var gradient = context.createRadialGradient(15 + i * 30 + 2, 15 + j * 30 - 2, 13, 15 + i * 30 + 2, 15 + j * 30 - 2, 0);
        gradient.addColorStop(0, '#0A0A0A');
        gradient.addColorStop(1, '#636766');
    }
    //如果是白棋 
     else {
        var gradient = context.createRadialGradient(15 + i * 30 + 2, 15 + j * 30 - 2, 13, 15 + i * 30 + 2, 15 + j * 30 - 2, 0);
        gradient.addColorStop(0, '#D1D1D1');
        gradient.addColorStop(1, '#F9F9F9');
    }

    context.fillStyle = gradient;
    context.fill();

}


//画棋盘
function drawChess() {
    //画线段的颜色
    context.strokeStyle = "#069";
    for (var i = 0; i < 15; i++) {
        //画纵坐标
        context.moveTo(15 + i * 30, 15);
        context.lineTo(15 + i * 30, 435);
        context.stroke();
        //画横坐标
        context.moveTo(435, 15 + i * 30);
        context.lineTo(15, 15 + i * 30);
        context.stroke();
    }

}




//现在实现了黑白子交替下棋了，但是存在问题，再次点击，下过棋子的区域，会覆盖之前的结果；

//  创建二维数组
var chessArea=[];

for(var i=0;i<15;i++){
    // 一维数组全部设置为【】
    chessArea[i]=[];  
    for(var j=0;j<15;j++){
        //  将这个二维数组的所有项全部设置为0；
        chessArea[i][j]=0;
    } 
}



//落子实现
chess.onclick=function(e){
    var x=e.offsetX;
    var y=e.offsetY;
    // console.log(x);
    var i=Math.floor(x/30);
    var j=Math.floor(y/30);
//  如果这个数组里的对应项==0；说明没有在该区域落过子
    if(chessArea[i][j]==0){
         onStep(i,j,me);
        //  如果是黑棋，将对应项在二维数组里设置为1
         if(me){
             chessArea[i][j]=1;
         }
          //  如果是白棋，将对应项在二维数组里设置为1
         else{
             chessArea[i][j]=2;
         }
    }
    //取反，下次下棋换人下
    me=!me;
}






