Tutorial1View = function() {
	
	//create component instance
	var self = Ti.UI.createImageView({
		left: 0, 
		top: 0,
		width: '100%',
		image: 'images/tutorial/tutorial-1-with-arrows.png',
		zIndex: 0,
	});

	var description1 = Ti.UI.createLabel({
		text: L('Time left until your next match'),
		left: 10,
		top: 85,
		color: '#ffffff',
		font:{fontSize:18, fontFamily:'Bromine'},
		shadowColor: '#171818', 
		shadowOffset: {x:0, y:2},
		zIndex:3,
		height: 30
	});
	self.add(description1);
	
	var description2 = Ti.UI.createLabel({
		text: L('Like your match for 10 Candy'),
		left: 50,
		top: 245,
		color: '#ffffff',
		font:{fontSize:18, fontFamily:'Bromine'},
		shadowColor: '#171818', 
		shadowOffset: {x:0, y:2},
		zIndex:3,
		height: 30
	});
	self.add(description2);	
		
	self.addEventListener('postlayout', function() {
		self.width = '100%';
		self.height = '100%';
	});
	return self;
};

module.exports = Tutorial1View;

