exports.getDefaultText = function(_category) {
	if(_category === "height")
		return 'Height (cm)';
	else if(_category === "ethnicity")
		return 'Ethnicity';
	else if(_category === "religion")
		return 'Religion';
	else if(_category === "graduate_school")
		return 'Graduate School';		
	else if(_category === "college")
		return 'Undergraduate School';
	else if(_category === "high_school")
		return 'High School';
	else if(_category === "occupation")
		return 'Occupation';
	else if(_category === "employer")
		return 'Employer';
	else if(_category === "about_me")
		return 'Write something about yourself...';	
	else return "";
};
