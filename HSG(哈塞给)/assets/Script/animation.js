cc.Class({
    extends: cc.Component,

    properties: {

        backGround: {
            default: null,
            type: cc.Node
        },
        person1: {
            default: null,
            type: cc.Node
        },
        windAnimate: {
            default: null,
            type: cc.Node
        },
        AnimationButton: {
            default: null,
            type: cc.Button
        },
        BtLabel: {
            default: null,
            type: cc.Label
        },
        
        buttonLabel: "play",
        isplay: 1,
    },
    windAct: function ()
    {
        var move = cc.moveBy(2, cc.p(300,0));
        var fade = cc.fadeIn(2);
        var call = cc.callFunc(function(){
            this.windAnimate.opacity = 0;
        }, this);
        var moveBack = cc.moveBy(0, cc.p(-300,0));
        
        // var fadeTo = cc.fadeTo(2, 0);
        // var fadeIn = cc.fadeIn(2);
        // var fadeOut = cc.fadeOut(2);
        var spawn = cc.spawn(move, fade);
        var sequence = cc.sequence(spawn,call,moveBack);
        
        return sequence;
    },
    
    button: function ()
    {
        var self = this;
        var getWindAnimation = self.windAnimate.getComponent(cc.Animation);
        var person1Animation = self.person1.getComponent(cc.Animation);
        self.AnimationButton.node.on(cc.Node.EventType.TOUCH_END,function(event)
        {
            
            person1Animation.play();
            
            self.scheduleOnce(function()
            {
                getWindAnimation.play();
                self.windAnimate.runAction(self.windAct());
                
            }, 0.5);
            
            
            
        });
    },
    
    onLoad: function () 
    {
        
        this.BtLabel.string = this.buttonLabel;
        this.windAnimate.opacity = 0;
        this.button();
        // this.wind.runAction(this.windAction());
        
    
    },
    
    
    // update: function (dt) 
    // {
    //     // if()
    // },
    
    
});
