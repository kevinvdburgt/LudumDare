function AssetManager() {
	this.numSuccess = 0;
	this.numError = 0;
	this.cache = {};
	this.downloadQueue = [];
}

AssetManager.prototype.add = function(file, name, type) {
	this.downloadQueue.push({
		file:	file,
		name:	name,
		type:	type
	});
}

AssetManager.prototype.get = function(name) {
	return this.cache[name];
}

AssetManager.prototype.download = function(callback) {
	var self = this;
	for(var i=0; i<this.downloadQueue.length; i++) {
		switch(this.downloadQueue[i].type) {
			case 'image':
				var image = new Image();
				image.addEventListener('load', function() {
					self.numSuccess++;
					if(self.isCompleted()) {
						callback();
					}
				});
				image.src = this.downloadQueue[i].file;
				this.cache[this.downloadQueue[i].name] = image;
				break;

			case 'audio':
				var audio = new Audio(this.downloadQueue[i].file);
				audio.addEventListener('canplaythrough', function() {
					self.numSuccess++;
					if(self.isCompleted()) {
						callback();
					}
				});
				this.cache[this.downloadQueue[i].name] = audio;
				break;

			default:
				console.error('ASSETMANAGER: Invalid filetype "' + this.downloadQueue[i].type + '" for ' + this.downloadQueue[i].name + '.');
				break;
		}
	}
}

AssetManager.prototype.isCompleted = function() {
	return (this.downloadQueue.length === (this.numSuccess + this.numError));
}