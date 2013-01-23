CreditView = function(_credit) {
	
	var self = Ti.UI.createImageView({
		image: 'images/menu-credits.png',
		width: 79,
		height: 31,
		top:6,
		left: 176,
		zIndex: 0
	});

	var fontFormat = {fontStyle:'normal', fontWeight:'bold',fontSize:18};
	var fontTop = 5;
	var fontDropShadowTop = fontTop + 1;
	var fontLeftOffset = 7;
	var fontLeftInterval = 18;
	
	var thousandDigit = Ti.UI.createLabel({
		text: '0',
		top: fontTop,
		left: fontLeftOffset,
		font: fontFormat,
		color: '#6a6c6e',
		zIndex: 1
	});
	var thousandDigitDropShadow = Ti.UI.createLabel({
		text: '0',
		top: fontDropShadowTop,
		left: fontLeftOffset,
		font: fontFormat,
		color: '#000',
		zIndex: 0,
		opacity: 0.8
	});
	self.add(thousandDigit);
	self.add(thousandDigitDropShadow);
	
	var hundredDigit = Ti.UI.createLabel({
		text: '0',
		top: fontTop,
		left: fontLeftOffset + fontLeftInterval,
		font:fontFormat,
		color: '#6a6c6e',
		zIndex: 1
	});
	var hundredDigitDropShadow = Ti.UI.createLabel({
		text: '0',
		top: fontDropShadowTop,
		left: fontLeftOffset + fontLeftInterval,
		font: fontFormat,
		color: '#000',
		zIndex: 0,
		opacity: 0.8
	})
	self.add(hundredDigit);
	self.add(hundredDigitDropShadow);
	
	var tenDigit = Ti.UI.createLabel({
		text: '2',
		top: fontTop,
		left: fontLeftOffset + 2*fontLeftInterval + 1,
		font:fontFormat,
		color: '#cdcdcd',
		zIndex: 1
	})
	var tenDigitDropShadow = Ti.UI.createLabel({
		text: '2',
		top: fontDropShadowTop,
		left: fontLeftOffset + 2*fontLeftInterval + 1,
		font:fontFormat,
		color: '#000',
		zIndex: 0,
		opacity: 0.8
	})
	self.add(tenDigit);
	self.add(tenDigitDropShadow);
	
	var unitDigit = Ti.UI.createLabel({
		text: '8',
		top: fontTop,
		left: fontLeftOffset + 3*fontLeftInterval + 1,
		font:fontFormat,
		color: '#cdcdcd',
		zIndex: 1,
	});
	var unitDigitDropShadow = Ti.UI.createLabel({
		text: '8',
		top: fontDropShadowTop,
		left: fontLeftOffset + 3*fontLeftInterval + 1,
		font:fontFormat,
		color: '#000',
		zIndex: 0,
		opacity: 0.8
	});
	self.add(unitDigit);
	self.add(unitDigitDropShadow);
	
	var pointsLbl = Ti.UI.createLabel({
		text: _credit,
		color: '#fcfcfc',
		top: 0,
		left: 0,
		font:{fontWeight:'bold',fontSize:14},
	});
//	self.add(pointsLbl);
		
	self.setCredit = function(_newCredit) {
		pointsLbl.text = _newCredit;	
	};
	
	Ti.App.addEventListener('creditChange', function(e) {
		pointsLbl.text = e.currentCredit;
	});
	
	return self;
}
module.exports = CreditView;