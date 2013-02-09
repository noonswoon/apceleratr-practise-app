exports.shouldRetrieveMatch = function(cacheTimeout) {
	if(!Ti.App.Properties.hasProperty('retrieveMatchTime')) { //do some caching
		Ti.API.info('never cache');
		var nowStr = Ti.App.moment().format("YYYY-MM-DDTHH:mm:ss"); 
		Ti.App.Properties.setString('retrieveMatchTime',nowStr);
		return true;
	} else {
		var cacheDateStr = Ti.App.Properties.getString('retrieveMatchTime');
		var cacheDate = moment(cacheDateStr,"YYYY-MM-DDTHH:mm:ss");		
		var elapsedTime = Ti.App.moment().diff(cacheDate,'minutes');
		if (elapsedTime < cacheTimeout) { //if cache is still ok
			Ti.API.info('cache hits');
			return false;
		} else { //cache is out-of-date, fetching new data from server
			Ti.API.info('cache misses');
			var nowStr = Ti.App.moment().format("YYYY-MM-DDTHH:mm:ss"); 
			Ti.App.Properties.setString('retrieveMatchTime',nowStr);
			return true;
		}
	}	
};

exports.setTimeRetrieveMatch = function() {
	var nowStr = Ti.App.moment().format("YYYY-MM-DDTHH:mm:ss"); 
	Ti.App.Properties.setString('retrieveMatchTime',nowStr);
};

exports.fetchDataOrCache = function(key, callback, param, eventToFire, cacheTimeout) {
	if(!Ti.App.Properties.hasProperty(key)) { //do some caching
		//Ti.API.info('never cache, do fn call '+key);
		callback(param); //never fetch before
		var nowStr = Ti.App.moment().format("YYYY-MM-DDTHH:mm:ss"); 
		Ti.App.Properties.setString(key,nowStr);
	} else {
		var cacheDateStr = Ti.App.Properties.getString(key);
		var cacheDate = Ti.App.moment(cacheDateStr,"YYYY-MM-DDTHH:mm:ss");		
		var elapsedTime = Ti.App.moment().diff(cacheDate,'minutes');
		if (elapsedTime < cacheTimeout) { //if still in cache, just fire event
			//Ti.API.info('cache and able to bypass: '+key);
			Ti.App.fireEvent(eventToFire); //fire event that signifies that db already loaded
		}
		else { //cache is out-of-date, fetching new data from server
			//Ti.API.info('cache stale..need to do fn call: '+key);
			callback(param);
			//pull data and reset cache
			var nowStr = Ti.App.moment().format("YYYY-MM-DDTHH:mm:ss"); 
			Ti.App.Properties.setString(key,nowStr);
		}
	}	
};

exports.shouldFetchData = function(key, cacheTimeout) {
	if(!Ti.App.Properties.hasProperty(key)) {
		Ti.API.info(key + ' never has the key..fetching..');
		return true;
	} else {
		if(cacheTimeout === 0) {
			Ti.API.info(key + ' never expire.. no fetch');
			return false; //never expire, no need to fetch
		} else {
			var cacheDateStr = Ti.App.Properties.getString(key);
			var cacheDate = Ti.App.moment(cacheDateStr,"YYYY-MM-DDTHH:mm:ss");		
			var elapsedTime = Ti.App.moment().diff(cacheDate,'minutes');
			if (elapsedTime < cacheTimeout) {
				Ti.API.info(key + ' :still not expire..no fetch');
				return false; //still not expire	
			} else {
				Ti.API.info(key + ' :already expired...fetch');
				return true; //already expired...need to fetchData
			}
		}
	}
};

exports.recordFetchedData = function(key) {
	var nowStr = Ti.App.moment().format("YYYY-MM-DDTHH:mm:ss"); 
	Ti.App.Properties.setString(key,nowStr);
};


