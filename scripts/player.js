function Player(selector, site){
    this.$ = $(selector);
    this.elem  = this.$[0];

    this.init();
}

Player.prototype.init = function(){
    this.width  = this.$.width();
    this.height = this.$.height(),
    this.left   = this.$.offset().left;
    this.top    = this.$.offset().top;
    this.right  = this.left + this.width;
    this.bottom = this.top  + this.height;
};

Player.prototype.getTime = function() {
    return this.elem.getNsData().time;
};

Player.prototype.getReadableTime = function(){
    var time = Math.round(this.getTime()),
        minutes = Math.floor(time / 60),
        seconds = time - minutes * 60;
    minutes =  (minutes < 10 ? "0" : "") + minutes;
    seconds  = (seconds < 10 ? "0" : "") + seconds;
    return minutes + ":" + seconds;
};