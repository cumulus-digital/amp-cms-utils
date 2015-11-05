!function(t,e){t._CMLS=t._CMLS||{},t._CMLS["const"]=t._CMLS["const"]||{},t._CMLS["const"].PLAYER_TUNEGENIE=8471,t._CMLS["const"].PLAYER_TRITON=8468,t._CMLS["const"].PLAYER_POSITION_TOP=80847980,t._CMLS["const"].PLAYER_POSITION_BOTTOM=80667984,t._CMLS.logger=function n(){if(!t._CMLS||!t._CMLS.debug||"object"!=typeof console||!console.debug)return!1;t._CMLS.loggerNamesToColors=t._CMLS.loggerNamesToColors||{};var e,n,o=arguments[0],i=Array.prototype.slice.call(arguments,1);console.log("arguments:",arguments),console.log("name:",o),console.log("message:",i),t._CMLS.loggerNamesToColors[o]?(e=t._CMLS.loggerNamesToColors[o].background,n=t._CMLS.loggerNamesToColors[o].complement):(e=Math.floor(16777215*Math.random()).toString(16),n=("000000"+(16777215^parseInt(e,16)).toString(16)).slice(-6),t._CMLS.loggerNamesToColors[o]={background:e,complement:n});var a=new Date;a=a.toISOString()?a.toISOString():a.toUTCString(),i=[].concat(["%c["+o+"]","background: #"+e+"; color: #"+n,a],i),console.debug.apply(console,i)},t._CMLS.now=Date.now()||function(){return(new Date).getTime()},t._CMLS.throttle=function(e,n,o){var i,a,r,s=null,l=0;o||(o={});var c=function(){l=o.leading===!1?0:t._CMLS.now(),s=null,r=e.apply(i,a),s||(i=a=null)};return function(){var d=t._CMLS.now();l||o.leading!==!1||(l=d);var u=n-(d-l);return i=this,a=arguments,0>=u||u>n?(s&&(clearTimeout(s),s=null),l=d,r=e.apply(i,a),s||(i=a=null)):s||o.trailing===!1||(s=setTimeout(c,u)),r}},t._CMLS.debounce=function(e,n,o){var i,a,r,s,l,c=function(){var d=t._CMLS.now()-s;n>d&&d>=0?i=setTimeout(c,n-d):(i=null,o||(l=e.apply(r,a),i||(r=a=null)))},d=function(){r=this,a=arguments,s=t._CMLS.now();var d=o&&!i;return i||(i=setTimeout(c,n)),d&&(l=e.apply(r,a),r=a=null),l};return d.clear=function(){clearTimeout(i),i=r=a=null},d},t._CMLS.whichPlayer=function(){if(t._CMLS.whichPlayerCache)return t._CMLS.whichPlayerCache;var e={type:null,position:null};return t.tgmp?(e.type=t._CMLS["const"].PLAYER_TUNEGENIE,t.tgmp.options.position&&"bottom"===t.tgmp.options.position.toLowerCase()?e.position=t._CMLS["const"].PLAYER_POSITION_BOTTOM:t.tgmp.options.position&&"top"===t.tgmp.options.position.toLowerCase()&&(e.position=t._CMLS["const"].PLAYER_POSITION_TOP)):t.TDPW&&(e.type=t._CMLS["const"].PLAYER_TRITON,e.position=t._CMLS["const"].PLAYER_POSITION_TOP),t._CMLS.whichPlayerCache=e,t._CMLS.whichPlayerCache},t._CMLS.isHomepage=function(){return"/"===t.location.pathname&&/[\?&]?p=/i.test(t.location.search)===!1}}(window),function($,t,e){"use strict";function n(){if(t._CMLS&&t._CMLS.debug&&"object"==typeof console&&console.log){var e=new Date;e=e.toISOString()?e.toISOString():e.toUTCString(),console.log("%c[GLOBALIZE SGROUPS "+o+"]","background: #75be84; color: #FFF",e,[].slice.call(arguments))}}var o="0.4";return t.tgmp&&t===t.top?void n("Using TuneGenie player and injected in top window, ejecting."):(t._CMLS=t._CMLS||{},t._CMLS.cGroups&&t._CMLS.cGroups.length?void n("Already defined, skipping"):void $(function(){n("Initializing"),$('script:not([src]):contains("cms-sgroup"):first').each(function(e,o){var i=o.innerHTML.match(/'cms-sgroup'\s*,\s*\[?'([^\]|\)]+)/i);if(i&&i.length>1){n("sgroups retrieved, firing events"),i=i[1].replace(/'$/,"").split(/',\s*'/),t._CMLS.cGroups=t._CMLS.cGroups||[],t._CMLS.cGroups.push.apply(t._CMLS.cGroups,i),t.sharedContainerDataLayer=t.sharedContainerDataLayer||[],t.sharedContainerDataLayer.push({event:"cms-sgroup"}),t.corpDataLayer=t.corpDataLayer||[],t.corpDataLayer.push({event:"cms-sgroup"});for(var a=0;a<i.length;a++)(i[a].indexOf("Format")>-1||i[a].indexOf("Market")>-1)&&(n("Firing event",i[a]),t.sharedContainerDataLayer.push({event:i[a]}),t.corpDataLayer.push({event:i[a]}))}else n("sgroups could not be retireved")})}))}(jQuery,window.self);try{!function(t,e){function n(){t._CMLS&&t._CMLS.debug&&"object"==typeof console&&console.log&&console.log("[TEADS INJECTOR "+o+"]",[].slice.call(arguments))}var o="0.6";if(t.tgmp&&t===t.top)return void n("Using TuneGenie player and injected in top window, ejecting.");if(t._teadsInject)return void n("Injector already loaded, skipping.");if(document.getElementById("flex_body"))return void n("FLEX body found, skipping.");var i={detectWindowSize:function s(){var e=1e3,n=1e3;return"number"==typeof t.innerWidth?e=t.innerWidth:document.documentElement&&document.documentElement.clientWidth?e=document.documentElement.clientWidth:document.body&&document.body.clientWidth&&(e=document.body.clientWidth),e>1e3&&(e=1e3),"number"==typeof t.innerHeight?n=t.innerHeight:document.documentElement&&document.documentElement.clientHeight?n=document.documentElement.clientHeight:document.body&&document.body.clientHeight&&(n=document.body.clientHeight),{w:e,h:n}},inboard:function l(t){i.go({pid:t,slot:".wrapper-content",format:"inboard",before:!0,css:"margin: auto !important; padding-top: 5px; padding-bottom: 5px;",size:{w:i.detectWindowSize().w}})},inread:function c(e){i.go({pid:e,slot:".loop .post .entry-content p",filter:function(){var e=t.top.document.getElementsByTagName("body")[0];return e.className.indexOf("single-post")>-1},format:"inread",before:!1,css:"padding-bottom: 10px !important;"})},inject:function d(t,e){t&&e&&(n("Received request for "+t+" with PID "+e),i[t](e))},go:function u(e){return e.pid&&e.slot&&e.format?(e.components=e.components||{skip:{delay:0}},e.lang=e.lang||"en",e.filter=e.filter||function(){return!0},e.minSlot=e.minSlot||0,e.before=e.before||!1,e.BTF=e.BTF||!1,e.css=e.css||"margin: auto !important;",t._ttf=t._ttf||[],t._ttf.push(e),function(t){var e,n=t.getElementsByTagName("script")[0];e=t.createElement("script"),e.async=!0,e.src="http://cdn.teads.tv/js/all-v1.js",n.parentNode.insertBefore(e,n)}(t.document),void n("Injecting!",e)):!1}},a=function(){};if(a.prototype=[],a.prototype.push=function(){for(var t=0;t<arguments.length;t++)arguments[t].pid&&arguments[t].format&&i.inject(arguments[t].format,arguments[t].pid)},n("Loaded."),t._teadsinjector&&t._teadsinjector.length)for(var r=0;r<t._teadsinjector.length;r++)t._teadsinjector[r].pid&&t._teadsinjector[r].format&&i.inject(t._teadsinjector[r].format,t._teadsinjector[r].pid);t._teadsinjector=new a,t._teadsInject=i.inject,n("Listening for future requests.")}(window.self)}catch(e){}!function(t,e){t._CMLS=t._CMLS||{},t._CMLS.embedPlayerWatch||t.tgmp||(t._CMLS.embedPlayerWatch={v:"0.4",initialized:!1,trackIdCache:null,stateCache:!1,timer:null,interval:1e3,log:function n(){if(t._CMLS&&t._CMLS.debug&&"object"==typeof console&&console.log){var e=new Date;e=e.toISOString()?e.toISOString():e.toUTCString(),console.log("[PLAYER WATCH "+this.v+"]",e,[].slice.call(arguments))}},isChanged:function o(t){return t?t===this.trackIdCache?!1:!0:!1},getCurrentState:function i(){return localStorage?JSON.parse(localStorage.getItem("tdas.controller."+amp_player_config.station+"."+amp_player_config.stream_id+".events.current-state")):!1},checkCurrent:function a(){var e=this.getCurrentState();e&&e.data&&e.data.stream&&"LIVE_PLAYING"===e.data.stream.code.toUpperCase()?this.setPlayState(!0):this.setPlayState(!1),e&&e.data&&e.data.song&&e.data.song.id&&this.isChanged(e.data.song.id)&&(this.log("Song changed!",e.data.song.id),this.trackIdCache=e.data.song.id,this.setCriteria(e),this.sendEvent(t,"td-player.trackChange",e.data.song.id)),this.setTimer()},setPlayState:function r(e){e===!0&&this.stateCache===!1?(this.log("Player is currently streaming."),this.stateCache=!0,googletag.pubads().setTargeting("td-player-state","playing"),this.sendEvent(t,"td-player.playing")):e===!1&&this.stateCache===!0&&(this.log("Player is not currently streaming."),this.stateCache=!1,googletag.pubads().setTargeting("td-player-state","stopped"),this.sendEvent(t,"td-player.stopped"))},setCriteria:function s(e){t.googletag&&googletag.pubadsReady&&e&&e.data&&e.data.song&&(e=e.data.song,e.artist&&(this.log("Setting Artist",e.artist),googletag.pubads().setTargeting("td-player-artist",e.artist),this.sendEvent(t,"td-player.artist",e.artist)),e.album&&(this.log("Setting Album",e.album),googletag.pubads().setTargeting("td-player-album",e.album),this.sendEvent(t,"td-player.album",e.album)),e.title&&(this.log("Setting Track",e.title),googletag.pubads().setTargeting("td-player-track",e.title),this.sendEvent(t,"td-player.track",e.title)),e.id&&(this.log("Setting Song ID",e.id),googletag.pubads().setTargeting("td-player-id",e.id)))},sendEvent:function l(e,n,o){var i;t.document.createEvent?(i=t.document.createEvent("CustomEvent"),i.initCustomEvent(n,!0,!0,o)):i=new CustomEvent(n,{detail:o}),e.dispatchEvent(i)},setTimer:function c(){var t=this;clearTimeout(this.timer),this.timer=null,this.timer=setTimeout(function(){t.checkCurrent()},this.interval)},init:function d(){if(!t.amp_player_config||!t.amp_player_config.station||!t.amp_player_config.stream_id)return this.log("amp_player_config not available."),!1;this.checkCurrent();var e=this;return t.addEventListener("load",function(){e.log("Caught window load."),setTimeout(function(){e.log("Delayed window load track check firing."),e.checkCurrent()},1e3)},!1),this.setTimer(),this.initialized=!0,this.log("Initialized! Current track ID:",this.trackIdCache),this}},t._CMLS.embedPlayerWatch.init())}(window),function($,t,e){function n(){var e=[].concat(o+" v"+i,"("+n.caller.name+")",[].slice.call(arguments));t._CMLS.logger(e)}if(!$||!$.fn.jquery)throw{message:"Auto-scroll script called without supplying jQuery."};var o="cmlsAutoScrollPastLeaderboard",i="0.7",a={timeout:.15,leaderboardSelector:'.wrapper-header div[id^="div-gpt-ad"]:first'};t._CMLS[o]||(t._CMLS[o]={scrolled:!1,disabled:!1,cache:{},regenerateCache:function r(){this.cache.leaderboard=$(a.leaderboardSelector),this.cache.player=$("#tgmp_frame:first,.tdpw:first"),this.cache.window=$(t)},leaderboardOnTop:function s(){if(!this.cache.leaderboard)return!1;var t=this.cache.leaderboard.offset();return this.playerOnTop()?t.top<100:t.top<50},playerOnTop:function l(){var e=t._CMLS.whichPlayer();return e.position===t._CMLS["const"].PLAYER_POSTITION_TOP?!0:!1},generateScrollToPosition:function c(){if(this.cache.leaderboard){var t=this.cache.leaderboard.offset();return this.playerOnTop()?t.top-this.cache.player.height()+this.cache.leaderboard.height():t.top+this.cache.leaderboard.height()}return 0},hasScrolledPastLeaderboard:function d(){return this.scrolled===!0?!0:this.cache.window.scrollTop()>=this.generateScrollToPosition()?(this.scrolled=!0,!0):!1},conditionsGood:function u(){return this.disabled?"Auto-scroll is disabled for this site.":t._CMLS.isHomepage()?this.leaderboardOnTop()?this.hasScrolledPastLeaderboard()?"Already scrolled passed leaderboard.":!0:"Leaderboard is not on top.":"Not on homepage."},initAnimation:function g(){n("Initializing animation queue.");var t=this,e=t.conditionsGood();return e!==!0?(n("Conditions check after leaderboard render found bad conditions.",e),void t.stopAnimation()):void $("html,body").clearQueue(o).stop(o,!0).delay(100,o).dequeue(o).delay(6e4*a.timeout,o).queue(o,function(){n("Pre-animation conditions check.");var e=t.conditionsGood();return e!==!0?(n(e),t.stopAnimation(),!1):void n("Conditions check passes.")}).animate({scrollTop:t.generateScrollToPosition()},{queue:o,duration:550,step:function(){return t.scrolled===!0?(n("Interrupting animation."),t.stopAnimation(),!1):void 0}}).dequeue(o)},stopAnimation:function h(){n("Stopping animation, clearing queue."),$("html,body").clearQueue(o).stop(o,!0).dequeue(o)},resetAnimation:function p(){n("Resetting animation queue."),this.initAnimation()},init:function m(){n("Initializing auto-scroll library."),this.regenerateCache();var e=this,i=this.conditionsGood();return i!==!0?void n("Init check found bad conditions.",i):(this.cache.window.on("scroll."+o,t._CMLS.throttle(function(){e.hasScrolledPastLeaderboard()&&(e.scrolled=!0,e.stopAnimation(),e.cache.window.off("scroll."+o))},500)),t.googletag=t.googletag||{},t.googletag.cmd=t.googletag.cmd||[],t.googletag.cmd.push(function(){t.googletag.pubads().addEventListener("slotRenderEnded",function o(i){if(!i.isEmpty&&"top"===i.slot.getTargeting("pos")){n("Caught leaderboard render event."),e.regenerateCache();var a=e.conditionsGood();a!==!0?(n("Conditions check after leaderboard render found bad conditions.",a),e.stopAnimation()):e.resetAnimation(),t.googletag.pubads().removeEventListener("slotRenderEnded",o)}})}),"complete"===t.document.readyState?void this.initAnimation():void this.cache.window.on("load",function(){e.initAnimation()}))}},$(function(){t._CMLS[o].init()}))}(jQuery,window),function($,t,e){function n(){if(t._CMLS&&t._CMLS.debug&&"object"==typeof console&&console.log){var e=new Date;e=e.toISOString()?e.toISOString():e.toUTCString(),console.log("[ADDTHIS INJECTOR "+r+"]",e,[].slice.call(arguments))}}function o(){n("Injecting.");var e=t.document.createElement("script");e.src="//s7.addthis.com/js/300/addthis_widget.js#pubid=ra-55dc79597bae383e&async=1",e.async=!0,t.document.body.appendChild(e),t.loadAddThis=function(){t.addthis.init(),t.addthis.toolbox(),t.addthis.layers.refresh(),t.addthis_share=t.addthis_share||{},t.addthis_share.url=t.location.href,t.addthis_share.title=t.document.title}}function i(){return"/"===t.location.pathname&&/[\?&]?p=/i.test(t.location.search)===!1}function a(){if(t.addthis){var e=$(".atss-left"),o=$("html.csstransitions").length;e.length||(t.addthis=null,t._adr=null,t._atc=null,t._atd=null,t._ate=null,t._atw=null,t.addthis_share={},$(".addthis-smartlayers,.addthis-toolbox,#_atssh").remove()),n("Resetting."),t.addthis.layers.refresh();var a=o?"slideOutLeft":"at4-hide";i()?e.addClass(a):e.removeClass(a)}}var r="0.2";if(!t.addthis){if(t.tgmp)return t===t.top?void n("Using TuneGenie player and injected in top window, ejecting."):void o();$(t).on("statechange",function(){var e=$(".atss-left"),n=$("html.csstransitions").length;e.length||(t.addthis=null,t._adr=null,t._atc=null,t._atd=null,t._ate=null,t._atw=null,t.addthis_share={},$(".addthis-smartlayers,.addthis-toolbox,#_atssh").remove(),o()),n?e.addClass("slideOutLeft"):e.addClass("at4-hide")}),$(t).on("pageChange",function(){a()}),i()||o()}}(jQuery,window.self),function(t,e){function n(){t._CMLS.autoReload=new a}function o(){var e=t._CMLS.autoReload.slice(-1)[0];t._CMLS.autoReloadInstance=new i(e),n()}if(t._CMLS=t._CMLS||{},!t._CMLS.autoReloadReference){var i=function(e){return this.version="0.6",this.condition=e&&e.condition?e.condition:"body.home",this.timeout=e&&e.timeout?6e4*e.timeout:48e4,this.active=!1,this.timer=null,this.log=function n(){if(t._CMLS&&t._CMLS.debug&&"object"==typeof console&&console.log){var e=new Date;e=e.toISOString()?e.toISOString():e.toUTCString(),console.log("[AUTO-RELOAD "+this.version+"]",e,[].slice.call(arguments))}},this.checkCondition=function o(){return t.document.querySelector(this.condition)?!0:!1},this.reset=function i(){if(this.timer&&(this.log("Clearing timer."),clearTimeout(this.timer),this.timer=null),this.active){this.log("Restarting timer.");var t=this;this.timer=setTimeout(function(){t.fire(),t.reset()},this.timeout)}},this.fire=function a(){this.checkCondition()?(this.log("Reloading the page."),t.History&&t.History.Adapter?History.Adapter.trigger(t,"statechange"):t.location.reload()):(this.log("Condition not met."),this.destroy())},this.start=function r(){this.log("Starting timer."),this.active=!0,this.reset()},this.stop=function s(){this.log("Stopping timer."),this.active=!1,this.reset()},this.destroy=function l(){this.log("Destroying timer."),this.stop()},this.start(),this.log("Initialized"),t._CMLS.autoReloadReference=this,this},a=function(){};a.prototype=[],a.prototype.originalPush=a.prototype.push,a.prototype.push=function(){for(var t=0;t<arguments.length;t++)this.originalPush(arguments[t]);o()},t._CMLS.autoReload&&t._CMLS.autoReload.length&&o(),n()}}(window);
//# sourceMappingURL=./compiled-allsites-min.js.map