function Pickups() {
  var self = this;

  this.pickups = [];
  this.pickupMessages = [];
};

Pickups.prototype.update = function(game, dt) {
  var pickupsCleanup = [];
  var pickupMessagesCleanup = [];

  for(var i = 0; i < this.pickups.length; i++) {

    // Apply velocity
    this.pickups[i].velX *= this.pickups[i].friction;
    this.pickups[i].velY += this.pickups[i].gravity;
    this.pickups[i].x += this.pickups[i].velX;
    this.pickups[i].y += this.pickups[i].velY;

    // Collision with player
    var vecD = game.collision.AABB(game.player, this.pickups[i]);
    if(vecD > 0) {
      var message = '';
      if(this.pickups[i].meta.type === 'health') {
        message = '+' + Math.ceil(this.pickups[i].meta.hp * 100) + ' HP';
        game.player.health += this.pickups[i].meta.hp;
      } else if(this.pickups[i].meta.type === 'gun') {
        if(game.weapon.weaponData[this.pickups[i].meta.weapon][1] === false) {
          message = 'New weapon unlocked: ' + game.weapon.weaponData[this.pickups[i].meta.weapon][0];
          game.weapon.weaponData[this.pickups[i].meta.weapon][1] = true;
        } else {
          message = '+' + this.pickups[i].meta.ammo + ' bullets for the ' + game.weapon.weaponData[this.pickups[i].meta.weapon][0];
          game.weapon.weaponData[this.pickups[i].meta.weapon][2].ammo += this.pickups[i].meta.ammo;
        }
      }

      this.pickupMessages.push([
        200, Math.floor(game.player.x), Math.floor(game.player.y) - 100, message
      ]);
      pickupsCleanup.push(i);
      this.pickups[i].ttl = 0;
      break;
    }

    // Collision with boxes
    for(var j = 0; j < game.boxes.length; j++) {
      var vecD = game.collision.AABB(this.pickups[i], game.boxes[j], true);
      if(vecD === 3 || vecD === 4) {
        this.pickups[i].velX *= -1;
      } else if(vecD === 2) {
        this.pickups[i].velY *= -.5;
      } else if(vecD === 1) {
        this.pickups[i].velY *= -1;
      }
    }

    // Cleanup
    this.pickups[i].ttl--;
    if(this.pickups[i].ttl < 0) {
      pickupsCleanup.push(i);
    }
  }

  for(var i = 0; i < this.pickupMessages.length; i++) {
    this.pickupMessages[i][0]--;
    if(this.pickupMessages[i][0] < 0) {
      pickupMessagesCleanup.push(i);
    }
  }

  for(var i = 0; i < pickupsCleanup.length; i++) {
    this.pickups.splice(pickupsCleanup[i], 1);
  }
  for(var i = 0; i < pickupMessagesCleanup.length; i++) {
    this.pickupMessages.splice(pickupMessagesCleanup[i], 1);
  }
};

Pickups.prototype.render = function(game, ctx) {
  for(var i = 0; i < this.pickups.length; i++) {
    ctx.drawImage(
      game.assets.get('pickups'),
      this.pickups[i].icon * 16,
      0,
      this.pickups[i].width,
      16,
      this.pickups[i].x,
      this.pickups[i].y,
      this.pickups[i].width,
      16);
  }



  ctx.textAlign = 'center';
  for(var i = 0; i < this.pickupMessages.length; i++) {
    ctx.font = '50px Wendy';
    ctx.fillStyle = '#000';
    ctx.fillText(this.pickupMessages[i][3],
      this.pickupMessages[i][1] + 2,
      this.pickupMessages[i][2] + (this.pickupMessages[i][0] / 2) + 2);
    ctx.fillText(this.pickupMessages[i][3],
      this.pickupMessages[i][1] - 2,
      this.pickupMessages[i][2] + (this.pickupMessages[i][0] / 2) + 2);
    ctx.fillText(this.pickupMessages[i][3],
      this.pickupMessages[i][1] + 2,
      this.pickupMessages[i][2] + (this.pickupMessages[i][0] / 2) - 2);
    ctx.fillText(this.pickupMessages[i][3],
      this.pickupMessages[i][1] - 2,
      this.pickupMessages[i][2] + (this.pickupMessages[i][0] / 2) - 2);
    ctx.fillStyle = '#FFF';
    ctx.fillText(this.pickupMessages[i][3],
      this.pickupMessages[i][1],
      this.pickupMessages[i][2] + (this.pickupMessages[i][0] / 2));
  }
};

Pickups.prototype.spawn = function(x, y, ttl, meta, iconSlot, iconWidth) {
  this.pickups.push({
    x: x,
    y: y,
    width: iconWidth || 16,
    height: 16,
    velX: 3,
    velY: 0,
    gravity: 0.3,
    friction: 0.8,
    ttl: ttl,
    icon: iconSlot,
    meta: meta
  });
};

/*
ctx.drawImage(
  game.assets.get('character'),
  this.isMoving ? (16 * (Math.floor(this.tick / 4) % 6)) : 0,
  32 * this.movingDirection,
  16,
  32,
  this.x,
  this.y,
  16,
  32);
for(var j = 0; j < game.npc.length; j++) {
  var vecD = game.collision.AABB(this.bullets[i], game.npc[j]);

  // Hit!
  if(vecD > 0) {
    game.particles.emit(this.bullets[i].x, this.bullets[i].y, 1);
    game.npc[j].health -= this.bullets[i].damage;

    // NPC died, add XP
    if(game.npc[j].health <= 0) {
      this.xp += this.bullets[i].xp;
    }

    // Destory the bullet
    this.bullets[i].ttl = 0;
    break;
  }
}
*/
