function Weapon_Bow(game) {
  var self = this;
  this.game = game;

  this.ammo = 32;
  this.xp = 0;
  this.weaponSkin = 0;
  this.level = 0;
  this.levels = [{
    name: 'Default',
    maxAmmo: 32,
    arrowSpeed: 20,
    arrowGravity: 0.3,
    ttl: 500,
    damage: 0.1,
    xp: 0.05,
    weaponSize: 1,
    charcheSpeed: 0.01,
    hitScore: 5,
    killScore: 50
  }, {
    name: 'Large',
    maxAmmo: 32,
    arrowSpeed: 20,
    arrowGravity: 0.3,
    ttl: 500,
    damage: 0.3,
    xp: 0.05,
    weaponSize: 2,
    charcheSpeed: 0.02,
    hitScore: 5,
    killScore: 50
  }, {
    name: 'Monster',
    maxAmmo: 32,
    arrowSpeed: 20,
    arrowGravity: 0.3,
    ttl: 500,
    damage: 0.9,
    xp: 0,
    weaponSize: 4,
    charcheSpeed: 0.05,
    hitScore: 5,
    killScore: 50
  }];

  this.arrows = [];

  this.isCharching = false;
  this.charcheProcess = 0;
};

Weapon_Bow.prototype.update = function(game, dt) {
  var arrowsCleanup = [];
  for(var i = 0; i < this.arrows.length; i++) {

    // Safe old position
    this.arrows[i].oldX = this.arrows[i].x;
    this.arrows[i].oldY = this.arrows[i].y;

    // Apply forces
    this.arrows[i].velY += this.arrows[i].gravity;
    this.arrows[i].x += this.arrows[i].velX;
    this.arrows[i].y += this.arrows[i].velY;

    // Get arrow rotation
    this.arrows[i].rotation = Math.atan2(
      this.arrows[i].y - this.arrows[i].oldY,
      this.arrows[i].x - this.arrows[i].oldX);

    // Collision
    for(var j = 0; j < game.npc.length; j++) {
      var vecD = game.collision.AABB(this.arrows[i], game.npc[j]);

      // Hit!
      if(vecD > 0) {
        game.player.score += this.arrows[i].hitScore;
        game.particles.emit(this.arrows[i].x, this.arrows[i].y, 1);
        game.npc[j].health -= this.arrows[i].damage;

        // NPC died, add XP
        if(game.npc[j].health <= 0) {
          game.player.score += this.arrows[i].killScore;
          this.xp += this.arrows[i].xp;
        }

        // Destory the bullet
        this.arrows[i].ttl = 0;
        break;
      }
    }

    this.arrows[i].ttl--;
    if(this.arrows[i].ttl < 0) {
      arrowsCleanup.push(i);
    }
  }

  for(var i = 0; i < arrowsCleanup.length; i++) {
    this.arrows.splice(arrowsCleanup[i], 1);
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

  // Charche bow
  if(this.isCharching && this.charcheProcess <= 1) {
    this.charcheProcess += this.levels[this.level].charcheSpeed;
    this.weaponSkin = Math.ceil(this.charcheProcess * 3);
  } else if(!this.isCharching && this.charcheProcess > 0) {
    this.arrows.push({
      x: this.game.player.x + (this.game.player.width / 2),
      y: this.game.player.y + (this.game.player.height / 2) + 5,
      width: 16,
      height: 8,
      gravity: 0.3,
      velX: (this.charcheProcess * this.levels[this.level].arrowSpeed) * Math.cos(this.game.player.aimRotation),
      velY: (this.charcheProcess * this.levels[this.level].arrowSpeed) * Math.sin(this.game.player.aimRotation),
      ttl: this.levels[this.level].ttl,
      damage: this.levels[this.level].damage,
      xp: this.levels[this.level].xp,
      hitScore: this.levels[this.level].hitScore,
      killScore: this.levels[this.level].killScore
    });
    this.charcheProcess = 0;
    this.weaponSkin = 0;
    this.ammo--;
  }
};

Weapon_Bow.prototype.render = function(game, ctx) {
  ctx.fillStyle = '#F00';
  for(var i = 0; i < this.arrows.length; i++) {
    ctx.save();
    ctx.translate(this.arrows[i].x, this.arrows[i].y);
    ctx.rotate(this.arrows[i].rotation);
    ctx.drawImage(game.assets.get('weapons'), 48, 640, 16, 16, 0, 0, 16, 16);

    ctx.restore();
  }

  if(this.charcheProcess > 0) {
    ctx.fillStyle = 'rgba(0, 0, 0, .7)';
    ctx.fillRect((~game.camera.x) + 300, (~game.camera.y) + 400, 200, 10);
    ctx.fillStyle = 'rgba(255, 255, 255, .7)';
    ctx.fillRect((~game.camera.x) + 300, (~game.camera.y) + 400, Math.ceil(this.charcheProcess * 200), 10);
  }
};

Weapon_Bow.prototype.fire = function() {
  if(this.ammo <= 0) {
    return;
  }

  this.isCharching = true;
};

Weapon_Bow.prototype.releaseFire = function() {
  this.isCharching = false;
};
