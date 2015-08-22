function Collision() { };

Collision.prototype.AABB = function(objectA, objectB, preventCollision) {
  var vecX = (objectA.x + (objectA.width / 2)) -
    (objectB.x + (objectB.width / 2));

  var vecY = (objectA.y + (objectA.height / 2)) -
    (objectB.y + (objectB.height / 2));

  var vecW = (objectA.width / 2) + (objectB.width / 2);
  var vecH = (objectA.height / 2) + (objectB.height / 2);

  var vecD = 0; // No collision

  if(Math.abs(vecX) < vecW && Math.abs(vecY) < vecH) {
    var colX = vecW - Math.abs(vecX);
    var colY = vecH - Math.abs(vecY);
    if(colX >= colY) {
      if(vecY > 0) {
        vecD = 1; // Top collision
        if(preventCollision) {
          objectA.y += colY;
        }
      } else {
        vecD = 2; // Bottom collision
        if(preventCollision) {
          objectA.y -= colY;
        }
      }
    } else {
      if(vecX > 0) {
        vecD = 3; // Left collision
        if(preventCollision) {
          objectA.x += colX;
        }
      } else {
        vecD = 4; // Right collision
        if(preventCollision) {
          objectA.x -= colX;
        }
      }
    }
  }

  return vecD;
};
