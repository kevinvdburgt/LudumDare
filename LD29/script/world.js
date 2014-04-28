function World() {
    this.gridLimit = [0, 0];
    this.fixGridCoords = 0;
    this.walls = [];
    this.cubeState = [false, false];

    this.onWin = null;

    this.obj = {
        grid: null,
        cube: [null, null]
    };

};

World.prototype.setGridLimit = function(gridSize) {
    var a = gridSize / 2,
        b = ~Math.floor(a) + 1,
        c = Math.floor(a);

    this.gridLimit = [b, c];
    this.fixGridCoords = c;
};

World.prototype.setWalls = function(wallInfo) {
    this.walls = wallInfo;
};

World.prototype.fixCoords = function(location) {
    return [location[0] + this.fixGridCoords, location[1] + this.fixGridCoords];
};

World.prototype.callWin = function(callback) {
    this.onWin = callback;
};

World.prototype.validMove = function(from, to, cubeid) {
    var ffrom = this.fixCoords(from),
        fto = this.fixCoords(to);

    if(from[0] > to[0]) {
        if(to[0] < this.gridLimit[0]) return false;

        var walla = this.walls[cubeid][ffrom[1]][ffrom[0]],
            wallb = this.walls[cubeid][fto[1]][fto[0]],
            debug_direction = 1;

        if(walla[3] == 1 || wallb[1] == 1) return false;

    } else if(from[0] < to[0]) {
        if(to[0] > this.gridLimit[1]) return false;

        var walla = this.walls[cubeid][ffrom[1]][ffrom[0]],
            wallb = this.walls[cubeid][fto[1]][fto[0]],
            debug_direction = 2;

        if(walla[1] == 1 || wallb[3] == 1) return false;

    } else if(from[1] > to[1]) {
        if(to[1] < this.gridLimit[0]) return false;

        var walla = this.walls[cubeid][ffrom[1]][ffrom[0]],
            wallb = this.walls[cubeid][fto[1]][fto[0]],
            debug_direction = 3;

        if(walla[0] == 1 || wallb[2] == 1) return false;

    } else if(from[1] < to[1]) {
        if(to[1] > this.gridLimit[1]) return false;

        var walla = this.walls[cubeid][ffrom[1]][ffrom[0]],
            wallb = this.walls[cubeid][fto[1]][fto[0]],
            debug_direction = 4;

        if(walla[2] == 1 || wallb[0] == 1) return false;

    } else {
        console.log('WTF, impossible to get this message !');
    }

    if(this.walls[0][fto[1]][fto[0]][4] == 1) {
        this.cubeState[cubeid] = true;
    } else {
        this.cubeState[cubeid] = false;
    }

    if(this.cubeState[0] == true && this.cubeState[1] == true && this.onWin != null) {
        this.onWin();
    }

    return true;
};

World.prototype.update = function(delta) {
    if(this.obj.cube[0] != null) this.obj.cube[0].update(delta);
    if(this.obj.cube[1] != null) this.obj.cube[1].update(delta);
};
