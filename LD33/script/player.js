function Player() {
  var self = this;
  this.tick = 0;
  this.x = 0;
  this.y = 0;
  this.width = 16;
  this.height = 32;
  this.velX = 0;
  this.velY = 0;
  this.friction = 0.8;
  this.gravity = 0.3;
  this.velocity = 2;
  this.maxSpeed = 6;
  this.jumpVelocity = 10;
  this.isJumping = false;
  this.isGrounded = true;
  this.isMoving = false;
  this.aimRotation = 0;
  this.movingDirection = 1; // 0: left, 1: right
  this.weaponSlot = 0;
  this.health = 1;
};

Player.prototype.update = function(game, dt) {

  this.tick++;

  // Jump the player
  if(game.keyDown(38) || game.keyDown(32) || game.keyDown(87)) {
    if(!this.isJumping && this.isGrounded) {
      this.isJumping = true;
      this.isGrounded = false;
      this.velY = -this.jumpVelocity;
    }
  }

  // Move player to the right
  if(game.keyDown(39) || game.keyDown(68)) {
    if(this.velX < this.maxSpeed) {
      this.velX += this.velocity;
    }

    if(game.keyDown(16)) {
      this.velX = 10;
    }
  }

  // Move player to the left
  if(game.keyDown(37) || game.keyDown(65)) {
    if(this.velX > -this.maxSpeed) {
      this.velX -= this.velocity;
    }

    if(game.keyDown(16)) {
      this.velX = -10;
    }
  }

  // Choose weapon slot
  if(game.keyDown(49)) {
    this.weaponSlot = 0;
    game.particles.emit(this.x, this.y, 400);
  } else if(game.keyDown(50)) {
    this.weaponSlot = 1;
  } else if(game.keyDown(51)) {
    this.weaponSlot = 2;
  } else if(game.keyDown(52)) {
    this.weaponSlot = 3;
  } else if(game.keyDown(53)) {
    this.weaponSlot = 4;
  }

  // Apply forces to the player
  this.velX *= this.friction;
  this.velY += this.gravity;

  // Check for collisions
  this.isGrounded = false;
  for(var i = 0; i < game.boxes.length; i++) {
    var vecD = game.collision.AABB(this, game.boxes[i], true);
    if(vecD === 3 || vecD === 4) {
      this.velX = 0;
      this.isJumping = false;
    } else if(vecD === 2) {
      this.isGrounded = true;
      this.isJumping = false;
    } else if(vecD === 1) {
      this.velY *= -1;
    }
  }

  // Reset the Y velocity
  if(this.isGrounded) {
    this.velY = 0;
  }

  // Velocity high enough to consider moving
  if(this.velX > .1) {
    this.isMoving = true;
  } else if(this.velX < -.1) {
    this.isMoving = true;
  } else {
    this.isMoving = false;
  }

  // Determine direction
  if(this.velX >= 0) {
    this.movingDirection = 0;
  } else {
    this.movingDirection = 1;
  }

  // Apply velocity
  this.x += this.velX;
  this.y += this.velY;

  // Get the aim position
  this.aimRotation = Math.atan2(
    (game.mouseState.y - game.camera.y) - (this.y + (this.height / 2)),
    (game.mouseState.x - game.camera.x) - (this.x + (this.width / 2))
  );

  // Kill player if fallen down into void!
  if(this.y > 850 && this.health > 0) {
    this.health -= 0.1;
    if(this.health < 0) {
      this.health = 0;
    }
  }

  // Hurt player if colliding with NPC
  for(var i = 0; i < game.npc.length; i++) {
    var vecD = game.collision.AABB(this, game.npc[i]);
    if(vecD > 0) {
      game.particles.emit(this.x, this.y, 1);
      this.health -= 0.01;
      if(this.health < 0) {
        this.health = 0;
      }
      break;
    }
  }

  // Move the camera around
  game.camera.x = -this.x + 400;
  game.camera.y = -this.y + 350;

  if(game.camera.y > 0) {
    game.camera.y = 0;
  }
  if(game.camera.y < -400) {
    game.camera.y = -400;
  }

};

Player.prototype.render = function(game, ctx) {
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

  // Draw the gun
  ctx.save();
  ctx.translate(this.x + (this.width / 2), this.y + (this.height / 2) + 5);

  //ctx.translate(this.x - 16, this.y + 16);
ctx.rotate(this.aimRotation);
  var degrees = this.aimRotation * (180 / Math.PI);

  ctx.drawImage(
    game.assets.get('weapons'),
    0,
    (degrees < 90 && degrees > -90) ? 0 : 64,
    64,
    64,
    -32,
    -32,
    64,
    64);

  ctx.restore();
};
