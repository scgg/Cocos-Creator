cc.Class({
    extends: cc.Component,

    properties: {
        T1:{
            default: null,
            type: cc.Node,
        },
        adc1:{
            default: null,
            type: cc.Node
        },
        ap1:{
            default: null,
            type: cc.Node
        },
        T2:{
            default: null,
            type: cc.Node
        },
        adc2:{
            default: null,
            type: cc.Node
        },
        ap2:{
            default: null,
            type: cc.Node
        },
        progress: {
            defaults: null,
            type : cc.progressbar.Mode
        },
        
        // defaults, set visually when attaching this script to the Canvas
        MaxMoveSpeed: 1,
        TLife: 1000,
        adcLife: 500,
        apLife: 500,
        
        
    },
    
    //得到Sprite的X,Y,Width,Height
    getInfo: function(role)
    {
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
    
    //两个Sprite之间x的距离
    range: function(role1,role2)
    {
        var arr1 = this.getInfo(role1);
        var arr2 = this.getInfo(role2);
        if(arr1[0] < arr2[0])
        {
            this.Faction = 1;
            var oneToTwoX = arr2[0] - arr1[0] - arr2[2]/2 - arr1[2]/2;
            var oneToTwoY = arr2[1] - arr1[1] - arr2[3]/2 + arr1[3]/2;
            var array = new Array(oneToTwoX,oneToTwoY);
            return array;
        }
        else
        {
            this.Faction = 2;
            var twoToOneX = arr2[0] - arr1[0] + arr2[2]/2 + arr1[2]/2;
            var twoToOneY = arr2[1] - arr1[1] + arr2[3]/2 - arr1[3]/2;
            var array1 = new Array(twoToOneX,twoToOneY);
            return array1;
        }
    },
    
    move: function(role1,role2)
    {   
        var array = this.range(role1,role2);
        var moveT = cc.moveBy(this.MaxMoveSpeed, cc.p(array[0],array[1]));
        var moveBac = cc.moveBy(this.MaxMoveSpeed, cc.p(-array[0],-array[1]));
        return cc.sequence(moveT,moveBac);
    },
    
    AToB: function(A,B)
    {
        var tototo = this.move(A,B);
        A.runAction(tototo);
    },
    
    //战斗
    fight: function()
    {
        if(this.FactionArrayOne[0] <= 0 && this.FactionArrayOne[1] <= 0 && this.FactionArrayOne[2] <= 0)
        {
            this.unschedule(this.fight);
        }
        else if(this.FactionArrayTwo[0] <= 0 && this.FactionArrayTwo[1] <= 0 && this.FactionArrayTwo[2] <= 0)
        {
            this.unschedule(this.fight);
        }
        else
        {
            var wrecker = this.isWrecker();
            var sufferer = this.isSufferer();
            this.AToB(wrecker, sufferer);
        }
    },
    
    //扣血
    kLife: function()
    {
        if(this.FactionArrayOne[0] <= 0 && this.FactionArrayOne[1] <= 0 && this.FactionArrayOne[2] <= 0)
        {
            this.unschedule(this.kLife);
        }
        else if(this.FactionArrayTwo[0] <= 0 && this.FactionArrayTwo[1] <= 0 && this.FactionArrayTwo[2] <= 0)
        {
            this.unschedule(this.kLife);
        }
        else
        {
            this.isSufferer()
            // if(this.index == 1)
            // {
            //     //扣血
            //     this.twolife = this.twolife - this.Kblood;
            //     //更新血量
            //     this.monster2Life.string = this.twolife;
            //     this.index = 2;
            // }
            // else
            // {
            //     //扣血        
            //     this.onelife = this.onelife - this.Kblood;
            //     //更新血量
            //     this.monster1Life.string = this.onelife;
            //     this.index = 1;
            // }
        }
        
    },
    //肇事者
    isWrecker: function()
    {
        if(this.Faction == 1)
        {
            while(this.FactionArrayTwo[this.Bwrecker].life <= 0)
            {
                this.Bwrecker ++;
                if(this.Bwrecker > 2)
                {
                    this.Bwrecker = 0;
                }
            }
            while(this.FactionArrayTwo[this.Bwrecker].life > 0)
            {
                var ss = this.FactionArrayTwo[this.Bwrecker];
                this.Bwrecker ++;
                if(this.Bwrecker > 2)
                {
                    this.Bwrecker = 0;
                }
                return ss;
            }
        }
        else
        {
            
            while(this.FactionArrayOne[this.Awrecker].life <= 0)
            {
                this.Awrecker ++;
                if(this.Awrecker > 2)
                {
                    this.Awrecker = 0;
                }
            }
            while(this.FactionArrayOne[this.Awrecker].life > 0)
            {
                var xx = this.FactionArrayOne[this.Awrecker]
                this.Awrecker ++;
                if(this.Awrecker > 2)
                {
                    this.Awrecker = 0;
                }
                return xx;
            }
        }
    },
    
    //受害人
    isSufferer: function()
    {
        if(this.Faction == 1)
        {
            if(this.FactionArrayOne[0].life > 0){
                return this.FactionArrayOne[0];
            }else if(this.FactionArrayOne[1],life > 0){
                return this.FactionArrayOne[1];
            }else if (this.FactionArrayOne[2].life > 0){
                return this.FactionArrayOne[2];
            }else{
                
            }
        }
        else
        {
            if(this.FactionArrayTwo[0].life > 0){
                return this.FactionArrayTwo[0];
            }else if(this.FactionArrayTwo[1],life > 0){
                return this.FactionArrayTwo[1];
            }else if (this.FactionArrayTwo[2].life > 0){
                return this.FactionArrayTwo[2];
            }else{
                
            }
            
        }
    },
    
    // use this for initialization
    onLoad: function () 
    {
        //初始化血量
        this.T1.life = this.TLife;
        this.T2.life = this.TLife;
        this.adc1.life = this.adcLife;
        this.adc2.life = this.adcLife;
        this.ap1.life = this.apLife;
        this.ap2.life = this.apLife;
        this.Faction = 0;//阵营
        
        //肇事者
        this.Awrecker = 0;
        this.Bwrecker = 0;
        //受害人
        // this.Asufferer = 0;
        // this.Bsufferer = 0;
        
        
        this.FactionArrayOne = [this.T1,this.adc1,this.ap1];
        this.FactionArrayTwo = [this.T2,this.adc2,this.ap2];
        // this.isWrecker.runAction(this.move(this.isWrecker, this.isSufferer));
        // this.AToB(this.FactionArrayTwo[1],this.FactionArrayOne[2]);
        this.schedule(this.fight,2,cc.REPEAT_FOREVER,0.5);  
        // this.schedule(this.kLife,2,cc.REPEAT_FOREVER,1.5);
    },

    // called every frame
    // update: function (dt) {

    // },
});
