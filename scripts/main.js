var Channels = {
    init: function(top, bottom, left, right, height, channel_num){
        var channels = [];
        for(var i = 0; i < channel_num; i++){
            channels.push({
                id          : channel_num - i,
                top         : top + height * i, 
                left        : left,
                right       : right,
                isAvailable : true
            });
        }
        this.channels = channels;
        this.speicalChannel = {
            top   : bottom - 80,
            left  : left,
            right : right,
            isAvailable: true
        };
    },
    channels: [],
    getFirstAvailable: function(){
        for (var i = 0, len = this.channels.length; i < len; i++) {
            var channel = this.channels[i];
            if(channel.isAvailable){
                return channel;
            }
        }
        return null;
    }

};

var TM  = {
    comment_datas: [],
    ajaxLoadComments: function () {
        var data = {
            call   : "loadComments",
            shareId: Constants.SHARE_ID 
        };
        var self = this;
        chrome.extension.sendRequest(data, function(response) {
            self.comment_datas = JSON.parse(response.result);
        });
    },

    wait4fly: [],
    handleWaiters: function(channel){
        if(TM.wait4fly.length > 0){
            var time = player.getTime();
            var new_wait4fly = [];
            for (var i = 0, len = TM.wait4fly.length; i < len; i++) {
                var waiter = TM.wait4fly[i];
                if(waiter.isSpecial){
                    if(Channels.speicalChannel.isAvailable){
                        waiter.fly(Channels.speicalChannel);
                    } else {
                        new_wait4fly.push(waiter);
                    }
                } else {
                    // never get the chance to fly.... diaosi
                    if(time - waiter.time >= 2){
                    } else if(channel = Channels.getFirstAvailable()){
                        waiter.fly(channel);
                    } else {
                        new_wait4fly.push(waiter);
                    }
                }
            }
            TM.wait4fly = new_wait4fly;
        }
        setTimeout(TM.handleWaiters, 100);
    },

    tryFly: function(comment){ 
        var channel = Channels.getFirstAvailable();
        if(channel){
            comment.fly(channel);
        } else {
            TM.wait4fly.push(comment);
        }
    },

    onPause: function(){
        this.paused = true;
        $(".tm_comments").pause();
    },

    onResume: function(){
        this.paused = false;   
        $(".tm_comments").resume();
    },

    onMove: function(time){
        self.last_time = time = player.getTime();
        for(var i = 0, len = this.comment_datas.length; i < len; i++){
            if(this.comment_datas[i].time > time){
                this.next_index = i;    
                break;
            }
        }
        $(".tm_comments").remove();
    },

    start: function (){
        var self = this;
        self.last_time  = 0;
        self.next_index = 0;
            
        var timeout = setInterval(function(){

            var current_time = player.getTime();

            if(self.paused){
                if (current_time - self.last_time > 0.3){
                    self.onResume();
                }
            } else {

                if(Math.abs(current_time - self.last_time) <= 0.02){
                    self.onPause();
                } else if (current_time < self.last_time){
                    self.onMove();
                } else if (current_time - self.last_time >= 2){
                    self.onMove();
                }

                for(var i = self.next_index, len = self.comment_datas.length; i < len; i++){
                    var comment_data = self.comment_datas[i],
                        time = comment_data.time;

                    if(comment_data.isSpecial){
                        var comment = new Comment(comment_data);
                        if(Channels.speicalChannel.isAvailable){
                            comment.fly(Channels.speicalChannel);
                        } else {
                            self.wait4fly.unshift(comment);
                        }
                        continue;
                    }

                    if(time > self.last_time && time <= current_time){
                        var comment = new Comment(comment_data);
                        self.tryFly(comment);
                    } else if (time > current_time) {
                        break; 
                    }
                }

                self.last_time  = current_time;
                self.next_index = i;
            }

        }, 500);
    },

    add: function(data){
        data.isSpecial = true;
        if(this.next_index === this.comment_datas.length){
            this.comment_datas.push(data);
        } else {
            var index = this.next_index === 0 ? 0 : this.next_index - 1;
            this.comment_datas.splice(index, 0, data);
            this.next_index = index;
        }
    }
}


function main () {

    TM.ajaxLoadComments();

    window.editor = new TmEditor();
    window.player = new Player("#sharevideo object", Constants.SITE);

    Channels.init(player.top + 10, player.bottom, player.left, player.right, 30, 5);

    TM.start();

    TM.handleWaiters();
}