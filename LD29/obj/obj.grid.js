function objGrid(gridInfo, tileInfo) {
    this.gridInfo = gridInfo;
    this.tileInfo = tileInfo;

    this.gridSpacing = this.gridInfo[0] * 2 / this.gridInfo[1];

    this.obj = null;
    this.create();
};

objGrid.prototype.update = function(delta) {
    // void
};

objGrid.prototype.create = function() {
    this.obj = new THREE.Object3D();

    var geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(-this.gridInfo[0], 0, 0));
    geometry.vertices.push(new THREE.Vector3( this.gridInfo[0], 0, 0));

    var material = new THREE.LineBasicMaterial({
        color: 0xffffff
    });

    for(var i = 0; i <= this.gridInfo[1]; i++) {
        var line = new THREE.Line(geometry, material);
        line.position.z = (i * this.gridSpacing) - this.gridInfo[0];
        this.obj.add(line);

        var line = new THREE.Line(geometry, material);
        line.position.x = (i * this.gridSpacing) - this.gridInfo[0];
        line.rotation.y = 90 * Math.PI / 180;
        this.obj.add(line);
    }

    // Worls walls
    var geometry = new THREE.PlaneGeometry(this.gridSpacing, 30);
    var material = new THREE.MeshLambertMaterial({
        color: 0xff0000
    });

    // Endpoint
    var geometry_e = new THREE.PlaneGeometry(this.gridSpacing, this.gridSpacing);
    var material_e = new THREE.MeshLambertMaterial({
        color: 0x00ff00
    });

    for(var w = 0; w < 2; w++) { // World 
        for(var z = 0; z < this.tileInfo[w].length; z++) { // Z axis
            for(var x = 0; x < this.tileInfo[w][z].length; x++) { // X axis
                for(var s = 0; s < 5; s++) { // Wall side
                    if(this.tileInfo[w][z][x][s] == 0) {
                        continue;
                    }

                    if(s < 4) {
                        var plane = new THREE.Mesh(geometry, material);
                        if(w == 0) {
                            plane.position.y = 30;
                        } else {
                            plane.position.y = -30;
                        }
                    } else {
                        var plane = new THREE.Mesh(geometry_e, material_e);
                    }

                    if(s == 0) { // front
                        plane.position.x = (x * this.gridSpacing) - this.gridInfo[0] + (this.gridSpacing / 2);
                        plane.position.z = (z * this.gridSpacing) - this.gridInfo[0];
                    } else if (s == 1) { // left
                        plane.position.x = (x * this.gridSpacing) - this.gridInfo[0] + (this.gridSpacing);
                        plane.position.z = (z * this.gridSpacing) - this.gridInfo[0] + (this.gridSpacing / 2);
                        plane.rotation.y = 90 * Math.PI / 180;
                    } else if (s == 2) { // back
                        plane.position.x = (x * this.gridSpacing) - this.gridInfo[0] + (this.gridSpacing / 2);
                        plane.position.z = (z * this.gridSpacing) - this.gridInfo[0] + (this.gridSpacing);
                    } else if (s == 3) { // right
                        plane.position.x = (x * this.gridSpacing) - this.gridInfo[0];
                        plane.position.z = (z * this.gridSpacing) - this.gridInfo[0] + (this.gridSpacing / 2);
                        plane.rotation.y = 90 * Math.PI / 180;
                    } else if (s == 4) { // Finish Pane
                        plane.rotation.x = 90 * Math.PI / 180;
                        plane.position.y = 0;
                    }

                    plane.material.side = THREE.DoubleSide;
                    this.obj.add(plane);
                }
            }
        }
    }
};

objGrid.prototype.show = function(scene) {
    if(this.obj == null) {
        return false;
    } else {
        scene.add(this.obj);
        return true;
    }
};

objGrid.prototype.hide = function(scene) {
    scene.remove(this.obj);
};
