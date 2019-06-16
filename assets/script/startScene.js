
cc.Class({
    extends: cc.Component,

    properties: {
        btnPlay:{
            default:null,
            type:cc.Button
           },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {},

    start () {
        //cc.view.resizeWithBrowserSize(true);
        //cc.view.setDesignResolutionSize(1024, 768, cc.ResolutionPolicy.EXACT_FIT);
        cc.screen.fullScreen();
        cc.audioEngine.stopAll();
        var audio = cc.url.raw("resources/sound/bg.mp3");
        cc.audioEngine.play(audio,true,1);
        this.btnPlay.node.on(cc.Node.EventType.MOUSE_ENTER,this.mouseOver);
        this.btnPlay.node.on(cc.Node.EventType.MOUSE_LEAVE,this.mouseLeave);
    },
    play:function()
    {
        cc.director.loadScene("main_game");
    },
    mouseOver:function()
    {
        cc.log("btnplay_mouse_over");
    },
    mouseLeave:function()
    {
        cc.log("btnplay_mouse_leave");
    },
    // update (dt) {},
});
