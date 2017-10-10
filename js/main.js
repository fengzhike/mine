    var boardNum = 100;
    var nLevel = Math.sqrt( boardNum );
    var jsonLevel = {10:'初级',40:'中级',90:'高级'};
    var numColor = ['#333', '#0000ff','#008000','#ff0000','#ffff00','#00ff00','#ff00ff','#990099'];

        var oMain = $('#main');
        var oPrev = $('#prev'),
            oNext = $('#next'),
            oStart = $('#start');

        //creat(oMain,boardNum);
        var aDiv = $('div',oMain);
        
        /////默认显示100方块////////////////////////////////////////////
        var str = '';
        var lineN =  Math.sqrt( boardNum );
        var w =600/lineN;
        //alert(lineN);
        for(var i=0;i< boardNum ;i++){
           str+='<div style = "width:'+(w-4)+'px;height:'+(w-4)+'px;top:'+Math.floor(i/lineN)*w +'px;left:'+ (i%lineN)*w + 'px;"></div>';
        };
        oMain.innerHTML = str;
        
        oMain.onclick=function(){
            alert('请点击 "开始游戏" !') ;
        }
        oStart.onclick=function(){
            gameOn(oMain);
        }

        oPrev.onclick = function(){
            nLevel-=10;
            if( nLevel<10 ){
                nLevel=10;
                alert('已经是初级难度了');
            };
            boardNum = nLevel*nLevel;
            gameOn(oMain);
        };
        oNext.onclick = function(){
            nLevel+=10;
            if( nLevel>30 ){
                nLevel = 30;
                alert('已经是高级难度了');
            };
            boardNum = nLevel*nLevel;
            gameOn(oMain);
        }



     //游戏运行////////////////////////////////////////////////////////////////////////////////
    function gameOn(obj){
        //游戏开始先清定时器/////////////////////////
        clearInterval( obj.timer );
        obj.timer = null;
        obj.onclick = null;
        creat(obj,boardNum);
        var aDiv = $('div',obj);
        var size = 600/ Math.sqrt( boardNum ) -4;
        //alert(aDiv.length)
        var success = 0;
        var time = 0;
        var oTime = $('#timePass');
        var weepNumL = boardNum/10;
        var oMineNumL = $('#mineNumL')
        oTime.innerHTML = time + 's';
        for(var i=0;i< aDiv.length ;i++){
            aDiv.openOnoff = false;
            aDiv[i].onclick = function(ev){
                //console.log(this.openOnoff )
                if( this.openOnoff ) return;
                if(this.flag==1||this.flag==2) return;
                ev = ev||event;
                ev.cancelBubble = true;
                if( this.mine === true ){
                    for(var j=0;j< aDiv.length ;j++){
                        if( aDiv[j].mine ===true ){
                            aDiv[j].style.background = 'url(./img/dl.png)';
                            aDiv[j].style.backgroundSize = size + 'px';
                        }
                    };
                    setTimeout(function(){
                        alert('游戏结束');
                        return gameOn( obj );
                    }, 100);     
                }else{
                    this.style.background = '';
                    this.className = 'open';

                    success++; 
                    this.openOnoff = true;
                    if( this.zero ===0 ){
                        openZero( this.index )
                    }
                    //console.log(success , boardNum*0.9)
                    if( success >= boardNum*0.9){
                        if( window.confirm('游戏通关!\n点击“确定”继续下一关;点击“取消”重玩本关') ){
                            nLevel+=10;
                            if( nLevel>30 ){
                                nLevel = 30;
                                alert('已经是高级难度了');
                            };
                            boardNum = nLevel*nLevel;
                            gameOn(obj);
                        }else{
                            gameOn(obj);
                        }
                    }
                };
                  //游戏用时//////////////
                if( obj.timer ) return;
                obj.timer = setInterval(function(){
                    time++;
                    oTime.innerHTML = time + 's';
                } , 1000);
            }
        //右键，小旗//////////////////////////////////////
            aDiv[i].flag = 0;
            aDiv[i].onmousedown = function(ev){
                ev = ev||event;
                section.oncontextmenu = function(ev){
                    return false;
                };
                if( !this.openOnoff){
                    if( ev.button ===2 ){
                        if(this.flag ===0){
                            this.style.background = 'url(./img/flag.png)';
                            this.style.backgroundSize = size + 'px';
                            this.flag = 1;
                            weepNumL--;
                            oMineNumL.innerHTML = weepNumL;
                        }else if(this.flag === 1){
                            this.style.background = 'url(./img/flag2.png)';
                            this.style.backgroundSize = size + 'px';
                            this.flag = 2;
                            weepNumL++;
                            oMineNumL.innerHTML = weepNumL;
                        }else{
                            this.style.background = '#c2c2c2';
                            //alert(1)
                            this.flag = 0;
                        }
                    }
                }
            }
        };
        ///递归开0;///////////////////////
        function openZero(i){
            var arr = count(i,boardNum);
            for(var j=0;j< arr.length ;j++){
                if( aDiv[ arr[j] ].openOnoff === true ) continue;
                if( aDiv[ arr[j] ].flag !== 0 ) continue;

                aDiv[ arr[j] ].style.background = '';
                aDiv[ arr[j] ].className = 'open';
                success++;
                aDiv[ arr[j] ].openOnoff = true;
                if(aDiv[ arr[j] ].zero === 0 ){
                    openZero( arr[j] );
                }
            }
        }             
    }
      ///生成方块和地雷//////////////////////////////////////////////////////
    function creat(obj,boardNum){
        ////生成方块////////////////////////////////////////////////////
        var str = '';
        var lineN =  Math.sqrt( boardNum );
        var w =600/lineN;
        //alert(lineN);
        for(var i=0;i< boardNum ;i++){
           str+='<div style = "width:'+(w-4)+'px;height:'+(w-4)+'px;top:'+Math.floor(i/lineN)*w +'px;left:'+ (i%lineN)*w +'px;"></div>';
        };
        obj.innerHTML = str;  
        //生成地雷//////////////////////////////////////////////////////////////////
        var weepNum = boardNum/10;
        var aDiv = $('div',obj);
        var arr = [];
        //alert(aDiv.length)
        for(var j=0;j<aDiv.length;j++){
            aDiv[j].index = j;
            aDiv[j].mine = false;
            aDiv[j].style.lineHeight = (w-2) +'px';
            arr.push(j);
        };
        arr.sort(function(){
            return Math.random() - 0.5;
        });
        var newArr = arr.splice(0,weepNum);
        for(var k = 0;k<newArr.length;k++){
            aDiv[ newArr[k] ].innerHTML = '地雷';
            aDiv[ newArr[k] ].mine = true;
        };
        var oMineNum = $('#mineNum');
        var oMineNumL = $('#mineNumL');
        var oLevel = $('#level');
        oMineNum.innerHTML = weepNum;
        oMineNumL.innerHTML = weepNum;
        oLevel.innerHTML = jsonLevel[weepNum];

        //////写上雷的个数///////////////////////////////////////////////////////////////////
        for(var m=0;m< aDiv.length ;m++){
            var arrMin =count( m,boardNum );
            var con =0 ;
            aDiv[m].zero = 1;
            if( !aDiv[m].mine){
                for(var n=0;n<arrMin.length;n++){
                    if( aDiv[ arrMin[n] ].mine === true ){
                        con++;
                    };  
                };
                if( con ===0 ){
                    aDiv[m].zero = 0;
                }else{
                    aDiv[m].innerHTML = con;
                    aDiv[m].style.color = numColor[con-1];
                }
                
            }
        }   
};
        ///////方格算法///////////////
function count(a,num){
        var lineN =  Math.sqrt( num );//一行个数，也是行数
        var arr1 = [];
        if(a%lineN == 0 && a!=0 &&a!=(num-lineN) ){
            arr = [a-lineN,a+lineN,a+1,a+1-lineN,a+1+lineN] ;
        }else if(a%lineN == (lineN-1) && a!=(lineN-1) && a!=(num-1) ){
            arr = [a-lineN,a+lineN,a-1,a-1+lineN,a-1-lineN] ;
        }else if(Math.floor(a/lineN)==0 && a!=0 && a!=(lineN-1)){
            arr = [a-1,a+1,a-1+lineN,a+lineN,a+1+lineN] ;
        }else if(Math.floor(a/lineN)==(lineN-1) && a!=(num-lineN) && a!=(num-1) ){
            arr = [a-1,a+1,a-1-lineN,a-lineN,a+1-lineN] ;  
        }else if( a==0){
            arr = [1,lineN,lineN+1];
        }else if( a==(lineN-1)){
            arr = [lineN-2,lineN*2-2,lineN*2-1];
        }else if( a==num-lineN ){
            arr = [num-lineN*2,num-lineN*2+1,num-lineN+1];
        }else if( a==(num-1)){
            arr = [num-2,num-2-lineN,num-1-lineN];
        }else{
            arr = [a-1-lineN,  a-lineN , a+1-lineN,a-1,a+1,a-1+lineN, a+lineN ,a+1+lineN];
        };
        return arr;
}