function Weapon(game) {
  var self = this;
  this.game = game;

  this.weaponData = [
    // NAME,        Enabled,
    ['Handgun',     false,    new Weapon_Handgun(game)],
    ['Rifle',       false,    new Weapon_Rifle(game)],
    ['Draw bow',    false,    new Weapon_Bow(game)],
    ['RPG',         false,    new Weapon_RPG(game)],
    ['Laser gun',   false,    new Weapon_Laser(game)]
  ];

  this.currentSlot = 0;

  document.querySelector('#stage > canvas').addEventListener('mousedown', function() {
    self.fire();
  });

  document.querySelector('#stage > canvas').addEventListener('mouseup', function() {
    self.releaseFire();
  });
};

Weapon.prototype.update = function(game, dt) {
  this.weaponData[0][2].update(game, dt);
  this.weaponData[1][2].update(game, dt);
  this.weaponData[2][2].update(game, dt);
  this.weaponData[3][2].update(game, dt);
  this.weaponData[4][2].update(game, dt);
};

Weapon.prototype.render = function(game, ctx) {
  // Update the weapons
  this.weaponData[0][2].render(game, ctx);
  this.weaponData[1][2].render(game, ctx);
  this.weaponData[2][2].render(game, ctx);
  this.weaponData[3][2].render(game, ctx);
  this.weaponData[4][2].render(game, ctx);

  // Draw the weapon
  if(this.weaponData[this.currentSlot][1]) {
    var degrees = game.player.aimRotation * (180 / Math.PI);
    ctx.save();
    ctx.translate(
      game.player.x + (game.player.width / 2),
      game.player.y + (game.player.height / 2) + 5);
    ctx.rotate(game.player.aimRotation);
    ctx.drawImage(
      game.assets.get('weapons'),
      64 * this.currentSlot,
      ((degrees < 90 && degrees > -90) ? 0 : 64) + (128 * this.weaponData[this.currentSlot][2].weaponSkin), // TODO: Apply level
      64,
      64,
      -(32 * this.weaponData[this.currentSlot][2].levels[this.weaponData[this.currentSlot][2].level].weaponSize),
      -(32 * this.weaponData[this.currentSlot][2].levels[this.weaponData[this.currentSlot][2].level].weaponSize),
      64 * this.weaponData[this.currentSlot][2].levels[this.weaponData[this.currentSlot][2].level].weaponSize,
      64 * this.weaponData[this.currentSlot][2].levels[this.weaponData[this.currentSlot][2].level].weaponSize
    );
    ctx.restore();
  }
};

Weapon.prototype.fire = function() {
  this.game.pickups.spawn();

  if(this.weaponData[this.currentSlot][1]) {
    this.weaponData[this.currentSlot][2].fire();
  };
};

Weapon.prototype.releaseFire = function() {
  if(this.weaponData[this.currentSlot][1]) {
    this.weaponData[this.currentSlot][2].releaseFire();
  };
};
