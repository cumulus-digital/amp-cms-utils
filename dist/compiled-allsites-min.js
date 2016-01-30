!function(o,t){o._CMLS=o._CMLS||{},o._CMLS.LOADED||(o._CMLS.LOADED=!0,o._CMLS["const"]=o._CMLS["const"]||{},o._CMLS.isHomepage=function(){return"/"===o.location.pathname&&/[\?&]?p=/i.test(o.location.search)===!1},o._CMLS.now=Date.now||function(){return(new Date).getTime()})}(window),function(o,t){o._CMLS.log=function n(){var t=o._CMLS.log;if(!o._CMLS||!o._CMLS.debug||"object"!=typeof console||!console.groupCollapsed)return!1;t.colorCache=t.colorCache||{};var n,e,i=arguments[0],r=[].slice.call(arguments[1]);t.colorCache[i]?(n=t.colorCache[i].background,e=t.colorCache[i].complement):(n=("000000"+Math.floor(16777215*Math.random()).toString(16)).slice(-6),e=parseInt(n,16)>=12303291?"000000":"FFFFFF",t.colorCache[i]={background:n,complement:e});var a=new Date;a=a.toISOString()?a.toISOString():a.toUTCString();var s=["%c["+i+"]","background: #"+n+"; color: #"+e];r=s.concat(r),console.groupCollapsed.apply(console,r),console.log("TIMESTAMP:",a),console.trace(),console.groupEnd()}}(window),function(o,t){o._CMLS.triggerEvent=function(t,n,e){var i;o.document.createEvent?(i=o.document.createEvent("CustomEvent"),i.initCustomEvent(n,!0,!0,e)):i=new CustomEvent(n,{detail:e}),t.dispatchEvent(i)}}(window),function(o,t){o._CMLS.throttle=function(t,n,e){var i,r,a,s=null,c=0;e||(e={});var u=function(){c=e.leading===!1?0:o._CMLS.now(),s=null,a=t.apply(i,r),s||(i=r=null)};return function(){var _=o._CMLS.now();c||e.leading!==!1||(c=_);var l=n-(_-c);return i=this,r=arguments,0>=l||l>n?(s&&(clearTimeout(s),s=null),c=_,a=t.apply(i,r),s||(i=r=null)):s||e.trailing===!1||(s=setTimeout(u,l)),a}}}(window),function(o,t){o._CMLS.debounce=function(t,n,e){var i,r,a,s,c,u=function(){var _=o._CMLS.now()-s;n>_&&_>=0?i=setTimeout(u,n-_):(i=null,e||(c=t.apply(a,r),i||(a=r=null)))},_=function(){a=this,r=arguments,s=o._CMLS.now();var _=e&&!i;return i||(i=setTimeout(u,n)),_&&(c=t.apply(a,r),a=r=null),c};return _.clear=function(){clearTimeout(i),i=a=r=null},_}}(window),function(o,t){function n(){s.log(i+" v"+a,arguments)}function e(){var t;o.googletag=o.googletag||{},o.googletag.cmd=o.googletag.cmd||[],o.googletag.cmd.push(function(){var e=o.googletag.pubads();for(var i in e)if(e[i].hasOwnProperty("cms-sgroup")){t=e[i]["cms-sgroup"];break}if(t){n("s-groups acquired!"),s.sGroups=t;var r=["cms-sgroup"].concat(s.sGroups);o.sharedContainerDataLayer=o.sharedContainerDataLayer||[],o.corpDataLayer=o.corpDataLayer||[],n("Firing events.");for(var a in r)r.hasOwnProperty(a)&&(o.sharedContainerDataLayer.push({event:r[a]}),o.corpDataLayer.push({event:r[a]}),s.triggerEvent(o,"cms-sgroup",r[a]))}})}var i="GLOBALIZE SGROUPS",r="globalizeSGroups",a="0.6",s=o._CMLS||{};s[r]||(n("Initializing."),s[r]=new e)}(window),function(o,t){o._CMLS["const"].PLAYER_TUNEGENIE=8471,o._CMLS["const"].PLAYER_TRITON=8468,o._CMLS["const"].PLAYER_POSITION_TOP=80847980,o._CMLS["const"].PLAYER_POSITION_BOTTOM=80667984,o._CMLS.whichPlayer=function(){if(o._CMLS.whichPlayer.cache)return o._CMLS.whichPlayer.cache;var t={type:null,position:null};return o.tgmp?(o._CMLS.log("COMMON",["Found TuneGenie player."]),t.type=o._CMLS["const"].PLAYER_TUNEGENIE,o.tgmp.options.position&&"bottom"===o.tgmp.options.position.toLowerCase()?(o._CMLS.log("COMMON",["TuneGenie player is on the bottom."]),t.position=o._CMLS["const"].PLAYER_POSITION_BOTTOM):o.tgmp.options.position&&"top"===o.tgmp.options.position.toLowerCase()&&(o._CMLS.log("COMMON",["TuneGenie player is on the top."]),t.position=o._CMLS["const"].PLAYER_POSITION_TOP)):o.TDPW&&(o._CMLS.log("COMMON",["Found Triton player, assuming it's on top."]),t.type=o._CMLS["const"].PLAYER_TRITON,t.position=o._CMLS["const"].PLAYER_POSITION_TOP),o._CMLS.whichPlayer.cache=t,o._CMLS.whichPlayer.cache}}(window),function(o,t){function n(){o._CMLS.log(r+" v"+s,arguments)}function e(){var t=u.whichPlayer(),e=null,i=this;this.timeout=u.autoRefreshAdsTimer||c,this.checkConditions=function(){return u.autoReloader&&u.autoReloader.active?(n("Autoreloader is active, conditions fail."),!1):!0},this.stop=function(){return n("Stopping timer."),clearTimeout(e),e=null,i},this.start=function(){return i.stop(),i.checkConditions()?(n("Starting timer for "+i.timeout+" minute countdown."),i.timer=setTimeout(function(){i.fire()},6e4*i.timeout),!0):!1},this.fire=function(){return i.checkConditions()?void o.googletag.cmd.push(function(){n("Refreshing ads."),o.googletag.pubads().refresh(),i.start()}):!1},n("Initializing."),t.type===u["const"].PLAYER_TRITON&&(o.addEventListener("td-player.stopped",function(){i.stop()},!1),o.addEventListener("td-player.playing",function(){i.start()},!1),o.History&&o.History.Adapter&&o.History.Adapter.bind(o,"pageChange",function(){i.start()})),t.type===u["const"].PLAYER_TUNEGENIE&&o.tgmp&&o.TGMP_EVENTS&&o.tgmp.addEventListener(o.TGMP_EVENTS.streamplaying,function(o){return o===!0?void i.start():void i.stop()})}function i(){if(!u.sGroups)return void n("Init test called without sgroups available.");for(var o in u.sGroups)/Format\s+(.*Talk.*|Sports)/.test(u.sGroups[o])&&(n("Format is good."),u[a]=new e,_=!0)}var r="AUTO REFRESH ADS",a="autoRefreshAds",s="0.4",c=4,u=o._CMLS;if(!u[a]){o.googletag=o.googletag||{},o.googletag.cmd=o.googletag.cmd||[];var _=!1;i(),o.addEventListener("cms-sgroup",function(){_||i()},!1)}}(window),window._CMLS.log("COMMON",["LIBRARIES LOADED!\n                           .__                \n  ____  __ __  _____  __ __|  |  __ __  ______\n_/ ___\\|  |  \\/     \\|  |  \\  | |  |  \\/  ___/\n\\  \\___|  |  /  Y Y  \\  |  /  |_|  |  /___ \\ \n \\___  >____/|__|_|  /____/|____/____//____  >\n     \\/            \\/                      \\/ \n"]);
//# sourceMappingURL=./compiled-allsites-min.js.map