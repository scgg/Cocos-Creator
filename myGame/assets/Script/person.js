cc.Class({
    extends: cc.Component,

    properties: {
        xuetiao: cc.ProgressBar,
        label: cc.Label,
        animation: cc.Node,
        currLife: 1000,
        allLife: 1000,

    },

    KLife: function (hurt) {
        var self = this;
        if(!hurt){
            return;
        }
        self.label.string = "-" + hurt;
        self.currLife -= hurt; 
        self.xuetiao.progress = self.currLife/self.allLife;

        self.scheduleOnce(function (dt) {
            self.label.string = null;

        }, 2);
    },
    // use this for initialization
    onLoad: function () {
        
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {
      
    // }
});

