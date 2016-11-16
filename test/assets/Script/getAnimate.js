// const armSpeed = require('game');

function death(person) {
    var armatureDisplay = person.getComponent(dragonBones.ArmatureDisplay);
    var arm = armatureDisplay.playAnimation("death",1);
    return arm;
}

function readyDown(person) {
    var armatureDisplay = person.getComponent(dragonBones.ArmatureDisplay);
    var arm = armatureDisplay.playAnimation("ready_down",0);
    return arm;
}

function attackDown(person) {
    var armatureDisplay = person.getComponent(dragonBones.ArmatureDisplay);
    var arm = armatureDisplay.playAnimation("attack_down",1);
    return arm;
}

function hitDown(person) {
    var armatureDisplay = person.getComponent(dragonBones.ArmatureDisplay);
    var arm = armatureDisplay.playAnimation("hit_down",1);
    return arm;
}


module.exports = {
    death: death,
    readyDown: readyDown,
    attackDown: attackDown,
    hitDown: hitDown,
};

