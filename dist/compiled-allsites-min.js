!function(o,n){o._CMLS=o._CMLS||{},o._CMLS["const"]=o._CMLS["const"]||{},o._CMLS["const"].PLAYER_TUNEGENIE=8471,o._CMLS["const"].PLAYER_TRITON=8468,o._CMLS["const"].PLAYER_POSITION_TOP=80847980,o._CMLS["const"].PLAYER_POSITION_BOTTOM=80667984,o._CMLS.logger=function t(){if(!o._CMLS||!o._CMLS.debug||"object"!=typeof console||!console.debug)return!1;o._CMLS.loggerNamesToColors=o._CMLS.loggerNamesToColors||{};var n,t,e=arguments[0],r=Array.prototype.slice.call(arguments,1);o._CMLS.loggerNamesToColors[e]?(n=o._CMLS.loggerNamesToColors[e].background,t=o._CMLS.loggerNamesToColors[e].complement):(n=Math.floor(16777215*Math.random()).toString(16),t=("000000"+(16777215^parseInt(n,16)).toString(16)).slice(-6),o._CMLS.loggerNamesToColors[e]={background:n,complement:t});var l=new Date;l=l.toISOString()?l.toISOString():l.toUTCString(),r=[].concat(["%c["+e+"]","background: #"+n+"; color: #"+t,l],r),console.debug.apply(console,r)},o._CMLS.now=Date.now()||function(){return(new Date).getTime()},o._CMLS.throttle=function(n,t,e){var r,l,i,a=null,c=0;e||(e={});var s=function(){c=e.leading===!1?0:o._CMLS.now(),a=null,i=n.apply(r,l),a||(r=l=null)};return function(){var _=o._CMLS.now();c||e.leading!==!1||(c=_);var u=t-(_-c);return r=this,l=arguments,0>=u||u>t?(a&&(clearTimeout(a),a=null),c=_,i=n.apply(r,l),a||(r=l=null)):a||e.trailing===!1||(a=setTimeout(s,u)),i}},o._CMLS.debounce=function(n,t,e){var r,l,i,a,c,s=function(){var _=o._CMLS.now()-a;t>_&&_>=0?r=setTimeout(s,t-_):(r=null,e||(c=n.apply(i,l),r||(i=l=null)))},_=function(){i=this,l=arguments,a=o._CMLS.now();var _=e&&!r;return r||(r=setTimeout(s,t)),_&&(c=n.apply(i,l),i=l=null),c};return _.clear=function(){clearTimeout(r),r=i=l=null},_},o._CMLS.whichPlayer=function(){if(o._CMLS.whichPlayerCache)return o._CMLS.whichPlayerCache;var n={type:null,position:null};return o.tgmp?(n.type=o._CMLS["const"].PLAYER_TUNEGENIE,o.tgmp.options.position&&"bottom"===o.tgmp.options.position.toLowerCase()?n.position=o._CMLS["const"].PLAYER_POSITION_BOTTOM:o.tgmp.options.position&&"top"===o.tgmp.options.position.toLowerCase()&&(n.position=o._CMLS["const"].PLAYER_POSITION_TOP)):o.TDPW&&(n.type=o._CMLS["const"].PLAYER_TRITON,n.position=o._CMLS["const"].PLAYER_POSITION_TOP),o._CMLS.whichPlayerCache=n,o._CMLS.whichPlayerCache},o._CMLS.isHomepage=function(){return"/"===o.location.pathname&&/[\?&]?p=/i.test(o.location.search)===!1}}(window);
//# sourceMappingURL=./compiled-allsites-min.js.map