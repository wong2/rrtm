function TmEditor(){
    this.init();
    this.bindEvents();
}

TmEditor.prototype = {
    init: function(){
        $('<div id="tm_wrapper"></div>').html(' \
            <form id="tm_form"> \
                <input type="text" class="input-text" id="tm_text" autocomplete="off" /> \
                <input type="submit" class="input-button" id="tm_button" value="弹!" /> \
                <input type="checkbox" class="tm_cb" id="tm_sync_box" /> \
                <label for="tm_sync_box">同步到评论中</label> \
                <input type="checkbox" class="tm_cb" id="tm_close_box" /> \
                <label for="tm_close_box">关闭弹幕</label> \
            </form> \
        ').insertAfter(".text-article");

        $('<div class="tm_indicator tm_picker"></div>').insertAfter("body");

        $('<div class="tm_color_picker"></div>').html(' \
            <div class="tm_picker" style="background-color:black"></div> \
            <div class="tm_picker" style="background-color:white"></div> \
            <div class="tm_picker" style="background-color:red"></div> \
            <div class="tm_picker" style="background-color:yellow"></div> \
            <div class="tm_picker" style="background-color:green"></div> \
        ').insertAfter("body");

        var input_pos = $("#tm_text").offset();
        var COLOR_WIDTH = 30 + 10;
        $(".tm_indicator").offset({top: input_pos.top, left: input_pos.left - COLOR_WIDTH});
        $(".tm_color_picker").offset({top: input_pos.top - 160, left: input_pos.left - COLOR_WIDTH}).hide();

        $(".tm_indicator").css("background-color", Settings.tmColor).click(function(){
            $(".tm_color_picker").toggle();
        });
        $(".tm_picker").click(function(){
            var new_color = $(this).css("background-color");
            $(".tm_indicator").css("background-color", new_color);
            Settings.tmColor = new_color;
        });
    },
    bindEvents: function(){
        var self = this;

        // submit the form
        $("#tm_form").submit(function(){
            var text = $.trim($("#tm_text").val());
            if(text){
                if(text.length < 20) {
                    try{
                        self.addComment(text);
                    } catch (error) {
                    }
                } else {
                    Utils.insertScript('XN.DO.showError("评论太长了呦...20字符内")');
                }
            }
            $("#tm_text").val("");
            return false;
        });

        // sync to comment or not
        $("#tm_sync_box").attr("checked", Settings.tmSync).click(function(){
            Settings.tmSync = this.checked;
        });

        $("#tm_close_box").click(function(){
            var show = Settings.tmShowTM = !this.checked;    
            $(".tm_comments")[(show?"remove":"add")+"Class"]("tm_hide_comments");
        });
    },
    addComment: function(text){
        if(Settings.tmSync){
            var readableText = "[" + window.player.getReadableTime() +"]" + text;
            this.addCommentToRR(readableText);
        }

        var data = {
            text:    text,
            shareid: Constants.SHARE_ID,
            time:    window.player.getTime(),
            color:   Settings.tmColor
        };

        TM.add(data);

        chrome.extension.sendRequest({call: "addComment", data: data}, function(response){});
    },
    addCommentToRR: function(msg){
        Utils.insertScript('$("miniEditorTextarea").value = "'+msg+'";XN.app.share.CommentManger.save(11601561871)');
    }
};
