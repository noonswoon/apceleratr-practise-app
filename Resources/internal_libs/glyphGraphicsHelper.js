var getZodiacGlyph = function(_zodiacStr) {
	//zodiac str can be: aquarius, aries, cancer, capricorn, gemini, leo, libra, pisces, sagittarius, 
	//scopio, taurus, virgo
	return 'images/glyph-zodiac-' + _zodiacStr.toLowerCase() + '.png'; 
};
exports.getZodiacGlyph = getZodiacGlyph;

exports.getLikeGlyph = function(_likeCategory) {
	//zodiac str can be: aquarius, aries, cancer, capricorn, gemini, leo, libra, pisces, sagittarius, 
	//scopio, taurus, virgo
	return 'images/glyph-zodiac-'+_zodiacStr+'.png'; 
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