!function(t,e){t.self!==t.top?t._CMLS={}:t._CMLS=t._CMLS||{},t._CMLS.LOADED||(t._CMLS["const"]=t._CMLS["const"]||{},t._CMLS["const"].PLAYER_TUNEGENIE=8471,t._CMLS["const"].PLAYER_TRITON=8468,t._CMLS["const"].PLAYER_POSITION_TOP=80847980,t._CMLS["const"].PLAYER_POSITION_BOTTOM=80667984,t._CMLS.logger=function o(){if(!t._CMLS||!t._CMLS.debug||"object"!=typeof console||!console.groupCollapsed)return!1;t._CMLS.loggerNamesToColors=t._CMLS.loggerNamesToColors||{};var e,o,n=arguments[0],i=[].slice.call(arguments[1]);t._CMLS.loggerNamesToColors[n]?(e=t._CMLS.loggerNamesToColors[n].background,o=t._CMLS.loggerNamesToColors[n].complement):(e=("000000"+Math.floor(16777215*Math.random()).toString(16)).slice(-6),o=parseInt(e,16)>=12303291?"000000":"FFFFFF",t._CMLS.loggerNamesToColors[n]={background:e,complement:o});var r=new Date;r=r.toISOString()?r.toISOString():r.toUTCString();var a=["%c["+n+"]","background: #"+e+"; color: #"+o];i=a.concat(i),t.top.console.groupCollapsed.apply(console,i),t.top.console.log("TIMESTAMP:",r),t.top.console.trace(),t.top.console.groupEnd()},t._CMLS.now=Date.now||function(){return(new Date).getTime()},t._CMLS.throttle=function(e,o,n){var i,r,a,s=null,l=0;n||(n={});var c=function(){l=n.leading===!1?0:t._CMLS.now(),s=null,a=e.apply(i,r),s||(i=r=null)};return function(){var d=t._CMLS.now();l||n.leading!==!1||(l=d);var p=o-(d-l);return i=this,r=arguments,0>=p||p>o?(s&&(clearTimeout(s),s=null),l=d,a=e.apply(i,r),s||(i=r=null)):s||n.trailing===!1||(s=setTimeout(c,p)),a}},t._CMLS.debounce=function(e,o,n){var i,r,a,s,l,c=function(){var d=t._CMLS.now()-s;o>d&&d>=0?i=setTimeout(c,o-d):(i=null,n||(l=e.apply(a,r),i||(a=r=null)))},d=function(){a=this,r=arguments,s=t._CMLS.now();var d=n&&!i;return i||(i=setTimeout(c,o)),d&&(l=e.apply(a,r),a=r=null),l};return d.clear=function(){clearTimeout(i),i=a=r=null},d},t._CMLS.whichPlayer=function(){if(t._CMLS.whichPlayerCache)return t._CMLS.whichPlayerCache;var e={type:null,position:null};return t.tgmp?(t._CMLS.logger("COMMON",["Found TuneGenie player."]),e.type=t._CMLS["const"].PLAYER_TUNEGENIE,t.tgmp.options.position&&"bottom"===t.tgmp.options.position.toLowerCase()?(t._CMLS.logger("COMMON",["TuneGenie player is on the bottom."]),e.position=t._CMLS["const"].PLAYER_POSITION_BOTTOM):t.tgmp.options.position&&"top"===t.tgmp.options.position.toLowerCase()&&(t._CMLS.logger("COMMON",["TuneGenie player is on the top."]),e.position=t._CMLS["const"].PLAYER_POSITION_TOP)):t.TDPW&&(t._CMLS.logger("COMMON",["Found Triton player, assuming it's on top."]),e.type=t._CMLS["const"].PLAYER_TRITON,e.position=t._CMLS["const"].PLAYER_POSITION_TOP),t._CMLS.whichPlayerCache=e,t._CMLS.whichPlayerCache},t._CMLS.isHomepage=function(e){return e||(e=t),"/"===e.location.pathname&&/[\?&]?p=/i.test(e.location.search)===!1},t._CMLS.triggerEvent=function(e,o,n){var i;t.document.createEvent?(i=t.document.createEvent("CustomEvent"),i.initCustomEvent(o,!0,!0,n)):i=new CustomEvent(o,{detail:n}),e.dispatchEvent(i)},t._CMLS.logger("COMMON",["LIBRARY LOADED!\n                           .__                \n  ____  __ __  _____  __ __|  |  __ __  ______\n_/ ___\\|  |  \\/     \\|  |  \\  | |  |  \\/  ___/\n\\  \\___|  |  /  Y Y  \\  |  /  |_|  |  /___ \\ \n \\___  >____/|__|_|  /____/|____/____//____  >\n     \\/            \\/                      \\/ \n"]),t._CMLS.LOADED=!0)}(window),function(t){function e(){t._CMLS.logger(o+" v"+i,arguments)}var o="GLOBALIZE SGROUPS",n="globalizeSGroups",i="0.5";t._CMLS[n]||(t._CMLS[n]={cycles:0,timer:null,globalize:function r(){var o;try{if(!t.googletag||!t.googletag.pubads())throw{message:"Googletag not yet ready."};var i=t.googletag.pubads();for(var r in i)if(i[r].hasOwnProperty("cms-sgroup")){o=i[r]["cms-sgroup"];break}}catch(a){return t._CMLS[n].cycles>10?void e("TERMINATING. Could not retrieve cms-sgroup in a reasonable time, aborting."):(e("Googletag not ready, waiting to retry..."),t._CMLS[n].timer&&(clearTimeout(t._CMLS[n].timer),t._CMLS[n].timer=null),t._CMLS[n].timer=setTimeout(t._CMLS[n].globalize,500),void t._CMLS[n].cycles++)}e("Globalizing cms-sgroup"),t._CMLS.cGroups=t._CMLS.cGroups||[],t._CMLS.cGroups=o;var s=["cms-sgroup"].concat(t._CMLS.cGroups);t.sharedContainerDataLayer=t.sharedContainerDataLayer||[],t.corpDataLayer=t.corpDataLayer||[],e("Firing events");for(var l=0,c=s.length;c>l;l++)t.sharedContainerDataLayer.push({event:s[l]}),t.corpDataLayer.push({event:s[l]}),t._CMLS.triggerEvent(t,"cms-sgroup",s[l])}},t.googletag=t.googletag||{},t.googletag.cmd=t.googletag.cmd||[],t.googletag.cmd.push(function(){e("Googletag command queue initiated."),t._CMLS[n].globalize()}))}(window,void 0),function($,t,e){function o(){t.top._CMLS&&t.top._CMLS.logger(i+" v"+a,arguments)}function n(){function e(e){try{if(!e||!e.pid||!e.format)throw{message:"Invalid request, no PID or format given.",data:e};o("Received request for "+e.format+" with PID "+e.pid,e);var i=$.extend({},n[e.format.toLowerCase()],e);o("Injecting",i),t._ttf=t._ttf||[],t._ttf.push(i),$("#cmlsTeadsTag").remove(),function(t){var e,o=t.getElementsByTagName("script")[0];e=t.createElement("script"),e.async=!0,e.id="cmlsTeadsTag",e.src="http://cdn.teads.tv/js/all-v1.js",o.parentNode.insertBefore(e,o)}(t.document)}catch(r){o("Failed to process.",r)}}var n={inboard:{slot:".wrapper-content",filter:function(){return t.document.body.className.indexOf("home")>-1||t._CMLS.forceTeadsInBoard===!0?(o("On homepage."),!0):(o("Not on homepage."),!1)},format:"inboard",before:!0,css:"margin: auto !important; padding-top: 5px; padding-bottom: 5px; max-width: 1020px",size:{w:1020},launched:!1,components:{skip:{delay:0}},lang:"en",minSlot:0,BTF:!1},inread:{slot:".wrapper-content .column-1 .entry-content p",filter:function(){return t.document.body.className.indexOf("single-feed_posts")>-1?(o("On a post page."),!0):(o("Not on a post page."),!1)},format:"inread",before:!1,css:"padding-bottom: 10px !important;",launched:!1,components:{skip:{delay:0}},lang:"en",minSlot:0,BTF:!1}};this.process=e;var i=function(){};if(i.prototype=[],i.prototype.push=function(){for(var t=0;t<arguments.length;t++)arguments[t].format&&arguments[t].pid&&$(e(arguments[t].format,arguments[t].pid))},t._teadsinjector&&t._teadsinjector.length){o("Found existing requests, processing.",t._teadsinjector);for(var r=0;r<t._teadsinjector.length;r++)e(t._teadsinjector[r])}t._teadsinjector=new i,o("Listening for future requests.")}var i="TEADS INJECTOR",r="teadsInjector",a="0.7.14";t.teads&&delete t.teads,t._ttf&&delete t._ttf,t.top===t?t.top._CMLS.teadsRemover=function(){o("Removing Teads from top frame."),$('#cmlsTeadsTag,script[src^="http://cdn.teads"],iframe[src*="sync.teads.tv"],style[id^="tt-"]').remove(),Object.keys(t.top).forEach(function(e){(e.indexOf("teads")>-1||e.indexOf("_ttf")>-1)&&delete t.top[e]}),t.top._CMLS[r]&&delete t.top._CMLS[r]}:t.top._CMLS.teadsRemover(),t._CMLS=t._CMLS||{},t._CMLS[r]=new n,o("Initialized.")}(jQuery,window.self),function(t,e){function o(){t._CMLS.logger(n+" v"+r,arguments)}var n="PLAYER WATCH",i="playerWatch",r="0.5";return t._CMLS[i]?!1:t.TDPW?(t._CMLS[i]={initialized:!1,cache:{},timer:null,interval:2500,"const":{STOPPED:0,PLAYING:1},setDFPCriteria:function a(e,n){t.googletag=t.googletag||{},t.googletag.cmd=t.googletag.cmd||[],t.googletag.cmd.push(function(){o("Setting targeting",e,n),t.googletag.pubads().setTargeting(e,n)})},checkCurrentTrack:function s(){var e=localStorage&&JSON?JSON.parse(localStorage.getItem("tdas.controller."+t.amp_player_config.station+"."+t.amp_player_config.stream_id+".events.current-state")):!1;e&&e.data&&(e.data.stream&&"LIVE_PLAYING"===e.data.stream.code.toUpperCase()?this.setState(this["const"].PLAYING):this.setState(this["const"].STOPPED),e.data.song&&e.data.song.id&&this.hasTrackChanged(e.data.song.id)&&this.trackHasChanged(e.data.song))},setState:function l(e){return e===this["const"].PLAYING&&e!==this.cache.state?(o("Player is streaming."),this.cache.state=e,this.setDFPCriteria("td-player-state","PLAYING"),void t._CMLS.triggerEvent(t,"td-player.playing")):e===this["const"].STOPPED&&e!==this.cache.state?(o("Player is stopped."),this.cache.state=e,this.setDFPCriteria("td-player-state","STOPPED"),void t._CMLS.triggerEvent(t,"td-player.stopped")):void 0},hasTrackChanged:function c(t){return t&&t!==this.cache.trackId?!0:!1},trackHasChanged:function d(e){o("Song has changed!",e),this.cache.trackId=e.id,e.artist&&this.setDFPCriteria("td-player-artist",e.artist),e.album&&this.setDFPCriteria("td-player-album",e.album),e.title&&this.setDFPCriteria("td-player-track",e.title),this.setDFPCriteria("td-player-id",e.id),t._CMLS.triggerEvent(t,"td-player.trackchange",e)},startTimer:function p(){var t=this;clearTimeout(this.timer),this.timer=null,this.timer=setTimeout(function(){t.checkCurrentTrack(),t.startTimer()},this.interval)},init:function g(){return t.amp_player_config&&t.amp_player_config.station&&t.amp_player_config.stream_id?(this.checkCurrentTrack(),this.startTimer(),this.initialized=!0,o("Initialized!",this.cache.trackId),this):(o("Player configuration not available, exiting."),!1)}},void t._CMLS[i].init()):(o("Triton player not enabled, exiting."),!1)}(window),function(t,e){function o(){t._CMLS.logger(i+" v"+a,arguments)}function n(){if(!t._CMLS.cGroups)return void o("Init test called without cGroups available, exiting.");for(var e=0;e<t._CMLS.cGroups.length;e++)/Format\s+(NewsTalk|Talk|Sports|Christian Talk)/i.test(t._CMLS.cGroups[e])&&(o("Running initialization."),t._CMLS[r].init(),s=!0)}var i="AUTO REFRESH ADS",r="autoRefreshAds",a="0.3";if(t._CMLS=t._CMLS||{},t._CMLS.autoRefreshAdsTimer=4,t._CMLS.autoRefreshAdsTimer=t._CMLS.autoRefreshAdsTimer||8,!t._CMLS[r]){t._CMLS[r]={player:t._CMLS.whichPlayer(),timer:null,boundToRenderEvent:!1,checkConditions:function l(){return t._CMLS.isHomepage()&&t._CMLS.autoReloader&&t._CMLS.autoReloader.active?(o("Autoreloader is active, conditions fail."),!1):!0},stop:function c(){return o("Stopping timer."),clearTimeout(this.timer),this.timer=null,this},start:function d(){if(this.stop(),this.checkConditions()){o("Starting timer at "+t._CMLS.autoRefreshAdsTimer+" minutes.");var e=this;return this.timer=setTimeout(function(){e.fire()},6e4*t._CMLS.autoRefreshAdsTimer),this}},fire:function p(){if(this.checkConditions()){var e=this;t.googletag.cmd.push(function(){o("Refreshing ads."),t.googletag.pubads().refresh(),e.start()})}},init:function g(){o("Initializing."),t.googletag=t.googletag||{},t.googletag.cmd=t.googletag.cmd||[],this.player.type===t._CMLS["const"].PLAYER_TRITON&&(t.addEventListener("td-player.stopped",function(){t._CMLS[r].stop()},!1),t.addEventListener("td-player.playing",function(){t._CMLS[r].start()},!1),t.History&&t.History.Adapter&&t.History.Adapter.bind(t,"pageChange",function(){t._CMLS[r].start()})),this.player.type===t._CMLS["const"].PLAYER_TUNEGENIE&&t.tgmp&&t.TGMP_EVENTS&&t.tgmp.addEventListener(t.TGMP_EVENTS.streamplaying,function(e){return e===!0?void t._CMLS[r].start():void t._CMLS[r].stop()}),o("Listeners set, waiting for player event."),o("Timer initialized at "+t._CMLS.autoRefreshAdsTimer+" minutes.")}};var s=!1;n(),t.addEventListener("cms-sgroup",function(){s||n()},!1)}}(window),function($,t,e){function o(){t._CMLS.logger(i+" v"+a,arguments)}function n(){return o("Checking for player...",l),t._CMLS[r].isPlayerActive()?void t._CMLS[r].init():void(l>20||(setTimeout(n,1e3),l++))}var i="NAV THROUGH PLAYER",r="navThroughPlayer",a="0.1",s=t._CMLS.whichPlayer();if(!t._CMLS[r]){t._CMLS[r]={isPlayerActive:function c(){return s=t._CMLS.whichPlayer(),s.type?!0:!1},updateIframeLinks:function d(e){if(t._CMLS[r].isPlayerActive){var n=e.jquery?e:$(e);n.contents().find('a[target="_self"],a[target="_top"],a[target="_parent"]').each(function(){o("Updating links in slot.",n.prop("id")),t._CMLS[r].updateLink(this)})}},updateLink:function p(e,o){if(t._CMLS[r].isPlayerActive&&e){var n=e.jquery?e:$(e),i=t.document.createElement("a");if(i.href=n.prop("href"),0===i.href.indexOf("/")||i.hostname!==t.location.hostname&&!o)return void(i=null);n.off("."+r).on("click."+r,t._CMLS[r].clickThrough),i=null}},clickThrough:function g(e){e&&t._CMLS[r].isPlayerActive()&&(e.preventDefault(),o("Intercepting click."),t._CMLS[r].navigate(e.currentTarget.href))},navigate:function u(e){s.type===t._CMLS["const"].PLAYER_TRITON&&t.History&&(o("Navigating through Triton player.",e),t.History.pushState(null,null,e)),s.type===t._CMLS["const"].PLAYER_TUNEGENIE&&t.top.tgmp&&(o("Navigating through TuneGenie player.",e),t.top.tgmp.updateLocation(e))},init:function f(){return t._CMLS[r].isPlayerActive()?(o("Initializing."),t.googletag=t.googletag||{},t.googletag.cmd=t.googletag.cmd||[],t.googletag.cmd.push(function(){t.googletag.pubads().addEventListener("slotRenderEnded",function(e){if(e&&e.slot){var o=e.slot.getSlotElementId(),n=t.document.getElementById(o);t._CMLS[r].updateIframeLinks(n)}})}),$('iframe[id^="google_ads_iframe"],#cmlsWallpaperInjectorContainer iframe').each(function(){t._CMLS[r].updateIframeLinks(this)}),$(t).load(function(){$('iframe[id^="google_ads_iframe"],#cmlsWallpaperInjectorContainer iframe').each(function(){t._CMLS[r].updateIframeLinks(this)})}),void o("Initialized.")):void o("No player is active, exiting.")}};var l=0;n()}}(jQuery,window),function($,t,e){function o(){t._CMLS.logger(r+" v"+s,arguments)}function n(n){function i(){var t,o=document.createElement("fakeelement"),n={transition:"transitionend",OTransition:"otransitionend",MozTransition:"transitionend",WebkitTransition:"webkittransitionend",msTransition:"mstransitionend"};for(t in n)if(o.style[t]!==e)return n[t]}function r(t){var e=0,o=t.length,n,i;if(0===o)return e;for(n=0;o>n;n++)i=t.charCodeAt(n),e=(e<<5)-e+i,e&=e;return e}function a(){return S.dfpSlot=$(n.dfpSlotNode),S.injectionNode=$(n.injectionNode),S.stickNode=$(n.stickNode),S.contentNode=$(n.contentNode),S.footerNode=$(n.footerNode),S.obstructiveNode=$(n.obstructiveNode),S.window=$(t),S.document=$(t.document),s(),S}function s(){return o("Refreshing stick position."),S.stickAt=S.stickNode.length?S.stickNode.offset().top:0,S.stickAt}function l(t){if(S.container&&S.container.length)return S.container;var e=$("#"+C+"Container");if(e.length)return S.container=e,S.container;if(t===!0)return!1;o("Generating new wallpaper container."),a();var n=$("<div />",{id:C+"Container","class":C+"-container"});return S.injectionNode.prepend(n),S.container=n,c(),S.container}function c(){var t=l(),e={content:S.contentNode.css(["position","zIndex"]),footer:S.footerNode.css(["position","zIndex"])};"static"===e.content.position&&(o("Setting content area position to relative."),S.contentNode.css("position","relative")),("auto"===e.content.zIndex||e.content.zIndex<=t.css("zIndex"))&&(o("Raising content area above wallpaper container."),S.contentNode.css("zIndex",t.css("zIndex")+1)),"static"===e.footer.position&&(o("Setting footer area position to relative."),S.footerNode.css("position","relative")),S.contentNode.data("originalStyles",e.content),S.footerNode.data("originalStyles",e.footer),o("Content area has been raised.")}function d(){o("Displaying wallpaper.");var t=l();t.off(y).addClass(C+"-open"),S.obstructiveNode.hide(),f()}function p(){function t(){r=!0,S.obstructiveNode.show(),o("Clearing all event listeners."),S.window.off("."+C),n&&n.length&&(o("Removing wallpaper container."),n.off("."+C).remove()),S.container=null,e.resolve()}var e=$.Deferred(),n=l(!0),i=n&&n.length?n.hasClass(C+"-open"):!1,r=!1;return o("RESET!"),n&&n.length?(n.off(y).removeData().removeProp("data").css("backgroundColor","rgba(0,0,0,0)").removeClass(C+"-open").removeClass(C+"-fixed"),o("Container is closing."),y&&i&&n.on(y,function(e){"opacity"===e.originalEvent.propertyName&&(o("Transition complete."),t())}),setTimeout(function(){r||t()},800)):t(),o("Returning our promise."),e.promise()}function g(){var t=l();return t.hasClass(C+"-fixed")}function u(t){var e=l();g()&&t===!1&&(o("Unfixing wallpaper position."),e.removeClass(C+"-fixed").css("top","0")),g()||t!==!0||(o("Fixing wallpaper position."),s(),e.addClass(C+"-fixed").css("top",S.stickAt))}function f(){function t(){var t=S.window.scrollTop(),e=S.injectionNode.length?S.injectionNode.offset().top:0;return e<t+S.stickAt?!0:!1}o("Initializing scroll tracking."),s(),u(t()?!0:!1),S.window.on("scroll."+C,L(function(){return t()?void u(!0):void u(!1)},50)),S.window.on("resize."+C,v(function(){s()},500)),o("Scroll tracking enabled.")}function h(){try{if($(n.contentNode).height()<200)return o("Content node is not ready, retrying."),void setTimeout(function(){h()},500);a(),o("Processing wallpaper slot.");var e=S.dfpSlot.find("iframe"),i=e.contents().find("#google_image_div,body").first(),s=i.find("a:first"),c=i.find("img.img_ad:first,img:first").first(),g=c.prop("alt");if(o("Checking image."),!c.length)return o("No image found in ad slot! Resetting."),void p();var u=l(),f=r((s.length?s.prop("href")+s.prop("target"):"")+c.prop("src"));if(o("Generated hash.",f),f===u.data("hash"))return void o("Requested wallpaper is already set.");o("Getting background color.",g);var m="rgba(255,255,255,0)",_=g.match(/(\#[A-Za-z0-9]+)/)||!1;_&&_.length>1&&(m=_[1]),o("Using background color.",m),p().then(function(){o("Building the new wallpaper.");var e="";s.length&&(e=$("<a />",{href:s.prop("href"),target:s.prop("target")}),t._CMLS.navThroughPlayer&&t._CMLS.navThroughPlayer.updateLink(e[0]));var n=$("<iframe />",{name:C+"Iframe",scrolling:"no",marginWidth:"0",marginHeight:"0",frameborder:"0"});o("Injecting iframe into container."),u=l(),u.data("hash",f).css("backgroundColor",m).append(n);var i='<style>html,body{background:transparent;margin:0;padding:0;width:100%;height:100%;}body{background:url("'+c.prop("src")+'") no-repeat top center;}a{display:block;width:100%;height:100%;text-decoration:none;}</style>';n.load(function(){o("Injecting wallpaper into iframe."),n.contents().find("body").append(i,e)}).prop("src","about:blank"),c.length?(o("Initializing preloader."),$("<img />").bind("load",function(){d(),$(this).remove()}).prop("src",c.prop("src"))):d()})}catch(L){console.log("WTF PEOPLE",L)}}function m(t){var e=t.slot.getTargeting("pos");return e.indexOf("wallpaper-ad")>-1?(o("Caught render event for wallpaper-ad",t.slot.getSlotElementId()),t.isEmpty?(o("Slot was empty, resetting wallpaper container."),p()):(o("Slot contained an ad, processing wallpaper."),h()),!1):void 0}function _(){$(t).off("."+C)}var S={},C=n.nameSpace||"wallpaperInjector",L=t._CMLS.throttle,v=t._CMLS.debounce,y=i();this.reset=p,this.process=h,this.unbindAllListeners=_,o("Initializing."),t.googletag=t.googletag||{},t.googletag.cmd=t.googletag.cmd||[],t.googletag.cmd.push(function(){t.googletag.pubads().addEventListener("slotRenderEnded",function(t){v(m(t),1e3)})});var M='<style id="'+C+'Styles">.'+C+"-container {display: block !important;position: absolute;z-index: 0;top: 0;left: 0;height: 0 !important;width: 100% !important;overflow: hidden;text-align: center;transition: opacity 0.5s, height 0.6s, background-color 0.4s;opacity: 0;}."+C+"-container iframe {border: 0;height: 100%;width: 100%;}."+C+"-container ~ .grid-container {transition: box-shadow 0.6s}."+C+"-open {height: 100% !important;opacity: 1;}."+C+"-open ~ .grid-container {box-shadow: 0 0 20px rgba(0,0,0,0.3);}."+C+"-fixed {position: fixed;}"+n.dfpSlotNode+" {display: none !important;}</style>";t.document.getElementById(C+"Styles")||$("head").append(M),"complete"===t.document.readyState||"loaded"===t.document.readyState?h():$(function(){h()})}var i={dfpSlotNode:"#div-gpt-ad-1418849849333-16",injectionNode:".wrapper-content",stickNode:".wrapper-header",contentNode:".wrapper-content .grid-container:first",footerNode:".wrapper-footer",obstructiveNode:".takeover-left, .takeover-right, .skyscraper-left, .skyscraper-right"},r="WALLPAPER INJECTOR",a="wallpaperInjector",s="0.5";t._CMLS[a],i.nameSpace=a,t._CMLS[a]=new n(i)}(jQuery,window),function($,t,e){function o(){s.logger(i+" v"+a,arguments)}function n(){var e=t.top.googletag||{};e.cmd=e.cmd||[],e.cmd.push(function(){$(function(){if($("#CMLSPlayerSponsorship").length)return void o("Container already exists, exiting.");o("Discovering local site ad path.");var t=null;try{var n=e.pubads(),i=Object.getOwnPropertyNames(n);for(var r in i){var a=n[i[r]];if(a.constructor&&a.constructor===Array)for(var l in a[0])if(a[0][l]&&a[0][l].constructor===String&&a[0][l].indexOf("/6717/")>-1){t=a[0][l];break}if(t)break}if(null===t)throw{message:"Could not retrieve ad unit path."}}catch(c){return void o("Failed to retrieve DFP properties.",c)}o("Ad path found, defining new slot.",t);var d=e.defineSlot(t,[[120,60]],"CMLSPlayerSponsorship");d&&d.addService(e.pubads()).setCollapseEmptyDiv(!0).setTargeting("pos","playersponsorlogo"),$("body").append('<style id="CMLSPlayerSponsorshipStyle">#CMLSPlayerSponsorship {position: fixed;z-index: 2147483647;width: 120px;height: 60px;}#CMLSPlayerSponsorship.cmls-player-tg {left: 50%;transform: translate(-520px, 0);}#CMLSPlayerSponsorship.cmls-player-triton {left: 50%;transform: translate(30px, 0);}#CMLSPlayerSponsorship.cmls-player-pos-bottom {bottom: 10px;}#CMLSPlayerSponsorship.cmls-player-pos-top {top: 10px;}#CMLSPlayerSponsorship.cmls-player-triton.cmls-player-pos-top {top: 5px;}@media (max-width: 75rem) {#CMLSPlayerSponsorship.cmls-player-tg {left: 80px;transform: translate(0,0);}}@media (max-width: 1042px) {#CMLSPlayerSponsorship.cmls-player-tg {display: none}}@media (max-width: 800px) {#CMLSPlayerSponsorship.cmls-player-triton {display: none}}</style>');var p=$('<div id="CMLSPlayerSponsorship"><script>googletag.cmd.push(function() { googletag.display("CMLSPlayerSponsorship")});</script></div>'),g=s.whichPlayer();g.position===s["const"].PLAYER_POSITION_TOP&&p.addClass("cmls-player-pos-top"),g.position===s["const"].PLAYER_POSITION_BOTTOM&&p.addClass("cmls-player-pos-bottom"),g.type===s["const"].PLAYER_TRITON&&p.addClass("cmls-player-triton"),g.type===s["const"].PLAYER_TUNEGENIE&&p.addClass("cmls-player-tg"),$("body").append(p),o("Slot initialized.")})})}var i="PLAYER SPONSOR INJECTOR",r="playerSponsorInjector",a="0.1",s=t._CMLS;if(t.self!==t.top)return void $(function(){t.parent._CMLSPlayerSponsorshipInit=t.parent._CMLSPlayerSponsorshipInit||[],t.parent._CMLSPlayerSponsorshipInit.push(1)});var l=function(){};l.prototype=[],l.prototype.push=function(){n()},t.self._CMLSPlayerSponsorshipInit=new l,$(n()),s[r]=a}(window.top.jQuery,window),function(t,e){function o(){t._CMLS.logger(i+" v"+r,arguments)}function n(){function e(){return l.type===t._CMLS["const"].PLAYER_TUNEGENIE&&t.page_frame?t.page_frame.document.querySelector(r.condition):t.document.querySelector(r.condition)}function n(t){return new Date(Date.now()+t)}var i={condition:"body.home",timeout:8},r=i,a,s,l=t._CMLS.whichPlayer(),c=this;this.start=function(t){return o("Starting timer.",t),c.stop(),r={condition:t.condition||i.condition,timeout:t.timeout||i.timeout},e()?(s=n(6e4*r.timeout),o("Starting countdown, reloading at "+s),void(a=setInterval(c.tick,1e4))):void o("Condition check failed at start.")},this.stop=function(){a&&(o("Stopping timer."),clearInterval(a),a=null)},this.tick=function(){Date.now()>s.getTime()&&c.fire()},this.fire=function(){return c.stop(),e()?(o("Reloading page."),l.type===t._CMLS["const"].PLAYER_TRITON&&t.History&&t.History.Adapter?void t.History.Adapter.trigger(t,"statechange"):l.type===t._CMLS["const"].PLAYER_TUNEGENIE?void t.tgmp.updateLocation(t.location.href):void t.location.reload()):void o("Condition check failed before firing, timer stopped.")},this.push=function(t){o("Received request.",t),c.start(t)}}var i="AUTO-RELOAD PAGE",r="0.9",a;t._CMLS.autoReload&&t._CMLS.autoReload.constructor===Array&&t._CMLS.autoReload.length&&(o("Loaded with request.",t._CMLS.autoReload),a=t._CMLS.autoReload[t._CMLS.autoReload.length-1]),t._CMLS.autoReload&&t._CMLS.autoReload.constructor!==Array||(t._CMLS.autoReload=new n),o("Initialized."),a&&t._CMLS.autoReload.push(a)}(window.top),function($,t,e){function o(){t.top._CMLS.logger(i+" v"+a,arguments)}function n(){o("Building layer."),t.self.addthis&&t.self.addthis.layers?t.self.addthis.layers({share:{position:"left",offset:{bottom:"100px"},services:"facebook,twitter,tumblr,email,more"}},function(){t.self.addthis.layers.refresh(),o("Layer built.")}):o("Addthis not available!")}var i="ADDTHIS INJECTOR",r="addThisInjector",a="0.6.2",s="ra-55dc79597bae383e";if(t.self.addthis&&t.self.addthis_config&&t.self.addthis_config.pubid&&t.self.addthis_config.pubid!==s)return void o("AddThis already loaded by local page.");var l=["addthis","addthis_config","addthis_share","_adr","_atc","_atd","_ate","_atr","_atw"];if(t.self!==t.top){o("Not top window."),t.top.addthisDestroyer&&t.top.addthisDestroyer();for(var c in l)try{delete t.self[l[c]]}catch(d){o(d)}}else o("Loaded in top window."),t.top.addthisDestroyer=function(){o("Removing addthis from top window."),$('script[src*="addthis"]').remove(),t.top.addthis&&t.top.addthis.layers(function(e){o("Destroying addthis layer in top window."),e.destroy(),$(".addthis-smartlayers").remove();for(var n in l)try{delete t.top[l[n]]}catch(i){o(i)}})};if(t.self.NO_ADDTHIS_HERE)return void o("NO_ADDTHIS_HERE found, will not build.");if(t.top._CMLS.isHomepage(t.self))return void o("Will not build on homepage, exiting.");t.self.addthis_config=t.self.addthis_config||{},t.self.addthis_config.pubid=s;var p=t.self.document.createElement("script");p.onload=function(){n()},p.src="//s7.addthis.com/js/300/addthis_widget.js#async=1",p.id=r+"-script",p.async=!0,t.self.document.head.appendChild(p),o("Injected.")}(jQuery,window),function($,t,e){function o(){a.logger(n+" v"+r,arguments)}var n="BREAKING NEWS BAR",i="BreakingNews",r="0.7",a=t._CMLS||{};Array.isArray||(Array.isArray=function(t){return"[object Array]"===Object.prototype.toString.call(t)}),a[i]=function(e,n){o("Called",typeof e,e,n);var r={classPrefix:"cmlsBreakingNews",additionalClass:"",position:"above",link:"",target:"_top",beforeText:"Breaking News:",text:"",background:"#900",color:"#fff"},s,l=".wrapper-header";if($(l).length){if("object"!=typeof e||Array.isArray(e))if("object"==typeof e&&Array.isArray(e)&&e.length)s=r,s.text=e[0],e.length>1&&(n=e[1]),o("Basic mode!");else{if("object"==typeof e)return void o("Invalid usage!",e,n);s=r,s.text=e,o("Basic mode!")}else s=$.extend({},r,e),o("Advanced mode!");!s.link&&n&&(s.link=n),o("Settings:",s);var c="."+s.classPrefix+"-container { display: block; box-sizing: border-box; position: relative; float: none; overflow: hidden; z-index: 10; padding: 1em; color: #fff; background: #900; box-shadow: 0 0 10px rgba(0,0,0,0.4); font-size: 14px; line-height: 1.2; text-decoration: none; outline: 0 }."+s.classPrefix+"-container > a { display: block; color: inherit !important; cursor: pointer; padding: 1em; margin: -1em; }."+s.classPrefix+"-container > a:hover ."+s.classPrefix+"-before { text-decoration: underline; }."+s.classPrefix+"-inner { box-sizing: border-box; max-width: 1020px; margin: 0 auto; }."+s.classPrefix+"-before { float: left; font-weight: bold; margin-right: .5em; }."+s.classPrefix+"-text { overflow: hidden; }."+s.classPrefix+"-inner a { text-decoration: underline !important; color: inherit; }@media (max-width: 500px) {."+s.classPrefix+"-before { float: none; margin-bottom: .25em; }}",d='<div class="'+s.classPrefix+'-container"><div class="'+s.classPrefix+'-inner">{{BEFORE}}<div class="'+s.classPrefix+'-text">{{TEXT}}</div></div></div>';if(s.beforeText&&s.beforeText.length){var p='<div class="'+s.classPrefix+'-before">'+s.beforeText+"</div>";d=d.replace("{{BEFORE}}",p)}if(d=$(d.replace("{{TEXT}}",s.text)),s.link&&s.link.length){var g=$("<a></a>").prop({href:s.link,target:s.target});d.wrapInner(g)}d.css({background:s.background,color:s.color}),d.addClass(s.additionalClass).prop("id","CMLS"+i+"-"+Math.floor(1e7*Math.random())),$("#cmlsBreakingNewsStyles").length||$("head").append('<style id="cmlsBreakingNewsStyles">/* CMLS Breaking News Bar styles */\n'+c+"</style>"),"below"===s.position?$(l).after(d):$(l).before(d),a.navThroughPlayer&&(o("Applying navThroughPlayer to bar links."),d.find('a:not([href]),a[target="_self"],a[target="_top"],a[target="_parent"]').each(function(){o("Applying navThroughPlayer to a link.",this.href),a.navThroughPlayer.updateLink($(this))})),"above"===s.position&&(t.DO_NOT_AUTO_SCROLL=!0)}};var s=function(){};s.prototype=[],s.prototype.push=function(){o("Received after-load request.",arguments),a[i].apply(null,arguments)},t["_CMLS"+i]&&t["_CMLS"+i].length&&t["_CMLS"+i].forEach(a[i]),t["_CMLS"+i]=new s}(jQuery,window),function($,t,e){function o(){t._CMLS.logger(n+" v"+r,arguments)}var n="SOCIAL LISTEN LIVE LINK",i="socialListenLiveLink",r="0.1";return t._CMLS=t._CMLS||{},o("Starting..."),t._CMLS[i]?void o("Already loaded, exiting."):t.tgmp?($(function(){o("Locating Listen Live button.");var e=$('.social-icons img[title="Listen Live!!"],.social-icons-container img[title="Listen Live!!"]').parent("a");return e.length?(e.click(function(e){t.tgmp?(e.preventDefault(),o("Playing stream..."),t.tgmp.playStream()):o("TuneGenie player not enabled.")}),void o("Social Listen Live button activated.")):void o("Could not locate Listen Live button in social icons.")}),t._CMLS[i]=r,void o("Initialized.")):void o("TuneGenie player not enabled, exiting.")}(jQuery,window);
//# sourceMappingURL=./compiled-allsites-min.js.map