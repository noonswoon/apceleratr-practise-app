BlankWindow = function() {

	var self = Titanium.UI.createWindow({
		top:0,
		left:0,
		width:'100%',
		backgroundColor: '#eeeeee',
		navBarHidden: true,
		zIndex:0,
	});
			
	return self;
};

module.exports = BlankWindow;

