const helper = require('helper');
const animation = require('getAnimate');
cc.Class({
    extends: cc.Component,

    properties: {
        aD: cc.Prefab,
        aP: cc.Prefab,
        aT: cc.Prefab,
        bD: cc.Prefab,
        bP: cc.Prefab,
        bT: cc.Prefab,
        timeAndBout: cc.Label,
        touch: cc.Node,
        allOurLife: cc.ProgressBar,
        allEnemyLife: cc.ProgressBar,

        readyTime: 30,
    },
    ourAllHp: function() {
        for(i = 0; i < this.heroArray.length; i++)
        {
            this.ourAllHP += this.currHP(this.heroArray[i]);
            this.ourAllCurrHP = this.ourAllHP;
        }
    },
    enemyAllHp: function() {
        for(i = 0; i < this.enemyArray.length; i++)
        {
            this.enemyAllHP += this.currHP(this.enemyArray[i]);
            this.enemyAllCurrHP = this.enemyAllHP;
        }
    },
    createHero: function(pref,position) {
        var prefab = cc.instantiate(pref);
        prefab.parent = this.node;
        prefab.position = position;
        return prefab;
    },
    createEnemy: function(pref,position) {
        var prefab = cc.instantiate(pref);
        prefab.parent = this.node;
        prefab.position = position;
        prefab.scaleX = - 1;
        var person = require('person');
        var personinfo = prefab.getComponent(person);
        personinfo.initLabel();
        return prefab;
    },
    KLife: function (hero,biubiubiu) {
        var person = require('person');
        var personinfo = hero.getComponent(person);
        animation.hitDown(this.getAnimation(hero));
        personinfo.KLife(biubiubiu);
        if(this.isFighter == 1)
        {
            this.enemyAllCurrHP -= biubiubiu;
            this.allEnemyLife.progress = this.enemyAllCurrHP/this.enemyAllHP;
        }else{
            this.ourAllCurrHP -= biubiubiu;
            this.allOurLife.progress = this.ourAllCurrHP/this.ourAllHP;
        }
        
        if(personinfo.currLife <= 0)
        {
            this.defaultTouch();
        }
    },
    currHP: function(hero) {
        var person = require('person');
        var personinfo = hero.getComponent(person);
        return personinfo.currLife;
    },
    getAnimation: function(hero) {
        var person = require('person');
        var animation = hero.getComponent(person);
        return animation.animation;
    },
    //默认选中目标
    defaultTouch: function() {
        for(var i = 0; i < this.enemyArray.length; i++)
        {
            if(this.currHP(this.enemyArray[i]) > 0)
            {
                this.touch.setPosition(cc.p(this.enemyArray[i].x + 10,this.enemyArray[i].y + 40));
                this.wounded = this.enemyArray[i];
                return this.wounded;
            }
        }
    },
    //手动选择目标
    touchButton: function(button) {
        button.node.on(cc.Node.EventType.MOUSE_DOWN, function (event) {
            this.isTouch = 1;
            if(this.isReadyTime == 1)
            {
                for(var i = 0; i < this.enemyArray.length; i++)
                {
                    if(this.currHP(this.enemyArray[i]) > 0)
                    {
                        if(i == button.tag)
                        {
                            //攻击对象
                            this.wounded = this.enemyArray[i];
                            if(this.touch.x == this.enemyArray[i].x + 10 &&
                                this.touch.y == this.enemyArray[i].y + 40)
                            {
                                this.touch.opacity = 0;
                                this.isReadyTime = 0;
                                this.fight();
                            }else{
                                this.touch.setPosition(cc.p(this.enemyArray[i].x + 10,this.enemyArray[i].y + 40));
                                return;
                            }
                        }
                    }
                }
            } 
        }, this);
    },
    //肇事者
    isWrecker: function() {
        if(this.isFighter == 1) 
        {
            while(this.currHP(this.heroArray[this.Awrecker]) <= 0) 
            {
                this.Awrecker ++;
            }
            var xx = this.heroArray[this.Awrecker];
            this.Awrecker ++;
            if(this.Awrecker == this.heroArray.length) 
            {
                this.isFighter = 0;
                this.Awrecker = 0;
                this.isTouch = 0;
            }
            return xx;
        }
        else 
        {
            while(this.currHP(this.enemyArray[this.Bwrecker]) <= 0) 
            {
                this.Bwrecker ++;
            }
            var ss = this.enemyArray[this.Bwrecker];
            this.Bwrecker ++;
            if(this.Bwrecker == this.enemyArray.length) 
            {
                this.isFighter = 1;
                this.Bwrecker = 0;
                this.isReadyTime = 1;
            }
            return ss;
        }
    },
    //受害人
    isSufferer: function() {
        if(this.isFighter == 1)
        {
            return this.wounded;
        }
        else
        {
            if(this.currHP(this.heroArray[this.Asufferer]) > 0)
            {
                return this.heroArray[this.Asufferer];
            }else{
                this.Asufferer ++;
                return this.heroArray[this.Asufferer];
            }
        }
    },
    move: function(role1,role2) {  
        var self = this;
        var array = helper.range(role1,role2);
        var moveT = cc.moveBy(self.MaxMoveSpeed, cc.p(array[0],array[1]));
        var callBack = cc.callFunc(function() {
            animation.attackDown(self.getAnimation(role1));
        },self);
        var delay = cc.delayTime(0.4);
        var klife = cc.callFunc(function(){
            this.KLife(role2,250);
        },self);
        var delay2 = cc.delayTime(0.3);
        var ending = cc.callFunc(function(){
            animation.readyDown(self.getAnimation(role1));
            if(self.currHP(role2) > 0){
                animation.readyDown(self.getAnimation(role2));
            }else{
                animation.death(self.getAnimation(role2));
            }
        },self);
        var moveBac = cc.moveBy(self.MaxMoveSpeed/2, cc.p(-array[0],-array[1]));
        
        var last = cc.callFunc(function(){
            if(self.isReadyTime == 0)
            {
                self.fight();
            }
        },self);
        var spawn = cc.spawn(callBack,delay);
        var spawn2 = cc.spawn(klife,delay2);

        var action = cc.sequence(moveT,spawn,spawn2,ending,moveBac,last);
        return action;
    },
    
    //战斗
    fight: function() {
        if(this.ourAllCurrHP > 0 && this.enemyAllCurrHP > 0)
        {
            var sufferer = this.isSufferer();
            var wrecker = this.isWrecker();
            if(this.currHP(sufferer) <= 0)
            {
                sufferer = this.defaultTouch;
            }
            wrecker.runAction(this.move(wrecker,sufferer));
        }
    },
    init: function() {
    this.ourAllHP = 0;
    this.ourAllCurrHP = 0;
    this.enemyAllHP = 0;
    this.enemyAllCurrHP = 0;
        this.isFighter = 1;
        this.Asufferer = 0;
        this.Awrecker = 0;
        this.Bsufferer = 0;
        this.Bwrecker = 0;
        this.MaxMoveSpeed = 1;
        var height = cc.view.getVisibleSize().height;
        var width = cc.view.getVisibleSize().width;
        
        this.ourLeftX = width / 7;
        this.ourRightX = width * 2 / 7;
        this.enemyLeftX = width - 100 - width / 7;
        this.enemyRightX = width - 120;
        
        this.topY = height * 3 / 4 - 70;
        this.centerY = height / 2 - 60;
        this.buttomY = height / 4 - 50;
        
        this.outX1 = - width / 6;
        this.outX2 = - width * 2 / 6; 
        
        //我方固定位置
        let A3 = cc.p(this.ourLeftX, this.topY);
        let A4 = cc.p(this.ourLeftX, this.centerY);
        let A5 = cc.p(this.ourLeftX, this.buttomY);
        let A0 = cc.p(this.ourRightX, this.topY);
        let A1 = cc.p(this.ourRightX, this.centerY);
        let A2 = cc.p(this.ourRightX, this.buttomY);
        //敌方固定位置
        let B0 = cc.p(this.enemyLeftX, this.topY);
        let B1 = cc.p(this.enemyLeftX, this.centerY);
        let B2 = cc.p(this.enemyLeftX, this.buttomY);
        let B3 = cc.p(this.enemyRightX, this.topY);
        let B4 = cc.p(this.enemyRightX, this.centerY);
        let B5 = cc.p(this.enemyRightX, this.buttomY);
        //初始位置
        let out3 = cc.p(- this.ourRightX, this.topY);
        let out4 = cc.p(- this.ourRightX, this.centerY);
        let out5 = cc.p(- this.ourRightX, this.buttomY);
        let out0 = cc.p(- this.ourLeftX, this.topY);
        let out1 = cc.p(- this.ourLeftX, this.centerY);
        let out2 = cc.p(- this.ourLeftX, this.buttomY);
        
        this.ourPositionArray = [A0,A1,A2,A3,A4,A5];
        this.enemyPositionArray = [B0,B1,B2,B3,B4,B5];
        this.outPositionArray = [out0,out1,out2,out3,out4,out5];
        
        this.heroPrefab = [this.aD,this.aT,this.aP,this.bT,this.bP,this.bD];
        this.enemyPrefab = [this.aP,this.aP,this.aP,this.aP,this.bP,this.aP];

        //准备时间
        this.isReadyTime = 0;
        this.time = 0;
    },
    onLoad: function () {
        this.init();
        this.heroArray = [];
        this.enemyArray = [];
        this.isTouch = 0;
        //初始化我方阵容,position在场景外
        for(var i = 0; i < this.outPositionArray.length; i++)
        {
            var hero = this.createHero(this.heroPrefab[i], this.outPositionArray[i]);
            this.heroArray.push(hero);
        }
        //初始化敌方阵容,在场内
        for(var j = 0; j < this.enemyPositionArray.length; j++) 
        {
            var enemy = this.createEnemy(this.enemyPrefab[j], this.enemyPositionArray[j]);
            
            this.enemyArray.push(enemy);
        }
        this.ourAllHp();
        this.enemyAllHp();
    },
    start: function() {
        //添加点击事件
        for(var i = 0; i < this.enemyArray.length; i++){
            var button = this.enemyArray[i].addComponent(cc.Button);
            button.tag = i;
            this.touchButton(button);
        }
        //入场
        for(var i = 0; i < this.outPositionArray.length; i++)
        {
            var moveT = helper.move(this.heroArray[i], this.ourPositionArray[i]);
            var callBack = cc.callFunc(function(){
                this.isReadyTime = 1;
            },this);
            var action = cc.sequence(moveT,callBack);
            this.heroArray[i].runAction(action);
            /*    动画
            let armatureDisplay = this.heroArray[i].getComponent(dragonBones.ArmatureDisplay);
            armatureDisplay.playAnimation("hit_down",0);
            */
        }
        
    },
    
    update: function (dt) {

        if(this.isReadyTime == 0){
            this.timeAndBout.string = "回合数";
            this.touch.opacity = 0;
            this.readyTime = 30;
        }else{
            this.touch.opacity = 255;
            this.time += dt;
            if(this.time >= 1){
                this.readyTime -= 1;
                this.timeAndBout.string = this.readyTime;
                this.time = 0;
                if(this.readyTime == 0)
                {
                    this.isReadyTime = 0;
                    this.touch.opacity = 0;
                    this.fight();
                }
            }
        }
        if (!this.isTouch)
        {
            this.defaultTouch();
        }

    },
});
