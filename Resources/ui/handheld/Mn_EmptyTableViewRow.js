EmptyTableViewRow = function() {
	
	//2532 -base, 2632 >> 100 >> 50; 2674 --> 42/2
	var tableRow = Ti.UI.createTableViewRow({
		top: 0,
		left: 0,
		width: '100%',
		height: 60,
		backgroundColor: '#eeeeee'
	});
	
	if(Ti.Platform.osname === 'iphone')
		tableRow.selectionStyle = Ti.UI.iPhone.TableViewCellSelectionStyle.NONE;
	
	tableRow.getFieldName = function() {
		return 'empty_row';
	};

	tableRow.isInvited = function() {
	    return false;
	};
	
	return tableRow;		
};

module.exports = EmptyTableViewRow;