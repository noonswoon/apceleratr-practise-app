InterestedInEditTableViewRow = function(_interestedIn) {
	var modified = false;
	var interestedInContent =  _interestedIn; //default is women
	var menRadioImageValue = 'images/glyph/radio-inactive.png';
	var womenRadioImageValue = 'images/glyph/radio-active.png';
	var menTextColorValue = '#a3a7ad';
	var womenTextColorValue = '#4e5866';
	
	if(interestedInContent === 'men') {
		menRadioImageValue = 'images/glyph/radio-active.png';
		womenRadioImageValue = 'images/glyph/radio-inactive.png';
		menTextColorValue = '#4e5866';
		womenTextColorValue = '#a3a7ad';
	}
	
	var tableRow = Ti.UI.createTableViewRow({
		top: 0,
		left: 0,
		width: '100%',
		height: 235,
	});
	if(Ti.Platform.osname === 'iphone')
		tableRow.selectionStyle = Ti.UI.iPhone.TableViewCellSelectionStyle.NONE;

	var preferenceBackground = Ti.UI.createView({
		top: 0,
		backgroundColor: '#eeeeee', 
		height: 235,
		width: '100%'
	});
	
	var interestedInLabel = Ti.UI.createLabel({
		text: L('Interested in'),
		top: 15, 
		left: 17,
		color: '#4e5866',
		font:{fontWeight:'bold', fontSize:18}
	});
	preferenceBackground.add(interestedInLabel);
	
	var topEdge = Ti.UI.createView({
		top: 45,
		left: 0,
		width: '100%',
		height: 5,
		backgroundImage: 'images/row-top-edge.png'
	});
	preferenceBackground.add(topEdge);

	var menLabel = Titanium.UI.createLabel({
		text: 'Men',
		top: 15, 
		left: 64,
		width: 80,
		height: 20,
		color:menTextColorValue,
		font:{fontWeight:'bold',fontSize:18},
	});
	
	var menGlyphImage = Ti.UI.createImageView({
		top: 8,
		left: 22, 
		width: 34,
		height: 34,
		image: 'images/glyph/glyph-profile-men.png',
	});
	var menRadioImage = Ti.UI.createImageView({
		top: 10,
		right: 25, 
		width: 29,
		height: 30,
		image: menRadioImageValue
	});
	
	var menChoiceRow = Ti.UI.createView({
		top: 50,
		height: 48,
		backgroundImage: 'images/match-info-white-row.png',
	});
	menChoiceRow.add(menLabel);
	menChoiceRow.add(menGlyphImage);
	menChoiceRow.add(menRadioImage);
	preferenceBackground.add(menChoiceRow);

	var womenLabel = Titanium.UI.createLabel({
		text: 'Women',
		top: 15, 
		left: 64,
		width: 80,
		height: 20,
		color:womenTextColorValue,
		font:{fontWeight:'bold',fontSize:18},
	});
	
	var womenGlyphImage = Ti.UI.createImageView({
		top: 8,
		left: 22, 
		width: 34,
		height: 34,
		image: 'images/glyph/glyph-profile-women.png',
	});
	var womenRadioImage = Ti.UI.createImageView({
		top: 10,
		right: 25, 
		width: 29,
		height: 30,
		image: womenRadioImageValue
	});
	
	var womenChoiceRow = Ti.UI.createView({
		top: 98,
		height: 48,
		backgroundImage: 'images/match-bottom-box.png',
	});
	womenChoiceRow.add(womenLabel);
	womenChoiceRow.add(womenGlyphImage);
	womenChoiceRow.add(womenRadioImage);
	preferenceBackground.add(womenChoiceRow);	

	menChoiceRow.addEventListener('click', function() {
		interestedInContent = 'men';		
		menLabel.color = '#4e5866';
		menRadioImage.image = 'images/glyph/radio-active.png';
		womenLabel.color = '#a3a7ad';
		womenRadioImage.image = 'images/glyph/radio-inactive.png';
	});
	
	womenChoiceRow.addEventListener('click', function() {
		interestedInContent = 'women';
		menLabel.color = '#a3a7ad';
		menRadioImage.image = 'images/glyph/radio-inactive.png';
		womenLabel.color = '#4e5866';
		womenRadioImage.image = 'images/glyph/radio-active.png';
	});
	
	var bottomEdge = Ti.UI.createView({
		top: 146,
		left: 0,
		width: '100%',
		height: 5,
		backgroundImage: 'images/row-bottom-edge.png'
	});
	preferenceBackground.add(bottomEdge);
	
	var hiddenGlyphImage = Ti.UI.createImageView({
		top: 163,
		left: 30, 
		width: 16,
		height: 13,
		image: 'images/glyph/glyph-profile-hidden.png',
	});
	preferenceBackground.add(hiddenGlyphImage);

	var hiddenLabel = Ti.UI.createLabel({
		text: L('This will not be visible on your profile'), 
		top: 160, 
		left: 52,
		color:'#a3a7ad',
		font:{fontWeight:'bold',fontSize:12},
		zIndex:2
	});
	preferenceBackground.add(hiddenLabel);
	
	var horizontalSeparator = Ti.UI.createImageView({
		image: 'images/credit/horizontal-separator.png', 
		top: 186,
		height: 2,
		width: '100%'
	});
	preferenceBackground.add(horizontalSeparator);
	
	
	//quite bad design, but this code is the 'My Information' label for the next section
	
	var myInfoLabel = Ti.UI.createLabel({
		text: L('General Information'),
		top: 201, 
		left: 17,
		color: '#4e5866',
		font:{fontWeight:'bold', fontSize:18}
	});
	preferenceBackground.add(myInfoLabel);
	
	var topEdge = Ti.UI.createView({
		bottom: 0,
		left: 0,
		width: '100%',
		height: 5,
		backgroundImage: 'images/row-top-edge.png'
	});
	preferenceBackground.add(topEdge);	
	
	tableRow.add(preferenceBackground); 

	tableRow.getFieldName = function() {
		return 'interested_in';
	};
	
	tableRow.getContent = function() {
		return interestedInContent;
	};
	
	tableRow.getModified = function() {
		return (_interestedIn !== interestedInContent);
	};

	return tableRow;		
};
module.exports = InterestedInEditTableViewRow;
