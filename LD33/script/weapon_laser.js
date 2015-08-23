function Weapon_Laser(game) {
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
    beamLength: 1,
    beamDelay: 10,
    hitScore: 5,
    killScore: 50
  }, {
    name: 'Fast',
    maxAmmo: 32,
    bulletSpeed: 10,
    ttl: 500,
    damage: 0.5,
    xp: 0.05,
    weaponSize: 2,
    beamLength: 10,
    beamDelay: 10,
    hitScore: 10,
    killScore: 150
  }, {
    name: 'Default',
    maxAmmo: 32,
    bulletSpeed: 5,
    ttl: 500,
    damage: 0.8,
    xp: 0,
    weaponSize: 4,
    beamLength: 100,
    beamDelay: 10,
    hitScore: 15,
    killScore: 500
  }];

  this.lasers = [];
};

Weapon_Laser.prototype.update = function(game, dt) {
  this.tick++;

  var lasersCleanup = [];
  for(var i = 0; i < this.lasers.length; i++) {

    // Safe old position
    this.lasers[i].oldX = this.lasers[i].x;
    this.lasers[i].oldY = this.lasers[i].y;

    // Apply forces
    //this.lasers[i].velY += this.lasers[i].gravity;
    this.lasers[i].x += this.lasers[i].velX;
    this.lasers[i].y += this.lasers[i].velY;

    // Get rocket rotation
    this.lasers[i].rotation = Math.atan2(
      this.lasers[i].y - this.lasers[i].oldY,
      this.lasers[i].x - this.lasers[i].oldX);

    // Check collision with NPC's
    for(var j = 0; j < game.npc.length; j++) {
      var vecD = game.collision.AABB(this.lasers[i], game.npc[j]);

      // Hit!
      if(vecD > 0) {
        game.player.score += this.lasers[i].hitScore;

        game.particles.emit(this.lasers[i].x, this.lasers[i].y, 1);
        game.npc[j].health -= this.lasers[i].damage;

        // NPC died, add XP
        if(game.npc[j].health <= 0) {
          game.player.score += this.lasers[i].killScore;
          this.xp += this.lasers[i].xp;
        }

        // Destory the bullet
        this.lasers[i].ttl = 0;
        break;
      }
    }

    // Destory old lasers
    this.lasers[i].ttl--;
    if(this.lasers[i].ttl < 0) {
      lasersCleanup.push(i);
    }
  }

  for(var i = 0; i < lasersCleanup.length; i++) {
    this.lasers.splice(lasersCleanup[i], 1);
  }

  // Upgrade weapon level
  if(this.xp > 1) {
    this.xp = 0;
    if(this.level < this.levels.length - 1) {
      this.level++;
    }
  }

  // Limit max lasers
  if(this.ammo > this.levels[this.level].maxAmmo) {
    this.ammo = this.levels[this.level].maxAmmo;
  }
};

Weapon_Laser.prototype.render = function(game, ctx) {
  ctx.fillStyle = '#F00';
  for(var i = 0; i < this.lasers.length; i++) {
    ctx.save();
    ctx.translate(this.lasers[i].x, this.lasers[i].y);
    ctx.rotate(this.lasers[i].rotation);
    ctx.drawImage(game.assets.get('weapons'), 160, 640, 16, 16, 0, 0, 16, 16);
    ctx.restore();
  }
};

Weapon_Laser.prototype.fire = function() {
  var self = this;

  if(this.ammo <= 0) {
    return;
  }

  this.ammo--;

  for(var i = 0; i < this.levels[this.level].beamLength; i++) {
    setTimeout(function() {
      self.lasers.push({
        x: self.game.player.x + (self.game.player.width / 2),
        y: self.game.player.y + (self.game.player.height / 2) + 5,
        width: 16,
        height: 16,
        velX: self.levels[self.level].bulletSpeed * Math.cos(self.game.player.aimRotation),
        velY: self.levels[self.level].bulletSpeed * Math.sin(self.game.player.aimRotation),
        ttl: self.levels[self.level].ttl,
        damage: self.levels[self.level].damage,
        xp: self.levels[self.level].xp,
        hitScore: self.levels[self.level].hitScore,
        killScore: self.levels[self.level].killScore
      });
    }, self.levels[self.level].beamDelay * i);
  }
};

Weapon_Laser.prototype.releaseFire = function() {

};
