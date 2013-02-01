TimerView = function(_parentWindow, _userId, _showRemainingTime) {
	
	var timerView = Ti.UI.createView({
		top: 5,
		left: 90,
		width: 139,
		height: 35,
		backgroundImage: 'images/top-bar-countdown-background-alt.png'
	});
	
	function computeRemainingTime() {
		var momentObj = Ti.App.moment(); 
		var curDate = momentObj.date();
		var curMonth = momentObj.month() + 1; //offset back
		var curYear = momentObj.year();
		var todayNoon = Ti.App.moment(curYear + "-" + curMonth + "-"+ curDate + " 12:00:00", "YYYY-MM-DD HH:mm:ss");
	
		//compare today noon with current time
		var curHour = momentObj.hours(); 
		var alreadyPassedNoon = false;
		if(curHour > 12) {
			//already passed noon, 
			alreadyPassedNoon = true;
		}
		
		var remainingSeconds = 0;
		if(alreadyPassedNoon) {	
			remainingSeconds = Ti.App.moment().eod().add('hours', 12).diff(momentObj, 'seconds');
		} else {
			remainingSeconds = todayNoon.diff(momentObj, 'seconds');
		}
		
		var remainingHours = Math.floor(remainingSeconds / 3600);
		remainingSeconds = remainingSeconds % 3600; 
		var remainingMinutes = Math.floor(remainingSeconds / 60); 
		remainingSeconds = remainingSeconds % 60;
		
		if(remainingHours < 10) remainingHours = '0'+remainingHours;
		if(remainingMinutes < 10) remainingMinutes = '0'+remainingMinutes;
		if(remainingSeconds < 10) remainingSeconds = '0'+remainingSeconds;
		return [remainingHours, remainingMinutes, remainingSeconds];
	}
	
	var remainingTimeData = computeRemainingTime();

	var remainingHourLbl = Ti.UI.createLabel({
		text: remainingTimeData[0],
		color: '#f3f5f9',
		bottom: 6,
		left: 8,
		width: 25,
		shadowColor: '#750b14',
		shadowOffset: {x:0, y:1},
		font: {fontWeight:'bold', fontSize: 20},
		zIndex: 1
	});
	timerView.add(remainingHourLbl);
	
	var hLabel = Ti.UI.createLabel({
		text: 'h',
		color: '#e3afba',
		bottom: 7,
		left: 33,
		shadowColor: '#a2101d', 
		shadowOffset: {x:0, y:1},
		font: {fontWeight:'bold', fontSize: 16},
	});
	timerView.add(hLabel);
	
	var remainingMinuteLbl = Ti.UI.createLabel({
		text: remainingTimeData[1],
		color: '#f3f5f9',
		bottom: 6,
		left: 50,
		width: 25,
		shadowColor: '#750b14',
		shadowOffset: {x:0, y:1},
		font: {fontWeight:'bold', fontSize: 20},
		zIndex: 1
	});
	timerView.add(remainingMinuteLbl);
	
	var mLabel = Ti.UI.createLabel({
		text: 'm',
		color: '#e3afba',
		bottom: 7,
		left: 75,
		shadowColor: '#a2101d', 
		shadowOffset: {x:0, y:1},
		font: {fontWeight:'bold', fontSize: 16},
	});
	timerView.add(mLabel);
	
	var remainingSecondLbl = Ti.UI.createLabel({
		text: remainingTimeData[2],
		color: '#f3f5f9',
		bottom: 6,
		left: 96,
		width: 25,
		shadowColor: '#750b14',
		shadowOffset: {x:0, y:1},
		font: {fontWeight:'bold', fontSize: 20},
		zIndex: 1
	});
	timerView.add(remainingSecondLbl);
	
	var sLabel = Ti.UI.createLabel({
		text: 's',
		color: '#e3afba',
		bottom: 7,
		left: 120,
		shadowColor: '#a2101d', 
		shadowOffset: {x:0, y:1},
		font: {fontWeight:'bold', fontSize: 16},
	});
	timerView.add(sLabel);
	
	
	var timer = setInterval(function() {
		remainingTimeData = computeRemainingTime()
		
		remainingHourLbl.text = remainingTimeData[0];
		remainingMinuteLbl.text = remainingTimeData[1]; 
		remainingSecondLbl.text = remainingTimeData[2]; 
	}, 1000);
	
	return timerView;
};

module.exports = TimerView;

