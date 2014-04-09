function entBlock() {
	this.posx = Math.random() * 790;
	this.posy = 0;
	this.fallSpeed = Math.random() * 5;
	if(this.fallSpeed < 0.5) {
		this.fallSpeed = 0.5;
	}
	this.silenceKill = false;
	this.kill = false;
}

entBlock.prototype.onPaddle = function(playerdata) {
	return ((this.posx) >= playerdata.paddlePos && (this.posx) <= (playerdata.paddlePos + playerdata.paddleSize) && (this.posy) >= 460 && (this.posy) <= 475 && this.silenceKill === false);
}

entBlock.prototype.onFail = function(playerdata) {
	return ((this.posy) > 475 && this.silenceKill === false);
}

entBlock.prototype.update = function(playerdata) {
	this.posy += this.fallSpeed;

	if(this.onFail(playerdata)) {
		this.silenceKill = true;
		// START EXPLOSION FOR FAILURE :D
		this.kill = true;
		playerdata.lives--;
		console.log(playerdata.lives)
	}

	if(this.onPaddle(playerdata)) {
		this.kill = true;
		playerdata.score++;
	}
}

entBlock.prototype.draw = function(ctx, h, w) {
	ctx.fillStyle = '#000';
	ctx.fillRect(this.posx, this.posy, 10, 10);
}