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
  this.weapon = new Weapon(this);
  this.particles = new Particles();
  this.pickups = new Pickups();
  this.ai = new AI(this);
  this.boxes = [];
  this.camera = { x: 0, y: 0, velX: 0, velY: 0 };
  this.npc = [];

  this.tick = 0;

  this.menu = 0;
  this.menu_level = 0;
  this.difficulty = 2;

  this.initialize();
};

Game.prototype.initialize = function() {
  var self = this;

  // Add assets
  this.assets.add('assets/splash.png', 'splash', 'image');
  this.assets.add('assets/level1.png', 'level_1', 'image');
  this.assets.add('assets/character.png', 'character', 'image');
  this.assets.add('assets/weapons.png', 'weapons', 'image');
  this.assets.add('assets/npc1.png', 'npc1', 'image');
  this.assets.add('assets/npc2.png', 'npc2', 'image');
  this.assets.add('assets/pickups.png', 'pickups', 'image');

  // Setup the canvas
  this.ctx = document.querySelector('#stage > canvas').getContext('2d');

  // Handle the pressed key's
  document.addEventListener('keydown', function(e) {
    if(self.keyState.indexOf(e.keyCode) > -1) {
      return;
    }
    self.keyState.push(e.keyCode);
    self.onKeyPress(e.keyCode);
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
    self.gameState = 1;
  });
};

Game.prototype.update = function(dt) {
  var self = this;

  this.tick++;

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
      this.particles.emit(this.npc[npcCleanup[i]].x, this.npc[npcCleanup[i]].y , 10);
      this.npc.splice(npcCleanup[i], 1);
    }

    // Handle the pickups
    this.pickups.update(this, dt);

    // Handle the plauer
    this.player.update(this, dt);

    // Handle the collision boxes
    for(var i = 0; i < this.boxes.length; i++) {
      this.boxes[i].update(this, dt);
    }

    // Handle weapons
    this.weapon.update(this, dt);

    // Handle the particles
    this.particles.update(this, dt);

    // Handle the GUI
    this.gui.update(game, dt);

    if(this.player.health <= 0) {
      this.gameState = 3;
    }
  }
};

Game.prototype.render = function() {
  this.ctx.clearRect(0, 0, 800, 450);
  this.ctx.fillStyle = '#F00';

  if(this.gameState === 1) {
    // Render background
    this.ctx.drawImage(this.assets.get('splash'), 0, 0);

    // Draw menu items
    this.ctx.font = '28px Wendy';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'top';
    this.ctx.fillStyle = '#ff9c00';

    if(this.menu_level === 0) {
      this.ctx.fillRect(300, 200, 200, 30);
      this.ctx.fillRect(300, 240, 200, 30);

      this.ctx.fillStyle = '#FFF';
      if(this.menu === 0) {
        this.ctx.fillText('> Start Game <', 400, 200);
      } else {
        this.ctx.fillText('Start Game', 400, 200);
      }

      if(this.menu === 1) {
        this.ctx.fillText('> Difficulty <', 400, 240);
      } else {
        this.ctx.fillText('Difficulty', 400, 240);
      }
    } else if(this.menu_level === 1) {
      this.ctx.fillRect(300, 200, 200, 30);
      this.ctx.fillRect(300, 240, 200, 30);
      this.ctx.fillRect(300, 280, 200, 30);
      this.ctx.fillRect(300, 320, 200, 30);
      this.ctx.fillRect(300, 360, 200, 30);

      this.ctx.fillStyle = '#FFF';
      if(this.difficulty === 0) {
        this.ctx.fillText('> God mode <', 400, 200);
      } else {
        this.ctx.fillText('God mode', 400, 200);
      }
      if(this.difficulty === 1) {
        this.ctx.fillText('> Easy <', 400, 240);
      } else {
        this.ctx.fillText('Easy', 400, 240);
      }
      if(this.difficulty === 2) {
        this.ctx.fillText('> Normal <', 400, 280);
      } else {
        this.ctx.fillText('Normal', 400, 280);
      }
      if(this.difficulty === 3) {
        this.ctx.fillText('> Hard <', 400, 320);
      } else {
        this.ctx.fillText('Hard', 400, 320);
      }
      if(this.difficulty === 4) {
        this.ctx.fillText('> Hardcore <', 400, 360);
      } else {
        this.ctx.fillText('Hardcore', 400, 360);
      }
    }

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

    // Render pickups
    this.pickups.render(this, this.ctx);

    // Render weapons
    this.weapon.render(this, this.ctx);

    // Render particles
    this.particles.render(this, this.ctx);

    // Restore the camera control view
    this.ctx.restore();

    // Render the GUI
    this.gui.render(game, this.ctx);

  } else if(this.gameState === 3) {
    // Render background
    this.ctx.drawImage(this.assets.get('splash'), 0, 0);

    // Draw menu items
    this.ctx.font = '64px Wendy';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'top';

    this.ctx.fillStyle = '#ff9c00';
    this.ctx.fillText('Game Over', 402, 162);
    this.ctx.fillStyle = '#FFF';
    this.ctx.fillText('Game Over', 400, 160);

    this.ctx.font = '34px Wendy';
    this.ctx.fillStyle = '#ff9c00';
    this.ctx.fillText('Score: ' + this.player.score, 402, 222);
    this.ctx.fillStyle = '#FFF';
    this.ctx.fillText('Score: ' +this.player.score , 400, 220);

    this.ctx.fillStyle = '#ff9c00';
    this.ctx.fillRect(200, 300, 405 , 30);
    this.ctx.fillStyle = '#FFF';
    this.ctx.fillText('Press any key to restart', 400, 300);
  }

};

Game.prototype.keyDown = function(keyCode) {
  return this.keyState.indexOf(keyCode) > -1;
};

Game.prototype.onKeyPress = function(key) {
  if(this.gameState === 1) {
    // Down
    if(key === 83 || key === 40) {
      if(this.menu_level === 0 && this.menu < 1) {
        this.menu++;
      } else if(this.menu_level === 1 && this.difficulty < 4) {
        this.difficulty++;
      }
    }

    // Up
    if(key === 87 || key === 38) {
      if(this.menu_level === 0 && this.menu > 0) {
        this.menu--;
      } else if(this.menu_level === 1 && this.difficulty > 0) {
        this.difficulty--
      }
    }

    // Select
    if(key === 32 || key === 13) {
      if(this.menu_level === 0 && this.menu === 0) {
        // Play
        this.gameState = 2;
      } else if(this.menu_level === 0 && this.menu === 1) {
        // Difficulty
        this.menu_level = 1;
      } else if(this.menu_level === 1) {
        this.menu_level = 0;
      }
    }
  } else if(this.gameState === 3) {
    location.reload(false);
  }
};
