    //两个Sprite之间的距离
    function range(role1,role2) {
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
    }

    //得到Sprite的X,Y,Width,Height
    function getInfo(role) {
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
    }
    //人物进入场景
    function move(role1,role2) {  
        var array = this.range(role1,role2);
        var moveT = cc.moveBy(1.5, cc.p(array[0],array[1]));
        return moveT;
    }
    
module.exports = {
    range: range,
    getInfo: getInfo,
    move: move,
};
