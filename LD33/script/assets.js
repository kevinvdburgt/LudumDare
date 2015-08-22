function Assets() {
  this.numSuccess = 0;
  this.numFailed = 0;
  this.assets = {};
  this.queue = [];
};

Assets.prototype.add = function(file, name, type) {
  this.queue.push({
    file: file,
    name: name,
    type: type
  });
};

Assets.prototype.get = function(name) {
  return this.assets[name] || null;
};

Assets.prototype.checkCompletion = function(callbackProgress, callbackDone) {
  console.log(this);
  callbackProgress(this.numSuccess, this.numFailed, this.queue.length);
  if(this.queue.length === (this.numSuccess + this.numFailed)) {
    callbackDone(this.numSuccess, this.numFailed, this.queue.length);
  }
};

Assets.prototype.download = function(callbackProgress, callbackDone) {
  var self = this;

  for(var i = 0; i < this.queue.length; i++) {
    if(this.queue[i].type === 'image') {
      var asset = new Image();
      asset.addEventListener('load', function() {
        self.numSuccess++;
        self.checkCompletion(callbackProgress, callbackDone);
      });
      asset.src = this.queue[i].file;
      this.assets[this.queue[i].name] = asset;
    }
  }
};
