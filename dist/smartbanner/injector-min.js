!function(e,t){function r(){e._CMLS&&e._CMLS.debug&&"object"==typeof console&&console.log&&console.log("[SMART APP BANNER INJECTOR "+a+"]",[].slice.call(arguments))}function n(){var e="undefined"!=typeof userAgent?userAgent:navigator.userAgent,t=e.split("[FBAN");"undefined"!=typeof t[1]&&(e=t[0]),r("UA",e);for(var n=[{vendor:l,regexp:/iP[honead]+/i},{vendor:c,regexp:/(?=.*\bAndroid\b)(?=.*\bMobile\b)/i}],o=0;o<n.length;o++)if(e.match(n[o].regexp))return n[o].vendor;return!1}function o(){return e._CMLS.smartBanner?(r("Injecting",i),void e._CMLS.smartBanner({icon:{color:i.backgroundColor},title:i.title,author:i.author,button:"View"})):void setTimeout(o,300)}var a="0.11",i={title:e.document.title,author:"Cumulus",backgroundColor:"transparent",appWidgetSelector:".free-apps,.mobile-apps",headerSelector:".wrapper-header",logoSelector:"figure.logo img",styleSheetUrl:"https://cdn.rawgit.com/cumulus-digital/amp-cms-utils/0a1cff3621f001382c724f36268123aa5f8f1c49/dist/smartbanner/smartbanner.css",libraryUrl:"https://cdn.rawgit.com/cumulus-digital/amp-cms-utils/0a1cff3621f001382c724f36268123aa5f8f1c49/dist/smartbanner/smartbanner-min.js"};if(e._CMLS=e._CMLS||{},e._CMLS.smartBannerEnabled)return void r("Already enabled, skipping.");var l="apple",c="google";if(!n())return void r("Unsupported device, exiting.");var u={getAppIds:function(e){var t={},n={apple:e.querySelector('a[href*="itunes.apple.com/us/app"]'),google:e.querySelector('a[href*="play.google.com/store/apps"]')};if(n.apple){var o=n.apple.getAttribute("href").match(/id(\d+)/i);o&&o.length&&(t.apple=o[1])}if(n.google){var a=n.google.getAttribute("href").match(/id=([0-9A-Za-z\.]+)/i);a&&a.length&&(t.google=a[1])}return n.apple||n.google?(r("Discovered app IDs",t),t):null},createMetaTags:function(t){r("Generating meta tags");var n=[],o={apple:"apple-itunes-app",google:"google-play-app"},a;for(var i in t)o[i]&&(a=e.document.createElement("meta"),a.setAttribute("name",o[i]),a.setAttribute("content","app-id="+t[i]),n.push(a));return n.length?(r("Generated meta tags",n),n):null},createNiceTitle:function(e){var t=e.replace(/(\|\s*)?Cumulus(\|\s*)?/,"").match(/\|\s*([^\|]*)(\|.*)?$/);return t&&t.length?(r("Using nice title",t[1]),t[1]):e},createIconLinks:function(t){if(!t)return null;var n=t.getAttribute("src");if(n){r("Generating link tags with logo image url",n);var o=e.document.createElement("link");o.setAttribute("rel","apple-touch-icon"),o.setAttribute("href",n);var a=e.document.createElement("link");return o.setAttribute("rel","android-touch-icon"),o.setAttribute("href",n),[o,a]}return null},getBackgroundColor:function(e){var t=getComputedStyle(e,null).getPropertyValue("background-color");return r("Getting background color",t),t?(r("Got background color",t),t):"transparent"},appendToHead:function(t){r("Injecting support nodes into head.",t);for(var n=e.document.querySelector("head"),o=0;o<t.length;o++)n.appendChild(t[o])},init:function(){var t=e.document.querySelector(i.appWidgetSelector);if(!t)return r("No app widget found, ejecting."),!1;var n=[],o=this.createNiceTitle(e.document.title),a=e.document.querySelector(i.logoSelector),l=this.getBackgroundColor(e.document.querySelector(i.headerSelector)),c=this.createMetaTags(this.getAppIds(t));if(!c||!c.length)return r("No app IDs found, ejecting."),!1;n=n.concat(c);var u=this.createIconLinks(a);n=n.concat(u);var s=e.document.createElement("link");if(s.setAttribute("rel","stylesheet"),s.setAttribute("href",i.styleSheetUrl),n.push(s),!e._CMLS.smartBanner){var d=e.document.createElement("script");d.src=i.libraryUrl,n.push(d)}return this.appendToHead(n),i.title=o,i.backgroundColor=l,!0}},s=function(e){"interactive"===document.readyState||"complete"===document.readyState?e():document.addEventListener("DOMContentLoaded",e)};s(function(){r("Initializing.");var e=u.init();e&&o()}),r("Loaded.")}(window);
//# sourceMappingURL=./injector-min.js.map