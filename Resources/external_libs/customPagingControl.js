// https://gist.github.com/2417902
// I was unhappy about there was close to no control over the "pageControl" 
// in scrollableViews, so I hacked my own
// -----
 
// Configuration
var pageColor = "#c99ed5";
 
PagingControl = function(scrollableView){
	// Keep a global reference of the available pages
	var numberOfPages = scrollableView.getViews().length;
	var widthOffset = 15;
	var currentPage = 0;
	
	var container = Titanium.UI.createView({
		height: 14,
		backgroundImage: 'images/carousel-background-stretchable.png',
		backgroundLeftCap: 5,
		width: numberOfPages * widthOffset,
		zIndex: 2
	});
	
	var pages = []; // without this, the current page won't work on future references of the module
	
	// Go through each of the current pages available in the scrollableView
	for (var i = 0; i < numberOfPages; i++) {
		var page = Titanium.UI.createImageView({
			image: 'images/carousel-dot-inactive.png',
			width: 12,
			height: 12,
			left: 15 * i,
			zIndex: 3
		});
		// Store a reference to this view
		pages.push(page);
		// Add it to the container
		container.add(page);
	}
	
	// Mark the initial selected page
	pages[scrollableView.getCurrentPage()].image = 'images/carousel-dot-active.png';
	currentPage = scrollableView.getCurrentPage(); 
	
	// Callbacks
	onScroll = function(event){
		// Go through each and reset it's opacity
		if(currentPage !== event.currentPage) {
			pages[currentPage].image = 'images/carousel-dot-inactive.png';
			pages[event.currentPage].image = 'images/carousel-dot-active.png';
			currentPage = event.currentPage;
		}
	};
	
	// Attach the scroll event to this scrollableView, so we know when to update things
	scrollableView.addEventListener("scroll", onScroll);
	
	return container;
};
 
module.exports = PagingControl;