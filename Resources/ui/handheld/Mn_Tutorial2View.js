Tutorial2View = function() {
	
	//create component instance
	var self = Ti.UI.createImageView({
		left: 0, 
		top: 0,
		width: '100%',
		image: 'images/tutorial/tutorial-2-with-arrows.png',
		zIndex: 0,
	});
	
	var description1 = Ti.UI.createLabel({
		text: L('Reveal mutual friends for 5 credits'),
		left: 30,
		top: 335,
		color: '#ffffff',
		font:{fontSize:18, fontFamily:'Bromine'},
		shadowColor: '#171818', 
		shadowOffset: {x:0, y:2},
		zIndex:3,
	});
	self.add(description1);
		
	self.addEventListener('postlayout', function() {
		self.width = '100%';
		self.height = '100%';
	});
	return self;
};

module.exports = Tutorial2View;

