
cc.Class({
    extends: cc.Component,

    properties: {
        numlabel:{
            default:null,
            type:cc.Label
        },
        select:false,
        check:false,
        animationFlag:false
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.select = false;
        cc.log(this.name);
        this.node.on("touchend",function(){
            if(this.node.parent.parent.getComponent("game").gameFlag === true)return;
            var image;
            if(this.select === false)
            {
                if(this.node.parent.parent.getComponent("game").select_num === 10)
                {
                    return;
                }
                image = cc.url.raw("resources/piece_select_back.png");
                this.node.parent.parent.getComponent("game").currentAddSelectIndex = this.numlabel.string;
                this.node.dispatchEvent(new cc.Event.EventCustom("AddNumber",true));
            }
            else 
            {
                image = cc.url.raw("resources/piece_normal_back.png");
                this.node.parent.parent.getComponent("game").currentDelSelectIndex = this.numlabel.string;
                this.node.dispatchEvent(new cc.Event.EventCustom("DelNumber",true));
            }
            var audio = cc.url.raw("resources/sound/piece.mp3");
            cc.audioEngine.play(audio,false,1);
            this.select = !this.select;
            var sprite = this.node.getComponent(cc.Sprite);
            sprite.type = cc.Sprite.Type.SLICED;
            sprite.spriteFrame = new cc.SpriteFrame(image);
            
        },this);
        this.node.on(cc.Node.EventType.MOUSE_ENTER,this.mouseOver);
        this.node.on(cc.Node.EventType.MOUSE_LEAVE,this.mouseLeave);
    },
    mouseOver:function(event)
    {
        var that = this.getComponent("itemSelect");
        if(that.node.parent.parent.getComponent("game").gameFlag === false)
        {
            cc.log("button_mouse_over");
        }
    },
    mouseLeave:function(object)
    {
        cc.log("button_mouse_leave");
    },
    // update (dt) {},
});
