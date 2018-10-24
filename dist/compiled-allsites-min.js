/**
 * Compiled script for ALL SITES
 */
// @codekit-append "common.js"
// Advertising interface library
// @codekit-append "advertising/taginterface/detector.js"
// 
// DISABLED codekit-append "advertising/teadsinjector.js"
// @codekit-append "advertising/pushdown-vast.js"
// DISABLED codekit-append "advertising/liquid-video-injector.js"
// @codekit-append "advertising/player-tracking-dfp-injection.js"
// DISABLED codekit-append "advertising/auto-scroll-homepage-past-leaderboard.js"
// @codekit-append "advertising/auto-refresh-ads.js"
// @codekit-append "advertising/nav-through-player.js"
// @codekit-append "advertising/wallpaper-injector.js"
// @codekit-append "advertising/player-sponsor-logo.js"
// @codekit-append "advertising/zergnet-injector.js"
// Misc
// @codekit-append "misc/gtm-stream-tracking.js"
// @codekit-append "misc/gtm-promoreel-tracking.js"
// @codekit-append "misc/gtm-tabvisibility-tracking.js"
// @codekit-append "misc/auto-reload.js"
// DISABLED codekit-append "misc/addthis-hider.js"
// @codekit-append "misc/addthis-injector.js"
// @codekit-append "misc/breaking-news-bar.js"
// @codekit-append "misc/social-listen-live-link.js"
// @codekit-append "misc/inform-video-player.js"
// @codekit-append "misc/tgmp-switchstream.js"
// Globalize sgroups at the end
// @codekit-append "advertising/globalize-sgroups.js"
/**
 * Common utilities for CMLS scripting
 */
/*jshint bitwise: false*/
!function(g,t){g.self!==g.top?g._CMLS={}:g._CMLS=g._CMLS||{},g._CMLS.LOADED||(
/**
	 * Constants
	 */
g._CMLS.const=g._CMLS.const||{},g._CMLS.const.PLAYER_TUNEGENIE=8471,g._CMLS.const.PLAYER_TRITON=8468,g._CMLS.const.PLAYER_POSITION_TOP=80847980,g._CMLS.const.PLAYER_POSITION_BOTTOM=80667984,
/**
	 * [logger description]
	 * @return {[type]} [description]
	 */
g._CMLS.logger=function cmlsLogger(t,e){if(!g._CMLS||!g._CMLS.debug||"object"!=typeof console||!console.groupCollapsed)return!1;g._CMLS.loggerNamesToColors=g._CMLS.loggerNamesToColors||{};var o,n,i=t,r=[].slice.call(e);
// Use cached colors for provided name, if possible.
g._CMLS.loggerNamesToColors[i]?(o=g._CMLS.loggerNamesToColors[i].background,n=g._CMLS.loggerNamesToColors[i].complement):(
// Calculate a random color and its complement
o=("000000"+Math.floor(16777215*Math.random()).toString(16)).slice(-6),n=12303291<=parseInt(o,16)?"000000":"FFFFFF",
//("000000" + (0xFFFFFF ^ parseInt(background, 16)).toString(16)).slice(-6);
g._CMLS.loggerNamesToColors[i]={background:o,complement:n});var a=new Date,s;a=a.toISOString()?a.toISOString():a.toUTCString(),r=["%c["+i+"]","background: #"+o+"; color: #"+n].concat(r),g.top.console.groupCollapsed.apply(g.top.console,r),g.top.console.log("TIMESTAMP:",a),g.top.console.trace(),g.top.console.groupEnd()},
/**
	 * Returns a numeric representation of the current time.
	 * (from Underscore.js)
	 * @return {number} Current time
	 */
g._CMLS.now=Date.now||function(){return(new Date).getTime()},
/**
	 * Throttle (from Underscore.js)
	 * @param  {function} func    Function to throttle
	 * @param  {number}   wait    Milliseconds for execution window
	 * @param  {object}   options Allows bypassing the leading or trailing executions
	 * @return {function}         Throttled wrapper for func
	 */
g._CMLS.throttle=function(o,n,i){var r,a,s,l=null,c=0;i||(i={});var d=function(){c=!1===i.leading?0:g._CMLS.now(),l=null,s=o.apply(r,a),l||(r=a=null)};return function(){var t=g._CMLS.now();c||!1!==i.leading||(c=t);var e=n-(t-c);return r=this,a=arguments,e<=0||n<e?(l&&(clearTimeout(l),l=null),c=t,s=o.apply(r,a),l||(r=a=null)):l||!1===i.trailing||(l=setTimeout(d,e)),s}},
/**
	 * Debounce (from Underscore.js)
	 * @param  {function} func      Function to debounce
	 * @param  {number}   wait      Milliseconds between executions
	 * @param  {boolean}  immediate Flag to toggle execution point, true for leading, 
	 *                              false for trailing wait window
	 * @return {function}           Debounced wrapper for func
	 */
g._CMLS.debounce=function(e,o,n){var i,r,a,s,l,c=function(){var t=g._CMLS.now()-s;t<o&&0<=t?i=setTimeout(c,o-t):(i=null,n||(l=e.apply(a,r),i||(a=r=null)))},t=function(){a=this,r=arguments,s=g._CMLS.now();var t=n&&!i;return i||(i=setTimeout(c,o)),t&&(l=e.apply(a,r),a=r=null),l};return t.clear=function(){clearTimeout(i),i=a=r=null},t},
/**
	 * Determines which resident player is active on the site, and its position
	 * @return {object} Player type and position
	 */
g._CMLS.whichPlayer=function(){if(g._CMLS.whichPlayerCache)return g._CMLS.whichPlayerCache;var t={type:null,position:null};return g.tgmp?(g._CMLS.logger("COMMON",["Found TuneGenie player."]),t.type=g._CMLS.const.PLAYER_TUNEGENIE,g.tgmp.options.position&&"bottom"===g.tgmp.options.position.toLowerCase()?(g._CMLS.logger("COMMON",["TuneGenie player is on the bottom."]),t.position=g._CMLS.const.PLAYER_POSITION_BOTTOM):g.tgmp.options.position&&"top"===g.tgmp.options.position.toLowerCase()&&(g._CMLS.logger("COMMON",["TuneGenie player is on the top."]),t.position=g._CMLS.const.PLAYER_POSITION_TOP)):g.TDPW&&(g._CMLS.logger("COMMON",["Found Triton player, assuming it's on top."]),t.type=g._CMLS.const.PLAYER_TRITON,t.position=g._CMLS.const.PLAYER_POSITION_TOP),g._CMLS.whichPlayerCache=t,g._CMLS.whichPlayerCache},
/**
	 * Uses current location pathname to determine if we're on the homepage.
	 * NOTE: With TuneGenie's player, scripts using this function should only
	 * execute after page load.
	 * @return {Boolean}
	 */
g._CMLS.isHomepage=function(t){return t||(t=g),"/"===t.location.pathname&&!1===/[\?&]?p=/i.test(t.location.search)},
/**
	 * Lightweight, cross-browser event trigger
	 * @param  {Object} el    Element to trigger on
	 * @param  {string} name  Name of event
	 * @param  {*}      data  Data to send with event
	 * @return {void}
	 */
g._CMLS.triggerEvent=function(t,e,o){var n;g.document.createEvent?(n=g.document.createEvent("CustomEvent")).initCustomEvent(e,!0,!0,o):n=new CustomEvent(e,{detail:o}),t.dispatchEvent(n)},g._CMLS.logger("COMMON",["LIBRARY LOADED!\n                           .__                \n  ____  __ __  _____  __ __|  |  __ __  ______\n_/ ___\\|  |  \\/     \\|  |  \\  | |  |  \\/  ___/\n\\  \\___|  |  /  Y Y  \\  |  /  |_|  |  /___ \\ \n \\___  >____/|__|_|  /____/|____/____//____  >\n     \\/            \\/                      \\/ \n"]),g._CMLS.LOADED=!0)}(window),
/**
 * Adtag Interface Detection
 * Detects and uses the appropriate ad tag service based on availability.
 */
function(e,t,o){function log(){e.top._CMLS&&e.top._CMLS.hasOwnProperty("logger")&&e.top._CMLS.logger(n+" v"+r,arguments)}function loopDetection(){s=setTimeout(e._CMLS[i].detectTag,50),l++}
//detectTag();
var n="ADTAG DETECTION",i="adTagDetection",r="0.1.1";e._CMLS=e._CMLS||{},e._CMLS[i]=e._CMLS[i]||{},
// Detectors must register themselves
e._CMLS[i].registeredDetectors=e._CMLS[i].registeredDetectors||[];
// Empty stub interface
/* jshint ignore:start */
var a=function(){var t="STUB INTERFACE",e="InterfaceSTUB",o="adTagDetection",n="x",i=this;return this.identity="STUB",this.detectTag=function(){},this.rawInterface=function(){},this.queue=function(t){i.rawInterface().cmd.push(t)},this.pubads=function(){return i.rawInterface().pubads()},this.refresh=function(t){return i.pubads().refresh(t)},this.addListener=function(t,e){},this.removeListener=function(t,e){},this.setTargeting=function(t,e){},
/**
		 * Define a slot and optionally apply collapsing, targeting, and initialization
		 * @param  {array}        slotOptions  Options for defineSlot. Path, sizes, div ID
		 * @param  {boolean}      collapse     True to apply collapseEmptyDiv
		 * @param  {array|object} targeting    Define targeting for slot. Array of {key: value} objects.
		 * @param  {boolean}      initialize   True to add pubads service and initialize slot
		 * @return {object}                    Returns the slot
		 */
this.defineSlot=function(t,e,o,n){},this.display=function(t){i.queue(function(){i.rawInterface().display(t)})},this},s,l;e._CMLS[i].stubInterface=a,e._CMLS.adTag=new e._CMLS[i].stubInterface,e._CMLS[i].detectTag=function detectTag(){if(e._CMLS[i].registeredDetectors&&(log("Running registered detectors.",e._CMLS[i].registeredDetectors),e._CMLS[i].registeredDetectors.forEach(function(t){if(!t.identity)return log("Invalid interface in detector: "+t.identity),!1;log("Checking registered detector: "+t.identity),t.detectTag&&t.detectTag()&&(log("Interface found in detector: "+t.identity),e._CMLS.adTag=t)})),!e._CMLS.adTag||!e._CMLS.adTag.rawInterface())return log("No interface found, rerunning detection."),void loopDetection()}}(window.self,jQuery),
/**
 * Googletag interface
 */
function(t,e,o){
//window._CMLS[parentNameSpace][nameSpace] = window._CMLS[parentNameSpace][nameSpace] || {};
function log(){t.top._CMLS&&t.top._CMLS.hasOwnProperty("logger")&&t.top._CMLS.logger(n+" v"+r,arguments)}var n="DFP INTERFACE",
//nameSpace = 'InterfaceDFP',
i="adTagDetection",r="0.1.2";t._CMLS=t._CMLS||{},t._CMLS[i]=t._CMLS[i]||{},t._CMLS[i].registeredDetectors=t._CMLS[i].registeredDetectors||[];var a=new t._CMLS[i].stubInterface;a.identity="dfp",a.detectTag=function(){if(t.googletag)return log("Googletag detected."),!0},a.rawInterface=function(){return t.googletag},a.addListener=function(t,e){a.queue(function(){a.pubads().addEventListener(t,e)})},a.removeListener=function(t,e){return a.pubads().removeEventListener(t,e)},a.setTargeting=function(t,e){return a.pubads().setTargeting(t,e)},a.defineSlot=function(t,e,o,n){var i=a.rawInterface().defineSlot.apply(null,t);if(e&&(i=i.setCollapseEmptyDiv(!0)),Array.isArray(o))o.forEach(function(t){for(var e in t)t.hasOwnProperty(e)&&(i=i.setTargeting(e,t[e]))});else if("object"==typeof o)for(var r in o)o.hasOwnProperty(r)&&(i=i.setTargeting(r,o[r]));return n&&(i=i.addService(a.pubads())),i},t._CMLS[i].registeredDetectors.push(a)}(window.self,jQuery),
/**
 * Add registered detector files for concatenation here.
 * Interfaces are detected in order and cascade until the
 * last detected interface wins. DFP should come first.
 */
// @codekit-prepend "interface.dfp.js"
window._CMLS.adTagDetection.detectTag(),function(o,h,v){function log(){h.top._CMLS&&h.top._CMLS.logger&&h.top._CMLS.logger(t+" v"+e,arguments)}
// Pushdowns only appear on homepages
var t="Pushdown Ad",e="0.6",n="6717",_="dfp-pushdown2",i=8,S=h.document;if(!S.querySelector("body.home"))return log("Not on homepage, exiting.");
// Don't run if our tag already exists
if(S.getElementById(_))return log("Tag already exists, exiting.");
// Must be run *after* googletag has been defined
if(!h.hasOwnProperty("googletag"))return log('DFP library must be included and "googletag" window variable must be available before including this library.');var y=h.googletag,C=h._CMLS&&h._CMLS.debounce?h._CMLS.debounce:function(t){t()},o=o.noConflict(),L=function(t,e){return new o.fn.init(t,e||h.document)},r;L.fn=L.prototype=o.fn,o.extend(L,o),r=function(e){function b(){o&&(h.requestAnimationFrame(b),e.fx.tick())}var o;3<=Number(e.fn.jquery.split(".")[0])?h.console&&h.console.warn&&h.console.warn("The jquery.requestanimationframe plugin is not needed in jQuery 3.0 or newer as they handle it natively."):h.requestAnimationFrame&&(e.fx.timer=function(t){t()&&e.timers.push(t)&&!o&&(o=!0,b())},e.fx.stop=function(){o=!1})},"function"==typeof define&&define.amd?define(["jquery"],r):r(o),
/*ignore jslint end*/
/*jsl:end */
/* jshint ignore:end */
y.cmd.push(function(){
/**
		 * Detect creative type within an ad container
		 * @param  {jQuery} $adFrame  iframe of ad
		 * @return {(string|boolean)} Type of ad creative, "image" "vast" "video"
		 */
function detectCreative(t){return t.length?t.contents().find("#vpContainer").length?"vast":t.contents().find(".img_ad").length?"image":!!t.contents().find("video").length&&"video":(log("Could not find DFP iframe within ad container."),!1)}
/**
		 * Format and display an Image creative type
		 * @param  {jQuery} $adFrame
		 * @return {boolean}
		 */function handleImage(t){log("Handling Image creative type.");var e=t.contents().find(".img_ad");if(!e.length)return log("Attempted to handle an image creative, but no image was found."),!1;
// Make image responsive
log("Making image responsive."),e.css({width:"100%",height:"auto"}),
// Detect an override for timeout
log("Checking for timeout override");var o=e.prop("alt").match(/timeout=(\d+)/i),n=o&&1<o.length?1e3*o[1]:8e3;return log("Triggering ad display with timeout",n),a.trigger("cmls.display",function(){s.trigger("cmls.start",[n,function(){log("Triggering ad removal."),a.trigger("cmls.hide")}])}),!0}
/**
		 * Setup and display a custom HTML video creative type
		 * @param  {jQuery} $adFrame
		 * @return {boolean}
		 */function handleVideo(t){log("Handling custom html video creative type.");var e=t.contents().find("video"),o=e.find("source");if(!e.length)return log("Attempted to handle a custom video creative, but no video tag was found."),!1;
// Ensure the current browser supports HTML video
if(!e[0].canPlayType)return log("Current browser does not support HTML video."),!1;
/**
			 * Check the video sources for a MIME type
			 * compatible with the current browser.
			 */var n=!1;return o.each(function(){var t=L(this).prop("type");return!t||!e[0].canPlayType(t).replace(/no/,"")||(n=L(this),!1)}),!1===n?(log("No video source was found to be compatible with this browser."),!1):(log("Video has a compatible source."),
// Set up video
e.prop("controls",!1).prop("muted",!0).prop("playsinline",!0).prop("autoplay",!1).on("mouseover",function(){e.prop("muted",!1)}).on("mouseout",function(){e.prop("muted",!0)}).on("canplaythrough",function(){a.trigger("cmls.display",function(){e[0].play()})}).on("playing",function(){s.trigger("cmls.start",1e3*this.duration)}).on("ended",function(){a.trigger("cmls.hide")}),log("Video initialized."),!0)}
/**
		 * Set up and display VAST-delivered video
		 * @param  {jQuery} $adFrame
		 * @return {boolean}
		 */function handleVast(i){log("Handling VAST-delivered creative.");var r={init:function(){log("Initializing VAST player.");var t=i.contents()[0],e=t.defaultView,o=t.getElementById("vpContainer");if(!o)return log("Attempted to handle VAST creative but no vpContainer was found."),!1;var n=o.getAttribute("data-vpurl");if(!n||n.length<1)return log("No vpurl attribute provided!"),!1;n=n.replace("[timestamp]",(new Date).getTime()).replace("[referrer_url]",h.location.href),e.player=new e.VASTPlayer(o),e.player.once("AdStopped",function(){r.stopped()}),e.player.load(o.getAttribute("data-vpurl")).then(function startAd(){r.ready()}).catch(function(t){r.error(t)})},ready:function(){var t,e=i.contents()[0].defaultView;
// Mute the player initially
e.player.adVolume=0,
// Unmute/mute on mouse over
a.on("mouseover",function(){e.player.adVolume=1}),a.on("mouseout",function(){e.player.adVolume=0}),a.trigger("cmls.display",function(){e.player.startAd().then(function(){log("VAST player playing."),s.trigger("cmls.start",1e3*e.player.adDuration)})})},stopped:function(){log("VAST player stopped."),a.trigger("cmls.hide")},error:function(t){log("Error from VAST player",t),a.trigger("cmls.hide")}};h._CMLS.vpPushdown=r;var t=i.contents()[0].createElement("script");t.onload=r.init,t.src="https://cdn.jsdelivr.net/npm/vast-player@latest/dist/vast-player.min.js",i.contents()[0].body.appendChild(t)}function checkRenderEvent(t){if(t.slot.getSlotElementId()===_){if(log("Caught relevant DFP render event.",t.slot.getSlotElementId()),t.isEmpty)return log("Slot was empty!"),a.trigger("cmls.hide"),!1;log("Handling ad.");var e=a.find("iframe:first");if(!e.length)return log("Attempted to handle ad, but no DFP iframe was found."),!1;var o=detectCreative(e);if(!o)return log("No supported ad creative type found."),!1;log("Ad type detected.",o),m[o](e)}}var o,// DFP ID string holder
a,// Ad container
t,s,// Virtual "timer" display
e,// "close" button
n,// CSS to inject
i,// Scripts to inject
r;// DOM position to inject within
if(!(r=L(".wrapper-content:first")).length)return log('Could not find ".wrapper-content" element.'),!1;
/**
		 * Inspects the googletag object to find the current site's
		 * DFP ID string for use in the generated tag.
		 */try{var l,c=y.pubads().getSlots();if(c.length&&(c.some(function(t){var e=t.getAdUnitPath();if(-1<e.indexOf("/6717/"))return o=e,!0}),null===o||o===v))throw{message:"Could not retrieve ad unit path."}}catch(t){return log("Failed to retrieve DFP properties.",t),!1}log('Ad path found, defining new slot with "/pushdown" level.',o+="/pushdown");
// Create our ad container
var d=S.createElement("div");d.id=_+"-container",d.style.display="none",a=L(d);var g=S.createElement("div");g.id=_,t=L(g).appendTo(a);var p=S.createElement("style");
// jshint multistr:true
p.innerText=" \t\t\t\t#"+_+"-container { \t\t\t\t\tfont-size: 24px !important; \t\t\t\t\tfont-size: 5vw !important; \t\t\t\t\tfont-weight: lightest !important; \t\t\t\t\tline-height: 0 !important; \t\t\t\t\tmargin: 0 auto !important; \t\t\t\t\tmax-width: 1020px !important; \t\t\t\t\toverflow: hidden !important; \t\t\t\t\tposition: relative !important; \t\t\t\t\tz-index: 1 !important; \t\t\t\t} \t\t\t\t#"+_+" { \t\t\t\t\tposition: relative; \t\t\t\t\tmargin-bottom: 10px; \t\t\t\t} \t\t\t\t#"+_+' div[id*="google_ads"] { \t\t\t\t\tposition: relative; \t\t\t\t\tpadding-bottom: 56.25%; \t\t\t\t\tmax-width: 100%; \t\t\t\t\theight: 0; \t\t\t\t\toverflow: hidden; \t\t\t\t} \t\t\t\t#'+_+" iframe { \t\t\t\t\twidth: 100%; \t\t\t\t\theight: 100%; \t\t\t\t\tposition: absolute; \t\t\t\t\ttop: 0; \t\t\t\t\tleft: 0; \t\t\t\t} \t\t\t\t#"+_+"-close { \t\t\t\t\tcolor: white; \t\t\t\t\tfont-family: sans !important; \t\t\t\t\ttext-shadow: .05em .05em .25em black; \t\t\t\t\tmix-blend-mode: exclusion; \t\t\t\t\tcursor: pointer; \t\t\t\t\tposition: absolute; \t\t\t\t\ttop: .75em; \t\t\t\t\tright: .3em; \t\t\t\t\tz-index: 100000; \t\t\t\t} \t\t\t\t#"+_+"-timer { \t\t\t\t\tbackground: #a33; \t\t\t\t\twidth: 0; \t\t\t\t\theight: 3px; \t\t\t\t\tposition: absolute; \t\t\t\t\tbottom: 7px; \t\t\t\t\tleft: 0; \t\t\t\t\tz-index: 100000; \t\t\t\t} \t\t\t\t@media (min-width: 550px) { \t\t\t\t\t#"+_+"-container { font-size: 24px !important; } \t\t\t\t} \t\t\t\t",n=L(p).appendTo(a),
// JS doesn't seem to execute when element is created otherwise...
i=L('<script> \t\t\t\tgoogletag.cmd.push(function() { \t\t\t\t\tgoogletag.display("'+_+'"); \t\t\t\t}); \t\t\t<\/script>').appendTo(t);var u=S.createElement("div");u.id=_+"-close",u.title="Close",u.innerText="✕",e=L(u).click(function(){a.trigger("cmls.hide")}).appendTo(a);var f=S.createElement("div");f.id=_+"-timer",s=L(f).appendTo(a),
/**
		 * Hiding and showing the ad container is controlled by events
		 */
a.on("cmls.display",function(t,e){log("Displaying ad"),a.stop().clearQueue().slideDown("fast"),e&&e()}),a.on("cmls.hide",function(t,e){log("Hiding ad."),s.trigger("cmls.reset"),a.stop().clearQueue().slideUp(),e&&e()}),
/**
		 * Events to control starting the timer div display and resetting
		 */
s.on("cmls.start",function(t,e,o){log("Timer display started with duration",e),s.trigger("cmls.reset",function(){log("Animating timerDiv"),s.animate({width:"100%"},e,"linear",o)})}),s.on("cmls.reset",function(t,e){log("Resetting timerDiv to 0"),s.stop().clearQueue().css("width",0),e&&(log("Callback from cmls.reset firing."),e())});var m={image:handleImage,video:handleVideo,vast:handleVast};y.pubads().addEventListener("slotRenderEnded",function(t){C(checkRenderEvent(t),500)}),log("Injecting ad tag."),y.defineSlot(o,[1020,574],_).setCollapseEmptyDiv(!0).setTargeting("pos","pushdown").addService(y.pubads()),r.prepend(a)})}(jQuery,window.self),
/**
 * Watches for changes to song data from Triton player,
 * updates DFP targeting criteria.
 */
function(o,t){function log(){o._CMLS.logger(e+" v"+i,arguments)}
// Only define once
var e="PLAYER WATCH",n="playerWatch",i="0.5";!o._CMLS[n]&&(
// Only operate if we're using Triton's player
o.TDPW?(o._CMLS[n]={initialized:!1,cache:{},timer:null,interval:2500,const:{STOPPED:0,PLAYING:1},
/**
		 * Sets targeting criteria in DFP
		 * @param {string} key   DFP targeting key
		 * @param {string} value DFP target value
		 */
setDFPCriteria:function setDFPCriteria(t,e){o.googletag=o.googletag||{},o.googletag.cmd=o.googletag.cmd||[],o.googletag.cmd.push(function(){log("Setting targeting",t,e),o.googletag.pubads().setTargeting(t,e)})},
/**
		 * Loads current track info from local storage, sets state.
		 * @return {[type]} [description]
		 */
checkCurrentTrack:function getCurrentTrack(){var t=!(!localStorage||!JSON)&&JSON.parse(localStorage.getItem("tdas.controller."+o.amp_player_config.station+"."+o.amp_player_config.stream_id+".events.current-state"));t&&t.data&&(
// Check and store the current play state
t.data.stream&&"LIVE_PLAYING"===t.data.stream.code.toUpperCase()?this.setState(this.const.PLAYING):this.setState(this.const.STOPPED),
// Check if song differs from cache
t.data.song&&t.data.song.id&&this.hasTrackChanged(t.data.song.id)&&this.trackHasChanged(t.data.song))},
/**
		 * Check if given state differs from cache, if so store it, set
		 * DFP criteria, and trigger events
		 * @param {Number} state Number representing state constant
		 */
setState:function setState(t){return t===this.const.PLAYING&&t!==this.cache.state?(log("Player is streaming."),this.cache.state=t,this.setDFPCriteria("td-player-state","PLAYING"),void o._CMLS.triggerEvent(o,"td-player.playing")):t===this.const.STOPPED&&t!==this.cache.state?(log("Player is stopped."),this.cache.state=t,this.setDFPCriteria("td-player-state","STOPPED"),void o._CMLS.triggerEvent(o,"td-player.stopped")):void 0},
/**
		 * Tests a given track ID against cache
		 * @param  {string}  id Track ID
		 * @return {Boolean}
		 */
hasTrackChanged:function hasTrackChanged(t){return!(!t||t===this.cache.trackId)},
/**
		 * Stores updated track info, sets DFP criteria, and triggers
		 * td-player.trackchange event.
		 * @param  {Object} data Data concerning song
		 * @return {void}
		 */
trackHasChanged:function trackHasChanged(t){log("Song has changed!",t),this.cache.trackId=t.id,t.artist&&this.setDFPCriteria("td-player-artist",t.artist),t.album&&this.setDFPCriteria("td-player-album",t.album),t.title&&this.setDFPCriteria("td-player-track",t.title),this.setDFPCriteria("td-player-id",t.id),o._CMLS.triggerEvent(o,"td-player.trackchange",t)},
/**
		 * Starts timer
		 * @return {void}
		 */
startTimer:function startTimer(){var t=this;clearTimeout(this.timer),this.timer=null,this.timer=setTimeout(function(){t.checkCurrentTrack(),t.startTimer()},this.interval)},
/**
		 * Initializes library, filling caches and starting the timer.
		 * @return {Object} Returns itself.
		 */
init:function init(){return o.amp_player_config&&o.amp_player_config.station&&o.amp_player_config.stream_id?(
// Refresh and check current track data
this.checkCurrentTrack(),this.startTimer(),this.initialized=!0,log("Initialized!",this.cache.trackId),this):(log("Player configuration not available, exiting."),!1)}},o._CMLS[n].init()):log("Triton player not enabled, exiting."))}(window),function(a,t){function log(){a.top._CMLS&&a.top._CMLS.hasOwnProperty("logger")&&a.top._CMLS.logger(e+" v"+n,arguments)}function initTest(){function testEventListener(t){r&&a.removeEventListener("cms-sgroup",testEventListener),-1<t.detail.indexOf("Format")&&(log('cms-sgroup "Format" event fired!'),initTest())}if(!r)return log("Testing initial state."),a._CMLS.cGroups?(a._CMLS.cGroups.forEach(function(t){if(!r)return/Format\s+.*(Talk|Sports)/i.test(t)?(log("Station is Talk or Sports format, initializing timer."),a._CMLS[o]=new i,void(r=!0)):void 0}),r?void 0:(log("Station is not Talk or Sports, no timer set."),!1)):(log("cGroups not available, will wait for cms-sgroup event."),void a.addEventListener("cms-sgroup",testEventListener,!1))}var e="AUTO REFRESH ADS",o="autoRefreshAds",n="0.5.2";if(a.DISABLE_AUTO_REFRESH_ADS)return log("Auto Refresh Ads is disabled");
// Time before refreshing ads
a._CMLS.autoRefreshAdsTimer=a._CMLS.autoRefreshAdsTimer||4;var i=function(t){
// Retrieves the window to refresh
function getWindow(){if(o.type===a._CMLS.const.PLAYER_TUNEGENIE){var t=a.top.document.querySelector("iframe#page_frame");if(t&&t.contentWindow)return log("Window context is page_frame"),t.contentWindow}return log("Window context is window"),a}
// Checks that autorefresh should happen
function checkConditions(){
// if autoReload is active, don't refresh ads
return!a.top._CMLS.autoReload||!a.top._CMLS.autoReload.active||(log("AutoReloadPage is active, autoRefreshAds will be disabled."),!1)}
// Check if we should fire now
function checkTimer(){if(!checkConditions())return log("Conditions have gone bad, killing timer."),void e.stop();var t=new Date;log("Checking timer",[t.toLocaleString(),i.toLocaleString()]),t.getTime()>=i.getTime()?
// It's time to fire a refresh!
fire():
// Not ready yet, start a new cycle
n=setTimeout(checkTimer,1e4)}
// Expose a way to check the current timer state
// Check current state of TuneGenie player
function checkTuneGeniePlayerState(t){return!0===t?(log("TuneGenie Player is streaming."),e.start(),!0):(log("TuneGenie Player has stopped."),e.stop(),!1)}
// Initialize TG player events
function fire(){if(!checkConditions())return log("Conditions have gone bad before firing, killing timer."),e.stop(),!1;var t=getWindow();log("Firing!",t._CMLS.adTag),t._CMLS.adTag.queue(function(){log("Refreshing page ads."),t._CMLS.adTag.refreshAds(),e.start()})}
// If we've been instantiated with an initial fire time, use it
var e=this,
// Determine which player we're using
o=a._CMLS.whichPlayer(),
// Contains the current timer
n=null,
// When the next firing event should occur
i=t||null,
// Current state
r=!1;this.checkState=function(){return r},
// Expose a way to stop the timer
this.stop=function(){log("Stopping timer."),clearTimeout(n),i=n=null,r=!1},
/**
		 * Exposed method to start the timer
		 * @param  {boolean} initFireTime (optional) Specify an initial start time
		 * @return {AutoRefresher}
		 */
this.start=function(t){if(e.stop(),!checkConditions())return log("Conditions are bad, timer will not start."),e;
// Set the fire time
t&&t instanceof Date?(log("Start called with a fire time.",t),i=t):e.resetFireTime(),log("Starting timer, will fire at "+i.toLocaleString()),checkTimer(),r=!0},
// Expose method to tear down timer and end listeners
this.destroy=function(){e.stop();
// Do we need to remove events??
},
// Expose method to retrieve fire time
this.getFireTime=function(){return i},
// Expose method to reset fire time
this.resetFireTime=function(){i=new Date((new Date).getTime()+6e4*a._CMLS.autoRefreshAdsTimer)},o.type===a._CMLS.const.PLAYER_TUNEGENIE&&(a.top.tgmp&&a.top.TGMP_EVENTS?(a.top.tgmp.addEventListener(a.top.TGMP_EVENTS.streamplaying,checkTuneGeniePlayerState),log("Now listening for TuneGenie Player events.")):log("TuneGenie player not available!")),i&&i instanceof Date&&(log("Instantiated with a time to fire, using it!"),e.start(i))},r=!1;log("Initializing."),initTest()}(window.self),
/**
 * Searches ad contents for local links that would interrupt the player,
 * and alters them to load through the player.  Supports TG and Triton.
 */
function(i,r,t){function log(){r._CMLS.logger(e+" v"+o,arguments)}function checkForPlayer(){log("Checking for player...",s),r._CMLS[a].isPlayerActive()?r._CMLS[a].init():20<s||(setTimeout(checkForPlayer,1e3),s++)}var e="NAV THROUGH PLAYER",a="navThroughPlayer",o="0.1",n=r._CMLS.whichPlayer();if(!r._CMLS[a]){r._CMLS[a]={isPlayerActive:function isPlayerActive(){return!!(n=r._CMLS.whichPlayer()).type},updateIframeLinks:function updateIframeLinks(e){if(r._CMLS[a].isPlayerActive){var t=e.jquery?e:i(e);
// make sure we can access this iframe
if(e.getAttribute("src")&&(e.getAttribute("src").indexOf(r.location.hostname)<0||0<e.getAttribute("src").indexOf("/safeframe/")))log("Ad iframe is in a safeframe, cannot update.",e);else try{t.contents().find('a[target="_self"],a[target="_top"],a[target="_parent"]').each(function(){log("Updating links in slot.",t.prop("id")),r._CMLS[a].updateLink(this)})}catch(t){log("Could not update links in given iframe",e,t)}}},updateLink:function updateLink(t,e){if(r._CMLS[a].isPlayerActive&&t){var o=t.jquery?t:i(t),n=r.document.createElement("a");n.href=o.prop("href"),n=(0===n.href.indexOf("/")||n.hostname!==r.location.hostname&&!e||o.off("."+a).on("click."+a,r._CMLS[a].clickThrough),null)}},clickThrough:function clickThrough(t){t&&r._CMLS[a].isPlayerActive()&&(t.preventDefault(),log("Intercepting click."),r._CMLS[a].navigate(t.currentTarget.href))},navigate:function navigate(t){
// Triton player
n.type===r._CMLS.const.PLAYER_TRITON&&r.History&&(log("Navigating through Triton player.",t),r.History.pushState(null,null,t)),
// TuneGenie player
n.type===r._CMLS.const.PLAYER_TUNEGENIE&&r.top.tgmp&&(log("Navigating through TuneGenie player.",t),r.top.tgmp.updateLocation(t))},init:function init(){r._CMLS[a].isPlayerActive()?(log("Initializing."),
// Hook into DFP render event to update new ads
r.googletag=r.googletag||{},r.googletag.cmd=r.googletag.cmd||[],r.googletag.cmd.push(function(){r.googletag.pubads().addEventListener("slotRenderEnded",function(t){if(t&&t.slot){var e=t.slot.getSlotElementId(),o=r.document.getElementById(e);r._CMLS[a].updateIframeLinks(o)}})}),
// Update any existing ads on the page
i('iframe[id^="google_ads_iframe"],#cmlsWallpaperInjectorContainer iframe').each(function(){r._CMLS[a].updateIframeLinks(this)}),i(r).load(function(){i('iframe[id^="google_ads_iframe"],#cmlsWallpaperInjectorContainer iframe').each(function(){r._CMLS[a].updateIframeLinks(this)})}),log("Initialized.")):log("No player is active, exiting.")}};
// Player may or may not be available at any load event we can hook to.
// Continuously check until we reach a limit or a player becomes available.
var s=0;checkForPlayer()}}(jQuery,window),
/**
 * Injects ads loaded into wallpaper ad slot behind content area
 */
function(u,f,m){function log(){f._CMLS.logger(e+" v"+n,arguments)}function WallpaperInjector(c){function determineTransitionEvent(){var t,e=document.createElement("fakeelement"),o={transition:"transitionend",OTransition:"otransitionend",MozTransition:"transitionend",WebkitTransition:"webkittransitionend",msTransition:"mstransitionend"};for(t in o)if(e.style[t]!==m)return o[t]}function checksum(t){var e=0,o=t.length,n,i;if(0===o)return e;for(n=0;n<o;n++)e=(e<<5)-e+(i=t.charCodeAt(n)),e&=e;return e}function refreshCache(){return d.dfpSlot=u(c.dfpSlotNode),d.injectionNode=u(c.injectionNode),d.stickNode=u(c.stickNode),d.contentNode=u(c.contentNode),d.footerNode=u(c.footerNode),d.obstructiveNode=u(c.obstructiveNode),d.window=u(f),d.document=u(f.document),refreshStickAtPosition(),d}function refreshStickAtPosition(){return log("Refreshing stick position."),d.stickAt=d.stickNode.length?d.stickNode.offset().top:0,d.stickAt}function getContainer(t){if(d.container&&d.container.length)return d.container;var e=u("#"+p+"Container");if(e.length)return d.container=e,d.container;if(!0===t)return!1;log("Generating new wallpaper container."),refreshCache();var o=u("<div />",{id:p+"Container",class:p+"-container"});return d.injectionNode.prepend(o),d.container=o,raiseContentArea(),d.container}function raiseContentArea(){var t=getContainer(),e={content:d.contentNode.css(["position","zIndex"]),footer:d.footerNode.css(["position","zIndex"])};"static"===e.content.position&&(log("Setting content area position to relative."),d.contentNode.css("position","relative")),("auto"===e.content.zIndex||e.content.zIndex<=t.css("zIndex"))&&(log("Raising content area above wallpaper container."),d.contentNode.css("zIndex",t.css("zIndex")+1)),"static"===e.footer.position&&(log("Setting footer area position to relative."),d.footerNode.css("position","relative"),d.footerNode.css("zIndex",t.css("zIndex")+2)),d.contentNode.data("originalStyles",e.content),d.footerNode.data("originalStyles",e.footer),log("Content area has been raised.")}function show(){var t;log("Displaying wallpaper."),getContainer().off(i).addClass(p+"-open"),d.obstructiveNode.hide(),startTrackingScroll()}function _reset(){function finishRemoval(){n=!0,d.obstructiveNode.show(),log("Clearing all event listeners."),d.window.off("."+p),e&&e.length&&(log("Removing wallpaper container."),e.off("."+p).remove()),d.container=null,t.resolve()}var t=u.Deferred(),e=getContainer(!0),o=!(!e||!e.length)&&e.hasClass(p+"-open"),n=!1;return log("RESET!"),e&&e.length?(e.off(i).removeData().removeProp("data").css("backgroundColor","rgba(0,0,0,0)").removeClass(p+"-open").removeClass(p+"-fixed"),log("Container is closing."),i&&o&&e.on(i,function(t){
// Assume opacity takes longest
"opacity"===t.originalEvent.propertyName&&(log("Transition complete."),finishRemoval())}),setTimeout(function(){n||finishRemoval()},800)):finishRemoval(),log("Returning our promise."),t.promise()}function isFixed(){var t;return getContainer().hasClass(p+"-fixed")}function toggleFixed(t){var e=getContainer();isFixed()&&!1===t&&(log("Unfixing wallpaper position."),e.removeClass(p+"-fixed").css("top","0")),isFixed()||!0!==t||(log("Fixing wallpaper position."),refreshStickAtPosition(),e.addClass(p+"-fixed").css("top",d.stickAt))}function startTrackingScroll(){function hasPassedStickPosition(){var t=d.window.scrollTop(),e;return(d.injectionNode.length?d.injectionNode.offset().top:0)<t+d.stickAt}log("Initializing scroll tracking."),refreshStickAtPosition(),hasPassedStickPosition()?toggleFixed(!0):toggleFixed(!1),d.window.on("scroll."+p,t(function(){hasPassedStickPosition()?toggleFixed(!0):toggleFixed(!1)},50)),d.window.on("resize."+p,e(function(){refreshStickAtPosition()},500)),log("Scroll tracking enabled.")}function _process(){try{if(u(c.contentNode).height()<200)return g===m&&(g=20),0===g?(log("Timed out waiting for content node."),void(g=m)):(log("Content node is not ready, retrying.",--g),void setTimeout(function(){_process()},500));refreshCache(),log("Processing wallpaper slot.");var t,e=d.dfpSlot.find("iframe").contents().find("#google_image_div,body").first(),n=e.find("a:first"),i=e.find("img.img_ad:first,img:first").first(),o=i.prop("alt");if(log("Checking image."),!i.length)return log("No image found in ad slot! Resetting."),void _reset();var r=getContainer(),a=checksum((n.length?n.prop("href")+n.prop("target"):"")+i.prop("src"));
// We get a simple "hash" of the image url and link so we don't try to
// replace the same background twice
if(log("Generated hash.",a),a===r.data("hash"))return void log("Requested wallpaper is already set.");log("Getting background color.",o);var s="rgba(255,255,255,0)",l=o.match(/(\#[A-Za-z0-9]+)/)||!1;l&&1<l.length&&(s=l[1]),log("Using background color.",s),_reset().then(function(){log("Building the new wallpaper.");var t="";n.length&&(t=u("<a />",{href:n.prop("href"),target:n.prop("target")}),
// If navThroughPlayer library is available, use it
f._CMLS.navThroughPlayer&&f._CMLS.navThroughPlayer.updateLink(t[0]));
// Build the iframe
var e=u("<iframe />",{name:p+"Iframe",scrolling:"no",marginWidth:"0",marginHeight:"0",frameborder:"0"});log("Injecting iframe into container."),(r=getContainer()).data("hash",a).css("backgroundColor",s).append(e);var o='<style>html,body{background:transparent;margin:0;padding:0;width:100%;height:100%;}body{background:url("'+i.prop("src")+'") no-repeat top center;}'+(-1<i.prop("alt").indexOf("contain")?"body{background-size:100%}":"")+"a{display:block;width:100%;height:100%;text-decoration:none;}</style>";e.load(function(){log("Injecting wallpaper into iframe."),e.contents().find("body").append(o,t)}).prop("src","about:blank"),i.length?(log("Initializing preloader."),u("<img />").bind("load",function(){show(),u(this).remove()}).prop("src",i.prop("src"))):show()})}catch(t){console.log("WTF PEOPLE",t)}}
// Hook into ad render event to intercept new ads.
function checkRenderEvent(t){var e;if(-1<t.slot.getTargeting("pos").indexOf("wallpaper-ad"))return log("Caught render event for wallpaper-ad",t.slot.getSlotElementId()),t.isEmpty?(log("Slot was empty, resetting wallpaper container."),_reset()):(log("Slot contained an ad, processing wallpaper."),_process()),!1}function _unbindAllListeners(){u(f).off("."+p)}var d={},g,p=c.nameSpace||"wallpaperInjector",t=f._CMLS.throttle,e=f._CMLS.debounce,i=determineTransitionEvent();this.reset=_reset,this.process=_process,this.unbindAllListeners=_unbindAllListeners,
/*-------------------------------------------------*/
log("Initializing."),f.googletag=f.googletag||{},f.googletag.cmd=f.googletag.cmd||[],f.googletag.cmd.push(function(){f.googletag.pubads().addEventListener("slotRenderEnded",function(t){e(checkRenderEvent(t),1e3)})});var o='<style id="'+p+'Styles">.'+p+"-container {display: block !important;position: absolute;z-index: 0;top: 0;left: 0;height: 0 !important;width: 100% !important;overflow: hidden;text-align: center;transition: opacity 0.5s, height 0.6s, background-color 0.4s;opacity: 0;}."+p+"-container iframe {border: 0;height: 100%;width: 100%;}."+p+"-container ~ .grid-container {transition: box-shadow 0.6s}."+p+"-open {height: 100% !important;opacity: 1;}."+p+"-open ~ .grid-container {box-shadow: 0 0 20px rgba(0,0,0,0.3);}."+p+"-fixed {position: fixed;}"+c.dfpSlotNode+" {display: none !important;}</style>";f.document.getElementById(p+"Styles")||u("head").append(o),
// Process any wallpapers that exist at loadtime.
"complete"===f.document.readyState||"loaded"===f.document.readyState?_process():u(function(){_process()})}var t={
// ID of wallpaper ad's slot div
dfpSlotNode:"#div-gpt-ad-1418849849333-16",
// Node selector for where to inject wallpaper
injectionNode:".wrapper-content",
// Node selector for determining stick position on scroll.
// Wallpaper will stick once it scrolls to the initial TOP
// position of this node.
stickNode:".wrapper-header",
// Content area selector
contentNode:".wrapper-content .grid-container:first",
// Footer selector
footerNode:".wrapper-footer",
// Node selectors to hide/show along with wallpaper changes.
obstructiveNode:".takeover-left, .takeover-right, .skyscraper-left, .skyscraper-right"},e="WALLPAPER INJECTOR",o="wallpaperInjector",n="0.5";
/*-----------------------------------------------------------------------------------------*/f._CMLS[o],t.nameSpace=o,f._CMLS[o]=new WallpaperInjector(t)}(jQuery,window),function(d,t,e){function log(){g.logger(o+" v"+i,arguments)}
/**
	 * If we're not the top window, assume we're on a second click in the TuneGenie player
	 * and activate the sponsor adtag in the parent window.
	 */function init(){var c=t.top.googletag||{};c.cmd=c.cmd||[],c.cmd.push(function(){d(function(){
// Eject if our tag already exists.
if(d("#CMLSPlayerSponsorship").length)log("Container already exists, exiting.");else{
// Attempt to fetch the site's DFP properties and ad unit paths
log("Discovering local site ad path.");var t=null;try{var e=c.pubads(),o=Object.getOwnPropertyNames(e);for(var n in o){var i=e[o[n]];if(i.constructor&&i.constructor===Array)for(var r in i[0])if(i[0][r]&&i[0][r].constructor===String&&-1<i[0][r].indexOf("/6717/")){t=i[0][r];break}if(t)break}if(null===t)throw{message:"Could not retrieve ad unit path."}}catch(t){return void log("Failed to retrieve DFP properties.",t)}log("Ad path found, defining new slot.",t);var a=c.defineSlot(t,[[120,60]],"CMLSPlayerSponsorship");a&&a.addService(c.pubads()).setCollapseEmptyDiv(!0).setTargeting("pos","playersponsorlogo"),
// Append ad container styles
d("body").append('<style id="CMLSPlayerSponsorshipStyle">#CMLSPlayerSponsorship {position: fixed;z-index: 2147483647;width: 120px;height: 60px;}#CMLSPlayerSponsorship.cmls-player-tg {left: 50%;transform: translate(+300px, 0);}#CMLSPlayerSponsorship.cmls-player-triton {left: 50%;transform: translate(30px, 0);}#CMLSPlayerSponsorship.cmls-player-pos-bottom {bottom: 4px;}#CMLSPlayerSponsorship.cmls-player-pos-top {top: 4px;}#CMLSPlayerSponsorship.cmls-player-triton.cmls-player-pos-top {top: 5px;}@media (max-width: 75rem) {#CMLSPlayerSponsorship.cmls-player-tg {left: 50%;}}@media (max-width: 1042px) {#CMLSPlayerSponsorship.cmls-player-tg {display: none}}@media (max-width: 800px) {#CMLSPlayerSponsorship.cmls-player-triton {display: none}}</style>');
// Append ad container
var s=d('<div id="CMLSPlayerSponsorship"><script>googletag.cmd.push(function() { googletag.display("CMLSPlayerSponsorship")});<\/script></div>'),l=g.whichPlayer();l.position===g.const.PLAYER_POSITION_TOP&&s.addClass("cmls-player-pos-top"),l.position===g.const.PLAYER_POSITION_BOTTOM&&s.addClass("cmls-player-pos-bottom"),l.type===g.const.PLAYER_TRITON&&s.addClass("cmls-player-triton"),l.type===g.const.PLAYER_TUNEGENIE&&s.addClass("cmls-player-tg"),d("body").append(s),log("Slot initialized.")}})})}var o="PLAYER SPONSOR INJECTOR",n="playerSponsorInjector",i="0.1",g=t._CMLS;if(t.self===t.top){var r=function(){};r.prototype=[],r.prototype.push=function(){init()},t.self._CMLSPlayerSponsorshipInit=new r,d(init()),g[n]=i}else d(function(){t.parent._CMLSPlayerSponsorshipInit=t.parent._CMLSPlayerSponsorshipInit||[],t.parent._CMLSPlayerSponsorshipInit.push(1)})}(window.top.jQuery,window),
/**
 * Zergnet injector
 *
 * Injects Zergnet code on any post using the standard post template.
 */
function(t,e,o){function log(){e.top._CMLS&&e.top._CMLS.logger&&e.top._CMLS.logger(n+" v"+i,arguments)}var n="ZERGNET INJECTOR",
//nameSpace = 'zergnetInjector',
i="0.2";if(e.top.NO_ZERGNET||e.parent.NO_ZERGNET||e.NO_ZERGNET)return log("Opted out with window.NO_ZERGNET, ejecting.");var r=e.document;
// Make sure we're in the right layout
if(
// Must be a single post
r.body.className.indexOf(" single ")<0||
// Must not use the full page layout
-1<r.body.className.indexOf("layout-using-template-1"))return log("Not a single post layout");
// Find the main page article
var a=r.querySelector(".wrapper-content > .grid-container > .row-1 > .column-1 > .block-type-content > .block-content > .loop > article.post.format-standard,.wrapper-content > .grid-container > .row-1 > .column-1 > .block-type-content > .block-content > .loop > article.feed_post,.wrapper-content > .grid-container > .row-1 > .column-1 > .block-type-content > .block-content > .loop > article.feed_posts");if(!a)return log("Could not discover main page article.");
// Check any special conditions on the main page article
if(800<a.getBoundingClientRect().width)return log("Found main page article, but it's suspiciously wide so we think it is not a normal post.");
// Find the parent column
var s=r.querySelector(".wrapper-content > .grid-container > .row-1 > .column-1");if(!s)return log("Could not determine column.");log("Injecting Zergnet");
// Create the injection point
var l=r.createElement("div");l.id="zergnet-widget-61785",
//main_article.parentNode.insertBefore(injectpoint, main_article.nextSibling);
s.appendChild(l);
// Zergnet code
var c=document.createElement("script");c.type="text/javascript",c.async=!0,c.src=("https:"===document.location.protocol.toLowerCase()?"https:":"http:")+"//www.zergnet.com/zerg.js?id=61785";var d=document.getElementsByTagName("script")[0];d.parentNode.insertBefore(c,d)}(jQuery,window.self),function(t,e,o){function log(){e._CMLS.logger(n+" v"+r,arguments)}function fireEvent(t){try{log("Event fired: "+t),sharedContainerDataLayer.push({event:t}),corpDataLayer.push({event:t})}catch(t){}}var n="GTM STREAM TRACKING",i="GTMStreamTracker",r="0.3";
/**
	 * Only load if TG player is enabled
	 */e.top.tgmp&&!e._CMLS[i]&&(e._CMLS[i]=!0,e.top.tgmp.addEventListener(e.top.TGMP_EVENTS.streamplaying,function(t){!0===t?(log("Stream started."),fireEvent("siteplayer-stream-playing")):!1===t&&(log("Stream stopped."),fireEvent("siteplayer-stream-stopped"))}),e.addEventListener("td-player.playing",function(){fireEvent("siteplayer-stream-playing")}),e.addEventListener("td-player.stopped",function(){fireEvent("siteplayer-stream-stopped")}),log("Initialized."))}(jQuery,window),
/**
 * Emit GTM events when a promo reel item is clicked
 */
function(o,t,e){function log(){window._CMLS.logger(n+" v"+r,arguments)}function fireEvent(t,e){try{log("Event fired: "+t,e),sharedContainerDataLayer.push({event:t,promoReelClickURL:e}),corpDataLayer.push({event:t,promoReelClickURL:e})}catch(t){}}var n="GTM PROMO REEL TRACKING",i="GTMPromoReelTracker",r="0.1";window._CMLS[i]=!0,o(function(){var t;o(".home .sliderItem").click(function(){var t=o(this),e=t.attr("data-href");(!e||e.length<1)&&(e=t.attr("onclick").replace(/window\.open=\(\'([^\']+).*/,"$1").replace(/window\.location=\'([^\']+).*/,"$1")),fireEvent("promoreel-click",e)})})}(jQuery,window.self),
/**
 * Emit GTM events when tab visibility changes
 */
function(o,t){function log(){window._CMLS.logger(e+" v"+i,arguments)}function fireEvent(t,e,o){try{log("Event fired: "+t,e,o),sharedContainerDataLayer.push({event:t,"page-visible":e,"page-visible-time-change":o}),corpDataLayer.push({event:t,"page-visible":e,"page-visible-time-change":o})}catch(t){}}function handleVisibilityChange(t){var e=Math.round((o._CMLS.now()-s)/1e3);t||(t=o.document[r]?"hidden":"visible"),fireEvent("page-visibility",t,e),s=o._CMLS.now()}var e="GTM TAB VISIBILITY TRACKING",n="GTMTabVisibilityTracker",i="0.1",r,a;window._CMLS[n]=!0,void 0!==o.document.hidden?(// Opera 12.10 and Firefox 18 and later support 
r="hidden",a="visibilitychange"):void 0!==o.document.mozHidden?(r="mozHidden",a="mozvisibilitychange"):void 0!==o.document.msHidden?(r="msHidden",a="msvisibilitychange"):void 0!==o.document.webkitHidden?(r="webkitHidden",a="webkitvisibilitychange"):void 0!==o.document.oHidden&&(r="oHidden",a="ovisibilitychange");var s=o._CMLS.now();o.document.addEventListener(a,function(){handleVisibilityChange()},!1)}(window.self),function(a,t){function log(){a._CMLS&&a._CMLS.logger&&a._CMLS.logger(e+" v"+o,arguments)}function AutoReloader(){function checkCondition(){return t.type===a._CMLS.const.PLAYER_TUNEGENIE&&a.page_frame?a.page_frame.document.querySelector(o.condition):a.document.querySelector(o.condition)}function getDateWithOffset(t){return new Date(Date.now()+t)}var e={condition:"body.home",timeout:8},o=e,n,i,t=a._CMLS.whichPlayer(),r=this;this.start=function(t){log("Starting timer.",t),r.stop(),o={condition:t.condition||e.condition,timeout:t.timeout||e.timeout},checkCondition()?(log("Starting countdown, reloading at "+(i=getDateWithOffset(6e4*o.timeout))),a._CMLS.autoReload&&(a._CMLS.autoReload.active=!0),n=setInterval(r.tick,1e4)):log("Condition check failed at start.")},this.stop=function(){n&&(log("Stopping timer."),clearInterval(n),n=null,a._CMLS.autoReload&&(a._CMLS.autoReload.active=!1))},this.tick=function(){Date.now()>i.getTime()&&r.fire()},this.fire=function(){r.stop(),checkCondition()?(log("Reloading page."),t.type===a._CMLS.const.PLAYER_TRITON&&a.History&&a.History.Adapter?a.History.Adapter.trigger(a,"statechange"):t.type!==a._CMLS.const.PLAYER_TUNEGENIE?a.location.reload():a.tgmp.updateLocation(a.location.href)):log("Condition check failed before firing, timer stopped.")},this.push=function(t){log("Received request.",t),r.start(t)}}
// Handle existing requests
var e="AUTO-RELOAD PAGE",
//nameSpace = 'autoReload',
o="0.9",n;a._CMLS&&(a._CMLS.autoReload&&a._CMLS.autoReload.constructor===Array&&a._CMLS.autoReload.length&&(log("Loaded with request.",a._CMLS.autoReload),n=a._CMLS.autoReload[a._CMLS.autoReload.length-1]),a._CMLS.autoReload&&a._CMLS.autoReload.constructor!==Array||(a._CMLS.autoReload=new AutoReloader)),log("Initialized."),n&&a._CMLS.autoReload.push(n)}(window.top),function(t,e,o){function log(){e.top._CMLS&&e.top._CMLS.logger&&e.top._CMLS.logger(n+" v"+r,arguments)}var n="ADDTHIS INJECTOR",i="addThisInjector",r="0.6.17",
// AddThis PubId to use
a="ra-55dc79597bae383e";if(e.self.addthis&&e.self.addthis_config&&e.self.addthis_config.pubid&&e.self.addthis_config.pubid!==a)log("AddThis already loaded by local page.");else if(
/*
	var addthis_properties = [
		'addthis',
		'addthis_close',
		'addthis_conf',
		'addthis_config',
		'addthis_exclude',
		'addthis_open',
		'addthis_options',
		'addthis_options_default',
		'addthis_options_rank',
		'addthis_sendto',
		'addthis_share',
		'addthis_use_personalization',
		'_adr',
		'_atc',
		'_atd',
		'_ate',
		'_atr',
		'_atw'
	];
	*/
e.self!==e.top?(log("Not top window."),e.top.addthisDestroyer&&e.top.addthisDestroyer(),t(e).unload(function(){log("Removing AddThis layers."),t(".addthis-smartlayers").remove()})):(log("Loaded in top window."),e.top.addthisDestroyer=function(){if(log("Removing addthis from top window."),t('script[src*="addthis"]').remove(),e.top.addthisLayerReference){log("Instructing addthis to destroy itself.");try{e.top.addthisLayerReference.destroy()}catch(t){}delete e.top.addthisLayerReference,t(".addthis-smartlayers").remove()}else log("No addthis object in top window.")}),e.self.NO_ADDTHIS_HERE)log("NO_ADDTHIS_HERE found, will not build.");else if(e.top._CMLS&&e.top._CMLS.hasOwnProperty("isHomepage")&&e.top._CMLS.isHomepage(e.self))log("Will not build on homepage, exiting.");else{e.self.addthis_config=e.self.addthis_config||{},e.self.addthis_config.pubid=a,log("Building addthis script.");var s=e.self.document.createElement("script");s.onload=function(){
//buildLayer();
},s.src="//s7.addthis.com/js/300/addthis_widget.js#async=1",s.id=i+"-script",s.async=!0,e.self.document.head.appendChild(s),log("Injected.")}}(jQuery,window),
/**
 * Breaking News Banner
 * Injects a breaking news banner above or below the masthead with specified options.
 *
 * SIMPLE USAGE:
 * <script>
 * window._CMLSBreakingNews = window._CMLSBreakingNews || [];
 * window._CMLSBreakingNews.push(['Text to display in bar', 'http://example.com']);
 * </script>
 *
 * ADVANCED USAGE:
 * <script>
 * window._CMLSBreakingNews = window._CMLSBreakingNews || [];
 * window._CMLSBreakingNews.push({
 * 	position: 'below',
 * 	background: '#349',
 * 	beforeText: 'Not So Breaking News:',
 * 	text: 'This is a more advanced usage which allows more options. It <a href="http://example.com" target="_blank">supports HTML</a>.'
 * });
 * </script>
 *
 * NOTE: If calling this from inside an ad, YOU MUST replace every instance of window._CMLSBreakingNews
 * in the example code with parent._CMLSBreakingNews
 */
function(c,d,t){function log(){p.logger(e+" v"+o,arguments)}var e="BREAKING NEWS BAR",g="BreakingNews",o="0.7",p=d._CMLS||{};Array.isArray||(Array.isArray=function(t){return"[object Array]"===Object.prototype.toString.call(t)}),p[g]=function(t,e){log("Called",typeof t,t,e);var o={classPrefix:"cmlsBreakingNews",additionalClass:"",position:"above",link:"",target:"_top",beforeText:"Breaking News:",text:"",background:"#900",color:"#fff"},n,i=".wrapper-header";if(c(i).length){if("object"!=typeof t||Array.isArray(t))if("object"==typeof t&&Array.isArray(t)&&t.length)(n=o).text=t[0],1<t.length&&(e=t[1]),log("Basic mode!");else{if("object"==typeof t)return void log("Invalid usage!",t,e);(n=o).text=t,log("Basic mode!")}else n=c.extend({},o,t),log("Advanced mode!");!n.link&&e&&(n.link=e),log("Settings:",n);var r="."+n.classPrefix+"-container { display: block; box-sizing: border-box; position: relative; float: none; overflow: hidden; z-index: 10; padding: 1em; color: #fff; background: #900; box-shadow: 0 0 10px rgba(0,0,0,0.4); font-size: 14px; line-height: 1.2; text-decoration: none; outline: 0 }."+n.classPrefix+"-container > a { display: block; color: inherit !important; cursor: pointer; padding: 1em; margin: -1em; }."+n.classPrefix+"-container > a:hover ."+n.classPrefix+"-before { text-decoration: underline; }."+n.classPrefix+"-inner { box-sizing: border-box; max-width: 1020px; margin: 0 auto; }."+n.classPrefix+"-before { float: left; font-weight: bold; margin-right: .5em; }."+n.classPrefix+"-text { overflow: hidden; }."+n.classPrefix+"-inner a { text-decoration: underline !important; color: inherit; }@media (max-width: 500px) {."+n.classPrefix+"-before { float: none; margin-bottom: .25em; }}",a='<div class="'+n.classPrefix+'-container"><div class="'+n.classPrefix+'-inner">{{BEFORE}}<div class="'+n.classPrefix+'-text">{{TEXT}}</div></div></div>';if(n.beforeText&&n.beforeText.length){var s='<div class="'+n.classPrefix+'-before">'+n.beforeText+"</div>";a=a.replace("{{BEFORE}}",s)}if(a=c(a.replace("{{TEXT}}",n.text)),n.link&&n.link.length){var l=c("<a></a>").prop({href:n.link,target:n.target});a.wrapInner(l)}a.css({background:n.background,color:n.color}),a.addClass(n.additionalClass).prop("id","CMLS"+g+"-"+Math.floor(1e7*Math.random())),c("#cmlsBreakingNewsStyles").length||c("head").append('<style id="cmlsBreakingNewsStyles">/* CMLS Breaking News Bar styles */\n'+r+"</style>"),"below"===n.position?(c(i).after(a),c("#cmlsBreakingNewsStyles").append(".takeover-left,.takeover-right,.skyscraper-left,.skyscraper-right { margin-bottom: -"+a.outerHeight()+"px; }")):c(i).before(a),
// If navThroughPlayer library is available, use it.
p.navThroughPlayer&&(log("Applying navThroughPlayer to bar links."),a.find('a:not([href]),a[target="_self"],a[target="_top"],a[target="_parent"]').each(function(){log("Applying navThroughPlayer to a link.",this.href),p.navThroughPlayer.updateLink(c(this))})),
// Disable auto-scroll if active
"above"===n.position&&(d.DO_NOT_AUTO_SCROLL=!0)}};var n=function(){};n.prototype=[],n.prototype.push=function(){log("Received after-load request.",arguments),p[g].apply(null,arguments)},d["_CMLS"+g]&&d["_CMLS"+g].length&&d["_CMLS"+g].forEach(p[g]),d["_CMLS"+g]=new n}(jQuery,window),
/**
 * Activates any listen live button found in the social icon row
 * to start the TuneGenie stream when clicked.
 */
function(e,o,t){function log(){o._CMLS.logger(n+" v"+r,arguments)}var n="SOCIAL LISTEN LIVE LINK",i="socialListenLiveLink",r="0.1";o._CMLS=o._CMLS||{},log("Starting..."),
// Only run once.
/*
	if (window._CMLS[nameSpace]) {
		log('Already loaded, exiting.');
		return;
	}
	*/
e(function(){if(o.top.tgmp){log("Storing TGMP default configuration."),o.top.tgmp_default_brand=o.top.tgmp_default_brand||""+o.top.tgmp.options.brand,o.top.tgmp_default_theme=o.top_tgmp_default_theme||o.top.tgmp.options.theme,log("Locating Listen Live button.");var t=e('.social-icons img[title="Listen Live!!"],.social-icons-container img[title="Listen Live!!"],.nav-listenlive img');t.length?(t.parent().is("a")&&(t=t.parent()),t.click(function(t){t.preventDefault(),log("Playing stream..."),o.top.tgmp_default_brand&&o.top.tgmp.options.brand!==o.top.tgmp_default_brand?o.top.tgmp.update({brand:o.top.tgmp_default_brand,theme:o.top.tgmp_default_theme,autostart:!0}):o.top.tgmp.playStream()}),log("Social Listen Live button activated.")):log("Could not locate Listen Live button in social icons.")}else log("TuneGenie player not enabled.")}),o._CMLS[i]=r,log("Initialized.")}(jQuery,window),
/**
 * Inform video injector
 * Received DPID (Inform's market ID) from local container
 * and injects Inform's player initializer
 * 
 * Local usage:
 * window._informinjector.push({
 *	id: '1234'
 * });
 */
function(i,o,t){function log(){if(o.top._CMLS&&o.top._CMLS.logger)return o.top._CMLS.logger(e+" v"+r,arguments)}
// Make sure we're on a post
/**
	 * Returns a post ID for the current page,
	 * or false if this is not a post page
	 */
function getPostId(){var t=o.document.body.className.match(/postid\-(\d+)/);return!!(t&&1<t.length&&parseInt(t[1],10))&&t[1]}function InformInjector(){
/**
		 * Returns a formatted Inform embed template
		 * @param   id     int    Inform DPID
		 * @param   pos    string Position indicator string
		 * @returns string
		 */
function getTemplate(t,e){return t?(e||(e="inform-pp-top"),n.replace("{POS_ID}",e).replace("{DPID}",t)):(log("getTemplate called without DPID"),!1);var o}
/**
		 * Injects inform video embeds
		 * @param id int Inform DPID
		 * @return boolean
		 */function injectInform(t){if(log("Inject called",t),!t)return log("Inject called without DPID."),!1;var e=getPostId();if(!1===e)return log("Could not retrieve post ID while injecting",t),!1;log("Post ID retrieved",e);
// Retrieve P tags in article
var o=i("article#post-"+e+" .entry-content > p:not(:has(img)):not(.read-more-full-link),article#post-"+e+" .entry-content > *:not(.themify_builder_content) p:not(:has(img)):not(.read-more-full-link)");if(o.length)return log("Found "+o.length+" p tags."),4<o.length?(log("Injectng top embed after 5th p tag"),o.eq(4).after(getTemplate(t,"inform-pp-top"))):1<o.length?(log("Injecting top embed after 1st p tag."),o.first().after(getTemplate(t,"inform-pp-top"))):log("Not enough p tags to inject top embed."),8<o.length?(log("Injecting bottom embed after last p tag."),o.last().before(getTemplate(t,"inform-pp-bottom"))):log("Not enough p tags to inject bottom embed."),!0;log("No valid p tags found in post.")}
/**
		 * Receives an object in the format
		 * { id: int }
		 */function _process(t){try{if(!t||!t.id)throw{message:"Invalid request, no ID",data:t};log("Received request to inject Inform embed with ID "+t.id),injectInform(t.id)}catch(t){log("Failed",t)}}var n='<div class="ndn_embed" id="{POS_ID}" data-config-distributor-id="{DPID}" data-config-width="100%" data-config-aspect-ratio="16:9"></div><script type="text/javascript">var _informq = _informq || []; _informq.push(["embed"]);<\/script>';
// Handle any existing requests that came before library loaded
if(this.process=_process,o._informinjector&&o._informinjector.length){log("Found existing requests, processing.",o._informinjector);for(var t=0;t<o._informinjector.length;t++)_process(o._informinjector[t])}log("Initializing InformInjector array handler.");var e=function(){};e.prototype=[],e.prototype.push=function(){for(var t=0;t<arguments.length;t++)arguments[t].id&&i(_process(arguments[t]))},
// Reassign our fake array for future requests
o._informinjector=new e,log("Listening for future requests.")}
// Remove any existing inform base script
var e="INFORM INJECTOR",n="informInjector",r="0.2";if(o.document.body.className.indexOf("single-feed_posts")<0&&o.document.body.className.indexOf("single-post")<0)return log("Not a post, ejecting.");i("script#informbase").remove(),
// Inject new inform base script
i('<script type="text/javascript" id="informbase" src="//launch.newsinc.com/js/embed.js"><\/script>').appendTo("head"),
// Start the injector
o._CMLS=o._CMLS||{},o._CMLS[n]=new InformInjector,log("Initialized.")}(jQuery,window.self),
/**
 * Easily create a button that switches the TGMP stream
 * by adding classes to an element.
 *
 * Classes:
 * 	tgmp-switchstream: Enables the action
 * 	tgmp-streamid-xxxx: Stream ID to switch to (change "xxxx")
 * 	tgmp-autostart: OPTIONAL. Automatically start playing when clicked.
 *  tgmp-theme-######: OPTIONAL. Theme color to apply, 6 digits.
 * 
 * Example:
 *
 * <a href="#" class="tgmp-switchstream tgmp-streamid-wxyz tgmp-theme-550000 tgmp-autostart">Switch Stream</a>
 * 
 */
function(t,r,e){function log(){r._CMLS&&r._CMLS.logger&&r._CMLS.logger(o+" v"+n,arguments)}r._CMLS=r._CMLS||{};var o="SWITCHSTREAM LINKS",n="0.4";r._CMLS.switchTGMPStream=function(t,e,o){var n=r.tgmp||r.top.tgmp||null,i={brand:t,autostart:!1};e&&(i.autostart=!0),o&&/\d+/.test(o)&&(i.theme=["#"+o]),n&&(log("Switching stream",i),n.update(i))},log("Initializing switchstream links on page."),t(function(){
// tgmp-switchstream tgmp-streamid-laxspec tgmp-autostart
t('.tgmp-switchstream,img[alt*="tgmp-switchstream"],a[alt*="tgmp-switchstream"]').off("click.cmls-tg-switchstream").on("click.cmls-tg-switchstream",function(t){function getVars(t){return log("Requested vars",t),{streamid:t.match(/tgmp\-streamid\-(\w+)/i),theme:-1<t.indexOf("tgmp-theme")?t.match(/tgmp\-theme\-(\d+)/i)[1]:null,autostart:-1<t.indexOf("tgmp-autostart")}}log("Intercepted click",this);var e=this.className,o=this.getAttribute("alt"),n={streamid:null,theme:null,autostart:!1};if(e&&-1<e.indexOf("tgmp-switchstream")&&(log("Using element classes",e),n=getVars(e)),o&&-1<o.indexOf("tgmp-switchstream")&&(log("Using element alt attribute",o),n=getVars(o)),log("Got switchstream link",this,n),n.streamid&&n.streamid.length<2)return log("No stream ID provided, exiting.",n.streamid,n.streamid.length),!1;n.streamid=n.streamid[1],t.preventDefault(),r._CMLS.switchTGMPStream(n.streamid,n.autostart,n.theme)})})}(jQuery,window.self),function(i){function log(){i.top._CMLS&&i.top._CMLS.hasOwnProperty("logger")&&i.top._CMLS.logger(t+" v"+o,arguments)}function GlobalizeSGroups(){var t=0,o=0,n=this;this.fireEvents=function(t){i.sharedContainerDataLayer.push({event:t}),i.corpDataLayer.push({event:t}),i._CMLS.triggerEvent(i,"cms-sgroup",t)},this.globalize=function(){
// Attempt to discover DFP page targeting
if(!i._CMLS.adTag.pubads()||!i._CMLS.adTag.pubads().getTargeting("cms-sgroup"))
// DFP is not yet available, retry
return 10<t?(log("TERMINATING. Could not retrieve page targeting in a reasonable time."),!1):(log("DFP is not ready, waiting to retry...","Cycles: "+t),clearTimeout(o),o=null,o=setTimeout(n.globalize,500),void t++);
// Register sgroups in our global container
i._CMLS.cGroups=i._CMLS.adTag.pubads().getTargeting("cms-sgroup")||[],
// Fire events
i.sharedContainerDataLayer=i.sharedContainerDataLayer||[],i.corpDataLayer=i.corpDataLayer||[];var e=!1;i._CMLS.cGroups.forEach(function(t){log("Firing cms-sgroup event",t),n.fireEvents(t),-1<t.indexOf("Westwood One")&&(e=!0)}),!0===e?n.fireEvents("Westwood One Property"):n.fireEvents("Cumulus Owned and Operated")},n.globalize()}var t="GLOBALIZE SGROUPS",e="globalizeSGroups",o="0.6";i._CMLS[e]?log("Already registered."):i._CMLS.adTag.queue(function(){log("adTag command queue initiated."),i._CMLS[e]=new GlobalizeSGroups})}(window.self);
//# sourceMappingURL=compiled-allsites-min.js.map