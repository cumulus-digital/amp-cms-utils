;(function(window, undefined){

	var scriptName = 'AUTO REFRESH ADS',
		nameSpace = 'autoRefreshAds',
		version = '0.4.15';

	var w = window,
		wt = window.top,
		ws = window.self;


	if (w.DISABLE_AUTO_REFRESH_ADS || ws.DISABLE_AUTO_REFRESH_ADS || wt.DISABLE_AUTO_REFRESH_ADS) {
		return;
	}

	// Time before refreshing ads, in minutes
	w._CMLS.autoRefreshAdsTimer = ws._CMLS.autoRefreshAdsTimer || 4;

	if (wt._CMLS && wt._CMLS.hasOwnProperty(nameSpace)) {
		if (wt._CMLS[nameSpace].checkState()) {
			wt._CMLS[nameSpace].start();
		}
		return;
	}

	function log() {
		wt._CMLS.logger(scriptName + ' v' + version, arguments);
	}

	var AutoRefresher = function(fireEarly){
		var player = wt._CMLS.whichPlayer(),
			timer = null,
			fireTime = null,
			on = false,
			that = this;

		function getWindow(){
			if (w.tgmp) {
				var iframe = wt.document.querySelector('iframe#page_frame');
				if (iframe && iframe.contentWindow) {
					return iframe.contentWindow;
				}
			}
			return w;
		}

		function checkConditions(){
			if (
				//wt._CMLS.isHomepage(ws) &&
				wt._CMLS.autoReload &&
				wt._CMLS.autoReload.active
			) {
				log('AutoReloadPage is active, so we will not additionally refresh page ads.');
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
			timer = setTimeout(checkTimer, 5000);
		}

		function checkState(){
			return on;
		}
		this.checkState = checkState;

		function stop(){
			log('Stopping timer.');
			clearTimeout(timer);
			timer = null;
			fireTime = null;
			on = false;
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
			on = true;
		}
		this.start = start;

		function fire(){
			if ( ! checkConditions()) {
				log('Conditions went bad at fire timer, killing timer.');
				stop();
				return;
			}

			var windowContext = getWindow();
			windowContext.googletag.cmd.push(function(){
				log('Refreshing page ads.');
				windowContext.googletag.pubads().refresh();
				that.start();
			});
		}

		function getFireTime(){
			return fireTime;
		}
		this.getFireTime = getFireTime;

		function resetFireTime(){
			fireTime = new Date(new Date().getTime() + w._CMLS.autoRefreshAdsTimer*60000);
		}
		this.resetFireTime = resetFireTime;

		function checkTGToggle(e){
			if (e === true) {
				log('TG Player playing!');
				start();
				return;
			}
			log('TG Player stopped.');
			stop();
		}

		function destroy(){
			stop();
			wt.removeEventListener('td-player.playing', start);
			wt.removeEventListener('td-player.stopped', stop);
		}
		this.destroy = destroy;

		log('Initializing.');

		// Initialize for Triton player
		if (player.type === wt._CMLS.const.PLAYER_TRITON) {
			wt.addEventListener(
				'td-player.playing',
				start,
				false
			);
			wt.addEventListener(
				'td-player.stopped',
				stop,
				false
			);

			// Restart timer if history changes
			if (w.History && w.History.Adapter) {
				w.History.Adapater.bind(
					w,
					'pageChange',
					resetFireTime
				);
			}
		
			log('Triton Player listeners set.');
		}

		// Initialize TuneGenie player
		if (player.type === wt._CMLS.const.PLAYER_TUNEGENIE) {
			if (wt.tgmp && wt.TGMP_EVENTS) {
				wt.tgmp.addEventListener(
					wt.TGMP_EVENTS.streamplaying,
					checkTGToggle
				);
				log('TG Player listener set.');
			}
		}

		log('Listeners set.');

		if (fireEarly) {
			log('Initialized with a time to fire, using it.');
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
				wt._CMLS[nameSpace] = new AutoRefresher();
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