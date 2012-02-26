function Comment (options) {
    if(!options.text){
        return;
    }
    var text  = options.text,
        color = options.color || "white",
        size  = "20px";

    this.isSpecial = options.isSpecial || false;

    this.text = text;
    this.render(text, color, size);
}

Comment.prototype.render = function(text, color, size) {
    var span = document.createElement("span");
    this.elem = $(span).text(text).css({
        color    : color,
        fontSize : size,
        position : "absolute"
    }).addClass("tm_comments").appendTo(document.body);

    if(!Settings.tmShowTM){
        this.elem.addClass("tm_hide_comments");
    }
}

Comment.prototype.fly = function(channel) {
    channel.isAvailable = false;

    var SAFE_PADDING = 40,
        SAFE_DISTANCE = SAFE_PADDING + this.elem.width(),
        SAFE_POS = window.player.right - SAFE_DISTANCE;

    var start_pos = {top:channel.top, left:channel.right};

    var fired = false;

    this.elem.css(start_pos).animate({left: channel.left}, {
        duration : 6000,
        easing   : "linear",
        step     : function(now, fx){
            if(!fired && now < SAFE_POS){
                fired = channel.isAvailable = true;    
            }
        },
        complete : function(){
            $(this).remove();
        }
    });
}