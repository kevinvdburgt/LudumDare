function Particles() {
  var self = this;

  this.particleList = [];
};

Particles.prototype.update = function(game, dt) {

  var dead = [];
  for(var i = 0; i < this.particleList.length; i++) {
    // Apply gravity
    this.particleList[i].velY += this.particleList[i].gravity;

    // Apply velocity
    this.particleList[i].posX += this.particleList[i].velX;
    this.particleList[i].posY += this.particleList[i].velY;

    this.particleList[i].ttl--;
    if(this.particleList[i].ttl < 0) {
      dead.push(i);
    }
  }

  for(var i = 0; i < dead.length; i++) {
    this.particleList.splice(dead[i], 1);
  }
};

Particles.prototype.render = function(game, ctx) {
  for(var i = 0; i < this.particleList.length; i++) {
    ctx.fillStyle = this.particleList[i].color;
    ctx.fillRect(this.particleList[i].posX, this.particleList[i].posY,
      this.particleList[i].size, this.particleList[i].size);
  }
};

Particles.prototype.emit = function(x, y, amount) {
  for(var i = 0; i < amount; i++) {
    this.particleList.push({
      posX: x,
      posY: y,
      velX: -2.5 + (5 * Math.random()),
      velY: ~(Math.random() * 10),
      gravity: 0.8,
      ttl: 100,
      color: '#F00',
      size: 2
    });
  }
};
