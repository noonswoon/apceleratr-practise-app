var getZodiacGlyph = function(_zodiacStr, _isColorGlyph) {
	//zodiac str can be: aquarius, aries, cancer, capricorn, gemini, leo, libra, pisces, sagittarius, 
	//scopio, taurus, virgo
	
	var zodiacArray = ['aquarius', 'aries', 'cancer', 'capricorn', 'gemini', 'leo', 'libra', 'pisces', 'sagittarius', 'scopio', 'taurus', 'virgo'];
	var validZodiac = false;
	var zodiacStrLower = _zodiacStr.toLowerCase();
	for(var i = 0; i < zodiacArray.length; i++) {
		if(zodiacStrLower === zodiacArray[i]) {
			validZodiac = true;
			break;
		}
	}
	
	if(validZodiac) {
		if(_isColorGlyph) return 'images/glyph/glyph-zodiac-' + zodiacStrLower + '.png'; 
		else return 'images/glyph/glyph-profile-zodiac-' + zodiacStrLower + '.png'; 
	} else {
		if(_isColorGlyph) return 'images/glyph/glyph-zodiac-aquarius.png'; 
		else return 'images/glyph/glyph-profile-zodiac-aquarius.png'; 
	}
};
exports.getZodiacGlyph = getZodiacGlyph;

exports.getLikeGlyph = function(_likeCategory) {
	if(_likeCategory === 'Book' || _likeCategory === 'Magazine') 
		return 'images/glyph/like-glyph-books.png';
	else if(_likeCategory === 'Dogs' || _likeCategory === 'Cats' ) 
		return 'images/glyph/like-glyph-animals.png';
	else if(_likeCategory === 'Food/grocery') 
		return 'images/glyph/like-glyph-food.png';
	else if(_likeCategory === 'Electronics' || _likeCategory === 'Computers/technology' || _likeCategory === 'Games/toys') 
		return 'images/glyph/like-glyph-games.png';		
	else if(_likeCategory === 'Entertainer') 
		return 'images/glyph/like-glyph-instrument.png';
	else if(_likeCategory === 'City' || _likeCategory === 'Country' ) 
		return 'images/glyph/like-glyph-location.png';
	else if(_likeCategory === 'Musician/band') 
		return 'images/glyph/like-glyph-music.png';
	else if(_likeCategory === 'Shopping/retail' || _likeCategory === 'Retail and consumer merchandise') 
		return 'images/glyph/like-glyph-shopping.png';
	else if(_likeCategory === 'Professional sports team' || _likeCategory === 'Sports league') 
		return 'images/glyph/like-glyph-sport.png';
	else if(_likeCategory === 'Travel/leisure' || _likeCategory === 'Tours/sightseeing' || _likeCategory === 'Sports/recreation/activities' || _likeCategory === 'Transportation' || _likeCategory === 'Transport/frieght') 
		return 'images/glyph/like-glyph-travel.png';
	else if(_likeCategory === 'Movie' || _likeCategory === 'Tv channel' || _likeCategory === 'Tv network' || _likeCategory === 'Tv/movie award') 
		return 'images/glyph/like-glyph-tv.png';
	else return 'images/glyph/like-glyph-generic.png';
};

exports.getTopicGlyph = function(_category, _value, _isColorGlyph) {
	if(_isColorGlyph) {
		if(_category === "name") 
			return 'images/glyph/glyph-name.png'; 
		else if(_category === "age")
			return 'images/glyph/glyph-age.png';
		else if(_category === "zodiac") {
			return getZodiacGlyph(_value, _isColorGlyph);
		} else if(_category === "location")
			return 'images/glyph/glyph-location.png';
		else if(_category === "height")
			return 'images/glyph/glyph-height.png';
		else if(_category === "ethnicity")
			return 'images/glyph/glyph-ethnicity.png';
		else if(_category === "religion") {
			if(_value === "Buddhist")
				return 'images/glyph/glyph-religion-buddhist.png';
			else if(_value === "Christian" || _value === "Catholic")
				return 'images/glyph/glyph-religion-christian.png';
			else if(_value === "Muslim")
				return 'images/glyph/glyph-religion-islam.png';
			else if(_value === "Spiritual but not religious")
				return 'images/glyph/glyph-religion-spiritual.png';
			else return 'images/glyph/glyph-religion-other.png';
		} else if(_category === "education")
			return 'images/glyph/glyph-education.png';
		else if(_category === "second_education")
			return 'images/glyph/glyph-secondary-education.png';
		else if(_category === "work")
			return 'images/glyph/glyph-work.png';
		else if(_category === "about_me")
			return 'images/glyph/glyph-about.png';		
		else {
			Ti.API.info('wtf: category: '+_category);
			return 'images/glyph/glyph-profile-about.png';
		} 
	} else {
		if(_category === "name") 
			return 'images/glyph/glyph-profile-name.png'; 
		else if(_category === "age")
			return 'images/glyph/glyph-profile-age.png';
		else if(_category === "zodiac") {
			return getZodiacGlyph(_value, _isColorGlyph);
		} else if(_category === "location")
			return 'images/glyph/glyph-profile-location.png';
		else if(_category === "height")
			return 'images/glyph/glyph-profile-height.png';
		else if(_category === "ethnicity")
			return 'images/glyph/glyph-profile-ethnicity.png';
		else if(_category === "religion") {
			if(_value === "Buddhist")
				return 'images/glyph/glyph-profile-religion-buddhist.png';
			else if(_value === "Christian" || _value === "Catholic")
				return 'images/glyph/glyph-profile-religion-christian.png';
			else if(_value === "Muslim")
				return 'images/glyph/glyph-profile-religion-islam.png';
			else if(_value === "Spiritual but not religious")
				return 'images/glyph/glyph-profile-religion-spiritual.png';
			else return 'images/glyph/glyph-profile-religion-other.png';
		} else if(_category === "education")
			return 'images/glyph/glyph-profile-education.png';
		else if(_category === "second_education")
			return 'images/glyph/glyph-secondary-education.png';
		else if(_category === "occupation")
			return 'images/glyph/glyph-profile-work.png';
		else if(_category === "employer")
			return 'images/glyph/glyph-secondary-work.png';
		else if(_category === "about_me")
			return 'images/glyph/glyph-profile-about.png';		
		else {
			Ti.API.info('wtf: category: '+_category);
			return 'images/glyph/glyph-profile-about.png';
		} 	
	}
};