var CURR = 0, NEXT = 1;

function Game() {
    this.level = new Level();
    this.world = new World();
    this.animate = new cmh();
    //this.animate = new Animate();

    // Game 
    this.gameState = 0; // 0 = menu
    this.menuState = 0;
    this.activeKeys = [];
    this.levelid = 0;
    this.flipped = false;
    this.flippedCur = 30;

    // GUI
    this.ctx = null;

    // WebGL stuff
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.light = null;

    // Effects
    this.effect = null;
    this.useAnaglyph = false;

    // Debug and testing stuff
    this.debug_stats = false;
};

Game.prototype.initialize = function() {
    var self = this;

    // When needed, use the Status performance meter
    if(this.debug_stats == true) {
        var _stats = new Stats();
        _stats.setMode(0);
        _stats.domElement.style.position = 'absolute';
        _stats.domElement.style.top = '0px';
        _stats.domElement.style.zIndex = 100;
        document.body.appendChild(_stats.domElement);
    }

    // Create a Three scene
    this.scene = new THREE.Scene();

    // Setup a perspective camera
    this.camera = new THREE.PerspectiveCamera(
        45, // Field of View
        window.innerWidth / window.innerHeight, // Aspect ration
        1, // Render distance: near
        8000); // Render distance: far

    // Setup the renderer, using WebGL
    this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true 
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    // Add key eventlisteners
    document.addEventListener('keyup', function(e) { self.keyHandler(e.keyCode, e, false); }, true);
    document.addEventListener('keydown', function(e) { self.keyHandler(e.keyCode, e, true)}, false);

    // Setup the canvas element
    this.ctx = document.getElementById('stage').getContext('2d');
    this.ctx.canvas.width = window.innerWidth;
    this.ctx.canvas.height = window.innerHeight;

    // Shader effects
    this.effect = new THREE.AnaglyphEffect(this.renderer);
    this.effect.setSize(window.innerWidth, window.innerHeight);

    // Lights
    this.lighta = new THREE.PointLight(0xffffff, 1, 10000);
    this.lighta.position.set(50, 50, 50);
    this.scene.add(this.lighta);

    // Initialize the level loader/builder
    this.level.initialize(this.scene, this.world);

    // Register the callback when the world class detects a win
    this.world.callWin(this.round_win);

    // Start the game main loop
    var delta = Date.now(), now, dt;
    (function loop() {
        now = Date.now();
        dt = now - delta;
        delta = now;
        self.update(dt);
        if(self.debug_stats) { _stats.update(); }
        if(!self.useAnaglyph) {
            self.renderer.render(self.scene, self.camera);
        } else {
            self.effect.render(self.scene, self.camera);
        }
        requestAnimationFrame(loop);
    })();

    // The canvas / infoscreen / gui
    (function loop() {
        self.guiUpdate();
        requestAnimationFrame(loop);
    })();

    this.level.load('level_00');

};

Game.prototype.update = function(delta) {

    this.world.update(delta);
    this.level.update(delta);

    // Update the camera position
    var radius = 1600, rotation = Date.now() * 0.01, tilt = this.flippedCur;
    this.camera.position.x = radius * Math.sin(rotation * Math.PI / 180) * Math.cos(tilt * Math.PI / 180);
    this.camera.position.y = radius * Math.sin(tilt * Math.PI / 180);
    this.camera.position.z = radius * Math.cos(rotation * Math.PI / 180) * Math.cos(tilt * Math.PI / 180);
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));

    
    var radius = 1600, rotation = Date.now() * 0.01, tilt = this.flippedCur;
    this.lighta.position.set(
        radius * Math.sin(rotation * Math.PI / 180) * Math.cos(tilt * Math.PI / 180),
        radius * Math.sin(tilt * Math.PI / 180),
        radius * Math.cos(rotation * Math.PI / 180) * Math.cos(tilt * Math.PI / 180));

    // Update the light position

};

Game.prototype.guiUpdate = function() {
    if(this.ctx == null) return;
    var c = this.ctx,
        w = c.canvas.width,
        h = c.canvas.height;

    c.clearRect(0, 0, w, h);

    // Draw menu
    if(this.gameState == 0) {
        c.textAlign = 'center';
        c.font = '134px wendy';
        c.fillStyle = '#FF7700';
        c.fillText('Beneath the Grid', w/2 + 5, 100 + 5);
        c.fillStyle = '#FFFFFF';
        c.fillText('Beneath the Grid', w/2, 100);

        c.font = '34px wendy';
        if(this.menuState == 0) { c.fillStyle = '#FF7700'; } else { c.fillStyle = '#007799'; }
        c.fillRect(w/2-200, h/2 - 50, 400, 30);
        c.fillStyle = '#FFFFFF';
        c.fillText('start game', w/2, h/2 + 24 - 50);
    
        if(this.menuState == 1) { c.fillStyle = '#FF7700'; } else { c.fillStyle = '#007799'; }
        c.fillRect(w/2-200, h/2, 400, 30);
        c.fillStyle = '#FFFFFF';
        c.fillText('how to play', w/2, h/2 + 24);
    
        if(this.menuState == 2) { c.fillStyle = '#FF7700'; } else { c.fillStyle = '#007799'; }
        c.fillRect(w/2-200, h/2 + 50, 400, 30);
        c.fillStyle = '#FFFFFF';
        if(this.useAnaglyph == false) {
            c.fillText('3d anaglyph: off', w/2, h/2 + 24 + 50);
        } else {
            c.fillText('3d anaglyph: on', w/2, h/2 + 24 + 50);
        }
    } else if(this.gameState == 1) {
        c.textAlign = 'left';
        c.fillStyle = '#FF7700';
        c.fillRect(w/2-300 + 5, h/2-200 + 5, 600, 400);
        c.fillStyle = '#007799';
        c.fillRect(w/2-300, h/2-200, 600, 400);

        c.font = '46px wendy';
        c.fillStyle = '#FF7700';
        c.fillText('Beneath the Grid', w/2 - 290 + 2, h/2 - 168 + 2);
        c.fillStyle = '#FFFFFF';
        c.fillText('Beneath the Grid', w/2 - 290, h/2 - 168);

        c.font = '34px wendy';
        c.fillText('Beneath the Grid is a simple puzzle game. your' ,w/2 - 290, h/2 - 120);
        c.fillText('goal is to got both hale cubes on the green' ,w/2 - 290, h/2 - 100);
        c.fillText('plate. when both half sized cubes on the green' ,w/2 - 290, h/2 - 80);
        c.fillText('plate you enters the next level.' ,w/2 - 290, h/2 - 60);

        c.fillText('On the surface and beneath the service there is' ,w/2 - 290, h/2 - 20);
        c.fillText('labyrinth, and you control both half cubes at' ,w/2 - 290, h/2);
        c.fillText('the same time!' ,w/2 - 290, h/2 + 20);

        c.fillText('controls: WSAD or arrow keys' ,w/2 - 290, h/2 + 60);

        c.fillText('This game has made in 48 hours during the Ludum' ,w/2 - 290, h/2 + 100);
        c.fillText('Dare compo 29 by kevin van der burgt' ,w/2 - 290, h/2 + 120);

        c.fillText('Hit enter or spacebar to return' ,w/2 - 290, h/2 + 190);
    } else if(this.gameState == 4) {
        c.textAlign = 'center';
        c.font = '134px wendy';
        c.fillStyle = '#FF7700';
        c.fillText('Beneath the Grid', w/2 + 5, 100 + 5);
        c.fillStyle = '#FFFFFF';
        c.fillText('Beneath the Grid', w/2, 100);

        c.fillStyle = '#FF7700';
        c.fillRect(w/2-200 + 5, h/2-40 + 5, 400, 80);
        c.fillStyle = '#007799';
        c.fillRect(w/2-200, h/2-40, 400, 80);

        c.font = '106px wendy';
        c.fillStyle = '#FFFFFF';
        c.fillText('FINISHED :]', w/2, h/2 + 25);
    }

    // Draw info and score
    c.font = '34px wendy';
    c.fillStyle = '#007799';
    c.fillRect(0, h - 30, w, 30);
    c.fillStyle = '#FFFFFF';
    c.textAlign = 'left';
    if(this.levelid > 0 && this.gameState == 2) {
        c.fillText("Level: " + this.levelid, 10, h - 30 + 24);
    } else {
        c.fillText("Ludumdare 29 - Theme: Beneath the Surface", 10, h - 30 + 24);
    }
    c.textAlign = 'right';
    c.fillText("by: kevinvdburgt.com", w - 10, h - 30 + 24);
};

Game.prototype.round_win = function() {
    var self = game; // <-- Hacky way...

    self.level.cleanup(function() {
        self.level.load(self.selectLevel());
    });
};

Game.prototype.selectLevel = function(prev) {
    var self = this;
    if(!prev) prev = this.levelid;

    this.levelid++;

    switch(prev) {
        case 0: return 'level_01';
        case 1: return 'level_02';
        case 2: return 'level_03';
        case 3: return 'level_04';
        case 4: this.gameState = 4; return 'level_00';
    }
};

Game.prototype.keyHandler = function(keyCode, keyEvent, keyState) {
    var self = this,
        index = this.activeKeys.indexOf(keyCode);

    if(keyState == true && index > -1) {
        return;
    } else if(keyState == false && index > -1) {
        this.activeKeys.splice(index, 1);
        return;
    } else if(keyState == true) {
        this.activeKeys.push(keyCode);
    } else {
        return;
    }

    switch(keyCode) {
        case 87: // W
        case 38: // Up arrow
            if(this.gameState == 0) {
                if(this.menuState > 0) {
                    this.menuState--;
                }
            } else if(this.gameState == 2) {
                this.world.obj.cube[0].move(1);
                this.world.obj.cube[1].move(1);
            }
            break;

        case 83: // S
        case 40: // Down arrow
            if(this.gameState == 0) {
                if(this.menuState < 2) {
                    this.menuState++;
                }
            } else if(this.gameState == 2) {
                this.world.obj.cube[0].move(2);
                this.world.obj.cube[1].move(2);
            }
            break;

        case 68: // D
        case 39: // Right arrow
            if(this.gameState == 2) {
                this.world.obj.cube[0].move(3);
                this.world.obj.cube[1].move(4);
            }
            break;

        case 65: // A
        case 37: // Left arrow
            if(this.gameState == 2) {
                this.world.obj.cube[0].move(4);
                this.world.obj.cube[1].move(3);
            }
            break;

        case 32: // Space
        case 13: // Enter
            if(this.gameState == 0) {
                if(this.menuState == 0) {

                    this.gameState = 2;
                    this.level.cleanup(function() {
                        self.level.load(self.selectLevel());
                    });

                } else if(this.menuState == 1) {
                    this.gameState = 1;
                } else if(this.menuState == 2) {
                    this.useAnaglyph = !this.useAnaglyph;
                }
            } else if(this.gameState == 1){
                this.gameState = 0;
            } else if(this.gameState == 2) {
                self.flipCamera();
            }
            break;
    }
};

Game.prototype.flipCamera = function() {
    var self = this;

    this.animate.animate({
        delay:      10,
        duration:   1500,
        delta:      self.animate.animateEaseOut(this.animate.ease),
        step:       function(delta) {
                        self.flippedCur = ((self.flipped) ? 30 : 210) + (10 * delta);
                    },
        onready:    function() {
                        self.flipped = !self.flipped;
                    }
    });

};
