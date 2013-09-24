CreditView = function(_credit) {
	
	var self = Ti.UI.createImageView({
		image: 'images/menu-credits.png',
		width: 79,
		height: 31,
		top:8,
		left: 173,
		zIndex: 0
	});
	
	var fontFormat = {fontStyle:'normal', fontWeight:'bold',fontSize:18};
	var fontForTextFormat = {fontStyle:'normal', fontWeight:'bold',fontSize:14};
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
	});
	self.add(hundredDigit);
	self.add(hundredDigitDropShadow);
	
	var tenDigit = Ti.UI.createLabel({
		text: '0',
		top: fontTop,
		left: fontLeftOffset + 2*fontLeftInterval + 1,
		font:fontFormat,
		color: '#6a6c6e',
		zIndex: 1
	});
	var tenDigitDropShadow = Ti.UI.createLabel({
		text: '0',
		top: fontDropShadowTop,
		left: fontLeftOffset + 2*fontLeftInterval + 1,
		font:fontFormat,
		color: '#000',
		zIndex: 0,
		opacity: 0.8
	});
	self.add(tenDigit);
	self.add(tenDigitDropShadow);
	
	var unitDigit = Ti.UI.createLabel({
		text: '0',
		top: fontTop,
		left: fontLeftOffset + 3*fontLeftInterval + 1,
		font:fontFormat,
		color: '#6a6c6e',
		zIndex: 1,
	});
	var unitDigitDropShadow = Ti.UI.createLabel({
		text: '0',
		top: fontDropShadowTop,
		left: fontLeftOffset + 3*fontLeftInterval + 1,
		font:fontFormat,
		color: '#000',
		zIndex: 0,
		opacity: 0.8
	});
	self.add(unitDigit);
	self.add(unitDigitDropShadow);

	var computeNumbers = function(_number) { //output an array of 4 element [0]-thousand, [1]-hundred, [2]-ten, [3]-unit
		var number = _number;
		var result = []; 
		var divider = 1000;
		while(divider > 0) {
			if(number < divider) result.push(0);
			else {
				result.push(Math.floor(number/divider));
				number = number % divider; 
			}
			divider = Math.floor(divider/10);
		}
		return result;
	};

	var setThousandDigit = function(_actualValue, _number) {
		thousandDigit.text = _number;
		thousandDigitDropShadow.text = _number;
		
		if(_actualValue < 1000)
			thousandDigit.color = '#6a6c6e';
		else thousandDigit.color = '#cdcdcd';
		
		if(_number === 'M') {
			thousandDigit.font = fontForTextFormat;
			thousandDigitDropShadow.font = fontForTextFormat;
		} else {
			thousandDigit.font = fontFormat;
			thousandDigitDropShadow.font = fontFormat;
		}
	}; 
	
	var setHundredDigit = function(_actualValue, _number) {
		hundredDigit.text = _number;
		hundredDigitDropShadow.text = _number;
		if(_actualValue < 100)
			hundredDigit.color = '#6a6c6e';
		else hundredDigit.color = '#cdcdcd';
		
		if(_number === 'B') {
			hundredDigit.font = fontForTextFormat;
			hundredDigitDropShadow.font = fontForTextFormat;
		} else {
			hundredDigit.font = fontFormat;
			hundredDigitDropShadow.font = fontFormat;
		}
	}; 
	
	var setTenDigit = function(_actualValue, _number) {
		tenDigit.text = _number;
		tenDigitDropShadow.text = _number;
		if(_actualValue < 10)
			tenDigit.color = '#6a6c6e';
		else tenDigit.color = '#cdcdcd';
		
		if(_number === 'E') {
			tenDigit.font = fontForTextFormat;
			tenDigitDropShadow.font = fontForTextFormat;
		} else {
			tenDigit.font = fontFormat;
			tenDigitDropShadow.font = fontFormat;
		}
	}; 
	
	var setUnitDigit = function(_actualValue, _number) {
		unitDigit.text = _number;
		unitDigitDropShadow.text = _number;
		if(_actualValue < 1)
			unitDigit.color = '#6a6c6e';
		else unitDigit.color = '#cdcdcd';
		
		if(_number === 'R') {
			unitDigit.font = fontForTextFormat;
			unitDigitDropShadow.font = fontForTextFormat;
		} else {
			unitDigit.font = fontFormat;
			unitDigitDropShadow.font = fontFormat;
		}
	}; 
	
	var setCredit = function(_newCredit) {
		
		if(Ti.App.CUSTOMER_TYPE === 'subscription' || _newCredit > 9999)
			_newCredit = 9999;
		
		var numberArray = computeNumbers(_newCredit);
		setThousandDigit(_newCredit, numberArray[0]);
		setHundredDigit(_newCredit, numberArray[1]);
		setTenDigit(_newCredit, numberArray[2]);
		setUnitDigit(_newCredit, numberArray[3]);
	};
	self.setCredit = setCredit; 
	
	Ti.App.addEventListener('creditChange', function(e) {
		setCredit(e.currentCredit);
	});

	var creditInstruction = L('Get 1 credit for each daily login\n');
	creditInstruction += L('Get 2 credits for each friend invite\n');	
	creditInstruction += L('Use 5 credits to see mutual friends\n');
	creditInstruction += L('Use 10 credits to Like someone');

	var creditDialog = Titanium.UI.createAlertDialog({
		title: L('Credits'),
		message: creditInstruction,
		buttonNames: [L('Ok')],
		cancel: 0
	});

/*	
	self.addEventListener('click', function() {
		creditDialog.show();
	});
*/
	setCredit(_credit);
	
	return self;
};
module.exports = CreditView;