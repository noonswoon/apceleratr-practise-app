exports.getDefaultText = function(_category) {
	if(_category === "height")
		return L('Height (cm)');
	else if(_category === "ethnicity")
		return L('Ethnicity');
	else if(_category === "religion")
		return L('Religion');
	else if(_category === "graduate_school")
		return L('Graduate School');		
	else if(_category === "college")
		return L('Undergraduate School');
	else if(_category === "high_school")
		return L('High School');
	else if(_category === "occupation")
		return L('Occupation');
	else if(_category === "employer")
		return L('Employer');
	else if(_category === "about_me")
		return L('Write something about yourself...');	
	else return "";
};
