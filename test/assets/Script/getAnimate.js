


function death(person) {
    var armatureDisplay = person.getComponent(dragonBones.ArmatureDisplay);
    return armatureDisplay.playAnimation("death",1);
}
function readyDown(person) {
    var armatureDisplay = person.getComponent(dragonBones.ArmatureDisplay);
    return armatureDisplay.playAnimation("ready_down",0);
}
function attackDown(person) {
    var armatureDisplay = person.getComponent(dragonBones.ArmatureDisplay);
    return armatureDisplay.playAnimation("attack_down",1);
}
function hitDown(person) {
    var armatureDisplay = person.getComponent(dragonBones.ArmatureDisplay);
    return armatureDisplay.playAnimation("hit_down",1);
}


module.exports = {
    death: death,
    readyDown: readyDown,
    attackDown: attackDown,
    hitDown: hitDown,
};

