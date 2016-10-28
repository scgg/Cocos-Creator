cc.Class({
    extends: cc.Component,

    properties: 
    {
        monster1: {
            default: null,
            type: cc.Node
        },
        monster2: {
            default: null,
            type: cc.Node
        },
        monster1Life: {
            default: null,
            type: cc.Label
        },
        monster2Life: {
            default: null,
            type: cc.Label
        },
        
        onelife: 0,
        twolife: 0,
        index: 1,
        maxMoveSpeed: 0,//1
        time: 0,
        moveX: 0,
        moveY: 0,
        Kblood: 0,//扣血量
        
        // fightNumber: 10000,
    },
    
    //怪物1移动
    monster1Move: function()
    {
        var moveGo = cc.moveBy(this.maxMoveSpeed, cc.p(this.moveX,this.moveY));
        var moveBack = cc.moveBy(this.maxMoveSpeed, cc.p(-this.moveX,-this.moveY));
        return cc.sequence(moveGo,moveBack);
    },
    //怪物2移动
    monster2Move: function()
    {
        var moveGo = cc.moveBy(this.maxMoveSpeed, cc.p(-this.moveX,-this.moveY));
        var moveBack = cc.moveBy(this.maxMoveSpeed, cc.p(this.moveX,this.moveY));
        return cc.sequence(moveGo,moveBack);
    },
    //战斗
    fight: function()
    {
        
        if(this.onelife <= 0 || this.twolife <= 0)
        {
            this.unschedule(this.fight);
        }
        else
        {
            this.GetRandomNum(200,400);
            if(this.index == 1)
            {
                //开始移动
                this.monster1.runAction(this.monster1Move());
            }
            else
            {   
                //开始移动
                this.monster2.runAction(this.monster2Move());
            }
        }
    },
    //扣血
    kLife: function()
    {
        if(this.onelife <= 0 || this.twolife <= 0)
        {
            this.unschedule(this.kLife);
        }
        else
        {
            if(this.index == 1)
            {
                //扣血
                this.twolife = this.twolife - this.Kblood;
                //更新血量
                this.monster2Life.string = this.twolife;
                this.index = 2;
            }
            else
            {
                //扣血        
                this.onelife = this.onelife - this.Kblood;
                //更新血量
                this.monster1Life.string = this.onelife;
                this.index = 1;
            }
        }
        
    },
    
    //得到Sprite的X,Y,Width,Height
    getInfo: function(monster)
    {
        var X = monster.x;
        var Y = monster.y;
        var Width = monster.width;
        var Height =  monster.height;
        var array = new Array(X,Y,Width,Height);
        
        // array[0] = X;
        // array[1] = Y;
        // array[2] = Width;
        // array[3] = Height;
        return array;
    },
    
    //两个Sprite之间x的距离
    rangeX: function(monster1,monster2)
    {
        var arr1 = this.getInfo(monster1);
        var arr2 = this.getInfo(monster2);
        var oneToTwoX = arr2[0] - arr1[0] - arr2[2]/2 - arr1[2]/2;
        
        return oneToTwoX;
    },
    //两个Sprite之间y的距离
    rangeY: function(monster1,monster2)
    {
        var arr1 = this.getInfo(monster1);
        var arr2 = this.getInfo(monster2);
        var oneToTwoY = arr2[1] - arr1[1] - arr2[3]/2 + arr1[3]/2;
        return oneToTwoY;
    },
    //随机数，扣血量
    GetRandomNum: function(Min,Max)
    {   
        var Range = Max - Min;   
        var Rand = Math.random();   
        this.Kblood = (Min + Math.round(Rand * Range));   
    },
    
    // use this for initialization
    onLoad: function () 
    {
        this.moveX = this.rangeX(this.monster1, this.monster2);
        this.moveY = this.rangeY(this.monster1, this.monster2);
        this.monster1Life.string = this.onelife;
        this.monster2Life.string = this.twolife;
        this.schedule(this.fight,2,cc.REPEAT_FOREVER,0.5);  
        this.schedule(this.kLife,2,cc.REPEAT_FOREVER,1.5);
        
    },
    
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) 
    // {
        
    // },
    
});
