!function(t,e){t._CMLS=t._CMLS||{},t._CMLS.LOADED||(t._CMLS.LOADED=!0,t._CMLS["const"]=t._CMLS["const"]||{},t._CMLS.isHomepage=function(){return"/"===t.location.pathname&&/[\?&]?p=/i.test(t.location.search)===!1},t._CMLS.now=Date.now||function(){return(new Date).getTime()})}(window),function(t,e){t._CMLS.log=function n(){var e=t._CMLS.log;if(!t._CMLS||!t._CMLS.debug||"object"!=typeof console||!console.groupCollapsed)return!1;e.colorCache=e.colorCache||{};var n,o,a=arguments[0],r=[].slice.call(arguments[1]);e.colorCache[a]?(n=e.colorCache[a].background,o=e.colorCache[a].complement):(n=("000000"+Math.floor(16777215*Math.random()).toString(16)).slice(-6),o=parseInt(n,16)>=12303291?"000000":"FFFFFF",e.colorCache[a]={background:n,complement:o});var i=new Date;i=i.toISOString()?i.toISOString():i.toUTCString();var c=["%c["+a+"]","background: #"+n+"; color: #"+o];r=c.concat(r),console.groupCollapsed.apply(console,r),console.log("TIMESTAMP:",i),console.trace(),console.groupEnd()}}(window),function(t,e){t._CMLS.triggerEvent=function(e,n,o){var a;t.document.createEvent?(a=t.document.createEvent("CustomEvent"),a.initCustomEvent(n,!0,!0,o)):a=new CustomEvent(n,{detail:o}),e.dispatchEvent(a)}}(window),function(t,e){t._CMLS.throttle=function(e,n,o){var a,r,i,c=null,s=0;o||(o={});var l=function(){s=o.leading===!1?0:t._CMLS.now(),c=null,i=e.apply(a,r),c||(a=r=null)};return function(){var u=t._CMLS.now();s||o.leading!==!1||(s=u);var d=n-(u-s);return a=this,r=arguments,0>=d||d>n?(c&&(clearTimeout(c),c=null),s=u,i=e.apply(a,r),c||(a=r=null)):c||o.trailing===!1||(c=setTimeout(l,d)),i}}}(window),function(t,e){t._CMLS.debounce=function(e,n,o){var a,r,i,c,s,l=function(){var u=t._CMLS.now()-c;n>u&&u>=0?a=setTimeout(l,n-u):(a=null,o||(s=e.apply(i,r),a||(i=r=null)))},u=function(){i=this,r=arguments,c=t._CMLS.now();var u=o&&!a;return a||(a=setTimeout(l,n)),u&&(s=e.apply(i,r),i=r=null),s};return u.clear=function(){clearTimeout(a),a=i=r=null},u}}(window),function(t,e){function n(){c.log(a+" v"+i,arguments)}function o(){var e;t.googletag=t.googletag||{},t.googletag.cmd=t.googletag.cmd||[],t.googletag.cmd.push(function(){var o=t.googletag.pubads();for(var a in o)if(o[a].hasOwnProperty("cms-sgroup")){e=o[a]["cms-sgroup"];break}if(e){n("s-groups acquired!"),c.sGroups=e;var r=["cms-sgroup"].concat(c.sGroups);t.sharedContainerDataLayer=t.sharedContainerDataLayer||[],t.corpDataLayer=t.corpDataLayer||[],n("Firing events.");for(var i in r)r.hasOwnProperty(i)&&(t.sharedContainerDataLayer.push({event:r[i]}),t.corpDataLayer.push({event:r[i]}),c.triggerEvent(t,"cms-sgroup",r[i]))}})}var a="GLOBALIZE SGROUPS",r="globalizeSGroups",i="0.6",c=t._CMLS||{};c[r]||(n("Initializing."),c[r]=new o)}(window),function(t,e){var n=t._CMLS||{};n["const"].PLAYER_TUNEGENIE=8471,n["const"].PLAYER_TRITON=8468,n["const"].PLAYER_POSITION_TOP=80847980,n["const"].PLAYER_POSITION_BOTTOM=80667984,n.whichPlayer=function(){if(n.whichPlayer.cache)return n.whichPlayer.cache;var e={type:null,position:null};if(t.tgmp){n.log("COMMON",["Found TuneGenie player."]),e.type=n["const"].PLAYER_TUNEGENIE;var o=t.tgmp.options;o.position&&"bottom"===o.position.toLowerCase()?(n.log("COMMON",["TuneGenie player is on the bottom."]),e.position=n["const"].PLAYER_POSITION_BOTTOM):o.position&&"top"===o.position.toLowerCase()&&(n.log("COMMON",["TuneGenie player is on the top."]),e.position=n["const"].PLAYER_POSITION_TOP)}else t.TDPW&&(n.log("COMMON",["Found Triton player, assuming it's on top."]),e.type=n["const"].PLAYER_TRITON,e.position=n["const"].PLAYER_POSITION_TOP);return n.whichPlayer.cache=e,n.whichPlayer.cache}}(window),function(t,e){function n(){t._CMLS.log(i+" v"+s,arguments)}function o(){this.trackChange=function(e){n("Track has changed.",e),l.triggerEvent(t,"cmls-player.trackchange",e)},this.playing=function(){n("Player is streaming."),l.triggerEvent(t,"cmls-player.playing")},this.stopped=function(){n("Player is stopped."),l.triggerEvent(t,"cmls-player.stopped")}}function a(){var e=new o;t.tgmp.addEventListener(t.top.TGMP_EVENTS.nowplaying,function(t){e.trackChange(t)}),t.tgmp.addEventListener(t.top.TGMP_EVENTS.streamplaying,function(t){t===!0?e.playing():e.stopped()})}function r(){var e={},a,r=2500,i={PLAYING:1,STOPPED:0},c=new o,s=this;return this.checkCurrentTrack=function(){var e=localStorage&&JSON?JSON.parse(localStorage.getItem("tdas.controller."+t.amp_player_config.station+"."+t.amp_player_config.stream_id+".events.current-state")):!1;return e&&e.data?(e.data.stream&&"LIVE_PLAYING"===e.data.stream.code.toUpperCase()?s.setState(i.PLAYING):s.setState(i.STOPPED),e.data.song&&e.data.song.id&&s.hasTrackChanged(e.data.song.id)&&s.trackHasChanged(e.data.song),!0):!1},this.setState=function(t){if(t!==e.state){switch(t){case i.PLAYING:c.playing();break;default:c.stopped()}e.state=t}},this.hasTrackChanged=function(t){return t&&t!==e.trackId?!0:!1},this.trackHasChanged=function(t){e.trackId=t.id,c.trackChange(t)},this.startTimer=function(){clearTimeout(a),a=null,a=setTimeout(function(){s.checkCurrentTrack(),s.startTimer()},r)},n("Initializing."),t.amp_player_config&&t.amp_player_config.station&&t.amp_player_config.stream_id?(this.checkCurrentTrack(),this.startTimer(),n("Initialized."),this):(n("Player configuration not available, exiting."),!1)}var i="PLAYER WATCH",c="playerWatch",s="0.6",l=t._CMLS;if(l[c])return!1;var u=l.whichPlayer();u.type===l["const"].PLAYER_TRITON&&(l[c]=new r,n("Triton player tracker enabled.")),u.type===l["const"].PLAYER_TUNEGENIE&&(l[c]=new a,n("TuneGenie player tracker enabled."))}(window),function(t,e){function n(){t._CMLS.log(r+" v"+c,arguments)}function o(){var e=null,o=this;this.timeout=l.autoRefreshAdsTimer||s,this.checkConditions=function(){return l.autoReloader&&l.autoReloader.active?(n("Autoreloader is active, conditions fail."),!1):!0},this.stop=function(){return n("Stopping timer."),clearTimeout(e),e=null,o},this.start=function(){return o.stop(),o.checkConditions()?(n("Starting timer for "+o.timeout+" minute countdown."),o.timer=setTimeout(function(){o.fire()},6e4*o.timeout),!0):!1},this.fire=function(){return o.checkConditions()?void t.googletag.cmd.push(function(){n("Refreshing ads."),t.googletag.pubads().refresh(),o.start()}):!1},n("Initializing."),t.addEventListener("cmls-player.stopped",function(){o.stop()},!1),t.addEventListener("cmls-player.playing",function(){o.start()},!1),t.History&&t.History.Adapter&&t.History.Adapter.bind(t,"pageChange",function(){o.start()})}function a(){if(!l.sGroups)return void n("Init test called without sgroups available.");for(var t in l.sGroups)/Format\s+(.*Talk.*|Sports)/.test(l.sGroups[t])&&(n("Format is good."),l[i]=new o,u=!0)}var r="AUTO REFRESH ADS",i="autoRefreshAds",c="0.4",s=4,l=t._CMLS;if(!l[i]){t.googletag=t.googletag||{},t.googletag.cmd=t.googletag.cmd||[];var u=!1;a(),t.addEventListener("cms-sgroup",function(){u||a()},!1)}}(window),function(t,e){function n(){t._CMLS.log(a+" v"+i,arguments)}function o(){var e=this;this.setDFPCriteria=function(e,o){t.googletag.cmd.push(function(){n("Setting targeting criteria.",e,o),t.googletag.pubads().setTargeting(e,o)})},t.addEventListener("cmls-player.playing",function(){n("Player is streaming."),e.setDFPCriteria("td-player-state","PLAYING")},!1),t.addEventListener("cmls-player.stopped",function(){n("Player has stopped."),e.setDFPCriteria("td-player-state","STOPPED")},!1),t.addEventListener("cmls-player.trackchange",function(t){n("Track has changed.",t),t.artist&&e.setDFPCriteria("td-player-artist",t.artist),t.album&&e.setDFPCriteria("td-player-album",t.album),t.title&&e.setDFPCriteria("td-player-track",t.title),t.id&&e.setDFPCriteria("td-player-id",t.id)}),n("Initialized.")}var a="PLAYER DFP INJECTOR",r="playerDFPInjector",i="0.1",c=t._CMLS||{};if(c[r])return!1;var s=c.whichPlayer();return s.type!==c["const"].PLAYER_TRITON?(n("Triton player not enabled."),!1):void(c[r]=new o)}(window),function($,t,e){function n(){s.log(r+" v"+c,arguments)}function o(){var e=this;this.updateIframe=function(t){var n=t.jquery?t:$(t);n.contents().find('a[target="_self"], a[target="_top"], a[target="_parent"]').each(function(){e.updateLink(this)})},this.updateLink=function(o,a){var r=o.jquery?o:$(o),c=t.document.createElement("a");return c.href=r.prop("href"),0===c.href.indexOf("/")||c.hostname!==t.location.hostname&&!a?void(c=null):void(r.data("cmls-bound")||(n("Binding to link with href:",c.href),r.off("."+i).on("click."+i,e.clickThrough).data("cmls-bound",1),c=null))},this.clickThrough=function(e){if(n("Intercepting click."),!e.currentTarget||e.currentTarget.href)return void n("Could not get href from target.");var o=e.currentTarget.href;if(l.type===s["const"].PLAYER_TRITON&&t.History)n("Navigating through Triton player.",o),t.History.pushState(null,null,o);else{if(l.type!==s["const"].PLAYER_TUNEGENIE||!t.tgmp)return;n("Navigating through TuneGenie player.",o),t.tgmp.updateLocation(o)}e.preventDefault()},n("Initializing."),t.googletag=t.googletag||{},t.googletag.cmd=t.googletag.cmd||[],t.googletag.cmd.push(function(){$('iframe[id^="google_ads_iframe"], #cmlsWallpaperInjectorContainer iframe').each(function(){e.updateIframe(this)}),$(t).load(function(){$('iframe[id^="google_ads_iframe"], #cmlsWallpaperInjectorContainer iframe').each(function(){e.updateIframe(this)})}),t.googletag.pubads().addEventListener("slotRenderEnded",function(n){if(n&&n.slot){var o=n.slot.getSlotElementId(),a=t.document.getElementById(o);e.updateIframe(a)}}),n("Initialized.")})}function a(){return n("Checking for player, try:",u),l=s.whichPlayer(),l.type?(n("Player found."),void(s[i]=new o)):u>20?void n("Limit reached, ejecting."):(setTimeout(a,1e3),void u++)}var r="NAV THROUGH PLAYER",i="navThroughPlayer",c="0.2",s=t._CMLS,l=s.whichPlayer();if(!s[i]){var u=0;a()}}(jQuery,window),function(t,e){function n(){c.log(a+" v"+i,arguments)}function o(){function o(){var e=1020,n=document.documentElement||{clientWidth:0,clientHeight:0},o=Math.max(n.clientWidth,t.innerWidth||0),a=Math.max(n.clientHeight,t.innerHeight||0);return o>e&&(o=e),{w:o,h:a}}function a(e){var n=o();l({pid:e,slot:".wrapper-content",filter:function(){return t.document.body.className.indexOf("home")>-1||c.forceTeadsInBoard===!0},format:"inboard",before:!0,css:"margin: auto !important; padding-top: 5px; padding-bottom: 5px; max-width: 1020px",size:{w:n.w}})}function r(e){l({pid:e,slot:".wrapper-content .column-1 .entry-content p",filter:function(){return t.document.body.className.indexOf("single-feed_posts")>-1},format:"inread",before:!1,css:"padding-bottom: 10px !important;"})}function i(){n("Refreshing cache, reinserting PID requests."),d.forEach(function(e){for(var n=0;n<t.self._ttf.length;n++)t.self._ttf[n].pid===e.pid&&t.self._ttf[n].splice(n,1);e.launched=!1,l(e)})}function s(){t.self._ttf=e,t.parent._ttf=e;for(var n=[t.self.document.getElementById("cmlsTeadsScript"),t.parent.document.getElementById("cmlsTeadsScript")],o=0;o<n.length;o++)n[o]&&n[o].parentNode.removeChild(n[o]);!function(t){var e,n=t.getElementsByTagName("script")[0];e=t.createElement("script"),e.async=!0,e.id="cmlsTeadsScript",e.src="http://cdn.teads.tv/js/all-v1.js",n.parentNode.insertBefore(e,n)}(t.self.document)}function l(e){return e&&e.pid&&e.slot&&e.format?(e.components=e.components||{skip:{delay:0}},e.lang=e.lang||"en",e.filter=e.filter||function(){return!0},e.minSlot=e.minSlot||0,e.before=e.before||!1,e.BTF=e.BTF||!1,e.css=e.css||"margin: auto !important;",n("Injecting!",e),t.self._ttf=t.self._ttf||[],t.self._ttf.push(e),s(),void(d[e.pid]=e)):void n("Invalid request.",e)}var u=this,d={},p=function(){};this.process=function(t){return t?(t.push&&t.pop||(t=[t]),void t.forEach(function(t){if(!t.format||!t.pid)return void n("Invalid request.",t);switch(n("Received request","format: "+t.format,"PID: "+t.pid),t.format.toLowerCase()){case"inread":r(t.pid);break;case"inboard":a(t.pid)}})):void n("Request was empty.",t)},t.self._teadsinjector&&t.self._teadsinjector.length&&u.process(t.self._teadsinjector),p.prototype=[],p.prototype.push=function(){var t=[].prototype.slice.call(arguments);u.process(t)},t.self._teadsinjector=new p;var g=c.whichPlayer();g&&g.type&&g.type===c["const"].PLAYER_TRITON&&t.History&&t.History.Adapter&&(n("Binding to pageChange event."),t.History.Adapter.bind(t,"pageChange",function(){t.document.addEventListener("DOMContentLoaded",function(){i()})})),n("Initialized.")}var a="TEADS INJECTOR",r="teadsInjector",i="0.8",c=t._CMLS||{};c[r]||t.self.teads||(c[r]=new o)}(window),window._CMLS.log("COMMON",["LIBRARIES LOADED!\n                           .__\n  ____  __ __  _____  __ __|  |  __ __  ______\n_/    \\|  |  \\/     \\|  |  \\  | |  |  \\/  ___/\n\\   ---|  |  /  Y Y  \\  |  /  |_|  |  /___ \\\n \\___  >____/|__|_|  /____/|____/____//____  >\n     \\/            \\/                      \\/\n"]);
//# sourceMappingURL=./compiled-allsites-min.js.map