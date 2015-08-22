function Gui() {

};

Gui.prototype.update = function(game, dt) {

};

Gui.prototype.render = function(game, ctx) {

  // Draw weapon slots
  ctx.fillStyle = 'rgba(255, 255, 255, .4)';

  ctx.fillRect((40 * game.player.weaponSlot) + 8, 8, 34, 34);

  ctx.fillRect(10, 10, 30, 30);
  ctx.drawImage(game.assets.get('weapons'), 0, 640, 16, 16, 10, 10, 32, 32);

  ctx.fillRect(50, 10, 30, 30);
  ctx.fillRect(90, 10, 30, 30);
  ctx.fillRect(130, 10, 30, 30);
  ctx.fillRect(170, 10, 30, 30);

  ctx.font = '46px Wendy';
  ctx.textAlign = 'left';
  ctx.fillStyle = '#FFF';
  ctx.textBaseline = 'top';
  ctx.fillText(game.weapon.weaponList[game.player.weaponSlot], 210, 2);

  // Draw health / ammo
  ctx.fillStyle = 'rgba(255, 255, 255, .4)';
  ctx.fillRect(690, 10, 100, 15);
  ctx.fillRect(690, 30, 100, 15);
  ctx.fillRect(690, 50, 100, 15);

  ctx.fillStyle = 'rgba(255, 0, 0, .4)';
  ctx.fillRect(690, 10, Math.ceil(game.player.health * 100), 15);

  ctx.fillStyle = 'rgba(0, 200, 0, .4)';
  ctx.fillRect(690, 30, 80, 15);

  ctx.fillStyle = 'rgba(0, 0, 200, .4)';
  ctx.fillRect(690, 50, 25, 15);

  ctx.font = '16px Wendy';
  ctx.textAlign = 'right';
  ctx.fillStyle = '#FFF';
  ctx.textBaseline = 'top';
  ctx.fillText('Health', 680, 10);
  ctx.fillText('Ammo', 680, 30);
  ctx.fillText('Weapon level 2 / 5', 680, 50);
};
