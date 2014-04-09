function entPotato() {
	this.posx = Math.random() * 790;
	this.posy = 0;
	this.fallSpeed = Math.random() * 10;
	this.silenceKill = false;
	this.kill = false;
}

entPotato.prototype.onPaddle = function(playerdata) {
	return ((this.posx) >= playerdata.paddlePos && (this.posx) <= (playerdata.paddlePos + playerdata.paddleSize) && (this.posy) >= 460 && (this.posy) <= 475 && this.silenceKill === false);
}

entPotato.prototype.onFail = function(playerdata) {
	return ((this.posy) > 500 && this.silenceKill === false);
}

entPotato.prototype.update = function(playerdata) {
	this.posy += this.fallSpeed;

	if(this.onFail(playerdata)) {
		this.kill = true;
	}

	if(this.onPaddle(playerdata)) {
		this.kill = true;
		document.getElementById('body').style.backgroundImage = "url(asset/potatoes.jpg)";
	}
}

entPotato.prototype.draw = function(ctx, h, w) {
	//ctx.fillStyle = '#F00';
	//ctx.fillRect(this.posx, this.posy, 10, 10);

	ctx.drawImage(ASSETMANAGER.get('patato'), this.posx, this.posy);
}