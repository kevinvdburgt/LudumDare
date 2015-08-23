function Gui() {

};

Gui.prototype.update = function(game, dt) {

};

Gui.prototype.render = function(game, ctx) {

  // Draw weapon slots
  ctx.fillStyle = 'rgba(255, 255, 255, .4)';

  ctx.fillRect((40 * game.weapon.currentSlot) + 8, 8, 34, 34);

  ctx.fillRect(10, 10, 30, 30);
  ctx.fillRect(50, 10, 30, 30);
  ctx.fillRect(90, 10, 30, 30);
  ctx.fillRect(130, 10, 30, 30);
  ctx.fillRect(170, 10, 30, 30);

  if(game.weapon.weaponData[0][1]) {
    ctx.drawImage(game.assets.get('weapons'), 0, 640, 16, 16, 4, 10, 32, 32);
  }
  if(game.weapon.weaponData[1][1]) {
    ctx.drawImage(game.assets.get('weapons'), 16, 640, 16, 16, 50, 10, 32, 32);
  }
  if(game.weapon.weaponData[2][1]) {
    ctx.drawImage(game.assets.get('weapons'), 32, 640, 16, 16, 85, 10, 30, 30);
  }
  if(game.weapon.weaponData[3][1]) {
    ctx.drawImage(game.assets.get('weapons'), 64, 640, 16, 16, 130, 10, 30, 30);
  }
  if(game.weapon.weaponData[4][1]) {
    ctx.drawImage(game.assets.get('weapons'), 144, 640, 16, 16, 170, 10, 30, 30);
  }

  ctx.font = '46px Wendy';
  ctx.textAlign = 'left';
  ctx.fillStyle = '#FFF';
  ctx.textBaseline = 'top';
  if(game.weapon.weaponData[game.weapon.currentSlot][1]) {
    ctx.fillText(game.weapon.weaponData[game.weapon.currentSlot][0] + ' - ' +
      game.weapon.weaponData[game.weapon.currentSlot][2].levels[game.weapon.weaponData[game.weapon.currentSlot][2].level].name,
      210, 2);
  } else {
    ctx.fillText('Empty slot', 210, 2);
  }

  // Draw health / ammo
  ctx.fillStyle = 'rgba(255, 255, 255, .4)';
  ctx.fillRect(690, 10, 100, 15);
  ctx.fillRect(690, 30, 100, 15);
  ctx.fillRect(690, 50, 100, 15);

  ctx.fillStyle = 'rgba(255, 0, 0, .4)';
  ctx.fillRect(690, 10, Math.ceil(game.player.health * 100), 15);

  if(game.weapon.weaponData[game.weapon.currentSlot][1]) {
    ctx.fillStyle = 'rgba(0, 200, 0, .4)';
    ctx.fillRect(690, 30, Math.ceil(
      game.weapon.weaponData[game.weapon.currentSlot][2].ammo /
      game.weapon.weaponData[game.weapon.currentSlot][2].levels[game.weapon.weaponData[game.weapon.currentSlot][2].level].maxAmmo * 100), 15);
  }

  if(game.weapon.weaponData[game.weapon.currentSlot][1]) {
    ctx.fillStyle = 'rgba(0, 0, 200, .4)';
    ctx.fillRect(690, 50, Math.ceil(
      game.weapon.weaponData[game.weapon.currentSlot][2].xp  * 100), 15);
  }

  ctx.font = '16px Wendy';
  ctx.textAlign = 'right';
  ctx.fillStyle = '#FFF';
  ctx.textBaseline = 'top';
  ctx.fillText('Health', 680, 10);
  ctx.fillText('Ammo', 680, 30);

  if(game.weapon.weaponData[game.weapon.currentSlot][1]) {
    ctx.fillText('Weapon level ' +
      (game.weapon.weaponData[game.weapon.currentSlot][2].level + 1) + ' / ' +
      game.weapon.weaponData[game.weapon.currentSlot][2].levels.length, 680, 50);
  } else {
    ctx.fillText('Weapon level - / -', 680, 50);
  }

  ctx.fillText('Score', 680, 70);
  ctx.textAlign = 'left';
  ctx.fillText(game.player.score, 690, 70);
};
