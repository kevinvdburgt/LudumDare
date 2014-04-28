function objCube(world, gridInfo, sideInfo, startPosition, cubeSize, cubeColor, cubeFacing) {
    //this.animate = new Animate();
    this.animate = new cmh();

    this.world = world;
    this.gridInfo = gridInfo;
    this.sideInfo = sideInfo; // 0 = top, 1 = bottom
    this.startPosition = startPosition;
    this.cubeSize = cubeSize;
    this.cubeColor = cubeColor;
    this.cubeFacing = cubeFacing;
    this.cubeYPos = (this.cubeSize / 2) / 2;

    // CURRENT -> GOTO
    this.moveLock = false;
    this.position = [[0,0], startPosition];
    this.facing = [0, cubeFacing, (cubeFacing * 90) * Math.PI / 180];

    this.gridSpacing = this.gridInfo[0] * 2 / this.gridInfo[1];

    this.obj = null;
    this.create();

    // FIX
    this.position[CURR][0] = this.position[NEXT][0];
    this.position[CURR][1] = this.position[NEXT][1];

    this.doMovements();
};

objCube.prototype.update = function(delta) {
    
};

objCube.prototype.anim_move = function(axis, start, distance) {
    var self = this;

    this.animate.animate({
        delay:      10,
        duration:   500,
        delta:      self.animate.animateEaseOut(this.animate.bounce),
        step:       function(delta) {
                        if(axis == 0) {
                            self.obj.position.x = start + (distance * delta);
                        } else {
                            self.obj.position.z = start + (distance * delta);
                        }
                    },
        onready:    function() {
                        if(axis == 0) { 
                            self.position[CURR][0] = self.position[NEXT][0];
                            self.obj.position.x = self.position[CURR][0] * self.gridSpacing;
                        } else {
                            self.position[CURR][1] = self.position[NEXT][1];
                            self.obj.position.z = self.position[CURR][1] * self.gridSpacing;
                        }
                    }
    });

    // Lock fix ?
    setTimeout(function() { self.moveLock = false }, 550);
};

objCube.prototype.anim_rotate = function(start, direction) {
    var self = this;

    this.animate.animate({
        delay:      10,
        duration:   500,
        delta:      self.animate.animateEaseOut(this.animate.bounce),
        step:       function(delta) {
                        self.obj.rotation.y = start + (direction * delta);
                    },
        onready:    function() {
                        self.facing[CURR] = self.facing[NEXT];
                    }
    });

    // Lock fix
    setTimeout(function() { self.moveLock = false }, 550);
};
//return n < 0 ? -(-n % 4) : n % 4;
//return n < 0 ? 3 - (-n % 4) : n % 4;
//(n % 4 + 4)  % 4 ?
objCube.prototype.doMovements = function() {
    var self = this;

    // Moving
    if(this.position[CURR][0] != this.position[NEXT][0]) {
        this.moveLock = true;
        //self.position[CURR][0] = self.position[NEXT][0];
        //self.obj.position.x = (self.position[CURR][0] * this.gridSpacing);

        var start = (this.position[CURR][0] * this.gridSpacing),
            distance = (this.position[CURR][0] > this.position[NEXT][0]) ? -(this.gridSpacing) : (this.gridSpacing);
        this.anim_move(0, start, distance);
    }

    // Moving
    if(this.position[CURR][1] != this.position[NEXT][1]) {
        this.moveLock = true;
        //this.position[CURR][1] = this.position[NEXT][1];
        //this.obj.position.z = (this.gridSpacing * this.position[CURR][1]);

        var start = (this.position[CURR][1] * this.gridSpacing),
            distance = (this.position[CURR][1] > this.position[NEXT][1]) ? -(this.gridSpacing) : (this.gridSpacing);
        this.anim_move(1, start, distance);
    }

    // Rotating
    if(this.facing[CURR] != this.facing[NEXT]) {
        this.moveLock = true;
        var direction = (this.facing[CURR] > this.facing[NEXT]) ? (90 * Math.PI / 180) : -(90 * Math.PI / 180);
        this.anim_rotate(this.facing[2], direction);
    }
};

objCube.prototype.fixFacing = function(n) {
    //return Math.abs(input) % 4;
    return (n % 4 + 4)  % 4;
};

objCube.prototype.move = function(moveAction) {
    var self = this;

    var f = this.fixFacing(this.facing[CURR]);
    //console.log(f, this.moveLock);

    if(this.moveLock == true) return;

    switch(moveAction) {
        case 1: // Forward
                if(f == 0 && this.world.validMove(this.position[CURR], [this.position[CURR][0]+1, this.position[CURR][1]], this.sideInfo)) { 
                    this.position[NEXT][0]++; }

            else if(f == 1 && this.world.validMove(this.position[CURR], [this.position[CURR][0], this.position[CURR][1]+1], this.sideInfo)) { 
                    this.position[NEXT][1]++; }

            else if(f == 2 && this.world.validMove(this.position[CURR], [this.position[CURR][0]-1, this.position[CURR][1]], this.sideInfo)) { 
                    this.position[NEXT][0]--; }

            else if(f == 3 && this.world.validMove(this.position[CURR], [this.position[CURR][0], this.position[CURR][1]-1], this.sideInfo)) { 
                    this.position[NEXT][1]--; }

            break;

        case 2: // Backwards
                 if(f == 0 && this.world.validMove(this.position[CURR], [this.position[CURR][0]-1, this.position[CURR][1]], this.sideInfo)) { 
                    this.position[NEXT][0]--; }

            else if(f == 1 && this.world.validMove(this.position[CURR], [this.position[CURR][0], this.position[CURR][1]-1], this.sideInfo)) { 
                    this.position[NEXT][1]--; }

            else if(f == 2 && this.world.validMove(this.position[CURR], [this.position[CURR][0]+1, this.position[CURR][1]], this.sideInfo)) { 
                    this.position[NEXT][0]++; }

            else if(f == 3 && this.world.validMove(this.position[CURR], [this.position[CURR][0], this.position[CURR][1]+1], this.sideInfo)) { 
                    this.position[NEXT][1]++; }

            break;

        case 3: // Turn right
            this.facing[NEXT]++;
            break;

        case 4: // Turn left
            this.facing[NEXT]--;
            break;
    }

    this.doMovements();
};

objCube.prototype.create = function() {
    var geometry = new THREE.BoxGeometry(
        this.cubeSize,
        this.cubeSize / 2,
        this.cubeSize);

    var material = new THREE.MeshLambertMaterial({
        color: parseInt(this.cubeColor)
    });

    this.obj = new THREE.Mesh(geometry, material);

    this.obj.position.x = (this.gridSpacing * this.startPosition[0]);
    this.obj.position.z = (this.gridSpacing * this.startPosition[1]);

    if(this.sideInfo == 0) {
        this.obj.position.y = (this.cubeSize / 2) / 2;
    } else {
        this.obj.position.y =~(this.cubeSize / 2) / 2;
    }
};

objCube.prototype.show = function(scene) {
    if(this.obj == null) {
        return false;
    } else {
        scene.add(this.obj);
        return true;
    }
};

objCube.prototype.hide = function(scene) {
    scene.remove(this.obj);
};
