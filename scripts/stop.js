// a hack to stop renren from load the flash player
var script = document.createElement('script');
script.textContent = 'Object.defineProperty(window, "playVideoOfContent", { get: function(){ return function(){} }, set: function(fn){window.playVideoOfContent2= fn} }) ';
(document.head || document.documentElement).appendChild(script);