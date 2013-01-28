TimerView = function(_parentWindow, _userId, _showRemainingTime) {
	
	var timerView = Ti.UI.createView({
		top: 5,
		left: 90,
		width: 109,
		height: 35,
		backgroundImage: 'images/top-bar-countdown-background-alt.png'
	});

	var remainingSeconds = Ti.App.moment().eod().diff(Ti.App.moment(), 'seconds');
	var remainingHours = Math.floor(remainingSeconds / 3600);
	remainingSeconds = remainingSeconds % 3600; 
	var remainingMinutes = Math.floor(remainingSeconds / 60); 
	remainingSeconds = remainingSeconds % 60;
	
	if(remainingHours < 10) remainingHours = '0'+remainingHours;
	if(remainingMinutes < 10) remainingMinutes = '0'+remainingMinutes;
	if(remainingSeconds < 10) remainingSeconds = '0'+remainingSeconds;
	
	remainingTimeLbl = Ti.UI.createLabel({
		text: remainingHours+':'+remainingMinutes+':'+remainingSeconds,
		center: {x:'50%', y:'50%'},
		color: '#f3f5f9',
		width: 98,
		shadowColor: '#750b14',
		shadowOffset: {x:0, y:1},
		font: {fontWeight:'bold', fontSize: 28, fontFamily: 'DS-Digital'},
		zIndex: 1
	});
	
	var timer = setInterval(function() {
		var remainingSeconds = Ti.App.moment().eod().diff(Ti.App.moment(), 'seconds');
		var remainingHours = Math.floor(remainingSeconds / 3600);
		remainingSeconds = remainingSeconds % 3600; 
		var remainingMinutes = Math.floor(remainingSeconds / 60); 
		remainingSeconds = remainingSeconds % 60;
		
		if(remainingHours < 10) remainingHours = '0'+remainingHours;
		if(remainingMinutes < 10) remainingMinutes = '0'+remainingMinutes;
		if(remainingSeconds < 10) remainingSeconds = '0'+remainingSeconds;
		
		remainingTimeLbl.text = remainingHours+':'+remainingMinutes+':'+remainingSeconds;
	}, 1000);

	timerView.add(remainingTimeLbl);
	
	return timerView;
};

module.exports = TimerView;

