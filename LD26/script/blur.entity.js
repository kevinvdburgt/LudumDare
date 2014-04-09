function entBlur() {
	this.posx = Math.random() * 790;
	this.posy = 0;
	this.fallSpeed = Math.random() * 10;
	this.silenceKill = false;
	this.kill = false;
}

entBlur.prototype.onPaddle = function(playerdata) {
	return ((this.posx) >= playerdata.paddlePos && (this.posx) <= (playerdata.paddlePos + playerdata.paddleSize) && (this.posy) >= 460 && (this.posy) <= 475 && this.silenceKill === false);
}

entBlur.prototype.onFail = function(playerdata) {
	return ((this.posy) > 500 && this.silenceKill === false);
}

entBlur.prototype.update = function(playerdata) {
	this.posy += this.fallSpeed;

	if(this.onFail(playerdata)) {
		this.kill = true;
	}

	if(this.onPaddle(playerdata)) {
		this.kill = true;
		playerdata.score+= 20;
		playerdata.modeBlur = !playerdata.modeBlur;
	}
}

entBlur.prototype.draw = function(ctx, h, w) {
	ctx.drawImage(ASSETMANAGER.get('blur'), this.posx, this.posy);
}