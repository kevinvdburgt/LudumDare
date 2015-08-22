function Game() {
  var self = this;

  this.ctx = null;
  this.keyState = [];
  this.mouseState = { x: 0, y: 0 };

  // Gamestate
  // 0: Downloading / initializing
  // 1: Main menu
  // 2: Playing
  this.gameState = 0;

  this.assets = new Assets();
  this.collision = new Collision();
  this.player = new Player();
  this.world = new World();
  this.gui = new Gui();
  this.weapon = new Weapon();
  this.particles = new Particles();
  this.boxes = [];
  this.camera = { x: 0, y: 0, velX: 0, velY: 0 };
  this.npc = [];

  this.initialize();
};

Game.prototype.initialize = function() {
  var self = this;

  // Add assets
  this.assets.add('assets/level1.png', 'level_1', 'image');
  this.assets.add('assets/character.png', 'character', 'image');
  this.assets.add('assets/weapons.png', 'weapons', 'image');
  this.assets.add('assets/npc1.png', 'npc1', 'image');
  this.assets.add('assets/npc2.png', 'npc2', 'image');

  // Setup the canvas
  this.ctx = document.querySelector('#stage > canvas').getContext('2d');

  // Handle the pressed key's
  document.addEventListener('keydown', function(e) {
    if(self.keyState.indexOf(e.keyCode) > -1) {
      return;
    }
    self.keyState.push(e.keyCode);
  }, false);

  // Handle the released key's
  document.addEventListener('keyup', function(e) {
    var index = self.keyState.indexOf(e.keyCode);
    if(index === -1) {
      return;
    }
    self.keyState.splice(index, 1);
  }, false);

  // Handle mouse movements
  document.querySelector('#stage').addEventListener('mousemove', function(e) {
    self.mouseState.x = e.layerX;
    self.mouseState.y = e.layerY;
  }, false);

  (function loop() {
    self.update(1);
    self.render();
    requestAnimationFrame(loop);
  })();

  this.ctx.imageSmoothingEnabled = false;
  this.ctx.webkitImageSmoothingEnabled = false;
  this.ctx.mozImageSmoothingEnabled = false;

  this.world.load(this, 'level_1');

  this.assets.download(function() {

  }, function() {
    self.gameState = 2;
  });
};

Game.prototype.update = function(dt) {
  var self = this;

  if(this.gameState === 2) {

    // Camera control
    this.camera.x += this.camera.velX;
    this.camera.y += this.camera.velY;

    // Handle world updates
    this.world.update(this, dt);

    // Handle NPC's
    var npcCleanup = [];
    for(var i = 0; i < this.npc.length; i++) {
      this.npc[i].update(this, dt);
      if(this.npc[i].health <= 0) {
        npcCleanup.push(i);
      }
    }
    for(var i = 0; i < npcCleanup.length; i++) {
      this.npc.splice(npcCleanup[i], 1);
    }

    // Handle the plauer
    this.player.update(this, dt);

    // Handle the collision boxes
    for(var i = 0; i < this.boxes.length; i++) {
      this.boxes[i].update(this, dt);
    }

    // Handle the particles
    this.particles.update(this, dt);

    // Handle the GUI
    this.gui.update(game, dt);
  }
};

Game.prototype.render = function() {
  this.ctx.clearRect(0, 0, 800, 450);
  this.ctx.fillStyle = '#F00';

  if(this.gameState === 1) {
    this.ctx.fillStyle = '#3296dc';
    this.ctx.fillRect(0, 0, 800, 450);

    // Draw menu items
    this.ctx.fillStyle = '#cd6c1e';
    this.ctx.fillRect(300, 100, 200, 30);
    this.ctx.fillRect(300, 140, 200, 30);

  } else if(this.gameState === 2) {

    // Save the current canvas state and translate the view
    // to a specific point (camera control)
    this.ctx.save();
    this.ctx.translate(this.camera.x, this.camera.y);

    // Render the world
    this.world.render(this, this.ctx);

    // Render NPC's
    for(var i = 0; i < this.npc.length; i++) {
      this.npc[i].render(this, this.ctx);
    }

    // Render player
    this.player.render(this, this.ctx);

    // Render collision boxes
    for(var i = 0; i < this.boxes.length; i++) {
      this.boxes[i].render(this, this.ctx);
    }

    // Render particles
    this.particles.render(this, this.ctx);

    // Restore the camera control view
    this.ctx.restore();

    // Render the GUI
    this.gui.render(game, this.ctx);
  }

};

Game.prototype.keyDown = function(keyCode) {
  return this.keyState.indexOf(keyCode) > -1;
};
