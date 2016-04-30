;(function(window, undefined){

	var scriptName = 'AUTO REFRESH ADS',
		nameSpace = 'autoRefreshAds',
		version = '0.4.7';

	var w = window,
		wt = window.top,
		ws = window.self;

	// Time before refreshing ads, in minutes
	w._CMLS.autoRefreshAdsTimer = ws._CMLS.autoRefreshAdsTimer || 4;

	function log() {
		wt._CMLS.logger(scriptName + ' v' + version, arguments);
	}

	var AutoRefresher = function(fireEarly){
		var player = wt._CMLS.whichPlayer(),
			timer = null,
			that = this;

		var fireTime = null;

		function checkConditions(){
			if (
				wt._CMLS.isHomepage(ws) &&
				wt._CMLS.autoReloader &&
				wt._CMLS.autoReloader.active
			) {
				log('Autoreloader is active but conditions fail.');
				return false;
			}

			return true;
		}

		function checkTimer(){
			if ( ! checkConditions()) {
				log('Conditions went bad while timer was running, killing timer.');
				stop();
				return;
			}

			var now = new Date().getTime();
			if (now >= fireTime) {
				fire();
				return;
			}
			timer = setTimeout(checkTimer, 200);
		}

		function stop(){
			log('Stopping timer.');
			clearTimeout(timer);
			fireTime = null;
		}
		this.stop = stop;

		function start(fireEarly){
			stop();

			if ( ! checkConditions()){
				return;
			}

			fireTime = fireEarly ? fireEarly : new Date(new Date().getTime() + w._CMLS.autoRefreshAdsTimer*60000);
			log('Starting timer, will fire at ' + fireTime.toLocaleString());
			checkTimer();
		}
		this.start = start;

		function fire(){
			if ( ! checkConditions()) {
				log('Conditions went bad at fire timer, killing timer.');
				stop();
				return;
			}

			ws.googletag.cmd.push(function(){
				log('Refreshing page ads.');
				ws.googletag.pubads().refresh();
				that.start();
			});
		}

		function getFireTime(){
			return fireTime;
		}
		this.getFireTime = getFireTime;

		log('Initializing.');

		ws.googletag = ws.googletag || {};
		ws.googletag.cmd = ws.googletag.cmd || [];

		// Initialize for Triton player
		if (player.type === wt._CMLS.const.PLAYER_TRITON) {
			w.addEventListener(
				'td-player.playing',
				start,
				false
			);
			w.addEventListener(
				'td-player.stopped',
				stop,
				false
			);

			// Restart timer if history changes
			if (w.History && w.History.Adapter) {
				w.History.Adapater.bind(
					w,
					'pageChange',
					start
				);
			}
			log('Triton Player listeners set.');
		}

		// Initialize TuneGenie player
		if (player.type === wt._CMLS.const.PLAYER_TUNEGENIE) {
			if (w.tgmp && w.TGMP_EVENTS) {
				w.tgmp.addEventListener(
					w.TGMP_EVENTS.streamplaying,
					function(e){
						if (e === true) {
							log('TG Player playing!');
							start();
							return;
						}
						log('TG Player stopped.');
						stop();
					}
				);
				log('TG Player listener set.');
			}
		}

		log('Listeners set.');

		if (fireEarly) {
			log('Found an existing timer in top window, continuing original timer.');
			start(fireEarly);
		}

	};

	var initialized = false;
	function initTest(){
		log('InitTest called.');
		if (initialized) {
			return;
		}
		if ( ! w._CMLS.cGroups) {
			log('Init test called without cGroups available, exiting.');
			return;
		}
		for (var i = 0, j = w._CMLS.cGroups.length; i < j; i++) {
			if (
				/Format\s+(NewsTalk|Talk|Sports|Christian Talk)/i.test(w._CMLS.cGroups[i])
			) {
				log('Valid cGroup found, initializing timer.');
				if (wt._CMLS[nameSpace]) {
					var fireEarly = wt._CMLS[nameSpace].getFireTime();
					wt._CMLS[nameSpace].stop();
					ws._CMLS[nameSpace] = new AutoRefresher(fireEarly);
				} else {
					ws._CMLS[nameSpace] = new AutoRefresher();
				}
				initialized = true;
			}
		}
	}
	initTest();
	if ( ! initialized) {
		w.addEventListener(
			'cms-sgroup',
			function(){
				if ( ! initialized) {
					initTest();
				}
			},
			false
		);
		log('Waiting for cGroups');
	}

}(window));