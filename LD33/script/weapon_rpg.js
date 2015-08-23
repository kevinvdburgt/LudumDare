function Weapon_RPG(game) {
  var self = this;
  this.game = game;
  this.tick = 0;

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
  }, {
    name: 'Large',
    maxAmmo: 32,
    bulletSpeed: 7,
    ttl: 500,
    damage: 0.1,
    xp: 0.05,
    weaponSize: 2,
    hitScore: 15,
    killScore: 150
  }, {
    name: 'Monster',
    maxAmmo: 64,
    bulletSpeed: 9,
    ttl: 500,
    damage: 0.1,
    xp: 0,
    weaponSize: 4,
    hitScore: 50,
    killScore: 500
  }];

  this.rockets = [];
};

Weapon_RPG.prototype.update = function(game, dt) {
  this.tick++;

  var rocketsCleanup = [];
  for(var i = 0; i < this.rockets.length; i++) {

    // Safe old position
    this.rockets[i].oldX = this.rockets[i].x;
    this.rockets[i].oldY = this.rockets[i].y;

    // Apply forces
    //this.rockets[i].velY += this.rockets[i].gravity;
    this.rockets[i].x += this.rockets[i].velX;
    this.rockets[i].y += this.rockets[i].velY;

    // Get rocket rotation
    this.rockets[i].rotation = Math.atan2(
      this.rockets[i].y - this.rockets[i].oldY,
      this.rockets[i].x - this.rockets[i].oldX);

    // Check collision with NPC's
    for(var j = 0; j < game.npc.length; j++) {
      var vecD = game.collision.AABB(this.rockets[i], game.npc[j]);

      // Hit!
      if(vecD > 0) {
        game.player.score += this.rockets[i].hitScore;

        game.particles.emit(this.rockets[i].x, this.rockets[i].y, 1);
        game.npc[j].health -= this.rockets[i].damage;

        // NPC died, add XP
        if(game.npc[j].health <= 0) {
          game.player.score += this.rockets[i].killScore;
          this.xp += this.rockets[i].xp;
        }

        // Destory the bullet
        this.rockets[i].ttl = 0;
        break;
      }
    }

    // Destory old rockets
    this.rockets[i].ttl--;
    if(this.rockets[i].ttl < 0) {
      rocketsCleanup.push(i);
    }
  }

  for(var i = 0; i < rocketsCleanup.length; i++) {
    this.rockets.splice(rocketsCleanup[i], 1);
  }

  // Upgrade weapon level
  if(this.xp > 1) {
    this.xp = 0;
    if(this.level < this.levels.length - 1) {
      this.level++;
    }
  }

  // Limit max rockets
  if(this.ammo > this.levels[this.level].maxAmmo) {
    this.ammo = this.levels[this.level].maxAmmo;
  }
};

Weapon_RPG.prototype.render = function(game, ctx) {
  ctx.fillStyle = '#F00';
  for(var i = 0; i < this.rockets.length; i++) {
    ctx.save();
    ctx.translate(this.rockets[i].x, this.rockets[i].y);
    ctx.rotate(this.rockets[i].rotation);

    ctx.drawImage(game.assets.get('weapons'), (80 + (16 * (this.tick % 4))), 640, 16, 16, 0, 0, 16, 16);

    ctx.restore();
  }
};

Weapon_RPG.prototype.fire = function() {
  if(this.ammo <= 0) {
    return;
  }

  this.ammo--;

  this.rockets.push({
    x: this.game.player.x + (this.game.player.width / 2),
    y: this.game.player.y + (this.game.player.height / 2) + 5,
    width: 16,
    height: 16,
    velX: this.levels[this.level].bulletSpeed * Math.cos(this.game.player.aimRotation),
    velY: this.levels[this.level].bulletSpeed * Math.sin(this.game.player.aimRotation),
    ttl: this.levels[this.level].ttl,
    damage: this.levels[this.level].damage,
    xp: this.levels[this.level].xp,
    gravity: 0.01,
    hitScore: this.levels[this.level].hitScore,
    killScore: this.levels[this.level].killScore
  });
};

Weapon_RPG.prototype.releaseFire = function() {

};
