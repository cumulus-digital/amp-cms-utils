!function(t,e){t._CMLS=t._CMLS||{},t._CMLS["const"]=t._CMLS["const"]||{},t._CMLS["const"].PLAYER_TUNEGENIE=8471,t._CMLS["const"].PLAYER_TRITON=8468,t._CMLS["const"].PLAYER_POSITION_TOP=80847980,t._CMLS["const"].PLAYER_POSITION_BOTTOM=80667984,t._CMLS.logger=function o(){if(!t._CMLS||!t._CMLS.debug||"object"!=typeof console||!console.debug)return!1;t._CMLS.loggerNamesToColors=t._CMLS.loggerNamesToColors||{};var e,o,n=arguments[0],i=Array.prototype.slice.call(arguments,1);t._CMLS.loggerNamesToColors[n]?(e=t._CMLS.loggerNamesToColors[n].background,o=t._CMLS.loggerNamesToColors[n].complement):(e=Math.floor(16777215*Math.random()).toString(16),o=("000000"+(16777215^parseInt(e,16)).toString(16)).slice(-6),t._CMLS.loggerNamesToColors[n]={background:e,complement:o});var a=new Date;a=a.toISOString()?a.toISOString():a.toUTCString(),i=[].concat(["%c["+n+"]","background: #"+e+"; color: #"+o,a],i),console.debug.apply(console,i)},t._CMLS.now=Date.now||function(){return(new Date).getTime()},t._CMLS.throttle=function(e,o,n){var i,a,r,s=null,c=0;n||(n={});var d=function(){c=n.leading===!1?0:t._CMLS.now(),s=null,r=e.apply(i,a),s||(i=a=null)};return function(){var l=t._CMLS.now();c||n.leading!==!1||(c=l);var u=o-(l-c);return i=this,a=arguments,0>=u||u>o?(s&&(clearTimeout(s),s=null),c=l,r=e.apply(i,a),s||(i=a=null)):s||n.trailing===!1||(s=setTimeout(d,u)),r}},t._CMLS.debounce=function(e,o,n){var i,a,r,s,c,d=function(){var l=t._CMLS.now()-s;o>l&&l>=0?i=setTimeout(d,o-l):(i=null,n||(c=e.apply(r,a),i||(r=a=null)))},l=function(){r=this,a=arguments,s=t._CMLS.now();var l=n&&!i;return i||(i=setTimeout(d,o)),l&&(c=e.apply(r,a),r=a=null),c};return l.clear=function(){clearTimeout(i),i=r=a=null},l},t._CMLS.whichPlayer=function(){if(t._CMLS.whichPlayerCache)return t._CMLS.whichPlayerCache;var e={type:null,position:null};return t.tgmp?(e.type=t._CMLS["const"].PLAYER_TUNEGENIE,t.tgmp.options.position&&"bottom"===t.tgmp.options.position.toLowerCase()?e.position=t._CMLS["const"].PLAYER_POSITION_BOTTOM:t.tgmp.options.position&&"top"===t.tgmp.options.position.toLowerCase()&&(e.position=t._CMLS["const"].PLAYER_POSITION_TOP)):t.TDPW&&(e.type=t._CMLS["const"].PLAYER_TRITON,e.position=t._CMLS["const"].PLAYER_POSITION_TOP),t._CMLS.whichPlayerCache=e,t._CMLS.whichPlayerCache},t._CMLS.isHomepage=function(){return"/"===t.location.pathname&&/[\?&]?p=/i.test(t.location.search)===!1},t._CMLS.triggerEvent=function(e,o,n){var i;t.document.createEvent?(i=t.document.createEvent("CustomEvent"),i.initCustomEvent(o,!0,!0,n)):i=new CustomEvent(o,{detail:n}),e.dispatchEvent(i)}}(window),function(t){function e(){t._CMLS.logger(o+" v"+i,arguments)}var o="GLOBALIZE SGROUPS",n="globalizeSGroups",i="0.5";t._CMLS=t._CMLS||{},t._CMLS[n]={cycles:0,timer:null,globalize:function a(){if(!t.googletag.pubads().G||!t.googletag.pubads().G["cms-sgroup"])return t._CMLS[n].cycles>10?void e("Could not retrieve cms-sgroup in a reasonable time, aborting."):(e("Googletag not ready, waiting to retry..."),t._CMLS[n].timer&&(clearTimeout(t._CMLS[n].timer),t._CMLS[n].timer=null),t._CMLS[n].timer=setTimeout(t._CMLS[n].globalize,500),void t._CMLS[n].cycles++);e("Globalizing cms-sgroup"),t._CMLS.cGroups=t._CMLS.cGroups||[],t._CMLS.cGroups=t.googletag.pubads().G["cms-sgroup"];var o=["cms-sgroup"].concat(t._CMLS.cGroups);t.sharedContainerDataLayer=t.sharedContainerDataLayer||[],t.corpDataLayer=t.corpDataLayer||[],e("Firing events");for(var i=0,a=o.length;a>i;i++)t.sharedContainerDataLayer.push({event:o[i]}),t.corpDataLayer.push({event:o[i]}),t._CMLS.triggerEvent(t,"cms-sgroup",o[i])}},t.googletag=t.googletag||{},t.googletag.cmd=t.googletag.cmd||[],t.googletag.cmd.push(function(){e("Googletag command queue initiated."),t._CMLS[n].globalize()})}(window,void 0),function(t,e){function o(){t._CMLS.logger(n+" v"+a,arguments)}var n="TEADS INJECTOR",i="teadsInjector",a="0.7";if(!t._CMLS[i]&&!t.teads){t._CMLS[i]={getWindowSize:function c(){var e=1e3,o=1e3;return"number"==typeof t.innerWidth?e=t.innerWidth:document.documentElement&&document.documentElement.clientWidth?e=document.documentElement.clientWidth:document.body&&document.body.clientWidth&&(e=document.body.clientWidth),e>1e3&&(e=1e3),"number"==typeof t.innerHeight?o=t.innerHeight:document.documentElement&&document.documentElement.clientHeight?o=document.documentElement.clientHeight:document.body&&document.body.clientHeight&&(o=document.body.clientHeight),{w:e,h:o}},inboard:function d(e){var o=t._CMLS[i].getWindowSize();t._CMLS[i].inject({pid:e,slot:".wrapper-content",format:"inboard",before:!0,css:"margin: auto !important; padding-top: 5px; padding-bottom: 5px; max-width: 1000px",size:{w:o.w}})},inread:function l(e){t._CMLS[i].inject({pid:e,slot:".loop .post .entry-content p",filter:function(){var e=t.document.getElementsByTagName("body")[0];return e.className.indexOf("single-post")>-1},format:"inread",before:!1,css:"padding-bottom: 10px !important;"})},process:function u(e,n){e&&n&&(o("Received request for "+e+" with PID "+n),t._CMLS[i][e](n))},inject:function g(e){return e.pid&&e.slot&&e.format?(e.components=e.components||{skip:{delay:0}},e.lang=e.lang||"en",e.filter=e.filter||function(){return!0},e.minSlot=e.minSlot||0,e.before=e.before||!1,e.BTF=e.BTF||!1,e.css=e.css||"margin: auto !important;",t._ttf=t._ttf||[],t._ttf.push(e),function(t){var e,o=t.getElementsByTagName("script")[0];e=t.createElement("script"),e.async=!0,e.src="http://cdn.teads.tv/js/all-v1.js",o.parentNode.insertBefore(e,o)}(t.document),void o("Injecting!",e)):!1}};var r=function(){};if(r.prototype=[],r.prototype.push=function(){for(var e=0;e<arguments.length;e++)arguments[e].format&&arguments[e].pid&&t._CMLS[i].process(arguments[e].format,arguments[e].pid)},t._teadsinjector&&t._teadsinjector.length)for(var s=0;s<t._teadsinjector.length;s++)t._teadsinjector[s].format&&t._teadsinjector[s].pid&&t._CMLS[i].process(t._teadsinjector[s].format,t._teadsinjector[s].pid);t._teadsinjector=new r,o("Listening for future requests.")}}(window),function(t,e){function o(){t._CMLS.logger(n+" v"+a,arguments)}var n="PLAYER WATCH",i="playerWatch",a="0.5";return t._CMLS[i]?!1:t.TDPW?(t._CMLS[i]={initialized:!1,cache:{},timer:null,interval:2500,"const":{STOPPED:0,PLAYING:1},setDFPCriteria:function r(e,n){t.googletag=t.googletag||{},t.googletag.cmd=t.googletag.cmd||[],t.googletag.cmd.push(function(){o("Setting targeting",e,n),t.googletag.pubads().setTargeting(e,n)})},checkCurrentTrack:function s(){var e=localStorage&&JSON?JSON.parse(localStorage.getItem("tdas.controller."+t.amp_player_config.station+"."+t.amp_player_config.stream_id+".events.current-state")):!1;e&&e.data&&(e.data.stream&&"LIVE_PLAYING"===e.data.stream.code.toUpperCase()?this.setState(this["const"].PLAYING):this.setState(this["const"].STOPPED),e.data.song&&e.data.song.id&&this.hasTrackChanged(e.data.song.id)&&this.trackHasChanged(e.data.song))},setState:function c(e){return e===this["const"].PLAYING&&e!==this.cache.state?(o("Player is streaming."),this.cache.state=e,this.setDFPCriteria("td-player-state","PLAYING"),void t._CMLS.triggerEvent(t,"td-player.playing")):e===this["const"].STOPPED&&e!==this.cache.state?(o("Player is stopped."),this.cache.state=e,this.setDFPCriteria("td-player-state","STOPPED"),void t._CMLS.triggerEvent(t,"td-player.stopped")):void 0},hasTrackChanged:function d(t){return t&&t!==this.cache.trackId?!0:!1},trackHasChanged:function l(e){o("Song has changed!",e),this.cache.trackId=e.id,e.artist&&this.setDFPCriteria("td-player-artist",e.artist),e.album&&this.setDFPCriteria("td-player-album",e.album),e.title&&this.setDFPCriteria("td-player-track",e.title),this.setDFPCriteria("td-player-id",e.id),t._CMLS.triggerEvent(t,"td-player.trackchange",e)},startTimer:function u(){var t=this;clearTimeout(this.timer),this.timer=null,this.timer=setTimeout(function(){t.checkCurrentTrack(),t.startTimer()},this.interval)},init:function g(){return t.amp_player_config&&t.amp_player_config.station&&t.amp_player_config.stream_id?(this.checkCurrentTrack(),this.startTimer(),this.initialized=!0,o("Initialized!",this.cache.trackId),this):(o("Player configuration not available, exiting."),!1)}},void t._CMLS[i].init()):(o("Triton player not enabled, exiting."),!1)}(window),function($,t,e){function o(){t._CMLS.logger(n+" v"+a,arguments)}if(!$||!$.fn.jquery)throw{message:"Auto-scroll script called without supplying jQuery."};var n="AUTO SCROLL",i="cmlsAutoScrollPastLeaderboard",a="0.7",r={timeout:.15,leaderboardSelector:'.wrapper-header div[id^="div-gpt-ad"]:first'};t._CMLS[i]||(t._CMLS[i]={scrolled:!1,disabled:!1,timer:null,cache:{},regenerateCache:function s(){this.cache.leaderboard=$(r.leaderboardSelector),this.cache.player=$("#tgmp_frame:first,.tdpw:first"),this.cache.window=$(t)},leaderboardOnTop:function c(){if(!this.cache.leaderboard)return o("Leaderboard was not cached."),!1;var t=this.cache.leaderboard.offset();return this.playerOnTop()?t.top<150:t.top<50},playerOnTop:function d(){var e=t._CMLS.whichPlayer();return e.position===t._CMLS["const"].PLAYER_POSITION_TOP?!0:!1},generateScrollToPosition:function l(){if(this.cache.leaderboard){var t=this.cache.leaderboard.offset();return this.playerOnTop()?t.top-this.cache.player.height()+this.cache.leaderboard.height():t.top+this.cache.leaderboard.height()}return 0},hasScrolledPastLeaderboard:function u(){return this.scrolled===!0?!0:this.cache.window.scrollTop()>=this.generateScrollToPosition()?(this.scrolled=!0,!0):!1},conditionsGood:function g(){return this.disabled?"Auto-scroll is disabled for this site.":t._CMLS.isHomepage()?this.leaderboardOnTop()?this.hasScrolledPastLeaderboard()?"Already scrolled passed leaderboard.":!0:"Leaderboard is not on top.":"Not on homepage."},scrollPage:function h(){var t=this;o("Pre-animation conditions check.");var e=this.conditionsGood();e!==!0&&(o("Conditions check failed.",e),this.stopTimer()),$("html,body").animate({scrollTop:t.generateScrollToPosition()},{queue:i,duration:550}).dequeue(i)},initTimer:function m(){o("Initializing scroll timer.");var t=this,e=t.conditionsGood();return e!==!0?(o("Conditions check after leaderboard render found bad conditions.",e),void t.stopTimer()):($("html,body").clearQueue(i).stop(i,!0),clearTimeout(this.timer),this.timer=null,void(this.timer=setTimeout(function(){t.scrollPage()},6e4*r.timeout)))},stopTimer:function p(){o("Stopping timer, clearing animation queue."),$("html,body").clearQueue(i).stop(i,!0),clearTimeout(this.timer),this.timer=null},resetTimer:function f(){o("Resetting scroll timer."),this.initTimer()},init:function C(){o("Initializing auto-scroll library."),this.regenerateCache();var e=this,n=this.conditionsGood();return n!==!0?void o("Init check found bad conditions.",n):(this.cache.window.on("scroll."+i,t._CMLS.throttle(function(){e.hasScrolledPastLeaderboard()&&(e.scrolled=!0,e.stopTimer(),e.cache.window.off("scroll."+i))},500)),t.googletag=t.googletag||{},t.googletag.cmd=t.googletag.cmd||[],t.googletag.cmd.push(function(){t.googletag.pubads().addEventListener("slotRenderEnded",function n(i){if(!i.isEmpty&&"top"===i.slot.getTargeting("pos")){o("Caught leaderboard render event."),e.regenerateCache();var a=e.conditionsGood();a!==!0?(o("Conditions check after leaderboard render found bad conditions.",a),e.stopTimer()):e.resetTimer(),t.googletag.pubads().removeEventListener("slotRenderEnded",n)}})}),"complete"===t.document.readyState?void this.initTimer():void this.cache.window.on("load",function(){e.initTimer()}))}},$(function(){t._CMLS[i].init()}))}(jQuery,window),function($,t,e){function o(){t._CMLS.logger(n+" v"+a,arguments)}var n="ADDTHIS INJECTOR",i="addThisInjector",a="0.3",r="ra-55dc79597bae383e";t.addthis||(t._CMLS[i]={addThisLayer:null,inject:function s(){o("Injecting."),t.addthis_config={pubid:r};var e=t.document.createElement("script");e.src="//s7.addthis.com/js/300/addthis_widget.js#pubid=ra-55dc79597bae383e&async=1",e.async=!0,e.id=i+"Script",t.document.body.appendChild(e),o("Injected.")},hide:function c(t){$(".atss-left").addClass(t?"slideOutLeft":"at4-hide")},show:function d(t){$(".atss-left").removeClass(t?"slideOutLeft":"at4-hide")},reset:function l(e){if(t.addthis){o("Resetting.");var n=$("html").hasClass("csstransitions");e?(t.addthis=null,t._adr=null,t._atc=null,t._atd=null,t._ate=null,t._atw=null,t.addthis_share={},this.inject()):(t.addthis.toolbox(),t.addthis.layers.refresh(),t.addthis.update("share","url",t.location.href),t.addthis.update("share","title",t.document.title)),t._CMLS.isHomepage()||!e?this.hide(n):this.show(n)}},init:function u(){var e=this;$(t).on("statechange pageChange",function(t){o("Caught navigation change.",t),e.reset("pagechange"===t.type.toLowerCase())}),this.inject(),o("Initialized!")}},$(function(){t._CMLS[i].init()}))}(jQuery,window);
//# sourceMappingURL=./compiled-allsites-min.js.map