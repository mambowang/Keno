var piece = cc.Class({
    name: 'info',
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
            type: [piece]
        },
        pieces:{
            default:[],
            type:cc.Prefab
        },
    },

    onLoad: function () {
        this.pieces = [];
        for (var i = 0; i < this.targetAry.length; ++i) {
            var num = this.targetAry[i].num;
            var target = this.targetAry[i].target;
            for(var j = 0; j < num; j++)
            {
                this._createItem(target, j+1);
            }
        }
        //var item = this.pieces[0];
        //var temp = item.getComponentInChildren(cc.Label);
        //var image = cc.url.raw("resources/piece_check_back.png");
        //var sprite =  item.getComponentInChildren(cc.Sprite);
        //sprite.spriteFrame = new cc.SpriteFrame(image);
    },

    _createItem: function (parentNode, idx) {
        var item = cc.instantiate(this.itemTemp);
        this.pieces.push(item);
        var label = this.pieces[idx-1].getComponentInChildren(cc.Label);
        label.string = idx;
        this.pieces[idx-1].select = false;
        this.pieces[idx-1].check = false;
        this.pieces[idx-1].parent = parentNode;
    },

    update: function (dt) {
       
    }
});
