$(function(){
    var videoimg = document.getElementsByClassName("videoimg")[0];

    if(!videoimg){
        // this is not a video share page(may be a photo share?)
        return;
    }

    // check if site supported, if so, return site name
    var swfurl = videoimg.alt.split(";")[1],
        site = Utils.isSupportedSite(swfurl);

    // play the video normally
    if(!site){
        Utils.insertScript('playVideoOfContent2("sharevideo", "videoimg", null, null, null, 610)');
        return;
    }

    // load or initialize settings from localStorage
    window.Settings = {};
        Settings.tmColor  = Utils.getOrSetLocalStorage("tmColor", "yellow");
        Settings.tmShowTM = Utils.getOrSetLocalStorage("tmShowTM", "true", true);
        Settings.tmSync   = Utils.getOrSetLocalStorage("tmSync", "true", true);

    // when values change, sync to localStorage automatically
    Utils.syncToLocalStorage(Settings); 

    // some constants
    window.Constants = {}; 

    // get shareId from page's url
    Constants.SHARE_ID = function(){
        var link = document.querySelector(".share-source a").href;
        return md5(link);
    }();
    Constants.SITE = site;

    // overwrite enhanceFlash and insert video player
    var script2 = document.createElement('script');
    script2.onload = function(){
        Utils.insertScript('playVideoOfContent2("sharevideo", "videoimg", null, null, null, 610)');

        var playerElement = document.querySelector("#sharevideo object");

        // wait for player load
        var timeout = setInterval(function(){
            if(playerElement.getNsData){
                clearInterval(timeout);
                main();
            }
        }, 500); 

    }
    script2.src = "chrome-extension://" + chrome.i18n.getMessage("@@extension_id") + "/scripts/overwrite.js";
    document.body.appendChild(script2);

});