var ball = cc.Class({
    name: 'ball',
    properties: {
        target: cc.Node,
        num: 0
    }
});
cc.Class({
    extends: cc.Component,

    properties: {
        itemTemp: {
            default: null,
            type: cc.Prefab
        },
        targetAry: {
            default: [],
            type: [ball]
        },
        balls:{
            default:[],
            type:cc.Prefab
        },
        actionIndex:0
    },

    onLoad: function () {
        this.balls = [];
        var num = this.targetAry[0].num;
        var target = this.targetAry[0].target;
        this.actionIndex = 0;
        for(var j = 0; j < num; j++)
        {
            this._createItem(target, j);
        }
    },
    _createItem: function (parentNode, idx) {
        var item = cc.instantiate(this.itemTemp);
        var image = cc.url.raw("resources/ball.png");
        var sprite =  item.getComponent(cc.Sprite);
        var img_pos = Math.ceil(cc.random0To1()*5)-1;
        sprite.spriteFrame = new cc.SpriteFrame(image,cc.rect(70*img_pos,0,70,70));
        item.setPosition(cc.p(-431,207-47*((idx>7)?7:idx)));
        this.balls.push(item);
        this.balls[idx].parent = parentNode;
    },
    actionPlay:function()
    {
        var target = this.targetAry[0].target;
        var value = this.node.parent.getComponent("game").gameValue[this.actionIndex]-1;
        cc.log(value);
        //통통 튀는 action
        var yValue = 220-parseInt(value/10)*60;
        var xValue = -305+parseInt(value%10)*60;
        cc.log("action"+this.actionIndex+":"+xValue);
        var jump1 = cc.jumpTo(0.5,cc.p(xValue-100,yValue),600,1);
        var jump2 = cc.jumpTo(0.5,cc.p(xValue-50,yValue),300,1);
        var jump3 = cc.jumpTo(0.4,cc.p(xValue-25,yValue),100,1);
        var jump4 = cc.jumpTo(0.3,cc.p(xValue,yValue),50,1);
        var ping_action = cc.sequence(jump1,jump2,jump3,jump4);
        var callback = new cc.CallFunc(this.myCallBack,this,this.actionIndex);
        this.balls[this.actionIndex].runAction(new cc.Sequence(ping_action, callback));
        var audio = cc.url.raw("resources/sound/ball.mp3");
        cc.audioEngine.play(audio,false,1);
        // 우로 올려미는 action
        for(var i=this.actionIndex+1;i<this.balls.length;i++)
        {
            var moveby = cc.moveBy(0.1,cc.p(0,47));
            this.balls[i].runAction(moveby);
        }
        this.actionIndex++;
        this._createItem(target,7+this.actionIndex);
        var scaleAction1 = cc.scaleTo(0,0);
        var scaleAction2 = cc.scaleTo(0.1,1);
        var scaleAction = cc.sequence(scaleAction1,scaleAction2);
        this.balls[this.balls.length-1].runAction(scaleAction);
    },
    actionStart:function()
    {
        this.clearBalls();
        this.actionIndex = 0;
        this.schedule(function(){
            this.actionPlay();
           },0.3,19);
    },
    clearBalls:function()
    {
        var length = this.balls.length;
        for(var i=0;i<length-8;i++)
        {
            this.balls[i].removeFromParent();
        }
        if(length>20)this.balls.splice(0,20);
    },
    myCallBack:function(self, param)
    {
        if(param===19)this.node.parent.getComponent("game").check();
    },
    update: function (dt) {
       
    }
});
