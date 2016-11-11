cc.Class({
    extends: cc.Component,
    properties: {
        T1: {
            default: null,
            type: cc.Node
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
        btLabel: {
          default: null,
          type: cc.Label
        },
        loadingLayout: {
            default: null,
            type: cc.Node
        },
        speedBt: {
            default: null,
            type: cc.Button
        },
        T1NLButton: {
            default: null,
            type: cc.Button
        },
        adc1NLButton: {
            default: null,
            type: cc.Button
        },
        ap1NLButton: {
            default: null,
            type: cc.Button
        },
        T1NL: {
            default: null,
            type: cc.ProgressBar
        },
        adc1NL: {
            default: null,
            type: cc.ProgressBar
        },
        ap1NL: {
            default: null,
            type: cc.ProgressBar
        },
        MaxMoveSpeed: 0,
        T1Life: 1000,
        T2Life: 1000,
        adc1Life: 500,
        adc2Life: 500,
        ap1Life: 500,
        ap2Life: 500,
        isFighter: 1,
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
        if(arr1[0] < arr2[0]){
            var oneToTwoX = arr2[0] - arr1[0] - arr2[2]/2 - arr1[2]/2;
            var oneToTwoY = arr2[1] - arr1[1] - arr2[3]/2 + arr1[3]/2;
            var array = new Array(oneToTwoX,oneToTwoY);
            return array;
        }else{
            var twoToOneX = arr2[0] - arr1[0] + arr2[2]/2 + arr1[2]/2;
            var twoToOneY = arr2[1] - arr1[1] - arr2[3]/2 + arr1[3]/2;
            var array1 = new Array(twoToOneX,twoToOneY);
            return array1;
        }
    },
        //肇事者
    isWrecker: function() {
        if(this.isFighter == 1){
            while(this.FactionArrayOne[this.Awrecker].currlife <= 0)
            {
                this.Awrecker ++;
                if(this.Awrecker > this.FactionArrayOne.length - 1){
                    this.Awrecker = 0;
                }
            }
            var xx = this.FactionArrayOne[this.Awrecker]
            this.Awrecker ++;
            if(this.Awrecker > this.FactionArrayOne.length - 1){
                this.Awrecker = 0;
            }
            this.isFighter = 2;
            return xx;
        }else{
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
            if(this.Bwrecker > 2){
                this.Bwrecker = 0;   
            }
            this.isFighter = 1;
            return ss;
        }
    },
    //受害人
    isSufferer: function() {
        if(this.isFighter == 1){
            if(this.FactionArrayOne[0].currlife > 0){
                return this.FactionArrayOne[0];
            }else if(this.FactionArrayOne[1].currlife > 0){
                return this.FactionArrayOne[1];
            }else if (this.FactionArrayOne[2].currlife > 0){
                return this.FactionArrayOne[2];
            }
        }else{
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
    move: function(role1,role2) {   
        var array = this.range(role1,role2);
        var moveT = cc.moveBy(this.MaxMoveSpeed, cc.p(array[0],array[1]));
        var delay = cc.delayTime(this.fightAnimTime);
        var moveBac = cc.moveBy(this.MaxMoveSpeed, cc.p(-array[0],-array[1]));
        var callBack = cc.callFunc(function() {
            var animState = this.animCtrl.playAdditive();
            animState.speed = this.animSpeed;
            this.kLife();
            //每次攻击加0.2能量
            for (var i = 0; i < this.FactionArrayOne.length; i++) {
                if(role1 == this.FactionArrayOne[i])
                {
                    role1.NL.progress += 0.3;
                    if(role1.NL.progress > 1)
                    {
                        role1.NL.progress = 1;
                    }
                }else if(role2 == this.FactionArrayOne[i])
                {
                    role2.NL.progress += 0.2;
                    if(role2.NL.progress > 1)
                    {
                        role2.NL.progress = 1;
                    }
                }
            }
        },this);
        var mBCallBack = cc.callFunc(function(){
            log(this.isT1FDZ);
            if(this.isT1FDZ == 0 && this.isAdc1FDZ == 0 && this.isAp1FDZ == 0)
            {
                this.fight();
            }else{
                if(this.isT1FDZ == 1)
                {
                    this.HSG(this.T1);
                    this.isT1FDZ = 0;
                }else if(this.isAdc1FDZ == 1)
                {
                    this.HSG(this.adc1);
                    this.isAdc1FDZ = 0;
                }else{
                    this.HSG(this.ap1);
                    this.isAp1FDZ = 0;
                }
            }
        },this);
        var spawn = cc.spawn(callBack,delay);
        var action = cc.sequence(moveT,spawn,moveBac,mBCallBack);
        return action;
    },
    fireTo: function(role) {
        var array = this.range(this.missile, role);
        var moveT = cc.moveBy(this.MaxMoveSpeed, cc.p(array[0],array[1]));
        var moveBac = cc.moveBy(0, cc.p(-array[0],-array[1]));
        var callBack = cc.callFunc(function(){
            this.kLife();
            this.ap1.NL.progress += 0.3
            if(this.ap1.NL.progress > 1)
            {
                this.ap1.NL.progress = 1;
            }
            this.missile.opacity = 0;
            },this);
            var mbCallback = cc.callFunc(function()
            {
                if(this.isT1FDZ == 0 && this.isAdc1FDZ == 0 && this.isAp1FDZ == 0)
            {
                this.fight();
            }else{
                if(this.isT1FDZ == 1)
                {
                    this.HSG(this.T1);
                    this.isT1FDZ = 0;
                }else if(this.isAdc1FDZ == 1)
                {
                    this.HSG(this.adc1);
                    this.isAdc1FDZ = 0;
                }else{
                    this.HSG(this.ap1);
                    this.isAp1FDZ = 0;
                }
            }
            },this)
        var action = cc.sequence(moveT,callBack,moveBac,mbCallback);
        if(this.fightSpeed) {
            var ac = cc.speed(action,this.fightSpeed);
        }
        return ac;
    },
    
    AToB: function(A,B) {
        if(this.fightSpeed){
            var ac = cc.speed(this.move(A,B), this.fightSpeed);
        }
        A.runAction(ac);
    },
    //战斗
    fight: function() {
        if(this.FactionArrayOne[0].currlife <= 0 && this.FactionArrayOne[1].currlife <= 0 && this.FactionArrayOne[2].currlife <= 0){
            this.winner.string = "Two Win!!";
        }else if(this.FactionArrayTwo[0].currlife <= 0 && this.FactionArrayTwo[1].currlife <= 0 && this.FactionArrayTwo[2].currlife <= 0){
            this.winner.string = "One Win!!";
        }else{
            var wrecker = this.isWrecker();
            var sufferer = this.isSufferer();
            this.animCtrl = wrecker.getComponent(cc.Animation);
            if(wrecker == this.ap1) {
                var animState = this.animCtrl.playAdditive();
                //导弹
                this.missile.opacity = 255;
                var missileAnim = this.missile.getComponent(cc.Animation);
                var misState = missileAnim.playAdditive();
                animState.speed = this.animSpeed;
                misState.speed = this.animSpeed;
                this.missile.runAction(this.fireTo(sufferer));
            }else{
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
        if(sufferer.currlife <= 0 && sufferer == this.T2){
            var ani = sufferer.getComponent(cc.Animation);
            ani.play("T2Die");
        }
    },

    button: function() {
        var self = this;
        self.speedBt.node.on(cc.Node.EventType.TOUCH_END,function(event)
        {
                if(self.fightSpeed == 1){
                    self.btLabel.string = "X 2";
                    self.fightSpeed = 2;
                    self.animSpeed = 0.6;
                }else if (self.fightSpeed == 2){
                    self.btLabel.string = "X 3";
                    self.fightSpeed = 3;
                    self.animSpeed = 0.9;
                }else{
                    self.btLabel.string = "X 1";
                    self.fightSpeed = 1;
                    self.animSpeed = 0.3;
                } 
        });  
    },
    wind : function(releaser) {
        var windNum = 1;
        var wind =  new cc.Node();
        var sprite = wind.addComponent(cc.Sprite);
        wind.parent = this.T1.parent;
        
        var array1 = this.getInfo(releaser);
        wind.x = array1[0] + 80;
        wind.y = array1[1];
        
        this.schedule(function(){
            var photo = cc.js.formatStr('resources/wind/winds%d.png',windNum);
            sprite.spriteFrame = new cc.SpriteFrame(cc.url.raw(photo));
            windNum ++;
            if(windNum > 6)
            {
                windNum = 1;
            }
        },0.1,cc.REPEAT_FOREVER);
        return wind;
    },
    //技能：哈塞给
    HSG : function(releaser) {
        var sufferer;
        if(this.FactionArrayTwo[0].currlife > 0){
                sufferer = this.FactionArrayTwo[0];
            }else if(this.FactionArrayTwo[1].currlife > 0){
                sufferer = this.FactionArrayTwo[1];
            }else if (this.FactionArrayTwo[2].currlife > 0){
                sufferer = this.FactionArrayTwo[2];
            } 
        var wind = this.wind(releaser);
        var moveX = sufferer.x - wind.x - sufferer.width/2 - wind.width/2;
        var moveY = sufferer.y - wind.y;
        var moveto = cc.moveBy(1, cc.p(moveX,moveY));
        var callBack = cc.callFunc(function(){
            wind.destroy();
            sufferer.currlife -= this.Kblood;
            sufferer.ProgressBar.progress = sufferer.currlife/sufferer.life;
            if(sufferer.currlife <= 0 && sufferer == this.T2){
                var ani = sufferer.getComponent(cc.Animation);
                ani.play("T2Die");
            }
            this.fight();
        }, this);
        
        var delay = cc.delayTime(0.5);
        var callBac = cc.callFunc(function(){
            var anima = releaser.getComponent(cc.Animation);
            anima.playAdditive();
        },this);
        wind.runAction(cc.sequence(callBac,delay,moveto,callBack));
    },
    dazhao: function() {
        var self = this;
        self.T1NLButton.node.on(cc.Node.EventType.TOUCH_END,function(event)
        {
            if(self.T1.currlife > 0)
            {
                if(self.T1.NL.progress == 1)
                {
                    self.isT1FDZ = 1;
                    self.T1.NL.progress = 0;
                }
            }
            
        });
        self.adc1NLButton.node.on(cc.Node.EventType.TOUCH_END,function(event)
        {   
            if(self.adc1.currlife > 0)
            {
                if(self.adc1.NL.progress == 1)
                {
                    self.isAdc1FDZ = 1;
                    self.adc1.NL.progress = 0;
                }
            }
        });
        self.ap1NLButton.node.on(cc.Node.EventType.TOUCH_END,function(event)
        {
            if(self.ap1.currlife > 0)
            {
                if(self.ap1.NL.progress == 1)
                {
                    self.isAp1FDZ = 1;
                    self.ap1.NL.progress = 0;
                }
            }
        });
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
        //血条
        this.T1.ProgressBar = this.T1PB;
        this.T2.ProgressBar = this.T2PB;
        this.adc1.ProgressBar = this.adc1PB;
        this.adc2.ProgressBar = this.adc2PB;
        this.ap1.ProgressBar = this.ap1PB;
        this.ap2.ProgressBar = this.ap2PB;
        //能量
        this.T1.NL = this.T1NL;
        this.adc1.NL = this.adc1NL;
        this.ap1.NL = this.ap1NL;
        //其他参数
        this.ap1.scaleX = -1;
        this.missile.opacity = 0;
        this.fightSpeed = 1;
        this.fightAnimTime = 0.6;
        this.animSpeed = 0.3
        this.btLabel.string = "X 1";
        this.isT1FDZ = 0;
        this.isAdc1FDZ = 0;
        this.isAp1FDZ = 0;
    },
    onLoad: function () {
        this.init();
        //两个阵营内的角色
        this.FactionArrayOne = [this.T1,this.adc1,this.ap1];
        this.FactionArrayTwo = [this.T2,this.adc2,this.ap2];
    },
    start: function()
    {
        var ap2Anim = this.ap2.getComponent(cc.Animation);
        ap2Anim.playAdditive("ap2Animation");
        var ap1Anim = this.ap1.getComponent(cc.Animation);
        ap1Anim.playAdditive("ap1");
        this.schedule(function() {
            this.loadingLayout.destroy();
            this.fight();
        },2,0);
        this.button();
        this.dazhao();
    },
    // update: function (dt) {
    // },
});
