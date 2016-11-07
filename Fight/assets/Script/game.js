cc.Class({
    extends: cc.Component,

    properties: {
        T1: {
            default: null,
            type: cc.Node,
        },
        adc1: {
            default: null,
            type: cc.Node
        },
        ap1: {
            default: null,
            type: cc.Node
        },
        T2: {
            default: null,
            type: cc.Node
        },
        adc2: {
            default: null,
            type: cc.Node
        },
        ap2: {
            default: null,
            type: cc.Node
        },
        T1PB: {
            default: null,
            type: cc.ProgressBar
        },
        adc1PB: {
            default: null,
            type: cc.ProgressBar
        },
        ap1PB: {
            default: null,
            type: cc.ProgressBar
        },
        T2PB: {
            default: null,
            type: cc.ProgressBar
        },
        adc2PB: {
            default: null,
            type: cc.ProgressBar
        },
        ap2PB: {
            default: null,
            type: cc.ProgressBar
        },
        winner: {
            default: null,
            type: cc.Label
        },
        missile: {
            default: null,
            type: cc.Node
        },
        speed: {
            default: null,
            type: cc.Button
        },
        btLabel: {
          default: null,
          type: cc.Label
        },
        
        // defaults, set visually when attaching this script to the Canvas
        MaxMoveSpeed: 0,
        T1Life: 1000,
        T2Life: 1000,
        adc1Life: 500,
        adc2Life: 500,
        ap1Life: 500,
        ap2Life: 500,
        Faction: 1,
        fightAnimTime: 0,
        timer: 0,
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
        if(this.Faction == 2)
        {
            var oneToTwoX = arr2[0] - arr1[0] - arr2[2]/2 - arr1[2]/2;
            var oneToTwoY = arr2[1] - arr1[1] - arr2[3]/2 + arr1[3]/2;
            var array = new Array(oneToTwoX,oneToTwoY);
            return array;
        }
        else
        {
            var twoToOneX = arr2[0] - arr1[0] + arr2[2]/2 + arr1[2]/2;
            var twoToOneY = arr2[1] - arr1[1] - arr2[3]/2 + arr1[3]/2;
            var array1 = new Array(twoToOneX,twoToOneY);
            return array1;
        }
    },
    move: function(role1,role2) {   
        var array = this.range(role1,role2);
        var moveT = cc.moveBy(this.MaxMoveSpeed, cc.p(array[0],array[1]));
        var delay = cc.delayTime(this.fightAnimTime);
        var moveBac = cc.moveBy(this.MaxMoveSpeed, cc.p(-array[0],-array[1]));
        var callBack = cc.callFunc(function()
        {
            var animState = this.animCtrl.playAdditive();
            if(this.fightSpeed == 1)
            {
                animState.speed = 0.3;
            }
            else
            {
                animState.speed = 0.6;
            }
            this.kLife();
        },this);
        var spawn = cc.spawn(callBack,delay);
        var action = cc.sequence(moveT,spawn,moveBac);
        return action;
    },
    fireTo: function(role) {
        var array = this.range(this.missile, role);
        var moveT = cc.moveBy(this.MaxMoveSpeed, cc.p(array[0],array[1]));
        var moveBac = cc.moveBy(0, cc.p(-array[0],-array[1]));
        var delay = cc.delayTime(this.fightAnimTime);
        var callBack = cc.callFunc(function(){
            this.kLife();
            this.missile.opacity = 0;
            },this);
        var action = cc.sequence(moveT,callBack,delay,moveBac);
        if(this.fightSpeed == 1)
        {
            var ac = cc.speed(action, 1);
        }
        else
        {
            var ac = cc.speed(action, 2);
        }
        return ac;
    },
    AToB: function(A,B) {
        if(this.fightSpeed == 1)
        {
             var ac = cc.speed(this.move(A,B), 1);
        }else
        {
             var ac = cc.speed(this.move(A,B), 2);
        }
        A.runAction(ac);
    },
    //战斗
    fight: function() {
        if(this.FactionArrayOne[0].currlife <= 0 && this.FactionArrayOne[1].currlife <= 0 && this.FactionArrayOne[2].currlife <= 0)
        {
            this.winner.string = "Two Win!!";
            this.unschedule(this.fight);
        }
        else if(this.FactionArrayTwo[0].currlife <= 0 && this.FactionArrayTwo[1].currlife <= 0 && this.FactionArrayTwo[2].currlife <= 0)
        {
            this.winner.string = "One Win!!";
            this.unschedule(this.fight);
        }
        else
        {
            var wrecker = this.isWrecker();
            var sufferer = this.isSufferer();
            this.animCtrl = wrecker.getComponent(cc.Animation);
            if(wrecker == this.ap1)
            {
                //导弹
                this.missile.opacity = 255;
                var missileAnim = this.missile.getComponent(cc.Animation);
                var misState = missileAnim.playAdditive();
                if(this.fightSpeed == 1)
                {
                    misState.speed = 0.3;
                }
                else
                {
                    misState.speed = 0.6;
                }
                this.missile.runAction(this.fireTo(sufferer));
            }
            else
            {
                this.AToB(wrecker, sufferer);
            }
        }
    },
    //扣血
    kLife: function() {
            //随机数
            this.GetRandomNum(100, 300);
            var sufferer = this.isSufferer();
            sufferer.currlife -= this.Kblood;
            sufferer.ProgressBar.progress = sufferer.currlife/sufferer.life;
            if(sufferer.currlife <= 0 && sufferer == this.T2)
            {
                var ani = sufferer.getComponent(cc.Animation);
                ani.play("T2Die");
            }
    },
    //肇事者
    isWrecker: function() {
        if(this.Faction == 1)
        {
            while(this.FactionArrayOne[this.Awrecker].currlife <= 0)
            {
                this.Awrecker ++;
                if(this.Awrecker > this.FactionArrayOne.length - 1)
                {
                    this.Awrecker = 0;
                }
            }
            var xx = this.FactionArrayOne[this.Awrecker]
            this.Awrecker ++;
            if(this.Awrecker > this.FactionArrayOne.length - 1)
            {
                this.Awrecker = 0;
            }
            this.Faction = 2;
            return xx;
        }
        else
        {
            while(this.FactionArrayTwo[this.Bwrecker].currlife <= 0)
            {
                this.Bwrecker ++;
                if(this.Bwrecker > 2)
                {
                    this.Bwrecker = 0;
                }
            }
            var ss = this.FactionArrayTwo[this.Bwrecker];
            this.Bwrecker ++;
            if(this.Bwrecker > 2)
            {
                this.Bwrecker = 0;
            }
            this.Faction = 1;
            return ss;
        }
    },
    //受害人
    isSufferer: function() {
        if(this.Faction == 1)
        {
            if(this.FactionArrayOne[0].currlife > 0){
                return this.FactionArrayOne[0];
            }else if(this.FactionArrayOne[1].currlife > 0){
                return this.FactionArrayOne[1];
            }else if (this.FactionArrayOne[2].currlife > 0){
                return this.FactionArrayOne[2];
            }
        }
        else
        {
            if(this.FactionArrayTwo[0].currlife > 0){
                return this.FactionArrayTwo[0];
            }else if(this.FactionArrayTwo[1].currlife > 0){
                return this.FactionArrayTwo[1];
            }else if (this.FactionArrayTwo[2].currlife > 0){
                return this.FactionArrayTwo[2];
            }
        }
    },
    //随机数，扣血量
    GetRandomNum: function(Min,Max) {   
        var Range = Max - Min;   
        var Rand = Math.random();   
        this.Kblood = (Min + Math.round(Rand * Range));   
    },
    init: function() {
        //初始化血量
        this.T1.life = this.T1Life;
        this.T2.life = this.T2Life;
        this.adc1.life = this.adc1Life;
        this.adc2.life = this.adc2Life;
        this.ap1.life = this.ap1Life;
        this.ap2.life = this.ap2Life;
        
        //当前血量
        this.T1.currlife = this.T1Life;
        this.T2.currlife = this.T2Life;
        this.adc1.currlife = this.adc1Life;
        this.adc2.currlife = this.adc2Life;
        this.ap1.currlife = this.ap1Life;
        this.ap2.currlife = this.ap2Life;
        
        //肇事者
        this.Awrecker = 0;
        this.Bwrecker = 0;
        //受害人
        this.Asufferer = 0;
        this.Bsufferer = 0;
        
        this.T1.ProgressBar = this.T1PB;
        this.T2.ProgressBar = this.T2PB;
        this.adc1.ProgressBar = this.adc1PB;
        this.adc2.ProgressBar = this.adc2PB;
        this.ap1.ProgressBar = this.ap1PB;
        this.ap2.ProgressBar = this.ap2PB;
        
        this.ap1.scaleX = -1;
        this.missile.opacity = 0;
        this.fightSpeed = 1;
        
    },
    button: function() {
        var self = this;
        self.speed.node.on(cc.Node.EventType.TOUCH_END,function(event)
        {
            if(self.fightSpeed == 1)
            {
                self.unschedule(self.fight);
                self.btLabel.string = "X 2";
                self.timer = 1.3;
                self.fightAnimTime = 0.3;
                self.fightSpeed = 2;
                self.schedule(self.fight,self.timer,cc.REPEAT_FOREVER,1);
            }
            else
            {
                self.unschedule(self.fight);
                
                self.btLabel.string = "X 1";
                self.timer = 2.6;
                self.fightAnimTime = 0.6;
                self.fightSpeed = 1;
                self.schedule(self.fight,self.timer,cc.REPEAT_FOREVER,1);
            }
        });  
    },
    // use this for initialization
    onLoad: function () {
        this.init();
        this.btLabel.string = "X 1";
        this.button();
        
        this.FactionArrayOne = [this.T1,this.adc1,this.ap1];
        this.FactionArrayTwo = [this.T2,this.adc2,this.ap2];
        
        var anim = this.ap2.getComponent(cc.Animation);
        anim.playAdditive("ap2Animation");
        var ap1Anim = this.ap1.getComponent(cc.Animation);
        ap1Anim.playAdditive("ap1");
        this.schedule(this.fight,this.timer,cc.REPEAT_FOREVER,0.5); 
    },
    
    // update: function (dt) {
    // },
    
});
