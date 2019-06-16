cc.Class({
    extends: cc.Component,

    properties: {
       main_board:{
           default:null,
           type:cc.Layout
       },
       pingball_layout:{
           default:null,
           type:cc.Layout
       },
       hitLabels:{
           default:[],
           type:cc.Label
       },
       payLabels:{
           default:[],
           type:cc.Label
       },
       myMoneyLabel:
       {
           default:null,
           type:cc.Label
       },
       WinMoneyLabel:
       {
           default:null,
           type:cc.Label
       },
       PayMoneyLabel:
       {
           default:null,
           type:cc.Label
       },
       btnPlayOne:{
           default:null,
           type:cc.Button
       },
       btnPlayFive:{
        default:null,
        type:cc.Button
       },
       btnUndo:{
        default:null,
        type:cc.Button
       },
       btnClear:{
        default:null,
        type:cc.Button
       },
       btnMinus:{
        default:null,
        type:cc.Button
       },
       btnPlus:{
        default:null,
        type:cc.Button
       },
       btnExit:{
        default:null,
        type:cc.Button
       },
       effect:{
           default:null,
           type:cc.ParticleSystem
       },
       roundLabel:{
            default:null,
            type:cc.Label
       },
       pingball:{
           default:null,
           type:cc.Prefab
       },
       select_num:0,
       gameRule:[[]],
       actionIndex:[],
       actionTime:0,
       actionStartIndex:0,
       gameValue:[],
       currentAddSelectIndex:-1,
       currentDelSelectIndex:-1,
       selectNumbers:[],
       animationFlag:false,
       gameFlag:false,
       matchNum:0,
       payoutsIndex:-1,
       gameAnimationCheckNum:0,
       payMoneyValues:[],
       playNum:1,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        
    },
    mouseOver:function(event)
    {
        var that = this.parent.getComponent("game");
        var flag;
        cc.log(this.name);
        switch(this.name)
        {
            case "btn_minus":flag = that.btnMinus.interactable;break;
            case "btn_plus":flag = that.btnPlus.interactable;break;
            case "btn_playOne":flag = that.btnPlayOne.interactable;break;
            case "btn_playFive":flag = that.btnPlayFive.interactable;break;
            case "btn_undo":flag = that.btnUndo.interactable;break;
            case "btn_clear":flag = that.btnClear.interactable;break;
            case "btn_exit":flag = true;break; 
        }
        if(flag === true)
        {
            cc.log("button_mouse_over");
        }
    },
    mouseLeave:function(object)
    {
        cc.log("button_mouse_leave");
    },
    exit:function()
    {
        cc.director.loadScene("start_scene");
    },
    start () {
        this.btnMinus.node.on(cc.Node.EventType.MOUSE_ENTER,this.mouseOver);
        this.btnMinus.node.on(cc.Node.EventType.MOUSE_LEAVE,this.mouseLeave);
        this.btnPlus.node.on(cc.Node.EventType.MOUSE_ENTER,this.mouseOver);
        this.btnPlus.node.on(cc.Node.EventType.MOUSE_LEAVE,this.mouseLeave);
        this.btnPlayOne.node.on(cc.Node.EventType.MOUSE_ENTER,this.mouseOver);
        this.btnPlayOne.node.on(cc.Node.EventType.MOUSE_LEAVE,this.mouseLeave);
        this.btnPlayFive.node.on(cc.Node.EventType.MOUSE_ENTER,this.mouseOver);
        this.btnPlayFive.node.on(cc.Node.EventType.MOUSE_LEAVE,this.mouseLeave);
        this.btnUndo.node.on(cc.Node.EventType.MOUSE_ENTER,this.mouseOver);
        this.btnUndo.node.on(cc.Node.EventType.MOUSE_LEAVE,this.mouseLeave);
        this.btnClear.node.on(cc.Node.EventType.MOUSE_ENTER,this.mouseOver);
        this.btnClear.node.on(cc.Node.EventType.MOUSE_LEAVE,this.mouseLeave);
        this.btnExit.node.on(cc.Node.EventType.MOUSE_ENTER,this.mouseOver);
        this.btnExit.node.on(cc.Node.EventType.MOUSE_LEAVE,this.mouseLeave);
       
        cc.log("start");
        this.select_num = 0;
        this.actionTime = 0;
        this.actionIndex = [];
        this.selectNumbers = [];
        this.gameFlag = false;
        this.btnPlayOne.interactable = false;
        this.btnPlayFive.interactable = false;
        this.effect.enabled = false;
        this.payMoneyValues = ["0.1","0.2","0.3","0.5","1","2","3","5"];
        cc.log(this.payMoneyValues[0]);
        for(var i=0;i<20;i++)
        {
            this.actionIndex.push(0);
            this.gameValue.push(0);
        }
        this.gameRule = [
                         [2,1,0,0,0,0,9,1,0,0,0,0],
                         [3,2,0,0,0,0,47,2,0,0,0,0],
                         [4,3,2,0,0,0,91,5,2,0,0,0],
                         [5,4,3,0,0,0,820,12,3,0,0,0],
                         [6,5,4,3,0,0,1600,70,4,3,0,0],
                         [7,6,5,4,3,0,7000,400,21,2,1,0],
                         [8,7,6,5,4,0,10000,1650,100,12,2,0],
                         [9,8,7,6,5,4,10000,4700,335,44,6,1],
                         [10,9,8,7,6,5,10000,4500,1000,142,24,5],
                        ];

        this.node.on("AddNumber",function(){
            this.select_num++;
            cc.log(this.currentAddSelectIndex);
            this.selectNumbers.push(this.currentAddSelectIndex-1);
            //cc.log(this.node.getChildByName("createPieces").getComponent("createPieces").pieces[this.currentAddSelectIndex-1].select);
            this.node.getChildByName("createPieces").getComponent("createPieces").pieces[this.currentAddSelectIndex-1].select = true;
            this.formatPayouts();
            if(this.select_num >= 2)
            {
                this.buttonSetState(this.btnPlayOne,true);
                this.buttonSetState(this.btnPlayFive,true);
                this.setPayouts();
            }
            else
            {
                this.buttonSetState(this.btnPlayOne,false);
                this.buttonSetState(this.btnPlayFive,false);
            }
            this.clearBoard();
            this.node.getChildByName("createball").getComponent("createBall").clearBalls();
        },this);
     
        this.node.on("DelNumber",function(){
            cc.log(this.select_num);
            this.select_num--;
            cc.log(this.currentDelSelectIndex);
            var arrayIndex = this.selectNumbers.indexOf(this.currentDelSelectIndex-1);
            this.selectNumbers.splice(arrayIndex,1);
            this.node.getChildByName("createPieces").getComponent("createPieces").pieces[this.currentDelSelectIndex-1].select = false;
            this.formatPayouts();
            if(this.select_num >= 2)
            {
                this.buttonSetState(this.btnPlayOne,true);
                this.buttonSetState(this.btnPlayFive,true);
                this.setPayouts();
            }
            else
            {
                this.buttonSetState(this.btnPlayOne,false);
                this.buttonSetState(this.btnPlayFive,false);
            }
            this.clearBoard();
            this.node.getChildByName("createball").getComponent("createBall").clearBalls();
        },this);
       // this.hitLabel1.string = "sdf";
    },
    buttonSetState:function(object,state)
    {
        if(state === false)var btn_image = cc.url.raw("resources/btn_disabled.png");
        else var btn_image = cc.url.raw("resources/btn_normal.png");
        var object_sprite = object.getComponent(cc.Sprite);
        object_sprite.spriteFrame = new cc.SpriteFrame(btn_image);
        object.interactable = state;
    },
    setPayouts:function()
    {
        cc.log(this.select_num);
        for(var i=0;i<6;i++)
        {
            if(this.gameRule[this.select_num-2][i] !== 0)
            {
                this.hitLabels[i].string = this.gameRule[this.select_num-2][i];
                this.payLabels[i].string = this.gameRule[this.select_num-2][i+6];
            }
        }
    },
    formatPayouts:function()
    {
        for(var i=0;i<6;i++)
        {
            this.hitLabels[i].string = "_";
            this.payLabels[i].string = "_";
            this.hitLabels[i].enabled = true;
            this.payLabels[i].enabled = true; 
        }
        var result="";
        for(var i=0;i<this.selectNumbers.length;i++)
        {
            result+=this.selectNumbers[i]+",";
        }
        cc.log(result);
    },
    ////////////////////////////////////////////////Complete Clear board
    allClearBoard:function()
    {
        this.effect.enabled = false;
        this.node.getChildByName("createball").getComponent("createBall").clearBalls();
        this.unscheduleAllCallbacks ();
        for(var i=0;i<80;i++)
        {
            var piece = this.node.getChildByName("createPieces").getComponent("createPieces").pieces[i];
            var image = cc.url.raw("resources/piece_normal_back.png");
            var sprite = piece.getComponent(cc.Sprite);
            sprite.spriteFrame = new cc.SpriteFrame(image);
            piece.check = false;
            piece.select = false;
            piece.getComponent("itemSelect").select = false;
        }
        this.formatPayouts();
        this.buttonSetState(this.btnPlayOne,false);
        this.buttonSetState(this.btnPlayFive,false);
        this.select_num=0;
        this.allClearFlag = true;
        this.selectNumbers = [];
    },
    ////////////////////////////////////////////////Clear board
    clearBoard:function()
    {
        this.effect.enabled = false;
        this.unscheduleAllCallbacks ();
        for(var i=0;i<80;i++)
        {
            var piece = this.node.getChildByName("createPieces").getComponent("createPieces").pieces[i];
            var image = cc.url.raw("resources/piece_select_back.png");
            piece.check = false;
            if(piece.select === true)
            {
                var sprite = piece.getComponent(cc.Sprite);
                sprite.spriteFrame = new cc.SpriteFrame(image);
            }
        }
    },
    ///////////////////////////////////////play_one click event
    gameStart:function()
    {
      //  this.unscheduleAllCallbacks ();
        this.buttonSetState(this.btnPlayOne,false);
        this.buttonSetState(this.btnPlayFive,false);
        this.buttonSetState(this.btnUndo,false);
        this.buttonSetState(this.btnClear,false);
        this.buttonSetState(this.btnPlus,false);
        this.buttonSetState(this.btnMinus,false);
        this.matchNum = 0;
        this.WinMoneyLabel.string = 0;
        var myMoneyValue = parseFloat(this.myMoneyLabel.string) - parseFloat(this.PayMoneyLabel.string);
        this.myMoneyLabel.string = myMoneyValue;
        if(this.payoutsIndex!=-1)
        {
            this.hitLabels[this.payoutsIndex].enabled = true;
            this.payLabels[this.payoutsIndex].enabled = true;
        }
        this.payoutsIndex = -1;
        this.gameAnimationCheckNum = 0;
        this.clearBoard();
        /////////////////////////////////////20 random number
        var result = "result:";
        for(var i=0;i<20;i++)
        {
            var flag = false;
            while(flag === false)
            {
                var value = Math.ceil(cc.random0To1()*80);
                var sameflag = true;
                for(var j=0;j<i;j++)
                {
                    if(this.gameValue[j]===value)sameflag = false;
                }
                if(sameflag === true)
                {
                    this.gameValue[i] = value;
                    var check_piece = this.node.getChildByName("createPieces").getComponent("createPieces").pieces[value-1];
                    check_piece.check = true;
                    flag = true;
                }
            }
            result+=",   "+this.gameValue[i];
            this.actionIndex[i] = 0;
        }
        cc.log(result);
        this.gameFlag = true;
        this.node.getChildByName("createball").getComponent("createBall").actionStart();
    },
    ////////////////////////////////////////////////update event
    update (dt) {

    },
    check:function()
    {
        cc.log("end");
        this.playNum--;
        if(this.playNum === 0)
        {
            this.roundLabel.string = 1;
            this.gameFlag = false;
            this.buttonSetState(this.btnPlayOne,true);
            this.buttonSetState(this.btnPlayFive,true);
            this.buttonSetState(this.btnUndo,true);
            this.buttonSetState(this.btnClear,true);
            this.buttonSetState(this.btnPlus,true);
            this.buttonSetState(this.btnMinus,true);
        }
        else
        {
            this.roundLabel.string++;
            var scale1 = cc.scaleTo(0.5, 2);
            var scale2 = cc.scaleTo(0.5,0)
            var action = cc.sequence(scale1,scale2);
            this.scheduleOnce(function(){
                this.roundLabel.node.runAction(action);
            },2);
            this.scheduleOnce(function(){
                this.gameStart();
            },3);
        }
        for(var i=0;i<20;i++)
        {
            var pieceindex = this.gameValue[i]-1;
            var piece = this.node.getChildByName("createPieces").getComponent("createPieces").pieces[pieceindex];
            if(piece.check === true && piece.select === true)
            {
                var piecelabel = piece.getComponentInChildren(cc.Label);
                cc.log(piecelabel.string);
                this.matchNum++;
            }
        }
        if(this.matchNum != 0)
        {
            for(var i=0;i<this.hitLabels.length;i++)
            {
                if(this.hitLabels[i].string === this.matchNum)this.payoutsIndex = i;
                cc.log(this.hitLabels[i].string+":"+this.matchNum+":"+this.payoutsIndex);
            }
            if(this.payoutsIndex != -1)
            {
                this.WinMoneyLabel.string = this.PayMoneyLabel.string * this.payLabels[this.payoutsIndex].string;
                var myMoneyValue = parseFloat(this.myMoneyLabel.string) + parseFloat(this.WinMoneyLabel.string);
                this.myMoneyLabel.string = myMoneyValue;
                cc.log(myMoneyValue);
                this.effect.enabled = true;
                var audio = cc.url.raw("resources/sound/complete.mp3");
                cc.audioEngine.play(audio,false,1);
            }
            else
            {
                this.WinMoneyLabel.string = 0;
            }
            this.animation();
        }
    },
    animation:function()
    {
        this.schedule(function(){
            this.actionPlay();
        },0.1);
    },
    ////////////////////////////////////////Match된 수자 icon 바탕색 변화 
    actionPlay:function()
    {
       // cc.log(this.animationFlag);
        var image;
        if(this.animationFlag == false)image = cc.url.raw("resources/piece_select_back.png");
        else image = cc.url.raw("resources/piece_normal_back.png");
        var result;
        for(var i=0;i<20;i++)
        {
            var index = this.gameValue[i]-1;
            var piece = this.node.getChildByName("createPieces").getComponent("createPieces").pieces[index];
            if(piece.check === piece.select === true)
            {
                var sprite = piece.getComponent(cc.Sprite);
                sprite.spriteFrame = new cc.SpriteFrame(image);
            }
            result += index+",";
        }
        cc.log(result);
        if(this.payoutsIndex != -1)
        {   
            this.hitLabels[this.payoutsIndex].enabled = this.animationFlag;
            this.payLabels[this.payoutsIndex].enabled = this.animationFlag;
        }
        this.animationFlag = !this.animationFlag;
    },
    ////////////////////////////////////////////////////////////////payMoney plus function
    plusPayMoney:function()
    {
        for(var i=0;i<this.payMoneyValues.length;i++)
        {
            if(this.payMoneyValues[i] === this.PayMoneyLabel.string)
            {
                cc.log(i);
                this.PayMoneyLabel.string = this.payMoneyValues[i+1];
                if(i===this.payMoneyValues.length-2)this.buttonSetState(this.btnPlus,false);
                else this.buttonSetState(this.btnMinus,true);
                break;
            }
        }
    },
    minusPayMoney:function()
    {
        for(var i=0;i<this.payMoneyValues.length;i++)
        {
            if(this.payMoneyValues[i] === this.PayMoneyLabel.string)
            {
                this.PayMoneyLabel.string = this.payMoneyValues[i-1];
                if(i===1)this.buttonSetState(this.btnMinus,false);
                else this.buttonSetState(this.btnPlus,true);
            }
        }
    },
    undoFunc:function()
    {
        if(this.select_num!=0)
        {
            this.clearBoard();
            this.node.getChildByName("createball").getComponent("createBall").clearBalls();
            var index = this.selectNumbers[this.selectNumbers.length-1];
            this.selectNumbers.pop();
            this.select_num--;
            var piece = this.node.getChildByName("createPieces").getComponent("createPieces").pieces[index];
            var image = cc.url.raw("resources/piece_normal_back.png");
            var sprite = piece.getComponent(cc.Sprite);
            sprite.spriteFrame = new cc.SpriteFrame(image);
            piece.check = false;
            piece.select = false;
            piece.getComponent("itemSelect").select = false;
            if(this.select_num<2)
            {
                this.buttonSetState(this.btnPlayOne,false);
                this.buttonSetState(this.btnPlayFive,false);
            }
            this.formatPayouts();
            this.setPayouts();
        }
    },
    playFive:function()
    {
        this.roundLabel.enabled = true;
        var scale1 = cc.scaleTo(0.5, 2);
        var scale2 = cc.scaleTo(0.5,0);
        var action = cc.sequence(scale1,scale2);
        this.roundLabel.node.runAction(action);
        this.playNum = 5;
        this.gameStart();
    },
    playOne:function()
    {
        this.playNum = 1;
        this.gameStart();
    }
});
