function entShake() {
	this.posx = Math.random() * 790;
	this.posy = 0;
	this.fallSpeed = Math.random() * 5;
	if(this.fallSpeed < 0.5) {
		this.fallSpeed = 0.5;
	}
	this.silenceKill = false;
	this.kill = false;
	this.offsetx = 0;
	this.offsety = 0;
}

entShake.prototype.onPaddle = function(playerdata) {
	return ((this.posx) >= playerdata.paddlePos && (this.posx) <= (playerdata.paddlePos + playerdata.paddleSize) && (this.posy) >= 460 && (this.posy) <= 475 && this.silenceKill === false);
}

entShake.prototype.onFail = function(playerdata) {
	return ((this.posy) > 475 && this.silenceKill === false);
}

entShake.prototype.update = function(playerdata) {
	this.posy += this.fallSpeed;

	if(this.onFail(playerdata)) {
		this.kill = true;
	}

	if(this.onPaddle(playerdata)) {
		this.kill = true;
		playerdata.score+=20;
		playerdata.modeShake = !playerdata.modeShake;
	}

	this.offsetx = Math.round((Math.random() * 10) - 5);
	this.offsety = Math.round((Math.random() * 10) - 5);
}

entShake.prototype.draw = function(ctx, h, w) {
	ctx.fillStyle = '#FF0000';
	ctx.fillRect(this.posx + this.offsetx, this.posy + this.offsety, 10, 10);
}