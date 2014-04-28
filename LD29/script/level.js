function Level() {
    // The level loader
    this.levelData = null;
    this.scene = null;
    this.world = null;

    this.ready = false;
    this.scrollA = 0;
    this.scrollB = 0;
};

Level.prototype.initialize = function(scene, world) {
    this.scene = scene;
    this.world = world;
};

Level.prototype.update = function(delta) {
    if(this.ready == false) {
        if(this.scroll < 0) {
            this.scroll+= 20;
            if(this.scroll > 0) {
                this.scroll = 0;
                this.ready = true;
            }
            if(this.world.obj.grid != null) {
                this.world.obj.grid.obj.position.y = this.scroll;
            }
            if(this.world.obj.cube[0] != null) {
                this.world.obj.cube[0].obj.position.y = this.scroll + this.world.obj.cube[0].cubeYPos;
            }
            if(this.world.obj.cube[1] != null) {
                this.world.obj.cube[1].obj.position.y = this.scroll + ~this.world.obj.cube[1].cubeYPos;
            }
        }
    }
};

Level.prototype.load = function(levelName) {
    var self = this;

    var xhr = new XMLHttpRequest(),
        tmr = setTimeout(function() {
            xhr.abort();
            alert('XHR Timed out...');
        }, 6000);

    xhr.onreadystatechange = function() {
        if(xhr.readyState === 4) {
            clearTimeout(tmr);
            if(xhr.status === 200) {
                try {
                    self.levelData = JSON.parse(xhr.responseText);
                        
                } catch(e) {
                    alert('Level parsing error ' + e);
                }
                self.build((levelName == 'level_00') ? true : false);  
            } else if(xhr.status > 0) {
                alert('XHR Error code ' + xhr.status);
            }
        }
    };

    xhr.open('GET', 'level/' + levelName + '.json', true);
    xhr.send();
};

Level.prototype.build = function(init) {
    this.world.setGridLimit(this.levelData.grid[1]);
    this.world.setWalls(this.levelData.walls);

    // Create the grid
    this.world.obj.grid = new objGrid(this.levelData.grid, this.levelData.walls);
    this.world.obj.grid.show(this.scene);

    // Load both cubes
    for(var i = 0; i < 2; i++) {
        if(this.levelData.cube[i].hide == false) {
            this.world.obj.cube[i] = new objCube(
                this.world,
                this.levelData.grid,
                i,
                this.levelData.cube[i].start,
                this.levelData.cube[i].size,
                this.levelData.cube[i].color,
                this.levelData.cube[i].facing);
            this.world.obj.cube[i].show(this.scene);
        }
    }

    if(!init) {
        this.scroll = -2000;
    }
};

Level.prototype.cleanup = function(callback) {
    var self = this;

    self.timer_1 = setInterval(function() {
        self.world.obj.grid.obj.position.y += 10;
        if(self.world.obj.cube[0] != null) {
            self.world.obj.cube[0].obj.rotation.y =  (Date.now() * 0.005);
        }

        if(self.world.obj.cube[1] != null) {
            self.world.obj.cube[1].obj.rotation.y = -(Date.now() * 0.005);
        }
    }, 1000 / 60);

    setTimeout(function() {
        self.timer_2 = setInterval(function() {
            if(self.world.obj.cube[0] != null) {
                self.world.obj.cube[0].obj.position.y += 10;
            }

            if(self.world.obj.cube[1] != null) {
                self.world.obj.cube[1].obj.position.y += 10;
            }
        }, 1000 / 60);
    }, 500);

    setTimeout(function() {
        self.world.obj.grid.hide(self.scene);
        self.world.obj.grid = null;

        if(self.world.obj.cube[0] != null) {
            self.world.obj.cube[0].hide(self.scene);
            self.world.obj.cube[0] = null;
        }

        if(self.world.obj.cube[1] != null) {
            self.world.obj.cube[1].hide(self.scene);
            self.world.obj.cube[1] = null;
        }

        clearInterval(self.timer_1);
        clearInterval(self.timer_2);

        this.levelData = null;
        callback();
    }, 1600);
};
