cc.Class({
    extends: cc.Component,

    properties: {
        aD: cc.Prefab,
        aP: cc.Prefab,
        aT: cc.Prefab,
        bD: cc.Prefab,
        bP: cc.Prefab,
        bT: cc.Prefab,

    },
    initPrefab : function(pref) 
    {
        var prefab = cc.instantiate(pref);
        prefab.parent = this.node;
        prefab.position = cc.p(0, 0);

    },
    // use this for initialization
    onLoad: function () {
        this.initPrefab(this.aD);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
