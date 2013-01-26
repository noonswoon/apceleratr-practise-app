exports.getZodiacGlyph = function(_zodiacStr) {
	//zodiac str can be: aquarius, aries, cancer, capricorn, gemini, leo, libra, pisces, sagittarius, 
	//scopio, taurus, virgo
	return 'images/glyph-zodiac-'+_zodiacStr+'.png'; 
};

exports.getLikeGlyph = function(_likeCategory) {
	//zodiac str can be: aquarius, aries, cancer, capricorn, gemini, leo, libra, pisces, sagittarius, 
	//scopio, taurus, virgo
	return 'images/glyph-zodiac-'+_zodiacStr+'.png'; 
};


exports.setUserCredit = function(_userCredit) {
	Ti.App.Properties.setInt('userCredit',_userCredit);
	Ti.App.fireEvent('creditChange', {currentCredit: _userCredit});
};