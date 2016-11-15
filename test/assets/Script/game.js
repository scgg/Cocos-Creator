const animation = require('getAnimate');
cc.Class({
    extends: cc.Component,

    properties: {
        aT: cc.Node,
        aP: cc.Node,
        aD: cc.Node,
        bT: cc.Node,
        bP: cc.Node,
        bD: cc.Node,
        winner: cc.Label,
        
        TLife: 1000,
        otherLife: 700,
    },
    init: function() {
        this.aT.life = this.TLife;
        this.aT.currlife = this.TLife;
        this.aP.life = this.otherLife;
        this.aP.currlife = this.otherLife;
        this.aD.life = this.otherLife;
        this.aD.currlife = this.otherLife;
        
        this.bT.life = this.TLife;
        this.bT.currlife = this.TLife;
        this.bP.life = this.otherLife;
        this.bP.currlife = this.otherLife;
        this.bD.life = this.otherLife;
        this.bD.currlife = this.otherLife;
        
        this.Asufferer = 0;
        this.Bsufferer = 0;
        this.Awrecker = 0;
        this.Bwrecker = 0;
        this.isFighter = 1;
        this.MaxMoveSpeed = 1;
        this.gameOver = 0;
        
    },
    //随机数，扣血量
    GetRandomNum: function(Min,Max) {   
        let Range = Max - Min;   
        let Rand = Math.random();   
        this.Kblood = (Min + Math.round(Rand * Range));   
    },
    //得到Sprite的X,Y,Width,Height
    getInfo: function(role) {
        let X = role.x;
        let Y = role.y;
        let Width = role.width;
        let Height =  role.height;
        // array[0] = X;
        // array[1] = Y;
        // array[2] = Width;
        // array[3] = Height;
        let array = new Array(X,Y,Width,Height);
        return array;
    },
    //两个Sprite之间的距离
    range: function(role1,role2) {
        let arr1 = this.getInfo(role1);
        let arr2 = this.getInfo(role2);
        if(arr1[0] < arr2[0]) {
            let oneToTwoX = arr2[0] - arr1[0] - 100;
            let oneToTwoY = arr2[1] - arr1[1];
            let array = new Array(oneToTwoX,oneToTwoY);
            return array;
        } else {
            let twoToOneX = arr2[0] - arr1[0] + 100;
            let twoToOneY = arr2[1] - arr1[1];
            let array1 = new Array(twoToOneX,twoToOneY);
            return array1;
        }
    },
    
     //肇事者
    isWrecker: function() {
        if(this.isFighter == 1) 
        {
            while(this.FactionArrayOne[this.Awrecker].currlife <= 0) 
            {
                this.Awrecker ++;
            }
            let xx = this.FactionArrayOne[this.Awrecker];
            this.Awrecker ++;
            if(this.Awrecker > this.FactionArrayOne.length - 1) {this.Awrecker = 0;}
            this.isFighter = 2;
            return xx;
        }else
        {
            while(this.FactionArrayTwo[this.Bwrecker].currlife <= 0) 
            {
                this.Bwrecker ++;
            }
            let ss = this.FactionArrayTwo[this.Bwrecker];
            this.Bwrecker ++;
            if(this.Bwrecker > this.FactionArrayTwo.length - 1) {this.Bwrecker = 0;}
            this.isFighter = 1;
            return ss;
        }
    },
    //受害人
    isSufferer: function() {
        if(this.isFighter == 1) 
        {
            if(this.FactionArrayOne[this.Asufferer].currlife > 0)
            {
                return this.FactionArrayOne[this.Asufferer];
            }else{
                this.Asufferer ++;
                return this.FactionArrayOne[this.Asufferer];
            }
        }
        else
        {
            if(this.FactionArrayTwo[this.Bsufferer].currlife > 0)
            {
                return this.FactionArrayTwo[this.Bsufferer];
            }else{
                this.Bsufferer ++;
                return this.FactionArrayTwo[this.Bsufferer];
            }
        }
    },
    
    move: function(role1,role2) {  
        var self = this;
        let array = self.range(role1,role2);
        
        let moveT = cc.moveBy(self.MaxMoveSpeed, cc.p(array[0],array[1]));
        let callBack = cc.callFunc(function() {
            animation.attackDown(role1);
            //每次攻击加0.2能量
            // for (let i = 0; i < self.FactionArrayOne.length; i++) {
            //     if(role1 == self.FactionArrayOne[i]) {
            //         role1.NL.progress += 0.3;
            //         if(role1.NL.progress > 1) {role1.NL.progress = 1;}
            //     }else if(role2 == self.FactionArrayOne[i]) {
            //         role2.NL.progress += 0.2;
            //         if(role2.NL.progress > 1) {role2.NL.progress = 1;}
            //     }
            // }
        },self);
        let delay = cc.delayTime(0.5);
        let klife = cc.callFunc(function(){
            self.kLife();
        },self);
        let delay2 = cc.delayTime(0.3);
        let ending = cc.callFunc(function(){
            animation.readyDown(role1);
            if(role2.currlife > 0){
                animation.readyDown(role2);
            }else{
                animation.death(role2);
            }
        },self);
        let moveBac = cc.moveBy(self.MaxMoveSpeed, cc.p(-array[0],-array[1]));
        let mBCallBack = cc.callFunc(function() {
            self.fight();
        },self);
        let spawn = cc.spawn(callBack,delay);
        let spawn2 = cc.spawn(klife,delay2);
        let action = cc.sequence(moveT,spawn,spawn2,ending,moveBac,mBCallBack);
        return action;
    },
    
    //战斗
    fight: function() {
        if(this.gameOver == 0) {
            var wrecker = this.isWrecker();
            var sufferer = this.isSufferer();
            wrecker.runAction(this.move(wrecker,sufferer));
        }
    },
    //扣血
    kLife: function() {
        //随机数
        this.GetRandomNum(100, 300);
        let sufferer = this.isSufferer();
        animation.hitDown(sufferer);
        sufferer.currlife -= this.Kblood;
        // sufferer.ProgressBar.progress = sufferer.currlife/sufferer.life;
        if(this.FactionArrayOne[0].currlife <= 0 && this.FactionArrayOne[1].currlife <= 0 && this.FactionArrayOne[2].currlife <= 0){
            this.winner.string = "Two Win!!";
            this.gameOver = 1;
        }else if(this.FactionArrayTwo[0].currlife <= 0 && this.FactionArrayTwo[1].currlife <= 0 && this.FactionArrayTwo[2].currlife <= 0){
            this.winner.string = "One Win!!";
            this.gameOver = 1;
        }
    },
    
    // use this for initialization
    onLoad: function () {
        this.init();
        this.FactionArrayOne = [this.aT,this.aP,this.aD];
        this.FactionArrayTwo = [this.bT,this.bP,this.bD];
        this.fight();
    },
    start: function() {
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {
        
    // },
});