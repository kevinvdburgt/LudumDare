function Npc() {
  var self = this;

  this.tick = 0;
  this.x = Math.random() * 500;
  this.y = 10;
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
  this.movingDirection = 0;
  this.health = Math.random();

  this.npcSkin = Math.random() > .5 ? 'npc1' : 'npc2';
  this.npcFavoriteDirection = Math.random() > .5 ? 10 : -10;

  (function loop() {

    // Random movement
    if(Math.random() > .25) {
      self.velX = self.npcFavoriteDirection * Math.random();
    } else {
      self.velX = ~(self.npcFavoriteDirection * Math.random());
    }

    // Random jumps, THE FUCK LOLZ
    if(Math.random() > .75) {

    }

    setTimeout(loop, Math.ceil(Math.random() * 500));
  })();
};

Npc.prototype.update = function(game, dt) {
  this.tick++;

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

  // Kill npc if fallen down into void!
  if(this.y > 850 && this.health > 0) {
    this.health = 0;
  }
};

Npc.prototype.render = function(game, ctx) {
  ctx.drawImage(
    game.assets.get(this.npcSkin),
    this.isMoving ? (16 * (Math.floor(this.tick / 4) % 6)) : 0,
    32 * this.movingDirection,
    16,
    32,
    this.x,
    this.y,
    16,
    32);

  ctx.fillStyle = 'rgba(255, 255, 255, .4)';
  ctx.fillRect(this.x - 8, this.y - 10, 32, 4);
  ctx.fillStyle = 'rgba(255, 0, 0, .4)';
  ctx.fillRect(this.x - 8, this.y - 10, Math.ceil(this.health * 32), 4);
};
