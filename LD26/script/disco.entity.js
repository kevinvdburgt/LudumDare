function entDisco() {
	this.posx = Math.random() * 790;
	this.posy = 0;
	this.fallSpeed = Math.random() * 5;
	if(this.fallSpeed < 0.5) {
		this.fallSpeed = 0.5;
	}
	this.silenceKill = false;
	this.kill = false;

	this.colors = [	'#FF0000', '#00FF00', '#0000FF',
					'#FFFF00', '#FF00FF', '#00FFFF',
					'#000000', '#F0F000', '#0F0F00',
					'#00F0F0', '#F0F0F0', '#0F0F0F'];

	this.colorid = 0;
}

entDisco.prototype.onPaddle = function(playerdata) {
	return ((this.posx) >= playerdata.paddlePos && (this.posx) <= (playerdata.paddlePos + playerdata.paddleSize) && (this.posy) >= 460 && (this.posy) <= 475 && this.silenceKill === false);
}

entDisco.prototype.onFail = function(playerdata) {
	return ((this.posy) > 475 && this.silenceKill === false);
}

entDisco.prototype.update = function(playerdata) {
	this.posy += this.fallSpeed;

	if(this.onFail(playerdata)) {
		this.silenceKill = true;
		this.kill = true;
	}

	if(this.onPaddle(playerdata)) {
		this.kill = true;
		playerdata.score+=20;
		playerdata.modeDisco = !playerdata.modeDisco;
	}

	this.colorid = Math.round(Math.random() * this.colors.length);
}

entDisco.prototype.draw = function(ctx, h, w) {
	ctx.fillStyle = this.colors[this.colorid];
	ctx.fillRect(this.posx, this.posy, 10, 10);
}