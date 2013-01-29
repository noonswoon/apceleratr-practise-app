var getZodiacGlyph = function(_zodiacStr) {
	//zodiac str can be: aquarius, aries, cancer, capricorn, gemini, leo, libra, pisces, sagittarius, 
	//scopio, taurus, virgo
	return 'images/glyph-zodiac-' + _zodiacStr.toLowerCase() + '.png'; 
};
exports.getZodiacGlyph = getZodiacGlyph;

exports.getLikeGlyph = function(_likeCategory) {
	if(_likeCategory === 'Book' || _likeCategory === 'Magazine') 
		return 'images/like-glyph-books.png';
	else if(_likeCategory === 'Dogs' || _likeCategory === 'Cats' ) 
		return 'images/like-glyph-animals.png';
	else if(_likeCategory === 'Food/grocery') 
		return 'images/like-glyph-food.png';
	else if(_likeCategory === 'Electronics' || _likeCategory === 'Computers/technology' || _likeCategory === 'Games/toys') 
		return 'images/like-glyph-games.png';		
	else if(_likeCategory === 'Entertainer') 
		return 'images/like-glyph-instrument.png';
	else if(_likeCategory === 'City' || _likeCategory === 'Country' ) 
		return 'images/like-glyph-location.png';
	else if(_likeCategory === 'Musician/band') 
		return 'images/like-glyph-music.png';
	else if(_likeCategory === 'Shopping/retail' || _likeCategory === 'Retail and consumer merchandise') 
		return 'images/like-glyph-shopping.png';
	else if(_likeCategory === 'Professional sports team' || _likeCategory === 'Sports league') 
		return 'images/like-glyph-sport.png';
	else if(_likeCategory === 'Travel/leisure' || _likeCategory === 'Tours/sightseeing' || _likeCategory === 'Sports/recreation/activities' || _likeCategory === 'Transportation' || _likeCategory === 'Transport/frieght') 
		return 'images/like-glyph-travel.png';
	else if(_likeCategory === 'Movie' || _likeCategory === 'Tv channel' || _likeCategory === 'Tv network' || _likeCategory === 'Tv/movie award') 
		return 'images/like-glyph-tv.png';
	else return 'images/like-glyph-generic.png';
};

exports.getTopicGlyph = function(_category, _value) {
	if(_category === "name") 
		return 'images/glyph-name.png'; 
	else if(_category === "age")
		return 'images/glyph-age.png';
	else if(_category === "zodiac") {
		return getZodiacGlyph(_value);
	}
	else if(_category === "location")
		return 'images/glyph-location.png';
	else if(_category === "height")
		return 'images/glyph-height.png';
	else if(_category === "ethnicity")
		return 'images/glyph-ethnicity.png';
	else if(_category === "religion") {
		if(_value === "Buddhist")
			return 'images/glyph-religion-buddhist.png';
		else if(_value === "Christian" || _value === "Catholic")
			return 'images/glyph-religion-christian.png';
		else if(_value === "Muslim")
			return 'images/glyph-religion-islam.png';
		else if(_value === "Spiritual but not religious")
			return 'images/glyph-religion-spiritual.png';
		else return 'images/glyph-religion-other.png';
	}
	else if(_category === "education")
		return 'images/glyph-education.png';
	else if(_category === "second_education")
		return 'images/glyph-secondary-education.png';
	else if(_category === "work")
		return 'images/glyph-work.png';
	else if(_category === "about_me")
		return 'images/glyph-about.png';		
	else {
		Ti.API.info('wtf: category: '+_category);
		return 'images/glyph-notfound.png';
	} 
};