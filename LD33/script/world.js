function World() {
  var self = this;

  this.worldImageReady = false;
  this.worldImage = new Image();
  this.worldImage.src = 'assets/level1.png';
  this.worldImage.addEventListener('load', function() {
    self.worldImageReady = true;
  });
  this.worldImageScroll = [0, 0];
};

World.prototype.update = function(game, dt) {
  // Keep the camera in the world
};

World.prototype.render = function(game, ctx) {

  if(this.worldImageReady) {

    ctx.drawImage(this.worldImage,
      ~(Math.floor(game.camera.x / this.worldImage.width) * this.worldImage.width), 0);

    ctx.drawImage(this.worldImage,
      ~(Math.ceil(game.camera.x / this.worldImage.width) * this.worldImage.width), 0);

  }

};

World.prototype.load = function(game, worldName) {
  game.boxes.push(new Box(0, 750, 5000, 100));
  game.boxes.push(new Box(400, 600, 100, 10));
  game.boxes.push(new Box(500, 450, 100, 10));
  game.boxes.push(new Box(600, 300, 100, 10));

  (function loop() {
    if(game.npc.length < 10) {
      game.npc.push(new Npc());
    }

    setTimeout(loop, 1000);
  })();
};
