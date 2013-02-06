ReportProfileTableViewRow = function() {
	
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
		text: 'Report profile',
		color: '#b3b3b3',
		shadowColor: '#ffffff',
		shadowOffset: {x:0,y:1},
		bottom: 22,
		left: 20+22+8,
		font:{fontWeight:'bold',fontSize:14},
	});
	tableRow.add(reportLabel);

	var reportDialog = Ti.UI.createEmailDialog();
	reportDialog.subject = "Profile Report";
	reportDialog.toRecipients = ['report@noonswoon.com'];
	reportDialog.messageBody = 'I would like to report this person because...';
	reportDialog.barColor = '#850f16';
	
	reportImageView.addEventListener('click', function() {
		reportDialog.open();
	});
	
	reportLabel.addEventListener('click', function() {
		reportDialog.open();
	});
	
	if(Ti.Platform.osname === 'iphone')
		tableRow.selectionStyle = Ti.UI.iPhone.TableViewCellSelectionStyle.NONE;
	
	tableRow.getFieldName = function() {
		return fieldName;
	};

	return tableRow;		
};

module.exports = ReportProfileTableViewRow;