function AI(game) {

  // Handle pickup spawing
  (function loop() {
    setTimeout(loop, 5000);
    if(game.gameState !== 2) {
      return;
    }

    // Spawning health
    if((game.player.health > .7 && Math.random() > .95) || (Math.random() > .85)) {
      if(game.player.health < 1) {
        game.pickups.spawn(Math.random() * game.world.width, Math.random() * game.world.height,
          5000, { type: 'health', hp: Math.ceil(Math.random() * 100) / 100 }, 0);
      }
    }

    // Spawning weapons
    if(Math.random() > .9) { // Handgun
      game.pickups.spawn(Math.random() * game.world.width, Math.random() * game.world.height,
        5000, { type: 'gun', ammo: Math.ceil(Math.random() * 32), weapon: 0 }, 1, 16);
    }
    if(Math.random() > .95) { // Rifle
      game.pickups.spawn(Math.random() * game.world.width, Math.random() * game.world.height,
        5000, { type: 'gun', ammo: Math.ceil(Math.random() * 32), weapon: 1 }, 2, 32);
    }
    if(Math.random() > .9) { // Bow
      game.pickups.spawn(Math.random() * game.world.width, Math.random() * game.world.height,
        5000, { type: 'gun', ammo: Math.ceil(Math.random() * 32), weapon: 2 }, 4, 16);
    }
    if(Math.random() > .95) { // RPG
      game.pickups.spawn(Math.random() * game.world.width, Math.random() * game.world.height,
        5000, { type: 'gun', ammo: Math.ceil(Math.random() * 32), weapon: 3 }, 5, 32);
    }
    if(Math.random() > .95) { // Laser gun
      game.pickups.spawn(Math.random() * game.world.width, Math.random() * game.world.height,
        5000, { type: 'gun', ammo: Math.ceil(Math.random() * 32), weapon: 4 }, 7, 16);
    }


  })();
};
