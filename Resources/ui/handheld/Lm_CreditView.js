CreditView = function(_credit) {
	
	var self = Ti.UI.createView({
		width: 30,
		height: 30,
		top: 10, 
		right: 5,
		backgroundColor: '#3d4456'
	});
	
	var pointsLbl = Ti.UI.createLabel({
		text: _credit,
		color: '#fcfcfc',
		top: 0,
		left: 0,
		font:{fontWeight:'bold',fontSize:14},
	});
	self.add(pointsLbl);
		
	self.setCredit = function(_newCredit) {
		pointsLbl.text = _newCredit;	
	};
	
	Ti.App.addEventListener('creditChange', function(e) {
		pointsLbl.text = e.currentCredit;
	});
	
	return self;
}
module.exports = CreditView;