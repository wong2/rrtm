var Utils = {
    insertScript: function(content){
        var script = document.createElement("script");
        script.textContent = content;
        document.body.appendChild(script);
    },
    isSupportedSite: function(url){
        var supported = {
            youku: /player\.youku\.com/
        };
        for(var key in supported){
            if(supported.hasOwnProperty(key)){
                if(supported[key].test(url)){
                    return key;
                }
            }
        }
        return null;
    },
    // "true", "false"
    getOrSetLocalStorage: function(key, defaultValue, json){
        var val = localStorage[key];
        if(typeof val === "undefined"){
            val = localStorage[key] = defaultValue;
        }
        return (json ? JSON.parse(val) : val);
    },
    _listen: function(o, p, callback){
        var originalVal = o[p];
        Object.defineProperty(o, p, {
            get: function(){
                return originalVal;
            },
            set: function(val){
                callback.call(o, p, val);
                return originalVal = val;
            }
        });  
    },
    _onPropertyChange: function(o, callback){
        for(var p in o){
            if(o.hasOwnProperty(p)){
                this._listen(o, p, callback);
            }
        }
    },
    // when object property values changed, sync to localStorage automatically
    syncToLocalStorage: function(object){
        this._onPropertyChange(object, function(p, val){
            localStorage[p] = val;
        });
    }
}