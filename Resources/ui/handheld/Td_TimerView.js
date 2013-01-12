TimerView = function(_parentWindow, _userId, _showRemainingTime) {
	
	var timerView = Ti.UI.createView({
		top: 10,
		left: 100,
		width: 100,
		height: 30,
		backgroundColor: 'orange',
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
		left: 5,
		color: '#3e3e3e',
		width: 'auto',
		height: 40,
		font: { fontWeight: 'bold', fontSize: 22}
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

