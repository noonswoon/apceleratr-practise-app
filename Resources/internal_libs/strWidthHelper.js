exports.computeStrWidth = function(str) {
	var totalLength = 0;	
    for(var i = 0; i < str.length; i++) {
		var curLetter = str[i];
		
		//upper letter
		if(curLetter === 'I')
			totalLength += 2;	
		else if(curLetter === 'J')
			totalLength += 7;	
			else if(curLetter === 'E' || curLetter === 'F' || curLetter === 'L' || curLetter === 'P')
			totalLength += 8;
		else if(curLetter === 'D' || curLetter === 'H' || curLetter === 'K' || 
				curLetter === 'S' || curLetter === 'U' || curLetter === 'V' || 
				curLetter === 'X' || curLetter === 'Z')
			totalLength += 9;	
		else if(curLetter === 'B' || curLetter === 'C' || curLetter === 'G' || 
				curLetter === 'L' || curLetter === 'O' || curLetter === 'Q' || 
				curLetter === 'R' || curLetter === 'T' || curLetter === 'Y')
			totalLength += 10;
		else if(curLetter === 'A')
			totalLength += 11;
		else if(curLetter === 'M')
			totalLength += 12;
		else if(curLetter === 'W')
			totalLength += 13;			
					  		
		//lowercase letter
		else if(curLetter === 'i' || curLetter === 'l')
			totalLength += 2;	
		else if(curLetter === 'j')
			totalLength += 3;	
		else if(curLetter === 'f' || curLetter === 'r' || curLetter === 't')
			totalLength += 5;	
		else if(curLetter === 'h' || curLetter === 'k' || curLetter === 'n' || 
				curLetter === 's' || curLetter === 'u' || curLetter === 'v' || 
				curLetter === 'z')
			totalLength += 7;	
		else if(curLetter === 'a' || curLetter === 'b' || curLetter === 'c' || 
				curLetter === 'd' || curLetter === 'e' || curLetter === 'g' || 
				curLetter === 'o' || curLetter === 'p' || curLetter === 'q' || 
				curLetter === 'x' || curLetter === 'y')
			totalLength += 8;
		else if(curLetter === 'm' || curLetter === 'w')
			totalLength += 11;	
			
		//symbol
		else if(curLetter === '.' || curLetter === ':' || curLetter === '|')
			totalLength += 2;	
		else if(curLetter === '(' || curLetter === ')')
			totalLength += 4;
		else if(curLetter === ' ')
			totalLength += 7;
		else if(curLetter === '-' || curLetter === '?')
			totalLength += 8;
				    			    				
		else totalLength += 8;
	}
	return totalLength;
};
