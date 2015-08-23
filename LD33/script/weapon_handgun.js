function Weapon_Handgun(game) {
  var self = this;
  this.game = game;

  this.ammo = 32;
  this.xp = 0;
  this.weaponSkin = 0;
  this.level = 0;
  this.levels = [{
    name: 'Default',
    maxAmmo: 32,
    bulletSpeed: 5,
    ttl: 500,
    damage: 0.1,
    xp: 0.1,
    weaponSize: 1,
    hitScore: 5,
    killScore: 50
  },{
    name: 'Large',
    maxAmmo: 32,
    bulletSpeed: 5,
    ttl: 500,
    damage: 0.5,
    xp: 0.05,
    weaponSize: 2,
    hitScore: 10,
    killScore: 150
  },{
    name: 'Monster',
    maxAmmo: 32,
    bulletSpeed: 5,
    ttl: 500,
    damage: 1,
    xp: 0,
    weaponSize: 4,
    hitScore: 15,
    killScore: 500
  }];

  this.bullets = [];
};

Weapon_Handgun.prototype.update = function(game, dt) {
  var bulletsCleanup = [];
  for(var i = 0; i < this.bullets.length; i++) {

    // Apply forces
    this.bullets[i].x += this.bullets[i].velX;
    this.bullets[i].y += this.bullets[i].velY;

    // Check collision with NPC's
    for(var j = 0; j < game.npc.length; j++) {
      var vecD = game.collision.AABB(this.bullets[i], game.npc[j]);

      // Hit!
      if(vecD > 0) {
        game.player.score += this.bullets[i].hitScore;

        game.particles.emit(this.bullets[i].x, this.bullets[i].y, 1);
        game.npc[j].health -= this.bullets[i].damage;

        // NPC died, add XP
        if(game.npc[j].health <= 0) {
          game.player.score += this.bullets[i].killScore;
          this.xp += this.bullets[i].xp;
        }

        // Destory the bullet
        this.bullets[i].ttl = 0;
        break;
      }
    }

    // Destory old bullets
    this.bullets[i].ttl--;
    if(this.bullets[i].ttl < 0) {
      bulletsCleanup.push(i);
    }
  }

  for(var i = 0; i < bulletsCleanup.length; i++) {
    this.bullets.splice(bulletsCleanup[i], 1);
  }

  // Upgrade weapon level
  if(this.xp > 1) {
    this.xp = 0;
    if(this.level < this.levels.length - 1) {
      this.level++;
    }
  }

  // Limit max bullets
  if(this.ammo > this.levels[this.level].maxAmmo) {
    this.ammo = this.levels[this.level].maxAmmo;
  }
};

Weapon_Handgun.prototype.render = function(game, ctx) {
  ctx.fillStyle = '#F00';
  for(var i = 0; i < this.bullets.length; i++) {
    ctx.fillRect(this.bullets[i].x, this.bullets[i].y,
      this.bullets[i].width, this.bullets[i].height);
  }
};

Weapon_Handgun.prototype.fire = function() {
  if(this.ammo <= 0) {
    return;
  }

  this.ammo--;

  this.bullets.push({
    x: this.game.player.x + (this.game.player.width / 2),
    y: this.game.player.y + (this.game.player.height / 2) + 5,
    width: 2,
    height: 2,
    velX: this.levels[this.level].bulletSpeed * Math.cos(this.game.player.aimRotation),
    velY: this.levels[this.level].bulletSpeed * Math.sin(this.game.player.aimRotation),
    ttl: this.levels[this.level].ttl,
    damage: this.levels[this.level].damage,
    xp: this.levels[this.level].xp,
    hitScore: this.levels[this.level].hitScore,
    killScore: this.levels[this.level].killScore
  });
};

Weapon_Handgun.prototype.releaseFire = function() {

};
