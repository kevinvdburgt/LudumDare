function World() {
  var self = this;

  this.width = 3500;
  this.height = 700;
};

World.prototype.update = function(game, dt) {
  if(game.difficulty === 0) {
    game.player.health = 1;
  }
};

World.prototype.render = function(game, ctx) {

    ctx.drawImage(game.assets.get('level_1'),
      ~(Math.floor(game.camera.x / game.assets.get('level_1').width) * game.assets.get('level_1').width), 0);

    ctx.drawImage(game.assets.get('level_1'),
      ~(Math.ceil(game.camera.x / game.assets.get('level_1').width) * game.assets.get('level_1').width), 0);

};

World.prototype.load = function(game, worldName) {
  game.boxes.push(new Box(0, 750, 3500, 100));

  for(var i = 0; i < 150; i++) {
    game.boxes.push(new Box(
      Math.ceil(Math.random() * this.width),
      Math.ceil(Math.random() * this.height),
      100 + Math.ceil(Math.random() * 100),
      10));
  }

  (function loop() {
    if(game.npc.length < (10 + (game.difficulty * 100))) {
      game.npc.push(new Npc());
    }

    setTimeout(loop, 100);
  })();
};
