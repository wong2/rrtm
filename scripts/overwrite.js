// sprinf.js

var sprintf=function(){function g(j){return Object.prototype.toString.call(j).slice(8,-1).toLowerCase()}var c=function(){c.cache.hasOwnProperty(arguments[0])||(c.cache[arguments[0]]=c.parse(arguments[0]));return c.format.call(null,c.cache[arguments[0]],arguments)};c.format=function(j,e){var c=1,i=j.length,a="",h=[],d,f,b,k;for(d=0;d<i;d++)if(a=g(j[d]),"string"===a)h.push(j[d]);else if("array"===a){b=j[d];if(b[2]){a=e[c];for(f=0;f<b[2].length;f++){if(!a.hasOwnProperty(b[2][f]))throw sprintf('[sprintf] property "%s" does not exist',
b[2][f]);a=a[b[2][f]]}}else a=b[1]?e[b[1]]:e[c++];if(/[^s]/.test(b[8])&&"number"!=g(a))throw sprintf("[sprintf] expecting number but found %s",g(a));switch(b[8]){case "b":a=a.toString(2);break;case "c":a=String.fromCharCode(a);break;case "d":a=parseInt(a,10);break;case "e":a=b[7]?a.toExponential(b[7]):a.toExponential();break;case "f":a=b[7]?parseFloat(a).toFixed(b[7]):parseFloat(a);break;case "o":a=a.toString(8);break;case "s":a=(a=""+a)&&b[7]?a.substring(0,b[7]):a;break;case "u":a=Math.abs(a);break;
case "x":a=a.toString(16);break;case "X":a=a.toString(16).toUpperCase()}a=/[def]/.test(b[8])&&b[3]&&0<=a?"+"+a:a;f=b[4]?"0"==b[4]?"0":b[4].charAt(1):" ";k=b[6]-(""+a).length;if(b[6]){for(var l=[];0<k;l[--k]=f);f=l.join("")}else f="";h.push(b[5]?a+f:f+a)}return h.join("")};c.cache={};c.parse=function(c){for(var e=[],g=[],i=0;c;){if(null!==(e=/^[^\x25]+/.exec(c)))g.push(e[0]);else if(null!==(e=/^\x25{2}/.exec(c)))g.push("%");else if(null!==(e=/^\x25(?:([1-9]\d*)\$|\(([^\)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fosuxX])/.exec(c))){if(e[2]){var i=
i|1,a=[],h=e[2],d=[];if(null!==(d=/^([a-z_][a-z_\d]*)/i.exec(h)))for(a.push(d[1]);""!==(h=h.substring(d[0].length));)if(null!==(d=/^\.([a-z_][a-z_\d]*)/i.exec(h)))a.push(d[1]);else if(null!==(d=/^\[(\d+)\]/.exec(h)))a.push(d[1]);else throw"[sprintf] huh?";else throw"[sprintf] huh?";e[2]=a}else i|=2;if(3===i)throw"[sprintf] mixing positional and named placeholders is not (yet) supported";g.push(e)}else throw"[sprintf] huh?";c=c.substring(e[0].length)}return g};return c}(),vsprintf=function(g,c){c.unshift(g);
return sprintf.apply(null,c)};

XN.template.enhanceFlash = function(o){
    return sprintf('' +
        '<object id="videoplayer" type="application/x-shockwave-flash" width="%d" height="%d"> \
            <param name="movie" value="%s"> \
            <param name="quality" value="high"> \
            <param name="bgcolor" value="#FFFFFF"> \
            <param name="allowNetworking" value="all"> \
            <param name="allowScriptAccess" value="always"> \
            <param name="allowFullScreen" value="true"> \
            <param name="wmode" value="transparent"> \
            <param name="FlashVars" value="%s"> \
        </object>', o.width || 320, o.height || 240, o.filename, o.flashVars || "");
};