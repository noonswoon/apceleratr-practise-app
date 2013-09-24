EducationEditTableViewRow = function(_educationArray) {
	var DefaultTextHelper = require('internal_libs/defaultTextHelper');
	
	var fieldName = 'education';
	var modified = false;

	var educationInfo = ["","",""];

	for(var i = 0; i < _educationArray.length; i++) {
		var curEd = _educationArray[i]; 
	
		if(curEd.level === "graduate_school") {
			educationInfo[0] = curEd.name; 
		} else if(curEd.level === "college") { 
			educationInfo[1] = curEd.name;
		} else {
			educationInfo[2] = curEd.name;
		}
	}
		
	//2532 -base, 2632 >> 100 >> 50; 2674 --> 42/2
	var tableRow = Ti.UI.createTableViewRow({
		top: 0,
		left: 0,
		width: '100%',
		height: 190,
		backgroundImage: 'images/match-info-white-row.png',
	});
	tableRow.graduateSchoolTextfield = null;
	tableRow.undergraduateSchoolTextfield = null;
	tableRow.highSchoolTextfield = null;
	
	if(Ti.Platform.osname === 'iphone')
		tableRow.selectionStyle = Ti.UI.iPhone.TableViewCellSelectionStyle.NONE;

	var schoolNameDefaultStr = [ DefaultTextHelper.getDefaultText('graduate_school'), 
								DefaultTextHelper.getDefaultText('college'), 
								DefaultTextHelper.getDefaultText('high_school')
								];
	var schoolLevelStr = [L('Graduate Degree'), L('Undergraduate Degree'), L('High School')];
	
	for(var i = 0; i < 3; i++) {
		var glyphImageUrl = 'images/glyph/glyph-profile-education.png';
		var schoolName = '';
		var schoolLevel = '';
		var textColor = '#4e5866';
		if(educationInfo[i] === "" ) {
			schoolName = schoolNameDefaultStr[i];
			textColor = "#a3a7ad";
		} else {
			schoolName = educationInfo[i];
		}
		
		if(i > 0) {
			glyphImageUrl = 'images/glyph/glyph-secondary-education.png';
			var linkImage = Ti.UI.createImageView({
				top: 45 + (i - 1) * 65,
				left: 38,
				width: 3,
				height: 47, 
				image: 'images/glyph-secondary-link.png'		
			});
			tableRow.add(linkImage);
		}

		var glyphImage = Ti.UI.createImageView({
			top: 75 + (i - 1) * 60,
			left: 22, 
			width: 34,
			height: 34,
			image: glyphImageUrl
		});
		tableRow.add(glyphImage);
		
		var schoolNameTextfield = Ti.UI.createTextField({
			value: schoolName,
			color: textColor,
			top: 75 + (i - 1) * 60, 
			left: 64,
			width: 241,
			height: 20,
			font:{fontWeight:'bold',fontSize:16},
		});
		tableRow.add(schoolNameTextfield);
		
		var schoolLevelLabel = Ti.UI.createLabel({
			text: schoolLevelStr[i],
			color: '#4e5866',
			top: 95 + (i-1) * 60, 
			left: 64,
			width: 200,
			height: 20,
			font:{fontSize:14},
		});
		tableRow.add(schoolLevelLabel);
			
		(function() { //double binding, change execution context
			var curTextfield = schoolNameTextfield;
			var schoolSequence = i;
			if(schoolSequence === 0) 
				tableRow.graduateSchoolTextfield = curTextfield;
			else if(schoolSequence === 1)
				tableRow.undergraduateSchoolTextfield = curTextfield;
			else tableRow.highSchoolTextfield = curTextfield;
			
			curTextfield.addEventListener('focus', function() {
				modified = true;
				if(curTextfield.value === schoolNameDefaultStr[schoolSequence]) {
					curTextfield.value = "";
					curTextfield.color = "#4e5866";
				}
				
			});
		})();
	}
		
	tableRow.getFieldName = function() {
		return fieldName;
	};
	
	tableRow.getModified = function() {
		return modified;
	};
		
	tableRow.getContent = function() {
		var graduateStr = tableRow.graduateSchoolTextfield.value; 
		if(graduateStr === DefaultTextHelper.getDefaultText('graduate_school'))
			graduateStr = "";
		
		var undergraduateStr = tableRow.undergraduateSchoolTextfield.value; 
		if(undergraduateStr === DefaultTextHelper.getDefaultText('college'))
			undergraduateStr = "";
			
		var highSchoolStr = tableRow.highSchoolTextfield.value; 
		if(highSchoolStr === DefaultTextHelper.getDefaultText('high_school'))
			highSchoolStr = "";
			
		return {
				'graduate_school':graduateStr,
				'college':undergraduateStr,
				'high_school':highSchoolStr
		};
	};

	tableRow.setContent = function(_value) {
		contentLabel.text = _value;
	};
	
	return tableRow;		
};

module.exports = EducationEditTableViewRow;