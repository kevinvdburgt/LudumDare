function MiniBlocks(viewport) {
	var self = this;

	this.ctx = document.getElementById(viewport).getContext('2d');

	this.mouse = 0;
	this.runmode = 0;

	this.player = {
		paddlePos:		0,
		paddleSize:		100,
		score:			0,
		lives:			10,

		potato:			false,

		modeBlur:		false,
		modeDisco:		false,
		modeShake:		false
	};

	this.blocks = [];

	this.colors = [	'#FF0000', '#00FF00', '#0000FF',
					'#FFFF00', '#FF00FF', '#00FFFF',
					'#000000', '#F0F000', '#0F0F00',
					'#00F0F0', '#F0F0F0', '#0F0F0F'];
	this.colorid = 0;

	window.addEventListener('mousemove', function(e) { self.mousemove(e); }, false);
	window.addEventListener('click', function(e) { self.mouseclick(e); }, false);
}

MiniBlocks.prototype.start = function() {
	var self = this;

	setInterval(function() {
		self.colorid = Math.round(Math.random() * self.colors.length);
	}, 200);

	(function gameLoop() {
		self.update();
		self.draw();
		requestAnimFrame(gameLoop);
	})();
}

MiniBlocks.prototype.createBlock = function() {
	if(this.runmode !== 1){
		return;
	}

	var self = this;

	var blockType = Math.round(Math.random() * 20);
	switch(blockType) {
		case 1: // Drop a heart if the player lives is lower than 9, else default block..
		case 2:
			if(this.player.lives <= 8) {
				this.blocks.push(new entHeart());
			} else {
				//this.blocks.push(new entBlock()); // Dont do this, it skind a hard to play xD
			}
			break;

		case 3: // DISCO MODE
		case 4:
			this.blocks.push(new entDisco());
			break;

		case 5: // BLUR MODE
		case 6:
			this.blocks.push(new entBlur());
			break;

		case 7:
			this.blocks.push(new entShake());
			break;


		/*case 7: // PATATO MODE :D :D :D :D :D
			
			break;*/

		default: // The default blocktype
			this.blocks.push(new entBlock());
			break;
	}

	if(this.player.score > 99 && this.player.potato === false) {
		this.blocks.push(new entPotato());
		this.blocks.push(new entPotato());
		this.blocks.push(new entPotato());
		this.player.potato = true;
	}

	var nextBlock = Math.random() * 2000;
	if(nextBlock < 800)
		nextBlock = 800;

	setTimeout(function() {
		self.createBlock();
	}, nextBlock);
}

MiniBlocks.prototype.mousemove = function(e) {
	this.mouse = (e.screenX / window.innerWidth);
}

MiniBlocks.prototype.mouseclick = function(e) {
	if(this.runmode === 0) {
		this.runmode = 2; // Show info (HOWTO)
	} else if(this.runmode === 2) {
		this.runmode = 1; // Start the game
		this.createBlock();
		this.player.paddlePos = 0;
		this.player.paddleSize = 100;
		this.player.score = 0;
		this.player.lives = 10;
		this.player.potato = false;
		document.getElementById('body').style.backgroundImage = "none";
	} else if(this.runmode === 3) {
		this.runmode = 1; // Start the game
		this.createBlock();
		this.player.paddlePos = 0;
		this.player.paddleSize = 100;
		this.player.score = 0;
		this.player.lives = 10;
		this.blocks.length = 0;
		this.player.potato = false;
		document.getElementById('body').style.backgroundImage = "none";
	}
}

MiniBlocks.prototype.playerResetModes = function() {
	this.player.modeBlur = false;
	this.player.modeDisco = false;
	this.player.modeShake = false;
}

MiniBlocks.prototype.update = function() {
	if(this.runmode === 1) { // Playing
		this.player.paddlePos = (this.mouse * (800 - this.player.paddleSize));

		for(var i=0; i<this.blocks.length; i++) {
			this.blocks[i].update(this.player);

			if(this.blocks[i].kill === true) {
				this.blocks.splice(i, 1);
			}
		}

		if(this.player.lives === 0) {
			this.runmode = 3;
			this.playerResetModes();
		}
	}
}

MiniBlocks.prototype.scoreReader = function() {
	if(this.player.score < 10) {
		return '000' + this.player.score;
	} else if(this.player.score < 100) {
		return '00' + this.player.score;
	} else if(this.player.score < 1000) {
		return '0' + this.player.score;
	} else  {
		return this.player.score;
	}
}

MiniBlocks.prototype.draw = function() {
	var ctx = this.ctx,
		w = ctx.canvas.width,
		h = ctx.canvas.height;

	if(this.player.modeShake) {
		ctx.save();
		ctx.translate(Math.round((Math.random() * 10) - 5), Math.round((Math.random() * 10) - 5));
	}

	if(this.player.modeBlur === false) {
		ctx.clearRect(0, 0, w, h);
	}

	if(this.player.modeDisco) {
		ctx.fillStyle = this.colors[this.colorid];
		ctx.fillRect(0, 0, w, h);
	}

	if(this.player.modeBlur) {
		ctx.fillStyle = 'rgba(255, 255, 255, 0.05);';
		ctx.fillRect(0, 0, w, h);
	}

	if(this.runmode === 0) { // Welcome screen
		
		ctx.textAlign = 'center';
		ctx.font = 'bold 44px Combo';
		ctx.fillStyle = '#000';
		ctx.fillText('MiniBlocks', 400, 230);

		ctx.font = 'normal 24px Exo';
		ctx.fillStyle = '#000';
		ctx.fillText('By Kevin van der Burgt', 400, 260);

		ctx.font = 'normal 14px Exo';
		ctx.fillStyle = '#000';
		ctx.fillText('Click on your mouse button to continue.', 400, 480);

	} else if(this.runmode === 1) { // Playing
		// Draw the field
		ctx.fillStyle = '#000000';
		ctx.fillRect(this.player.paddlePos, 470, this.player.paddleSize, 5);

		// Draw the blocks
		for(var i=0; i<this.blocks.length; i++) {
			this.blocks[i].draw(ctx, h, w);
		}

		// Draw the hearts
		for(var i=0, j=this.player.lives; i<5; i++) {
			if(j > 1) {
				ctx.drawImage(ASSETMANAGER.get('heart_full'), 675 + (i * 25), 5);
				j-=2;
			} else if(j === 1) {
				ctx.drawImage(ASSETMANAGER.get('heart_half'), 675 + (i * 25), 5);
				j--;
			} else {
				ctx.drawImage(ASSETMANAGER.get('heart_empty'), 675 + (i * 25), 5);
			}
		}

		// Draw the score
		ctx.textAlign = 'left';
		ctx.font = 'bold 24px Combo';
		ctx.fillStyle = '#333333';
		ctx.fillText('Score: ' + this.scoreReader(), 675, 50);
	} else if(this.runmode === 2) { // How to play
		ctx.textAlign = 'center';
		ctx.font = 'bold 44px Combo';
		ctx.fillStyle = '#000';
		ctx.fillText('MiniBlocks', 400, 60);

		ctx.font = 'normal 24px Exo';
		ctx.fillStyle = '#000';
		ctx.fillText('By Kevin van der Burgt', 400, 90);

		ctx.font = 'normal 14px Exo';
		ctx.fillStyle = '#000';
		ctx.fillText('Catch all black blocks, when you miss one you loose 0.5 lives.', 400, 140);
		ctx.fillText('When you catch a black block you earn 1 point.', 400, 160);

		ctx.fillText('Blue blurred blocks blurs your game but you receive 20 potins', 400, 200);
		ctx.fillText('When you catch a blue block again the effect will undo.', 400, 220);

		ctx.fillText('Flashy disco blocks are awesome! Catch them and you receive 20 points !', 400, 260);
		ctx.fillText('Catch that flashy disco blcok again the effect will undo.', 400, 280);

		ctx.fillText('There is also a ~SHAKING~ block! Catch them and you receive 20 points !', 400, 320);
		ctx.fillText('Catch that block again and the effect will undo.', 400, 340);

		ctx.fillText('There is a patato in this game! Wait for it (hint: 100 points)', 400, 380);
		ctx.fillText('And see what happens !', 400, 400);
		
		ctx.fillText('Click on your mouse button to start the game.', 400, 480);
	} else if(this.runmode === 3) {
		ctx.textAlign = 'center';
		ctx.font = 'bold 44px Combo';
		ctx.fillStyle = '#000';
		ctx.fillText('GAME OVER', 400, 250);

		ctx.textAlign = 'center';
		ctx.font = 'bold 34px Combo';
		ctx.fillStyle = '#000';
		ctx.fillText('Score: ' + this.player.score, 400, 300);

		ctx.font = 'normal 14px Exo';
		ctx.fillStyle = '#000';
		ctx.fillText('Click on your mouse button to restart the game.', 400, 480);
	}

	if(this.player.modeShake) {
		ctx.restore();
	}
}