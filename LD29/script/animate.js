function cmh() {}

cmh.prototype.bounce = function(progress) {
    for(var a = 0, b = 1, result; 1; a += b, b /= 2) {
        if(progress >= (7 - 4 * a) / 11) {
            return -Math.pow((11 - 6 * a - 11 * progress) / 4, 2) + Math.pow(b, 2);
        }
    }
};

cmh.prototype.ease = function(progress) {
    return progress;
};

cmh.prototype.shake = function(progress) {
    return ~Math.pow((11 - 6 * progress), 11);
};

cmh.prototype.animateEaseOut = function(delta) {
    return function(progress) {
        return 1 - delta(1 - progress);
    };
};

cmh.prototype.animate = function(param) {
    var self = this,
        start = new Date(),
        id = setInterval(function() {
            var timePassed = new Date() - start;
            var progress = timePassed / (param.duration || 10);
            if(progress > 1) {
                progress = 1;
            }

            var delta = param.delta(progress);
            param.step(delta);

            if(progress == 1) {
                clearInterval(id);
                param.onready();
            }
        }, param.delay || 10);
};
