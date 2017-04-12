
//获取chess对象
var chess = document.querySelector('#chess');
var ctx = chess.getContext('2d');
var over = false;
//设定初始为黑子先下
var me = true;
var myWin = [];//玩家的赢法统计
var computerWin = [];//电脑的赢法统计
ctx.strokeStyle = "#0C0C0C"



//画棋盘
var drawChessBoard = function () {
    // 画竖线      两条线之间的距离是30，左右Padding 为15
    for (var i = 0; i < 15; i++) {
        ctx.moveTo(30 * i + 15, 15);
        ctx.lineTo(30 * i + 15, 435);
        ctx.stroke();
    }
    // 画横线      两条线之间的距离是30，左右Padding 为15
    for (var i = 0; i < 15; i++) {
        ctx.moveTo(15, 30 * i + 15);
        ctx.lineTo(435, 30 * i + 15);
        ctx.stroke();
    }
}



//画棋子
var onStep = function (i, j, me) {
    ctx.beginPath();
    ctx.arc(30 * i + 15, 30 * j + 15, 13, 0, 2 * Math.PI);
    ctx.closePath();
    //如果是我的话

    var gradient = ctx.createRadialGradient(30 * i + 15 + 2, 30 * j + 15, 13, 30 * i + 15 - 2, 30 * j + 15, 0);
    if (me) {

        gradient.addColorStop(0, "#ccc");
        gradient.addColorStop(1, "#fff");
    } else {

        gradient.addColorStop(0, "#0A0A0A");
        gradient.addColorStop(1, "#fff");
    }

    ctx.fillStyle = gradient;
    ctx.fill()
}



// 在确保图片加载进来在操作 
var bg = new Image();
bg.src = './image/8.jpg'
bg.onload = function () {
    ctx.drawImage(bg, 0, 0, 450, 450);
    drawChessBoard();

    onStep(11, 11, true)
}




//用来记录棋盘上所有落子的点； 并将每个点赋值为0；表示此处没有落过子
var chessCount = [];


for (var i = 0; i < 15; i++) {
    chessCount[i] = [];
    for (var j = 0; j < 15; j++) {
        chessCount[i][j] = 0
    }
}




//点击棋盘下子
chess.onclick = function (e) {

	if(over || me == false) return;
    var x = e.offsetX,
        y = e.offsetY;

    x = Math.floor(x / 30);
    y = Math.floor(y / 30);


    //因为棋盘上所有可以落子的点都为0；所以 chessCount==0;表示此处没有棋子
    if (chessCount[x][y] == 0) {
        onStep(x, y, me);
        //xy这个坐标刚才已经落过子了，所以将此项设置为一个不可能用到的值88
        chessCount[x][y] = 88;
        for (var k = 0; k < winCount; k++) {
            if (wins[x][y][k]) {
                myWin[k]++;
                computerWin[k] = 999;
                if (myWin[k] == 5) {
                    alert('你赢了');
                    over = true;
                }
            }
        }
        //判断对局是否没结束，如果是将换成电脑下子
        if (over == false) {
            me = !me;
            computer();
        }
    }

}




// 计算机所有的落子要基于一个赢法算法所以先做一个赢法数组，这个数组包含了，在这个15*15棋盘上的所有赢法可能性


var wins = [];

for (var i = 0; i < 15; i++) {
    wins[i] = [];
    for (var j = 0; j < 15; j++) {
        wins[i][j] = [];
    }
}




//赢法总类统计，   winCount 统计各类赢法， 所有横向的赢法，纵向的赢法，正斜和反斜的赢法
var winCount = 0;

//横   所有横向的赢法  14行，   到第11列（包括第11）以后都不可能赢了   因为没有第十五个子
for (var i = 0; i < 15; i++) {
    for (var j = 0; j < 11; j++) {
        for (var k = 0; k < 5; k++) {   //第一次遍历进来，winCount是0    代表这是第1中赢法， 
            wins[i][j + k][winCount] = true;
        }
        winCount++;                      //跳出k的遍历 遍历一圈之后wincount+1  n那么下次进入的时候就是第2中赢法了
    }
}

//纵   所有纵向的赢法
for (var i = 0; i < 15; i++) {
    for (var j = 0; j < 11; j++) {
        for (var k = 0; k < 5; k++) {
            wins[j + k][i][winCount] = true;
        }
        winCount++;
    }
}


for (var i = 0; i < 11; i++) {//斜
    for (var j = 0; j < 11; j++) {
        for (var k = 0; k < 5; k++) {
            wins[i + k][j + k][winCount] = true;
        }
        winCount++;
    }
}


for (var i = 0; i < 11; i++) {//斜
    for (var j = 0; j < 11; j++) {
        for (var k = 0; k < 5; k++) {
            wins[i + k][j + k][winCount] = true;
        }
        winCount++;
    }
}
for (var i = 0; i < 11; i++) {//反斜
    for (var j = 14; j > 3; j--) {
        for (var k = 0; k < 5; k++) {
            wins[i + k][j - k][winCount] = true;
        }
        winCount++;
    }
}


for (var i = 0; i < winCount; i++) {
    myWin[i] = 0;
    computerWin[i] = 0;
}


var computer = function () {
    //定义变量，分数统计数组和坐标存储变量
    var myScore = [],
        computerScore = [],
        max = u = v = 0;
    //分数统计初始化
    for (var i = 0; i < 15; i++) {
        myScore[i] = [];
        computerScore[i] = [];
        for (var j = 0; j < 15; j++) {
            myScore[i][j] = 0;
            computerScore[i][j] = 0;
        }
    }
    //分数（权重）统计&计算，获取坐标
    for (var i = 0; i < 15; i++) {
        for (var j = 0; j < 15; j++) {
            //判断当前位置是否没有落子
            if (chessCount[i][j] == 0) {
                //计算分数
                for (var k = 0; k < winCount; k++) {
                    if (wins[i][j][k]) {
                        switch (myWin[k]) {
                            case 1: myScore[i][j] += 200;
                                break;
                            case 2: myScore[i][j] += 400;
                                break;
                            case 3: myScore[i][j] += 2000;
                                break;
                            case 4: myScore[i][j] += 10000;
                            //break;
                        }

                        switch (computerWin[k]) {
                            case 1: computerScore[i][j] += 220;
                                break;
                            case 2: computerScore[i][j] += 420;
                                break;
                            case 3: computerScore[i][j] += 2100;
                                break;
                            case 4: computerScore[i][j] += 20000;
                            //break;
                        }
                    }
                }
                //通过判断获取最优的落子点
                if (myScore[i][j] > max) {
                    max = myScore[i][j];
                    u = i;
                    v = j;
                } else if (myScore[i][j] == max) {
                    if (computerScore[i][j] > computerScore[u][v]) {
                        u = i;
                        v = j
                    }
                }

                if (computerScore[i][j] > max) {
                    max = computerScore[i][j];
                    u = i;
                    v = j;
                } else if (computerScore[i][j] == max) {
                    if (myScore[i][j] > myScore[u][v]) {
                        u = i;
                        v = j
                    }
                }
            }
        }
    }
    onStep(u, v, me);
    chessCount[u][v] = 2;
    //判断当前落点是否已有棋子，如果没有则落子成功，如果有则后台提示
    for (var k = 0; k < winCount; k++) {
        if (wins[u][v][k]) {
            computerWin[k]++;
            myWin[k] = 999;
            if (computerWin[k] == 5) {
                alert('计算机赢了');
                over = true;
            }
        }
    }
    if (over == false) {
        me = !me;
    }
}

