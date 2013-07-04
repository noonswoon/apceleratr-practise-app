exports.selectServerAPI = function(_userId) {
	if(_userId <= 1000000) { //BANGKOK
		if(Ti.App.IS_PRODUCTION_BUILD) {
			Ti.App.API_SERVER = "http://noonswoon.com/";
			Ti.App.API_ACCESS = "n00nsw00n:he1p$1ngle";
		} else {
			Ti.App.API_SERVER = "http://noonswoondevelopment.apphb.com/"; 
			Ti.App.API_ACCESS = "noondev:d0minate$";
		}
	} else if(_userId <= 2000000) { //SINGAPORE
		if(Ti.App.IS_PRODUCTION_BUILD) {
			Ti.App.API_SERVER = "http://noonswoonsgproduction.apphb.com/";
			Ti.App.API_ACCESS = "n00nsw00n:he1pSG$1ngle";
		} else {
			Ti.App.API_SERVER = "http://noonswoonsgdevelopment.apphb.com/"; 
			Ti.App.API_ACCESS = "noondev:d0minate$SG";
		}
	} else if(_userId <= 3000000) { //HONG KONG
		if(Ti.App.IS_PRODUCTION_BUILD) {
			Ti.App.API_SERVER = "http://noonswoonhkproduction.apphb.com/";
			Ti.App.API_ACCESS = "n00nsw00n:he1pHK$1ngle";
		} else {
			Ti.App.API_SERVER = "http://noonswoonhkdevelopment.apphb.com/"; 
			Ti.App.API_ACCESS = "noondev:d0minate$HK";
		}
	} else {
		if(Ti.App.IS_PRODUCTION_BUILD) {
			Ti.App.API_SERVER = "http://noonswoon.com/";
			Ti.App.API_ACCESS = "n00nsw00n:he1p$1ngle";
		} else {
			Ti.App.API_SERVER = "http://noonswoondevelopment.apphb.com/"; 
			Ti.App.API_ACCESS = "noondev:d0minate$";
		}		
	}
};