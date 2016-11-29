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
    //得到Sprite的X,Y,Width,Height
    getInfo: function(role) {
        var X = role.x;
        var Y = role.y;
        var Width = role.width;
        var Height =  role.height;
        // array[0] = X;
        // array[1] = Y;
        // array[2] = Width;
        // array[3] = Height;
        var array = new Array(X,Y,Width,Height);
        return array;
    },
    //两个Sprite之间的距离
    range: function(role1,role2) {
        var arr1 = this.getInfo(role1);
        var arr2 = this.getInfo(role2);
        if(arr1[0] < arr2[0]) {
            var oneToTwoX = arr2[0] - arr1[0] - 100;
            var oneToTwoY = arr2[1] - arr1[1];
            var array = new Array(oneToTwoX,oneToTwoY);
            return array;
        } else {
            var twoToOneX = arr2[0] - arr1[0] + 100;
            var twoToOneY = arr2[1] - arr1[1];
            var array1 = new Array(twoToOneX,twoToOneY);
            return array1;
        }
    },
    initPrefabA : function(pref,position) {
        var prefab = cc.instantiate(pref);
        prefab.parent = this.node;
        prefab.position = position;
    },
    initPrefabB : function(pref,position) {
        var prefab = cc.instantiate(pref);
        prefab.scaleX = -1;
        prefab.parent = this.node;
        prefab.position = position;
    },
    //肇事者
    isWrecker: function() {
        if(this.isFighter == 1) 
        {
            var xx = this.person[this.Awrecker];
            this.Awrecker ++;
            if(this.Awrecker > this.person.length - 1) {this.Awrecker = 0;}
            this.isFighter = 2;
            return xx;
        }else
        {
            var ss = this.person[this.Bwrecker];
            this.Bwrecker ++;
            if(this.Bwrecker > this.person.length - 1) {this.Bwrecker = 0;}
            this.isFighter = 1;
            return ss;
        }
    },
    //受害人
    isSufferer: function() {
        if(this.isFighter == 1) 
        {
            var xx = this.person[this.Asufferer];
            this.Asufferer ++;
            return xx;
        }
        else
        {
            var zz = this.person[this.Bsufferer];
            this.Bsufferer ++;
            return zz;
        }
    },
    //战斗
    fight: function() {
            var wrecker = this.isWrecker();
            var sufferer = this.isSufferer();
            wrecker.runAction(this.move(wrecker,sufferer));
    },
    move: function(role1,role2) {  
        var self = this;
        var array = self.range(role1,role2);
        var moveT = cc.moveBy(1, cc.p(array[0],array[1]));
        var moveBac = cc.moveBy(1, cc.p(-array[0],-array[1]));
        var action = cc.sequence(moveT,moveBac);
        return action;
    },
    init: function() {
        
        let witdh = this.node.width;
        let height = this.node.height;
        
        let A1 = cc.p(witdh / 6, height * 3 / 4 - 30);
        let A2 = cc.p(witdh / 6, height / 2 - 60);
        let A3 = cc.p(witdh / 6, height / 4 - 100);
        let A4 = cc.p(witdh * 2 / 6, height * 3 / 4 - 30);
        let A5 = cc.p(witdh * 2 / 6, height / 2 - 60);
        let A6 = cc.p(witdh * 2 / 6, height / 4 - 100);
        
        let B1 = cc.p(witdh * 4 / 6, height * 3 / 4 - 30);
        let B2 = cc.p(witdh * 4 / 6, height / 2 - 60);
        let B3 = cc.p(witdh * 4 / 6, height / 4 - 100);
        let B4 = cc.p(witdh * 5 / 6, height * 3 / 4 - 30);
        let B5 = cc.p(witdh * 5 / 6, height / 2 - 60);
        let B6 = cc.p(witdh * 5 / 6, height / 4 - 100);

        this.APositionArray = [A1,A2,A3,A4,A5,A6];
        this.BPositionArray = [B1,B2,B3,B4,B5,B6];
        
        this.person = [this.aP,this.aD,this.aT,this.bP,this.bD,this.bT];
        
        // for(var i = 0; i < this.APositionArray.length; i++)
        // {
        //     this.initPrefabA(this.person[i],this.APositionArray[i]);
        // }
        // for(var j = 0; j < this.BPositionArray.length; j++)
        // {
        //     this.initPrefabB(this.person[j],this.BPositionArray[j]);
        // }
        
        this.Awrecker = 0;
        this.Bwrecker = 0;
        this.Bsufferer = 0;
        this.Asufferer = 0;
        this.isFighter = 1;
    },
    // use this for initialization
    onLoad: function () {
        this.init();
        // this.fight();
        // this.initPrefabB(this.person[0],this.BPositionArray[0]);
        var prefab = cc.instantiate(this.person[0]);
        var button = prefab.addComponent(cc.Button);
        button.node.on(cc.Node.EventType.TOUCH_END,function(event){
            log("xxxx");
        });
        prefab.scaleX = -1;
        prefab.parent = this.node;
        prefab.position = this.BPositionArray[0];


    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
