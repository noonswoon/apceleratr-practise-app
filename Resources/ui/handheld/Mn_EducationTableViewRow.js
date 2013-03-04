EducationTableViewRow = function(_fieldName, _educationArray, _isWhiteBackground) {
	var fieldName = _fieldName;
	var modified = false;

	var rowBackgroundImage = 'images/match-info-white-row.png';	
	if(!_isWhiteBackground) {
		rowBackgroundImage = 'images/match-info-gray-row.png';
	}
	
	var heightOffset = _educationArray.length - 1;
	//2532 -base, 2632 >> 100 >> 50; 2674 --> 42/2
	var tableRow = Ti.UI.createTableViewRow({
		top: 0,
		left: 0,
		width: '100%',
		height: 60 + heightOffset * 50,
		backgroundImage: rowBackgroundImage,
	});

	if(Ti.Platform.osname === 'iphone')
		tableRow.selectionStyle = Ti.UI.iPhone.TableViewCellSelectionStyle.NONE;
	
	var glyphImage = Ti.UI.createImageView({
		top: 10,
		left: 22, 
		width: 34,
		height: 34,
		image: 'images/glyph/glyph-education.png'
	})
	tableRow.add(glyphImage);
	
	//127, 535
	var schoolNameLabel = Ti.UI.createLabel({
		text: _educationArray[0].name,
		color: '#4e5866',
		top: 10, 
		left: 64,
		width: 241,
		height: 20,
		font:{fontWeight:'bold',fontSize:14},
	});
	tableRow.add(schoolNameLabel);

	var levelStr = '';
	if(_educationArray[0].level === 'graduate_school') levelStr = L('Graduate degree');
	else if(_educationArray[0].level === 'college') levelStr = L('Undergraduate degree');
	else levelStr = L('High school');
	
	var schoolLevelLabel = Ti.UI.createLabel({
		text: levelStr,
		color: '#4e5866',
		top: 30, 
		left: 64,
		font:{fontSize:14},
	});
	tableRow.add(schoolLevelLabel);	

	for(var i = 1; i < _educationArray.length; i++) {
		var linkImageUrl = 'images/glyph-secondary-link-faded.png'; 
		if(i > 1) linkImageUrl = 'images/glyph-secondary-link.png'; 
		var linkImage = Ti.UI.createImageView({
			top: 40 + (i - 1) * 55,
			left: 38,
			width: 3,
			height: 27, 
			image: linkImageUrl		
		});
		tableRow.add(linkImage);
		
		var secondaryGlyphImage = Ti.UI.createImageView({
			top: 60 + (i - 1) * 50,
			left: 22, 
			width: 34,
			height: 34,
			image: 'images/glyph/glyph-secondary-education.png'
		});
		tableRow.add(secondaryGlyphImage);
	
		var additionalSchoolNameLabel = Ti.UI.createLabel({
			text: _educationArray[i].name,
			color: '#4e5866',
			top: 60 + (i - 1) * 50, 
			left: 64,
			width: 241,
			height: 20,
			font:{fontWeight:'bold',fontSize:14},
		});
		tableRow.add(additionalSchoolNameLabel);
	
		if(_educationArray[i].level === 'graduate_school') levelStr = L('Graduate degree');
		else if(_educationArray[i].level === 'college') levelStr = L('Undergraduate degree');
		else levelStr = L('High school');
		
		var additionalSchoolLevelLabel = Ti.UI.createLabel({
			text: levelStr,
			color: '#4e5866',
			top: 80 + (i-1) * 50, 
			left: 64,
			font:{fontSize:14},
		});
		tableRow.add(additionalSchoolLevelLabel);		
	}
		
	tableRow.getFieldName = function() {
		return fieldName;
	};
	
	tableRow.getContent = function() {
		return contentLabel.text;
	};

	tableRow.setContent = function(_value) {
		contentLabel.text = _value;
	};
	
	return tableRow;		
};

module.exports = EducationTableViewRow;