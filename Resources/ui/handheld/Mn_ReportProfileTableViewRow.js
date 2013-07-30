ReportProfileTableViewRow = function(_userId, _targetedUserId) {
	var BackendUser = require('backend_libs/backendUser');
	
	var fieldName = 'report_profile';
	var modified = false;
	
	//2532 -base, 2632 >> 100 >> 50; 2674 --> 42/2
	var tableRow = Ti.UI.createTableViewRow({
		top: 0,
		left: 0,
		width: '100%',
		height: 60,
		backgroundColor: '#eeeeee'
	});
	
	var reportImageView = Ti.UI.createImageView({
		image: 'images/home-report.png',
		bottom: 20,
		left: 20,
		width: 22,
		height: 22,
	});
	tableRow.add(reportImageView);
	
	var reportLabel = Ti.UI.createLabel({
		text: L('Report profile'),
		color: '#b3b3b3',
		shadowColor: '#ffffff',
		shadowOffset: {x:0,y:1},
		bottom: 22,
		left: 20+22+8,
		font:{fontWeight:'bold',fontSize:14},
	});
	tableRow.add(reportLabel);
	
	var saveReportCallback = function(e) {
		var reportDialog = Titanium.UI.createAlertDialog({
			title: L('Profile Reported'),
			message: L('We will review this profile. If you want to provide more details, email us at support@noonswoon.com'),
			buttonNames: [L('Ok')],
		});
		if(!e.success) {
			reportDialog.title = L('Something went wrong');
			reportDialog.message = L('Please report again');
		}
		reportDialog.show();
	};
	
	reportImageView.addEventListener('click', function() {
		var reportObj = {userId: _userId, targetedUserId: _targetedUserId, reason: 'will have next release'};
		BackendUser.saveUserReport(reportObj, saveReportCallback);
	});
	
	reportLabel.addEventListener('click', function() {
		var reportObj = {userId: _userId, targetedUserId: _targetedUserId, reason: 'will have next release'};
		BackendUser.saveUserReport(reportObj, saveReportCallback);
	});
	
	if(Ti.Platform.osname === 'iphone')
		tableRow.selectionStyle = Ti.UI.iPhone.TableViewCellSelectionStyle.NONE;
	
	tableRow.getFieldName = function() {
		return fieldName;
	};

	return tableRow;		
};

module.exports = ReportProfileTableViewRow;