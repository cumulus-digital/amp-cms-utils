try{!function(t,e){function n(){t._CMLS&&t._CMLS.debug&&"object"==typeof console&&console.log&&console.log("[TEADS INJECTOR "+o+"]",[].slice.call(arguments))}var o="0.6";if(t._teadsInject)return void n("Injector already loaded, skipping.");if(document.getElementById("flex_body"))return void n("FLEX body found, skipping.");var i={detectWindowSize:function c(){var e=1e3,n=1e3;return"number"==typeof t.innerWidth?e=t.innerWidth:document.documentElement&&document.documentElement.clientWidth?e=document.documentElement.clientWidth:document.body&&document.body.clientWidth&&(e=document.body.clientWidth),e>1e3&&(e=1e3),"number"==typeof t.innerHeight?n=t.innerHeight:document.documentElement&&document.documentElement.clientHeight?n=document.documentElement.clientHeight:document.body&&document.body.clientHeight&&(n=document.body.clientHeight),{w:e,h:n}},inboard:function a(t){i.go({pid:t,slot:".wrapper-content",format:"inboard",before:!0,css:"margin: auto !important; padding-top: 5px; padding-bottom: 5px;",size:{w:i.detectWindowSize().w}})},inread:function m(e){i.go({pid:e,slot:".loop .post .entry-content p",filter:function(){var e=t.top.document.getElementsByTagName("body")[0];return e.className.indexOf("single-post")>-1},format:"inread",before:!1,css:"padding-bottom: 10px !important;"})},inject:function s(t,e){t&&e&&(n("Received request for "+t+" with PID "+e),i[t](e))},go:function u(e){return e.pid&&e.slot&&e.format?(e.components=e.components||{skip:{delay:0}},e.lang=e.lang||"en",e.filter=e.filter||function(){return!0},e.minSlot=e.minSlot||0,e.before=e.before||!1,e.BTF=e.BTF||!1,e.css=e.css||"margin: auto !important;",t._ttf=t._ttf||[],t._ttf.push(e),function(t){var e,n=t.getElementsByTagName("script")[0];e=t.createElement("script"),e.async=!0,e.src="http://cdn.teads.tv/js/all-v1.js",n.parentNode.insertBefore(e,n)}(t.document),void n("Injecting!",e)):!1}},d=function(){};if(d.prototype=[],d.prototype.push=function(){for(var t=0;t<arguments.length;t++)arguments[t].pid&&arguments[t].format&&i.inject(arguments[t].format,arguments[t].pid)},n("Loaded."),t._teadsinjector&&t._teadsinjector.length)for(var r=0;r<t._teadsinjector.length;r++)t._teadsinjector[r].pid&&t._teadsinjector[r].format&&i.inject(t._teadsinjector[r].format,t._teadsinjector[r].pid);t._teadsinjector=new d,t._teadsInject=i.inject,n("Listening for future requests.")}(window)}catch(e){}
//# sourceMappingURL=./teadsinjector-min.js.map