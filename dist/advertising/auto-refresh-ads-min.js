!function(e,t){function o(){if(e._CMLS&&e._CMLS.debug&&"object"==typeof console&&console.log){var t=new Date;t=t.toISOString()?t.toISOString():t.toUTCString(),console.log("%c[AUTO REFRESH ADS "+i+"]","background: #557b9e; color: #FFF",t,[].slice.call(arguments))}}function n(){e._CMLS&&e._CMLS[g]&&e._CMLS[g].timer&&(clearTimeout(e._CMLS[g].timer),e._CMLS[g].timer=null)}var g="AutoRefreshAds",i="0.1",r=6;e._CMLS=e._CMLS||{},e._CMLS[g]||(e._CMLS[g]={timer:null},e.addEventListener("td-player.playing",function(){e.googletag=e.googletag||{},e.googletag.cmd=e.googletag.cmd||[],e.googletag.cmd.push(function(){googletag.pubads().addEventListener("slotRenderEnded",function(){e._CMLS[g]&&e._CMLS[g].timer||(o("Starting timer."),e._CMLS[g].timer=setTimeout(function(){googletag&&googletag.pubads&&(o("Firing refresh."),googletag.pubads().refresh(),e._CMLS[g].timer=null)},6e4*r))}),googletag.pubads().refresh()})},!1),e.addEventListener("td-player.stopped",function(){n()},!1),e.addEventListener("statechange",function(){n()},!1))}(window);
//# sourceMappingURL=./auto-refresh-ads-min.js.map