function Box(x, y, width, height) {
  var self = this;

  this.x = x || 0;
  this.y = y || 0;
  this.width = width || 10;
  this.height = height || 10;
}

Box.prototype.update = function(game, dt) {

};

Box.prototype.render = function(game, ctx) {
  ctx.fillStyle = 'rgba(250, 250, 250, .5)';
  ctx.fillRect(
    this.x,
    this.y,
    this.width,
    this.height);
};
