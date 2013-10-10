Tutorial4View = function() {
	
	//create component instance
	var self = Ti.UI.createImageView({
		left: 0, 
		top: 0,
		width: '100%',
		image: 'images/tutorial/tutorial-4-with-arrows.png',
		zIndex: 0,
	});

	var description1 = Ti.UI.createLabel({
		text: L('Edit your profile'),
		left: 127,
		top: 15,
		color: '#ffffff',
		font:{fontSize:18, fontFamily:'Bromine'},
		shadowColor: '#171818', 
		shadowOffset: {x:0, y:2},
		zIndex:3,
	});
	self.add(description1);
	
	var description2 = Ti.UI.createLabel({
		text: L('Get more Candy'),
		left: 95,
		top: 235,
		color: '#ffffff',
		font:{fontSize:18, fontFamily:'Bromine'},
		shadowColor: '#171818', 
		shadowOffset: {x:0, y:2},
		zIndex:3,
	});
	self.add(description2);	
		
	self.addEventListener('postlayout', function() {
		self.width = '100%';
		self.height = '100%';
	});

	return self;
};

module.exports = Tutorial4View;

