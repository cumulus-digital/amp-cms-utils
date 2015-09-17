!function($,t,e){"use strict";function n(){if(t._CMLS&&t._CMLS.debug&&"object"==typeof console&&console.log){var e=new Date;e=e.toISOString()?e.toISOString():e.toUTCString(),console.log("%c[GLOBALIZE SGROUPS "+o+"]","background: #75be84; color: #FFF",e,[].slice.call(arguments))}}var o="0.4";return t.tgmp&&t===t.top?void n("Using TuneGenie player and injected in top window, ejecting."):(t._CMLS=t._CMLS||{},t._CMLS.cGroups&&t._CMLS.cGroups.length?void n("Already defined, skipping"):void $(function(){n("Initializing"),$('script:not([src]):contains("cms-sgroup"):first').each(function(e,o){var i=o.innerHTML.match(/'cms-sgroup'\s*,\s*\[?'([^\]|\)]+)/i);if(i&&i.length>1){n("sgroups retrieved, firing events"),i=i[1].replace(/'$/,"").split(/',\s*'/),t._CMLS.cGroups=t._CMLS.cGroups||[],t._CMLS.cGroups.push.apply(t._CMLS.cGroups,i),t.sharedContainerDataLayer=t.sharedContainerDataLayer||[],t.sharedContainerDataLayer.push({event:"cms-sgroup"}),t.corpDataLayer=t.corpDataLayer||[],t.corpDataLayer.push({event:"cms-sgroup"});for(var r=0;r<i.length;r++)(i[r].indexOf("Format")>-1||i[r].indexOf("Market")>-1)&&(n("Firing event",i[r]),t.sharedContainerDataLayer.push({event:i[r]}),t.corpDataLayer.push({event:i[r]}))}else n("sgroups could not be retireved")})}))}(jQuery,window.self);try{!function(t,e){function n(){t._CMLS&&t._CMLS.debug&&"object"==typeof console&&console.log&&console.log("[TEADS INJECTOR "+o+"]",[].slice.call(arguments))}var o="0.6";if(t.tgmp&&t===t.top)return void n("Using TuneGenie player and injected in top window, ejecting.");if(t._teadsInject)return void n("Injector already loaded, skipping.");if(document.getElementById("flex_body"))return void n("FLEX body found, skipping.");var i={detectWindowSize:function s(){var e=1e3,n=1e3;return"number"==typeof t.innerWidth?e=t.innerWidth:document.documentElement&&document.documentElement.clientWidth?e=document.documentElement.clientWidth:document.body&&document.body.clientWidth&&(e=document.body.clientWidth),e>1e3&&(e=1e3),"number"==typeof t.innerHeight?n=t.innerHeight:document.documentElement&&document.documentElement.clientHeight?n=document.documentElement.clientHeight:document.body&&document.body.clientHeight&&(n=document.body.clientHeight),{w:e,h:n}},inboard:function c(t){i.go({pid:t,slot:".wrapper-content",format:"inboard",before:!0,css:"margin: auto !important; padding-top: 5px; padding-bottom: 5px;",size:{w:i.detectWindowSize().w}})},inread:function l(e){i.go({pid:e,slot:".loop .post .entry-content p",filter:function(){var e=t.top.document.getElementsByTagName("body")[0];return e.className.indexOf("single-post")>-1},format:"inread",before:!1,css:"padding-bottom: 10px !important;"})},inject:function d(t,e){t&&e&&(n("Received request for "+t+" with PID "+e),i[t](e))},go:function u(e){return e.pid&&e.slot&&e.format?(e.components=e.components||{skip:{delay:0}},e.lang=e.lang||"en",e.filter=e.filter||function(){return!0},e.minSlot=e.minSlot||0,e.before=e.before||!1,e.BTF=e.BTF||!1,e.css=e.css||"margin: auto !important;",t._ttf=t._ttf||[],t._ttf.push(e),function(t){var e,n=t.getElementsByTagName("script")[0];e=t.createElement("script"),e.async=!0,e.src="http://cdn.teads.tv/js/all-v1.js",n.parentNode.insertBefore(e,n)}(t.document),void n("Injecting!",e)):!1}},r=function(){};if(r.prototype=[],r.prototype.push=function(){for(var t=0;t<arguments.length;t++)arguments[t].pid&&arguments[t].format&&i.inject(arguments[t].format,arguments[t].pid)},n("Loaded."),t._teadsinjector&&t._teadsinjector.length)for(var a=0;a<t._teadsinjector.length;a++)t._teadsinjector[a].pid&&t._teadsinjector[a].format&&i.inject(t._teadsinjector[a].format,t._teadsinjector[a].pid);t._teadsinjector=new r,t._teadsInject=i.inject,n("Listening for future requests.")}(window.self)}catch(e){}!function(t,e){t._CMLS=t._CMLS||{},t._CMLS.embedPlayerWatch||t.tgmp||(t._CMLS.embedPlayerWatch={v:"0.4",initialized:!1,trackIdCache:null,stateCache:!1,timer:null,interval:1e3,log:function n(){if(t._CMLS&&t._CMLS.debug&&"object"==typeof console&&console.log){var e=new Date;e=e.toISOString()?e.toISOString():e.toUTCString(),console.log("[PLAYER WATCH "+this.v+"]",e,[].slice.call(arguments))}},isChanged:function o(t){return t?t===this.trackIdCache?!1:!0:!1},getCurrentState:function i(){return localStorage?JSON.parse(localStorage.getItem("tdas.controller."+amp_player_config.station+"."+amp_player_config.stream_id+".events.current-state")):!1},checkCurrent:function r(){var e=this.getCurrentState();e&&e.data&&e.data.stream&&"LIVE_PLAYING"===e.data.stream.code.toUpperCase()?this.setPlayState(!0):this.setPlayState(!1),e&&e.data&&e.data.song&&e.data.song.id&&this.isChanged(e.data.song.id)&&(this.log("Song changed!",e.data.song.id),this.trackIdCache=e.data.song.id,this.setCriteria(e),this.sendEvent(t,"td-player.trackChange",e.data.song.id)),this.setTimer()},setPlayState:function a(e){e===!0&&this.stateCache===!1?(this.log("Player is currently streaming."),this.stateCache=!0,googletag.pubads().setTargeting("td-player-state","playing"),this.sendEvent(t,"td-player.playing")):e===!1&&this.stateCache===!0&&(this.log("Player is not currently streaming."),this.stateCache=!1,googletag.pubads().setTargeting("td-player-state","stopped"),this.sendEvent(t,"td-player.stopped"))},setCriteria:function s(e){t.googletag&&googletag.pubadsReady&&e&&e.data&&e.data.song&&(e=e.data.song,e.artist&&(this.log("Setting Artist",e.artist),googletag.pubads().setTargeting("td-player-artist",e.artist),this.sendEvent(t,"td-player.artist",e.artist)),e.album&&(this.log("Setting Album",e.album),googletag.pubads().setTargeting("td-player-album",e.album),this.sendEvent(t,"td-player.album",e.album)),e.title&&(this.log("Setting Track",e.title),googletag.pubads().setTargeting("td-player-track",e.title),this.sendEvent(t,"td-player.track",e.title)),e.id&&(this.log("Setting Song ID",e.id),googletag.pubads().setTargeting("td-player-id",e.id)))},sendEvent:function c(e,n,o){var i;t.document.createEvent?(i=t.document.createEvent("CustomEvent"),i.initCustomEvent(n,!0,!0,o)):i=new CustomEvent(n,{detail:o}),e.dispatchEvent(i)},setTimer:function l(){var t=this;clearTimeout(this.timer),this.timer=null,this.timer=setTimeout(function(){t.checkCurrent()},this.interval)},init:function d(){if(!t.amp_player_config||!t.amp_player_config.station||!t.amp_player_config.stream_id)return this.log("amp_player_config not available."),!1;this.checkCurrent();var e=this;return t.addEventListener("load",function(){e.log("Caught window load."),setTimeout(function(){e.log("Delayed window load track check firing."),e.checkCurrent()},1e3)},!1),this.setTimer(),this.initialized=!0,this.log("Initialized! Current track ID:",this.trackIdCache),this}},t._CMLS.embedPlayerWatch.init())}(window),function($,t,e){function n(){if(t._CMLS&&t._CMLS.debug&&"object"==typeof console&&console.log){var e=new Date;e=e.toISOString()?e.toISOString():e.toUTCString(),console.log("%c[AUTO SCROLL "+p+"]","background: #759bbe; color: #FFF",e,[].slice.call(arguments))}}function o(t,e,n){e=e||(e=250);var o,i;return function(){var r=n||this,a=+new Date,s=arguments;o&&o+e>a?(clearTimeout(i),i=setTimeout(function(){o=a,t.apply(r,s)},e)):(o=a,t.apply(r,s))}}function i(){return"/"===t.location.pathname&&/[\?&]?p=/i.test(t.location.search)===!1}function r(){if(!m.leaderboard||!m.playerbar)return!1;var t=m.leaderboard.offset();return a()===f?t.top<100:t.top<30}function a(){return m.playerbar.length&&m.playerbar.attr("id")&&"tgmp_frame"===m.playerbar.attr("id").toLowerCase()&&t.tgmp&&t.tgmp.options&&t.tgmp.options.position&&"bottom"===t.tgmp.options.position.toLowerCase()?S:f}function s(){return m.leaderboard?a()===f?m.leaderboard.offset().top-m.playerbar.height()+m.leaderboard.height():m.leaderboard.offset().top+m.leaderboard.height():0}function c(){return t._CMLS[g].scrolled===!0?!0:$(t).scrollTop()>=s()?!0:!1}function l(){var e=u();return e!==!0?void n("Scrolling check found bad conditions.",e):(n("Scrolling homepage past leaderboard."),$("html,body").animate({scrollTop:s()},600),void(t._CMLS[g].scrolled=!0))}function d(){n("Setting timer."),t._CMLS[g].timer=setTimeout(l,6e4*h)}function u(){return i()?(t._CMLS[g].regenerateCache(),r()?(t._CMLS[g].scrolled=c(),t._CMLS[g].scrolled?"Already scrolled passed leaderboard.":!0):"Leaderboard is not on top."):"Not on homepage."}var g="cmlsAutoScrollPastLeaderboard",p="0.4",h=.05;if(t._CMLS=t._CMLS||{},!t._CMLS[g]){if(t._CMLS[g]=t._CMLS[g]||{},t._CMLS[g].scrolled=!1,t.tgmp&&t===t.top)return void n("Called in top window while using TuneGenie player, exiting.");var m={},f=1,S=2;t._CMLS[g].regenerateCache=function(){m.leaderboard=$('.wrapper-header div[id*="div-gpt-ad"]:first'),m.playerbar=$(".tdpw:first,#tgmp_frame:first")},t._CMLS[g].init=function(){if(t._CMLS=t._CMLS||{},t._CMLS[g]){n("Initializing auto-scroll.");var e=u();if(e!==!0)return void n("Init check found bad conditions.",e);$(t).on("load",function(){d()})}},$(function(){t._CMLS[g].init(),$(t).on("scroll."+g,o(function(){c()&&(t._CMLS[g].scrolled=!0)},240)),t.googletag=t.googletag||{},t.googletag.cmd=t.googletag.cmd||[],t.googletag.cmd.push(function(){t.googletag.pubads().addEventListener("slotRenderEnded",function(t){if(!t.isEmpty&&t.slot.getTargeting("pos").indexOf("top")>-1){n("Caught googletag render event.");var e=u();if(e!==!0)return void n("Googletag check found bad conditions.",e);$("#"+t.slot.getSlotElementId()+' iframe[id*="google_ads"]').load(function(){d()})}})})})}}(jQuery,window.self),function($,t,e){function n(){if(t._CMLS&&t._CMLS.debug&&"object"==typeof console&&console.log){var e=new Date;e=e.toISOString()?e.toISOString():e.toUTCString(),console.log("[ADDTHIS INJECTOR "+r+"]",e,[].slice.call(arguments))}}function o(){n("Injecting.");var e=t.document.createElement("script");e.src="//s7.addthis.com/js/300/addthis_widget.js#pubid=ra-55dc79597bae383e",e.async=!0,t.document.body.appendChild(e)}function i(){t.addthis&&(n("Resetting."),t.addthis.layers.refresh())}var r="0.2";return t.tgmp?t===t.top?void n("Using TuneGenie player and injected in top window, ejecting."):void o():($(t).on("statechange",function(){i()}),void o())}(jQuery,window.self),function(t,e){function n(){t._CMLS.autoReload=new r}function o(){var e=t._CMLS.autoReload.slice(-1)[0];t._CMLS.autoReloadInstance=new i(e),n()}if(t._CMLS=t._CMLS||{},!t._CMLS.autoReloadReference){var i=function(e){return this.version="0.6",this.condition=e&&e.condition?e.condition:"body.home",this.timeout=e&&e.timeout?6e4*e.timeout:48e4,this.active=!1,this.timer=null,this.log=function n(){if(t._CMLS&&t._CMLS.debug&&"object"==typeof console&&console.log){var e=new Date;e=e.toISOString()?e.toISOString():e.toUTCString(),console.log("[AUTO-RELOAD "+this.version+"]",e,[].slice.call(arguments))}},this.checkCondition=function o(){return t.document.querySelector(this.condition)?!0:!1},this.reset=function i(){if(this.timer&&(this.log("Clearing timer."),clearTimeout(this.timer),this.timer=null),this.active){this.log("Restarting timer.");var t=this;this.timer=setTimeout(function(){t.fire(),t.reset()},this.timeout)}},this.fire=function r(){this.checkCondition()?(this.log("Reloading the page."),t.History&&t.History.Adapter?History.Adapter.trigger(t,"statechange"):t.location.reload()):(this.log("Condition not met."),this.destroy())},this.start=function a(){this.log("Starting timer."),this.active=!0,this.reset()},this.stop=function s(){this.log("Stopping timer."),this.active=!1,this.reset()},this.destroy=function c(){this.log("Destroying timer."),this.stop()},this.start(),this.log("Initialized"),t._CMLS.autoReloadReference=this,this},r=function(){};r.prototype=[],r.prototype.originalPush=r.prototype.push,r.prototype.push=function(){for(var t=0;t<arguments.length;t++)this.originalPush(arguments[t]);o()},t._CMLS.autoReload&&t._CMLS.autoReload.length&&o(),n()}}(window),function(t,e){function n(){t._CMLS&&t._CMLS.debug&&"object"==typeof console&&console.log&&console.log("[SMART APP BANNER INJECTOR "+r+"]",[].slice.call(arguments))}function o(){var t="undefined"!=typeof userAgent?userAgent:navigator.userAgent,e=t.split("[FBAN");"undefined"!=typeof e[1]&&(t=e[0]),n("UA",t);for(var o=[{vendor:s,regexp:/iP[honead]+/i},{vendor:c,regexp:/(?=.*\bAndroid\b)(?=.*\bMobile\b)/i}],i=0;i<o.length;i++)if(t.match(o[i].regexp))return o[i].vendor;return!1}function i(){return t._CMLS.smartBanner?(n("Injecting",a),void t._CMLS.smartBanner({icon:{color:a.backgroundColor},title:a.title,author:a.author,button:"View"})):void setTimeout(i,300)}var r="0.11",a={title:t.document.title,author:"Cumulus",backgroundColor:"transparent",appWidgetSelector:".free-apps,.mobile-apps",headerSelector:".wrapper-header",logoSelector:"figure.logo img",styleSheetUrl:"https://cdn.rawgit.com/cumulus-digital/amp-cms-utils/0a1cff3621f001382c724f36268123aa5f8f1c49/dist/smartbanner/smartbanner.css",libraryUrl:"https://cdn.rawgit.com/cumulus-digital/amp-cms-utils/0a1cff3621f001382c724f36268123aa5f8f1c49/dist/smartbanner/smartbanner-min.js"};if(t._CMLS=t._CMLS||{},t._CMLS.smartBannerEnabled)return void n("Already enabled, skipping.");var s="apple",c="google";if(!o())return void n("Unsupported device, exiting.");var l={getAppIds:function(t){var e={},o={apple:t.querySelector('a[href*="itunes.apple.com/us/app"]'),google:t.querySelector('a[href*="play.google.com/store/apps"]')};if(o.apple){var i=o.apple.getAttribute("href").match(/id(\d+)/i);i&&i.length&&(e.apple=i[1])}if(o.google){var r=o.google.getAttribute("href").match(/id=([0-9A-Za-z\.]+)/i);r&&r.length&&(e.google=r[1])}return o.apple||o.google?(n("Discovered app IDs",e),e):null},createMetaTags:function(e){n("Generating meta tags");var o=[],i={apple:"apple-itunes-app",google:"google-play-app"},r;for(var a in e)i[a]&&(r=t.document.createElement("meta"),r.setAttribute("name",i[a]),r.setAttribute("content","app-id="+e[a]),o.push(r));return o.length?(n("Generated meta tags",o),o):null},createNiceTitle:function(t){var e=t.replace(/(\|\s*)?Cumulus(\|\s*)?/,"").match(/\|\s*([^\|]*)(\|.*)?$/);return e&&e.length?(n("Using nice title",e[1]),e[1]):t},createIconLinks:function(e){if(!e)return null;var o=e.getAttribute("src");if(o){n("Generating link tags with logo image url",o);var i=t.document.createElement("link");i.setAttribute("rel","apple-touch-icon"),i.setAttribute("href",o);var r=t.document.createElement("link");return i.setAttribute("rel","android-touch-icon"),i.setAttribute("href",o),[i,r]}return null},getBackgroundColor:function(t){var e=getComputedStyle(t,null).getPropertyValue("background-color");return n("Getting background color",e),e?(n("Got background color",e),e):"transparent"},appendToHead:function(e){n("Injecting support nodes into head.",e);for(var o=t.document.querySelector("head"),i=0;i<e.length;i++)o.appendChild(e[i])},init:function(){var e=t.document.querySelector(a.appWidgetSelector);if(!e)return n("No app widget found, ejecting."),!1;var o=[],i=this.createNiceTitle(t.document.title),r=t.document.querySelector(a.logoSelector),s=this.getBackgroundColor(t.document.querySelector(a.headerSelector)),c=this.createMetaTags(this.getAppIds(e));if(!c||!c.length)return n("No app IDs found, ejecting."),!1;o=o.concat(c);var l=this.createIconLinks(r);o=o.concat(l);var d=t.document.createElement("link");if(d.setAttribute("rel","stylesheet"),d.setAttribute("href",a.styleSheetUrl),o.push(d),!t._CMLS.smartBanner){var u=t.document.createElement("script");u.src=a.libraryUrl,o.push(u)}return this.appendToHead(o),a.title=i,a.backgroundColor=s,!0}},d=function(t){"interactive"===document.readyState||"complete"===document.readyState?t():document.addEventListener("DOMContentLoaded",t)};d(function(){n("Initializing.");var t=l.init();t&&i()}),n("Loaded.")}(window);
//# sourceMappingURL=./compiled-allsites-min.js.map