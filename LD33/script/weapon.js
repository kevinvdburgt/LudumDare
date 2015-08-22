function Weapon() {
  var self = this;


  this.weaponList = [
    'Handgun - Basic',
    'Empty slot',
    'Empty slot',
    'Empty slot',
    'Empty slot'
  ];

};

Weapon.prototype.fire = function() {
  console.log('FIRE!');
};
