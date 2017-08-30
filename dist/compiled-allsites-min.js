!function(t,e){t.self!==t.top?t._CMLS={}:t._CMLS=t._CMLS||{},t._CMLS.LOADED||(t._CMLS.const=t._CMLS.const||{},t._CMLS.const.PLAYER_TUNEGENIE=8471,t._CMLS.const.PLAYER_TRITON=8468,t._CMLS.const.PLAYER_POSITION_TOP=80847980,t._CMLS.const.PLAYER_POSITION_BOTTOM=80667984,t._CMLS.logger=function e(){if(!t._CMLS||!t._CMLS.debug||"object"!=typeof console||!console.groupCollapsed)return!1;t._CMLS.loggerNamesToColors=t._CMLS.loggerNamesToColors||{};var o,n,i=arguments[0],r=[].slice.call(arguments[1]);t._CMLS.loggerNamesToColors[i]?(o=t._CMLS.loggerNamesToColors[i].background,n=t._CMLS.loggerNamesToColors[i].complement):(o=("000000"+Math.floor(16777215*Math.random()).toString(16)).slice(-6),n=parseInt(o,16)>=12303291?"000000":"FFFFFF",t._CMLS.loggerNamesToColors[i]={background:o,complement:n});var a=new Date;a=a.toISOString()?a.toISOString():a.toUTCString(),r=["%c["+i+"]","background: #"+o+"; color: #"+n].concat(r),t.top.console.groupCollapsed.apply(t.top.console,r),t.top.console.log("TIMESTAMP:",a),t.top.console.trace(),t.top.console.groupEnd()},t._CMLS.now=Date.now||function(){return(new Date).getTime()},t._CMLS.throttle=function(e,o,n){var i,r,a,s=null,l=0;n||(n={});var c=function(){l=!1===n.leading?0:t._CMLS.now(),s=null,a=e.apply(i,r),s||(i=r=null)};return function(){var d=t._CMLS.now();l||!1!==n.leading||(l=d);var p=o-(d-l);return i=this,r=arguments,p<=0||p>o?(s&&(clearTimeout(s),s=null),l=d,a=e.apply(i,r),s||(i=r=null)):s||!1===n.trailing||(s=setTimeout(c,p)),a}},t._CMLS.debounce=function(e,o,n){var i,r,a,s,l,c=function(){var d=t._CMLS.now()-s;d<o&&d>=0?i=setTimeout(c,o-d):(i=null,n||(l=e.apply(a,r),i||(a=r=null)))},d=function(){a=this,r=arguments,s=t._CMLS.now();var d=n&&!i;return i||(i=setTimeout(c,o)),d&&(l=e.apply(a,r),a=r=null),l};return d.clear=function(){clearTimeout(i),i=a=r=null},d},t._CMLS.whichPlayer=function(){if(t._CMLS.whichPlayerCache)return t._CMLS.whichPlayerCache;var e={type:null,position:null};return t.tgmp?(t._CMLS.logger("COMMON",["Found TuneGenie player."]),e.type=t._CMLS.const.PLAYER_TUNEGENIE,t.tgmp.options.position&&"bottom"===t.tgmp.options.position.toLowerCase()?(t._CMLS.logger("COMMON",["TuneGenie player is on the bottom."]),e.position=t._CMLS.const.PLAYER_POSITION_BOTTOM):t.tgmp.options.position&&"top"===t.tgmp.options.position.toLowerCase()&&(t._CMLS.logger("COMMON",["TuneGenie player is on the top."]),e.position=t._CMLS.const.PLAYER_POSITION_TOP)):t.TDPW&&(t._CMLS.logger("COMMON",["Found Triton player, assuming it's on top."]),e.type=t._CMLS.const.PLAYER_TRITON,e.position=t._CMLS.const.PLAYER_POSITION_TOP),t._CMLS.whichPlayerCache=e,t._CMLS.whichPlayerCache},t._CMLS.isHomepage=function(e){return e||(e=t),"/"===e.location.pathname&&!1===/[\?&]?p=/i.test(e.location.search)},t._CMLS.triggerEvent=function(e,o,n){var i;t.document.createEvent?(i=t.document.createEvent("CustomEvent"),i.initCustomEvent(o,!0,!0,n)):i=new CustomEvent(o,{detail:n}),e.dispatchEvent(i)},t._CMLS.logger("COMMON",["LIBRARY LOADED!\n                           .__                \n  ____  __ __  _____  __ __|  |  __ __  ______\n_/ ___\\|  |  \\/     \\|  |  \\  | |  |  \\/  ___/\n\\  \\___|  |  /  Y Y  \\  |  /  |_|  |  /___ \\ \n \\___  >____/|__|_|  /____/|____/____//____  >\n     \\/            \\/                      \\/ \n"]),t._CMLS.LOADED=!0)}(window),function(t){function e(){t._CMLS.logger(o+" v"+i,arguments)}var o="GLOBALIZE SGROUPS",n="globalizeSGroups",i="0.5";t._CMLS[n]||(t._CMLS[n]={cycles:0,timer:null,globalize:function o(){var i;try{if(!t.googletag||!t.googletag.pubads())throw{message:"Googletag not yet ready."};var r=t.googletag.pubads();for(var a in r)if(r[a].hasOwnProperty("cms-sgroup")){i=r[a]["cms-sgroup"];break}}catch(o){return t._CMLS[n].cycles>10?void e("TERMINATING. Could not retrieve cms-sgroup in a reasonable time, aborting."):(e("Googletag not ready, waiting to retry..."),t._CMLS[n].timer&&(clearTimeout(t._CMLS[n].timer),t._CMLS[n].timer=null),t._CMLS[n].timer=setTimeout(t._CMLS[n].globalize,500),void t._CMLS[n].cycles++)}e("Globalizing cms-sgroup"),t._CMLS.cGroups=t._CMLS.cGroups||[],t._CMLS.cGroups=i;var s=["cms-sgroup"].concat(t._CMLS.cGroups);t.sharedContainerDataLayer=t.sharedContainerDataLayer||[],t.corpDataLayer=t.corpDataLayer||[],e("Firing events");for(var l=0,c=s.length;l<c;l++)t.sharedContainerDataLayer.push({event:s[l]}),t.corpDataLayer.push({event:s[l]}),t._CMLS.triggerEvent(t,"cms-sgroup",s[l])}},t.googletag=t.googletag||{},t.googletag.cmd=t.googletag.cmd||[],t.googletag.cmd.push(function(){e("Googletag command queue initiated."),t._CMLS[n].globalize()}))}(window,void 0),function($,t,e){function o(){t.top._CMLS&&t.top._CMLS.logger&&t.top._CMLS.logger(r+" v"+a,arguments)}function n(){return t.document.querySelector("body.home")?(o("On Homepage."),!0):(o("Not on Homepage."),!1)}function i(){function e(e){try{if(!e||!e.pid||!e.format)throw{message:"Invalid request, no PID or format given.",data:e};o("Received request for "+e.format.toUpperCase()+" with PID "+e.pid,e,i[e.format.toLowerCase()]);var n=$.extend({},i[e.format.toLowerCase()],e);o("Injecting",n),"function"==typeof n.slot&&(n.slot=n.slot()),t._ttf=t._ttf||[],t._ttf.push(n),$('script[src*="teads.tv"],iframe[src*="teads.tv"]').remove(),function(t){var e,o=t.getElementsByTagName("script")[0];e=t.createElement("script"),e.async=!0,e.id="cmlsTeadsTag",e.src="//cdn.teads.tv/media/format.js",o.parentNode.insertBefore(e,o)}(t.document)}catch(t){o("Failed",t)}}var i={inboard:{slot:function(){return t.document.querySelectorAll(".wrapper-content")[0]||!1},filter:function(){return!(!n()&&!0!==t._CMLS.forceTeadsInBoard)},format:"inboard",before:!0,css:"margin: auto !important; padding-top: 5px; padding-bottom: 5px; max-width: 1020px;",size:{w:1020},launched:!1,components:{skip:{delay:0}},lang:"en",minSlot:0,BTF:!1},inread:{slot:function(){var e=t.document.querySelectorAll(".wrapper-content .column-1 .entry-content > p");return e[2]||e[e.length]},filter:!n(),before:!1,css:"margin: 10px auto !important; max-width: 90%;",launched:!1,components:{skip:{delay:0}},lang:"en",minSlot:0,BTF:!1}};this.process=e,o("Initializing _teadsinjector array handlers.");var r=function(){};if(r.prototype=[],r.prototype.push=function(){for(var t=0;t<arguments.length;t++)arguments[t].format&&arguments[t].pid&&$(e(arguments[t]))},t._teadsinjector&&t._teadsinjector.length){o("Found existing requests, processing.",t._teadsinjector);for(var a=0;a<t._teadsinjector.length;a++)e(t._teadsinjector[a])}t._teadsinjector=new r,o("Listening for future requests.")}var r="TEADS INJECTOR",a="0.7.16";$('script[src*="teads.tv"],iframe[src*="teads.tv"]').remove(),t._CMLS=t._CMLS||{},t._CMLS.teadsInjector=new i,o("Initialized.")}(jQuery,window.self),function(t,e){function o(){t._CMLS.logger(n+" v"+r,arguments)}var n="PLAYER WATCH",i="playerWatch",r="0.5";!t._CMLS[i]&&(t.TDPW?(t._CMLS[i]={initialized:!1,cache:{},timer:null,interval:2500,const:{STOPPED:0,PLAYING:1},setDFPCriteria:function e(n,i){t.googletag=t.googletag||{},t.googletag.cmd=t.googletag.cmd||[],t.googletag.cmd.push(function(){o("Setting targeting",n,i),t.googletag.pubads().setTargeting(n,i)})},checkCurrentTrack:function e(){var o=!(!localStorage||!JSON)&&JSON.parse(localStorage.getItem("tdas.controller."+t.amp_player_config.station+"."+t.amp_player_config.stream_id+".events.current-state"));o&&o.data&&(o.data.stream&&"LIVE_PLAYING"===o.data.stream.code.toUpperCase()?this.setState(this.const.PLAYING):this.setState(this.const.STOPPED),o.data.song&&o.data.song.id&&this.hasTrackChanged(o.data.song.id)&&this.trackHasChanged(o.data.song))},setState:function e(n){return n===this.const.PLAYING&&n!==this.cache.state?(o("Player is streaming."),this.cache.state=n,this.setDFPCriteria("td-player-state","PLAYING"),void t._CMLS.triggerEvent(t,"td-player.playing")):n===this.const.STOPPED&&n!==this.cache.state?(o("Player is stopped."),this.cache.state=n,this.setDFPCriteria("td-player-state","STOPPED"),void t._CMLS.triggerEvent(t,"td-player.stopped")):void 0},hasTrackChanged:function t(e){return!(!e||e===this.cache.trackId)},trackHasChanged:function e(n){o("Song has changed!",n),this.cache.trackId=n.id,n.artist&&this.setDFPCriteria("td-player-artist",n.artist),n.album&&this.setDFPCriteria("td-player-album",n.album),n.title&&this.setDFPCriteria("td-player-track",n.title),this.setDFPCriteria("td-player-id",n.id),t._CMLS.triggerEvent(t,"td-player.trackchange",n)},startTimer:function t(){var e=this;clearTimeout(this.timer),this.timer=null,this.timer=setTimeout(function(){e.checkCurrentTrack(),e.startTimer()},this.interval)},init:function e(){return t.amp_player_config&&t.amp_player_config.station&&t.amp_player_config.stream_id?(this.checkCurrentTrack(),this.startTimer(),this.initialized=!0,o("Initialized!",this.cache.trackId),this):(o("Player configuration not available, exiting."),!1)}},t._CMLS[i].init()):o("Triton player not enabled, exiting."))}(window),function(t,e){function o(){l._CMLS&&l._CMLS.hasOwnProperty("logger")&&l._CMLS.logger(i+" v"+a,arguments)}function n(){if(o("InitTest called."),!p){if(!s._CMLS.cGroups)return void o("Init test called without cGroups available, exiting.");for(var t=0,e=s._CMLS.cGroups.length;t<e;t++)/Format\s+(NewsTalk|Talk|Sports|Christian Talk)/i.test(s._CMLS.cGroups[t])&&(o("Valid cGroup found, initializing timer."),l._CMLS[r]=new d,p=!0)}}var i="AUTO REFRESH ADS",r="autoRefreshAds",a="0.4.15",s=t,l=t.top,c=t.self;if(!(s.DISABLE_AUTO_REFRESH_ADS||c.DISABLE_AUTO_REFRESH_ADS||l.DISABLE_AUTO_REFRESH_ADS)){if(s._CMLS.autoRefreshAdsTimer=c._CMLS.autoRefreshAdsTimer||4,l._CMLS&&l._CMLS.hasOwnProperty(r))return void(l._CMLS[r].checkState()&&l._CMLS[r].start());var d=function(t){function e(){if(s.tgmp){var t=l.document.querySelector("iframe#page_frame");if(t&&t.contentWindow)return t.contentWindow}return s}function n(){return!l._CMLS.autoReload||!l._CMLS.autoReload.active||(o("AutoReloadPage is active, so we will not additionally refresh page ads."),!1)}function i(){return n()?(new Date).getTime()>=_?void d():void(m=setTimeout(i,5e3)):(o("Conditions went bad while timer was running, killing timer."),void a())}function r(){return S}function a(){o("Stopping timer."),clearTimeout(m),m=null,_=null,S=!1}function c(t){a(),n()&&(_=t||new Date((new Date).getTime()+6e4*s._CMLS.autoRefreshAdsTimer),o("Starting timer, will fire at "+_.toLocaleString()),i(),S=!0)}function d(){if(!n())return o("Conditions went bad at fire timer, killing timer."),void a();var t=e();t.googletag.cmd.push(function(){o("Refreshing page ads."),t.googletag.pubads().refresh(),y.start()})}function p(){return _}function g(){_=new Date((new Date).getTime()+6e4*s._CMLS.autoRefreshAdsTimer)}function u(t){if(!0===t)return o("TG Player playing!"),void c();o("TG Player stopped."),a()}function f(){a(),l.removeEventListener("td-player.playing",c),l.removeEventListener("td-player.stopped",a)}var h=l._CMLS.whichPlayer(),m=null,_=null,S=!1,y=this;this.checkState=r,this.stop=a,this.start=c,this.getFireTime=p,this.resetFireTime=g,this.destroy=f,o("Initializing."),h.type===l._CMLS.const.PLAYER_TRITON&&(l.addEventListener("td-player.playing",c,!1),l.addEventListener("td-player.stopped",a,!1),s.History&&s.History.Adapter&&s.History.Adapater.bind(s,"pageChange",g),o("Triton Player listeners set.")),h.type===l._CMLS.const.PLAYER_TUNEGENIE&&l.tgmp&&l.TGMP_EVENTS&&(l.tgmp.addEventListener(l.TGMP_EVENTS.streamplaying,u),o("TG Player listener set.")),o("Listeners set."),t&&(o("Initialized with a time to fire, using it."),c(t))},p=!1;n(),p||(s.addEventListener("cms-sgroup",function(){p||n()},!1),o("Waiting for cGroups"))}}(window),function($,t,e){function o(){t._CMLS.logger(i+" v"+a,arguments)}function n(){if(o("Checking for player...",l),t._CMLS[r].isPlayerActive())return void t._CMLS[r].init();l>20||(setTimeout(n,1e3),l++)}var i="NAV THROUGH PLAYER",r="navThroughPlayer",a="0.1",s=t._CMLS.whichPlayer();if(!t._CMLS[r]){t._CMLS[r]={isPlayerActive:function e(){return s=t._CMLS.whichPlayer(),!!s.type},updateIframeLinks:function e(n){if(t._CMLS[r].isPlayerActive){var i=n.jquery?n:$(n);if(n.getAttribute("src")&&(n.getAttribute("src").indexOf(t.location.hostname)<0||n.getAttribute("src").indexOf("/safeframe/")>0))return void o("Ad iframe is in a safeframe, cannot update.",n);try{i.contents().find('a[target="_self"],a[target="_top"],a[target="_parent"]').each(function(){o("Updating links in slot.",i.prop("id")),t._CMLS[r].updateLink(this)})}catch(t){o("Could not update links in given iframe",n,t)}}},updateLink:function e(o,n){if(t._CMLS[r].isPlayerActive&&o){var i=o.jquery?o:$(o),a=t.document.createElement("a");if(a.href=i.prop("href"),0===a.href.indexOf("/")||a.hostname!==t.location.hostname&&!n)return void(a=null);i.off("."+r).on("click."+r,t._CMLS[r].clickThrough),a=null}},clickThrough:function e(n){n&&t._CMLS[r].isPlayerActive()&&(n.preventDefault(),o("Intercepting click."),t._CMLS[r].navigate(n.currentTarget.href))},navigate:function e(n){s.type===t._CMLS.const.PLAYER_TRITON&&t.History&&(o("Navigating through Triton player.",n),t.History.pushState(null,null,n)),s.type===t._CMLS.const.PLAYER_TUNEGENIE&&t.top.tgmp&&(o("Navigating through TuneGenie player.",n),t.top.tgmp.updateLocation(n))},init:function e(){if(!t._CMLS[r].isPlayerActive())return void o("No player is active, exiting.");o("Initializing."),t.googletag=t.googletag||{},t.googletag.cmd=t.googletag.cmd||[],t.googletag.cmd.push(function(){t.googletag.pubads().addEventListener("slotRenderEnded",function(e){if(e&&e.slot){var o=e.slot.getSlotElementId(),n=t.document.getElementById(o);t._CMLS[r].updateIframeLinks(n)}})}),$('iframe[id^="google_ads_iframe"],#cmlsWallpaperInjectorContainer iframe').each(function(){t._CMLS[r].updateIframeLinks(this)}),$(t).load(function(){$('iframe[id^="google_ads_iframe"],#cmlsWallpaperInjectorContainer iframe').each(function(){t._CMLS[r].updateIframeLinks(this)})}),o("Initialized.")}};var l=0;n()}}(jQuery,window),function($,t,e){function o(){t._CMLS.logger(r+" v"+s,arguments)}function n(n){function i(){var t,o=document.createElement("fakeelement"),n={transition:"transitionend",OTransition:"otransitionend",MozTransition:"transitionend",WebkitTransition:"webkittransitionend",msTransition:"mstransitionend"};for(t in n)if(o.style[t]!==e)return n[t]}function r(t){var e=0,o=t.length,n,i;if(0===o)return e;for(n=0;n<o;n++)i=t.charCodeAt(n),e=(e<<5)-e+i,e&=e;return e}function a(){return S.dfpSlot=$(n.dfpSlotNode),S.injectionNode=$(n.injectionNode),S.stickNode=$(n.stickNode),S.contentNode=$(n.contentNode),S.footerNode=$(n.footerNode),S.obstructiveNode=$(n.obstructiveNode),S.window=$(t),S.document=$(t.document),s(),S}function s(){return o("Refreshing stick position."),S.stickAt=S.stickNode.length?S.stickNode.offset().top:0,S.stickAt}function l(t){if(S.container&&S.container.length)return S.container;var e=$("#"+L+"Container");if(e.length)return S.container=e,S.container;if(!0===t)return!1;o("Generating new wallpaper container."),a();var n=$("<div />",{id:L+"Container",class:L+"-container"});return S.injectionNode.prepend(n),S.container=n,c(),S.container}function c(){var t=l(),e={content:S.contentNode.css(["position","zIndex"]),footer:S.footerNode.css(["position","zIndex"])};"static"===e.content.position&&(o("Setting content area position to relative."),S.contentNode.css("position","relative")),("auto"===e.content.zIndex||e.content.zIndex<=t.css("zIndex"))&&(o("Raising content area above wallpaper container."),S.contentNode.css("zIndex",t.css("zIndex")+1)),"static"===e.footer.position&&(o("Setting footer area position to relative."),S.footerNode.css("position","relative"),S.footerNode.css("zIndex",t.css("zIndex")+2)),S.contentNode.data("originalStyles",e.content),S.footerNode.data("originalStyles",e.footer),o("Content area has been raised.")}function d(){o("Displaying wallpaper."),l().off(M).addClass(L+"-open"),S.obstructiveNode.hide(),f()}function p(){function t(){r=!0,S.obstructiveNode.show(),o("Clearing all event listeners."),S.window.off("."+L),n&&n.length&&(o("Removing wallpaper container."),n.off("."+L).remove()),S.container=null,e.resolve()}var e=$.Deferred(),n=l(!0),i=!(!n||!n.length)&&n.hasClass(L+"-open"),r=!1;return o("RESET!"),n&&n.length?(n.off(M).removeData().removeProp("data").css("backgroundColor","rgba(0,0,0,0)").removeClass(L+"-open").removeClass(L+"-fixed"),o("Container is closing."),M&&i&&n.on(M,function(e){"opacity"===e.originalEvent.propertyName&&(o("Transition complete."),t())}),setTimeout(function(){r||t()},800)):t(),o("Returning our promise."),e.promise()}function g(){return l().hasClass(L+"-fixed")}function u(t){var e=l();g()&&!1===t&&(o("Unfixing wallpaper position."),e.removeClass(L+"-fixed").css("top","0")),g()||!0!==t||(o("Fixing wallpaper position."),s(),e.addClass(L+"-fixed").css("top",S.stickAt))}function f(){function t(){var t=S.window.scrollTop();return(S.injectionNode.length?S.injectionNode.offset().top:0)<t+S.stickAt}o("Initializing scroll tracking."),s(),u(t()?!0:!1),S.window.on("scroll."+L,v(function(){if(t())return void u(!0);u(!1)},50)),S.window.on("resize."+L,C(function(){s()},500)),o("Scroll tracking enabled.")}function h(){try{if($(n.contentNode).height()<200)return y===e&&(y=20),0===y?(o("Timed out waiting for content node."),void(y=e)):(y--,o("Content node is not ready, retrying.",y),void setTimeout(function(){h()},500));a(),o("Processing wallpaper slot.");var i=S.dfpSlot.find("iframe"),s=i.contents().find("#google_image_div,body").first(),c=s.find("a:first"),g=s.find("img.img_ad:first,img:first").first(),u=g.prop("alt");if(o("Checking image."),!g.length)return o("No image found in ad slot! Resetting."),void p();var f=l(),m=r((c.length?c.prop("href")+c.prop("target"):"")+g.prop("src"));if(o("Generated hash.",m),m===f.data("hash"))return void o("Requested wallpaper is already set.");o("Getting background color.",u);var _="rgba(255,255,255,0)",v=u.match(/(\#[A-Za-z0-9]+)/)||!1;v&&v.length>1&&(_=v[1]),o("Using background color.",_),p().then(function(){o("Building the new wallpaper.");var e="";c.length&&(e=$("<a />",{href:c.prop("href"),target:c.prop("target")}),t._CMLS.navThroughPlayer&&t._CMLS.navThroughPlayer.updateLink(e[0]));var n=$("<iframe />",{name:L+"Iframe",scrolling:"no",marginWidth:"0",marginHeight:"0",frameborder:"0"});o("Injecting iframe into container."),f=l(),f.data("hash",m).css("backgroundColor",_).append(n);var i='<style>html,body{background:transparent;margin:0;padding:0;width:100%;height:100%;}body{background:url("'+g.prop("src")+'") no-repeat top center;}'+(g.prop("alt").indexOf("contain")>-1?"body{background-size:100%}":"")+"a{display:block;width:100%;height:100%;text-decoration:none;}</style>";n.load(function(){o("Injecting wallpaper into iframe."),n.contents().find("body").append(i,e)}).prop("src","about:blank"),g.length?(o("Initializing preloader."),$("<img />").bind("load",function(){d(),$(this).remove()}).prop("src",g.prop("src"))):d()})}catch(t){console.log("WTF PEOPLE",t)}}function m(t){if(t.slot.getTargeting("pos").indexOf("wallpaper-ad")>-1)return o("Caught render event for wallpaper-ad",t.slot.getSlotElementId()),t.isEmpty?(o("Slot was empty, resetting wallpaper container."),p()):(o("Slot contained an ad, processing wallpaper."),h()),!1}function _(){$(t).off("."+L)}var S={},y,L=n.nameSpace||"wallpaperInjector",v=t._CMLS.throttle,C=t._CMLS.debounce,M=i();this.reset=p,this.process=h,this.unbindAllListeners=_,o("Initializing."),t.googletag=t.googletag||{},t.googletag.cmd=t.googletag.cmd||[],t.googletag.cmd.push(function(){t.googletag.pubads().addEventListener("slotRenderEnded",function(t){C(m(t),1e3)})});var w='<style id="'+L+'Styles">.'+L+"-container {display: block !important;position: absolute;z-index: 0;top: 0;left: 0;height: 0 !important;width: 100% !important;overflow: hidden;text-align: center;transition: opacity 0.5s, height 0.6s, background-color 0.4s;opacity: 0;}."+L+"-container iframe {border: 0;height: 100%;width: 100%;}."+L+"-container ~ .grid-container {transition: box-shadow 0.6s}."+L+"-open {height: 100% !important;opacity: 1;}."+L+"-open ~ .grid-container {box-shadow: 0 0 20px rgba(0,0,0,0.3);}."+L+"-fixed {position: fixed;}"+n.dfpSlotNode+" {display: none !important;}</style>";t.document.getElementById(L+"Styles")||$("head").append(w),"complete"===t.document.readyState||"loaded"===t.document.readyState?h():$(function(){h()})}var i={dfpSlotNode:"#div-gpt-ad-1418849849333-16",injectionNode:".wrapper-content",stickNode:".wrapper-header",contentNode:".wrapper-content .grid-container:first",footerNode:".wrapper-footer",obstructiveNode:".takeover-left, .takeover-right, .skyscraper-left, .skyscraper-right"},r="WALLPAPER INJECTOR",a="wallpaperInjector",s="0.5";t._CMLS[a],i.nameSpace=a,t._CMLS[a]=new n(i)}(jQuery,window),function($,t,e){function o(){s.logger(i+" v"+a,arguments)}function n(){var e=t.top.googletag||{};e.cmd=e.cmd||[],e.cmd.push(function(){$(function(){if($("#CMLSPlayerSponsorship").length)return void o("Container already exists, exiting.");o("Discovering local site ad path.");var t=null;try{var n=e.pubads(),i=Object.getOwnPropertyNames(n);for(var r in i){var a=n[i[r]];if(a.constructor&&a.constructor===Array)for(var l in a[0])if(a[0][l]&&a[0][l].constructor===String&&a[0][l].indexOf("/6717/")>-1){t=a[0][l];break}if(t)break}if(null===t)throw{message:"Could not retrieve ad unit path."}}catch(t){return void o("Failed to retrieve DFP properties.",t)}o("Ad path found, defining new slot.",t);var c=e.defineSlot(t,[[120,60]],"CMLSPlayerSponsorship");c&&c.addService(e.pubads()).setCollapseEmptyDiv(!0).setTargeting("pos","playersponsorlogo"),$("body").append('<style id="CMLSPlayerSponsorshipStyle">#CMLSPlayerSponsorship {position: fixed;z-index: 2147483647;width: 120px;height: 60px;}#CMLSPlayerSponsorship.cmls-player-tg {left: 50%;transform: translate(-520px, 0);}#CMLSPlayerSponsorship.cmls-player-triton {left: 50%;transform: translate(30px, 0);}#CMLSPlayerSponsorship.cmls-player-pos-bottom {bottom: 10px;}#CMLSPlayerSponsorship.cmls-player-pos-top {top: 10px;}#CMLSPlayerSponsorship.cmls-player-triton.cmls-player-pos-top {top: 5px;}@media (max-width: 75rem) {#CMLSPlayerSponsorship.cmls-player-tg {left: 80px;transform: translate(0,0);}}@media (max-width: 1042px) {#CMLSPlayerSponsorship.cmls-player-tg {display: none}}@media (max-width: 800px) {#CMLSPlayerSponsorship.cmls-player-triton {display: none}}</style>');var d=$('<div id="CMLSPlayerSponsorship"><script>googletag.cmd.push(function() { googletag.display("CMLSPlayerSponsorship")});</script></div>'),p=s.whichPlayer();p.position===s.const.PLAYER_POSITION_TOP&&d.addClass("cmls-player-pos-top"),p.position===s.const.PLAYER_POSITION_BOTTOM&&d.addClass("cmls-player-pos-bottom"),p.type===s.const.PLAYER_TRITON&&d.addClass("cmls-player-triton"),p.type===s.const.PLAYER_TUNEGENIE&&d.addClass("cmls-player-tg"),$("body").append(d),o("Slot initialized.")})})}var i="PLAYER SPONSOR INJECTOR",r="playerSponsorInjector",a="0.1",s=t._CMLS;if(t.self!==t.top)return void $(function(){t.parent._CMLSPlayerSponsorshipInit=t.parent._CMLSPlayerSponsorshipInit||[],t.parent._CMLSPlayerSponsorshipInit.push(1)});var l=function(){};l.prototype=[],l.prototype.push=function(){n()},t.self._CMLSPlayerSponsorshipInit=new l,$(n()),s[r]=a}(window.top.jQuery,window),function($,t,e){function o(){t._CMLS.logger(i+" v"+a,arguments)}function n(t){try{o("Event fired: "+t),sharedContainerDataLayer.push({event:t}),corpDataLayer.push({event:t})}catch(t){}}var i="GTM STREAM TRACKING",r="GTMStreamTracker",a="0.3";t.top.tgmp&&!t._CMLS[r]&&(t._CMLS[r]=!0,t.top.tgmp.addEventListener(t.top.TGMP_EVENTS.streamplaying,function(t){!0===t?(o("Stream started."),n("siteplayer-stream-playing")):!1===t&&(o("Stream stopped."),n("siteplayer-stream-stopped"))}),t.addEventListener("td-player.playing",function(){n("siteplayer-stream-playing")}),t.addEventListener("td-player.stopped",function(){n("siteplayer-stream-stopped")}),o("Initialized."))}(jQuery,window),function($,t,e){function o(){window._CMLS.logger(i+" v"+r,arguments)}function n(t,e){try{o("Event fired: "+t,e),sharedContainerDataLayer.push({event:t,promoReelClickURL:e}),corpDataLayer.push({event:t,promoReelClickURL:e})}catch(t){}}var i="GTM PROMO REEL TRACKING",r="0.1";window._CMLS.GTMPromoReelTracker=!0,$(function(){$(".home .sliderItem").click(function(){var t=$(this),e=t.attr("data-href");(!e||e.length<1)&&(e=t.attr("onclick").replace(/window\.open=\(\'([^\']+).*/,"$1").replace(/window\.location=\'([^\']+).*/,"$1")),n("promoreel-click",e)})})}(jQuery,window.self),function(t,e){function o(){t._CMLS&&t._CMLS.logger&&t._CMLS.logger(i+" v"+r,arguments)}function n(){function e(){return l.type===t._CMLS.const.PLAYER_TUNEGENIE&&t.page_frame?t.page_frame.document.querySelector(r.condition):t.document.querySelector(r.condition)}function n(t){return new Date(Date.now()+t)}var i={condition:"body.home",timeout:8},r=i,a,s,l=t._CMLS.whichPlayer(),c=this;this.start=function(l){if(o("Starting timer.",l),c.stop(),r={condition:l.condition||i.condition,timeout:l.timeout||i.timeout},!e())return void o("Condition check failed at start.");s=n(6e4*r.timeout),o("Starting countdown, reloading at "+s),t._CMLS.autoReload&&(t._CMLS.autoReload.active=!0),a=setInterval(c.tick,1e4)},this.stop=function(){a&&(o("Stopping timer."),clearInterval(a),a=null,t._CMLS.autoReload&&(t._CMLS.autoReload.active=!1))},this.tick=function(){Date.now()>s.getTime()&&c.fire()},this.fire=function(){return c.stop(),e()?(o("Reloading page."),l.type===t._CMLS.const.PLAYER_TRITON&&t.History&&t.History.Adapter?void t.History.Adapter.trigger(t,"statechange"):l.type===t._CMLS.const.PLAYER_TUNEGENIE?void t.tgmp.updateLocation(t.location.href):void t.location.reload()):void o("Condition check failed before firing, timer stopped.")},this.push=function(t){o("Received request.",t),c.start(t)}}var i="AUTO-RELOAD PAGE",r="0.9",a;t._CMLS&&(t._CMLS.autoReload&&t._CMLS.autoReload.constructor===Array&&t._CMLS.autoReload.length&&(o("Loaded with request.",t._CMLS.autoReload),a=t._CMLS.autoReload[t._CMLS.autoReload.length-1]),t._CMLS.autoReload&&t._CMLS.autoReload.constructor!==Array||(t._CMLS.autoReload=new n)),o("Initialized."),a&&t._CMLS.autoReload.push(a)}(window.top),function($,t,e){function o(){t.top._CMLS&&t.top._CMLS.logger&&t.top._CMLS.logger(n+" v"+r,arguments)}var n="ADDTHIS INJECTOR",i="addThisInjector",r="0.6.17",a="ra-55dc79597bae383e";if(t.self.addthis&&t.self.addthis_config&&t.self.addthis_config.pubid&&t.self.addthis_config.pubid!==a)return void o("AddThis already loaded by local page.");if(t.self!==t.top?(o("Not top window."),t.top.addthisDestroyer&&t.top.addthisDestroyer(),$(t).unload(function(){o("Removing AddThis layers."),$(".addthis-smartlayers").remove()})):(o("Loaded in top window."),t.top.addthisDestroyer=function(){if(o("Removing addthis from top window."),$('script[src*="addthis"]').remove(),t.top.addthisLayerReference){o("Instructing addthis to destroy itself.");try{t.top.addthisLayerReference.destroy()}catch(t){}delete t.top.addthisLayerReference,$(".addthis-smartlayers").remove()}else o("No addthis object in top window.")}),t.self.NO_ADDTHIS_HERE)return void o("NO_ADDTHIS_HERE found, will not build.");if(t.top._CMLS&&t.top._CMLS.hasOwnProperty("isHomepage")&&t.top._CMLS.isHomepage(t.self))return void o("Will not build on homepage, exiting.");t.self.addthis_config=t.self.addthis_config||{},t.self.addthis_config.pubid=a,o("Building addthis script.");var s=t.self.document.createElement("script");s.onload=function(){},s.src="//s7.addthis.com/js/300/addthis_widget.js#async=1",s.id=i+"-script",s.async=!0,t.self.document.head.appendChild(s),o("Injected.")}(jQuery,window),function($,t,e){function o(){a.logger(n+" v"+r,arguments)}var n="BREAKING NEWS BAR",i="BreakingNews",r="0.7",a=t._CMLS||{};Array.isArray||(Array.isArray=function(t){return"[object Array]"===Object.prototype.toString.call(t)}),a[i]=function(e,n){o("Called",typeof e,e,n);var i={classPrefix:"cmlsBreakingNews",additionalClass:"",position:"above",link:"",target:"_top",beforeText:"Breaking News:",text:"",background:"#900",color:"#fff"},r,s=".wrapper-header";if($(s).length){if("object"!=typeof e||Array.isArray(e))if("object"==typeof e&&Array.isArray(e)&&e.length)r=i,r.text=e[0],e.length>1&&(n=e[1]),o("Basic mode!");else{if("object"==typeof e)return void o("Invalid usage!",e,n);r=i,r.text=e,o("Basic mode!")}else r=$.extend({},i,e),o("Advanced mode!");!r.link&&n&&(r.link=n),o("Settings:",r);var l="."+r.classPrefix+"-container { display: block; box-sizing: border-box; position: relative; float: none; overflow: hidden; z-index: 10; padding: 1em; color: #fff; background: #900; box-shadow: 0 0 10px rgba(0,0,0,0.4); font-size: 14px; line-height: 1.2; text-decoration: none; outline: 0 }."+r.classPrefix+"-container > a { display: block; color: inherit !important; cursor: pointer; padding: 1em; margin: -1em; }."+r.classPrefix+"-container > a:hover ."+r.classPrefix+"-before { text-decoration: underline; }."+r.classPrefix+"-inner { box-sizing: border-box; max-width: 1020px; margin: 0 auto; }."+r.classPrefix+"-before { float: left; font-weight: bold; margin-right: .5em; }."+r.classPrefix+"-text { overflow: hidden; }."+r.classPrefix+"-inner a { text-decoration: underline !important; color: inherit; }@media (max-width: 500px) {."+r.classPrefix+"-before { float: none; margin-bottom: .25em; }}",c='<div class="'+r.classPrefix+'-container"><div class="'+r.classPrefix+'-inner">{{BEFORE}}<div class="'+r.classPrefix+'-text">{{TEXT}}</div></div></div>';if(r.beforeText&&r.beforeText.length){var d='<div class="'+r.classPrefix+'-before">'+r.beforeText+"</div>";c=c.replace("{{BEFORE}}",d)}if(c=$(c.replace("{{TEXT}}",r.text)),r.link&&r.link.length){var p=$("<a></a>").prop({href:r.link,target:r.target});c.wrapInner(p)}c.css({background:r.background,color:r.color}),c.addClass(r.additionalClass).prop("id","CMLSBreakingNews-"+Math.floor(1e7*Math.random())),$("#cmlsBreakingNewsStyles").length||$("head").append('<style id="cmlsBreakingNewsStyles">/* CMLS Breaking News Bar styles */\n'+l+"</style>"),"below"===r.position?($(s).after(c),$("#cmlsBreakingNewsStyles").append(".takeover-left,.takeover-right,.skyscraper-left,.skyscraper-right { margin-bottom: -"+c.height()+"; }")):$(s).before(c),a.navThroughPlayer&&(o("Applying navThroughPlayer to bar links."),c.find('a:not([href]),a[target="_self"],a[target="_top"],a[target="_parent"]').each(function(){o("Applying navThroughPlayer to a link.",this.href),a.navThroughPlayer.updateLink($(this))})),"above"===r.position&&(t.DO_NOT_AUTO_SCROLL=!0)}};var s=function(){};s.prototype=[],s.prototype.push=function(){o("Received after-load request.",arguments),a[i].apply(null,arguments)},t["_CMLS"+i]&&t["_CMLS"+i].length&&t["_CMLS"+i].forEach(a[i]),t["_CMLS"+i]=new s}(jQuery,window),function($,t,e){function o(){t._CMLS.logger(n+" v"+i,arguments)}var n="SOCIAL LISTEN LIVE LINK",i="0.1";t._CMLS=t._CMLS||{},o("Starting..."),$(function(){if(!t.top.tgmp)return void o("TuneGenie player not enabled.");o("Storing TGMP default configuration."),t.top.tgmp_default_brand=t.top.tgmp_default_brand||""+t.top.tgmp.options.brand,o("Locating Listen Live button.");var e=$('.social-icons img[title="Listen Live!!"],.social-icons-container img[title="Listen Live!!"],.nav-listenlive img');if(!e.length)return void o("Could not locate Listen Live button in social icons.");e.parent().is("a")&&(e=e.parent()),e.click(function(e){if(e.preventDefault(),o("Playing stream..."),t.top.tgmp_default_brand&&t.top.tgmp.options.brand!==t.top.tgmp_default_brand)return void t.top.tgmp.update({brand:t.top.tgmp_default_brand,autostart:!0});t.top.tgmp.playStream()}),o("Social Listen Live button activated.")}),t._CMLS.socialListenLiveLink=i,o("Initialized.")}(jQuery,window),function($,t,e){function o(){if(t.top._CMLS&&t.top._CMLS.logger)return t.top._CMLS.logger(r+" v"+s,arguments)}function n(){var e=t.document.body.className.match(/postid\-(\d+)/);return!!(e&&e.length>1&&parseInt(e[1],10))&&e[1]}function i(){function e(t,e){return t?(e||(e="inform-pp-top"),
a.replace("{POS_ID}",e).replace("{DPID}",t)):(o("getTemplate called without DPID"),!1)}function i(t){if(o("Inject called",t),!t)return o("Inject called without DPID."),!1;var i=n();if(!1===i)return o("Could not retrieve post ID while injecting",t),!1;o("Post ID retrieved",i);var r=$("article#post-"+i+" .entry-content > p:not(:has(img)):not(.read-more-full-link),article#post-"+i+" .entry-content > *:not(.themify_builder_content) p:not(:has(img)):not(.read-more-full-link)");if(r.length)return o("Found "+r.length+" p tags."),r.length>4?(o("Injectng top embed after 5th p tag"),r.eq(4).after(e(t,"inform-pp-top"))):r.length>1?(o("Injecting top embed after 1st p tag."),r.first().after(e(t,"inform-pp-top"))):o("Not enough p tags to inject top embed."),r.length>8?(o("Injecting bottom embed after last p tag."),r.last().before(e(t,"inform-pp-bottom"))):o("Not enough p tags to inject bottom embed."),!0;o("No valid p tags found in post.")}function r(t){try{if(!t||!t.id)throw{message:"Invalid request, no ID",data:t};o("Received request to inject Inform embed with ID "+t.id),i(t.id)}catch(t){o("Failed",t)}}var a='<div class="ndn_embed" id="{POS_ID}" data-config-distributor-id="{DPID}" data-config-width="100%" data-config-aspect-ratio="16:9"></div><script type="text/javascript">var _informq = _informq || []; _informq.push(["embed"]);</script>';if(this.process=r,t._informinjector&&t._informinjector.length){o("Found existing requests, processing.",t._informinjector);for(var s=0;s<t._informinjector.length;s++)r(t._informinjector[s])}o("Initializing InformInjector array handler.");var l=function(){};l.prototype=[],l.prototype.push=function(){for(var t=0;t<arguments.length;t++)arguments[t].id&&$(r(arguments[t]))},t._informinjector=new l,o("Listening for future requests.")}var r="INFORM INJECTOR",a="informInjector",s="0.2";if(t.document.body.className.indexOf("single-feed_posts")<0&&t.document.body.className.indexOf("single-post")<0)return o("Not a post, ejecting."),!1;$("script#informbase").remove(),$('<script type="text/javascript" id="informbase" src="//launch.newsinc.com/js/embed.js"></script>').appendTo("head"),t._CMLS=t._CMLS||{},t._CMLS[a]=new i,o("Initialized.")}(jQuery,window.self);
//# sourceMappingURL=./compiled-allsites-min.js.map