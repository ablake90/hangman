var HangMan = {

	settings: {
		availableLetters: ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'],
		availableNumbers: ['0','1','2','3','4','5','6','7','8','9'],
		dictionary: ['antidisestablishmentarianism','bikes','cheeseburgers','crackerjack','fusion','mammali6an'],
		newWord: '',
		scoring: {
			current: 0,
			max: 6,
			currentWordBuild: ''
		},
		livesLeftColours: ['379114','3b7027','707a44','7a6849','8c3333','a81f1f'],
		elements: {
			startButton: document.getElementById("start-button"),
			wordHolder: document.getElementById("word-holder"),
			letterElement: document.getElementsByClassName("available-letter"),
			availableLettersHolder: document.getElementById("available-letters"),
			availableLNumbersHolder: document.getElementById("available-numbers"),
			hangmanImage: document.getElementById("hangman-image"),
			userFeedback: document.getElementsByClassName("user-feedback")[0],
			livesLeftContainer: document.getElementById("lives-left"),
			livesLeft: document.getElementById("lives-amount")
		}
	},

	init: function() {
		s = this.settings;
		this.bindActions();
	},

	bindActions: function() {
		s.elements.startButton.onclick=function(){HangMan.startGame()};
    },

    renderUserFeedback: function(text,cssClass,state) {
    	//reset
    	s.elements.userFeedback.innerHTML = text
		s.elements.userFeedback.style.display="block";
		s.elements.userFeedback.className += ' ' + cssClass;
    },

	startGame: function() {

		//resetting data/dom
		HangMan.reset();

		s.elements.startButton.innerHTML = "Reset game";
		s.elements.livesLeft.innerHTML = s.scoring.max;
	    s.newWord = s.dictionary[Math.floor(Math.random() * s.dictionary.length) + 0];

	    s.elements.livesLeftContainer.style.display = "inline";
	    s.elements.livesLeftContainer.style.color = "#" + s.livesLeftColours[s.scoring.current];

	    s.elements.wordHolder.innerHTML = "";
	    s.elements.availableLettersHolder.style.display='block';
	    s.elements.availableLNumbersHolder.style.display='block';
	    s.elements.hangmanImage.style.display="block";

	    //creating the word dom elements
	    for (var i = 0; i < s.newWord.length; i++) {
	    	var elem = document.createElement("DIV");
	    	elem.className = 'individual-letter hidden';
	    	elem.id = "the-chosen-word-letter" + s.newWord[i];

	    	var elemText = document.createElement("SPAN");
	    	elem.appendChild(elemText);

	    	var innerText = document.createTextNode(s.newWord[i]);

	    	elemText.appendChild(innerText);
	    	s.elements.wordHolder.appendChild(elem);  
	    }

	    //creating the available letter elements
	    for (var i = 0; i < s.availableLetters.length; i++) {
	    	var elem = document.createElement("DIV");
	    	elem.className = 'available-letter';
	    	elem.id = s.availableLetters[i];
	    	var elemText = document.createTextNode(s.availableLetters[i]);
	    	elem.appendChild(elemText);

	    	//add event listener to the elem
	    	//on click, do what the form does
	    	elem.onclick = function() { HangMan.handleSubmitLetter(event) };
	    	s.elements.availableLettersHolder.appendChild(elem);  
	    }

	    //creating the available number elements
	    for (var i = 0; i < s.availableNumbers.length; i++) {
	    	var elem = document.createElement("DIV");
	    	elem.className = 'available-number';
	    	elem.id = s.availableNumbers[i];
	    	var elemText = document.createTextNode(s.availableNumbers[i]);
	    	elem.appendChild(elemText);

	    	//add event listener to the elem
	    	//on click, do what the form does
	    	elem.onclick = function() { HangMan.handleSubmitLetter(event) };
	    	s.elements.availableLNumbersHolder.appendChild(elem);  
	    }
	},

	reset: function() {

		//resetting data
		s.availableLetters = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
		s.availableNumbers = ['0','1','2','3','4','5','6','7','8','9'];
		s.newWord = "";
		s.scoring.currentWordBuild = '';
		s.scoring.current = 0;

		//resetting the dom
		s.elements.availableLettersHolder.innerHTML = "";
		s.elements.availableLNumbersHolder.innerHTML = "";
		s.elements.userFeedback.style.display="none";
		var hangmanPieces = document.getElementsByClassName("hangman-piece");
		for (var i = 0; i < hangmanPieces.length; i++) {
			hangmanPieces[i].style.display = "none";
		}
		var hangmanImage = document.getElementById("hangman-image-element");
		hangmanImage.src = "images/hangman0.png";
        
	},

	handleSubmitLetter: function(event) {

		event.preventDefault();

		var enteredLetter = event.target.id
        
		if (s.availableLetters.indexOf(enteredLetter) > -1) {
			var letterToRemove = s.availableLetters.indexOf(enteredLetter);
			s.availableLetters.splice(letterToRemove,1);
			HangMan.reRenderAvailableWords(enteredLetter);
		}
		if (s.availableNumbers.indexOf(enteredLetter) > -1) {
			var letterToRemove = s.availableNumbers.indexOf(enteredLetter);
			s.availableNumbers.splice(letterToRemove,1);
			HangMan.reRenderAvailableWords(enteredLetter);
		} 

		var indices = [];
		for (var i = 0; i < s.newWord.length; i++) {
			if(s.newWord[i] === enteredLetter) {
				indices.push(i);
			}
		}
		if (indices.length > 0) {
			for (var i = 0; i < indices.length; i++) {
				HangMan.reRenderWordHolder(indices[i]);
			}
		} else {
			s.scoring.current ++;

			//update the lives left
			s.elements.livesLeft.innerHTML = s.scoring.max - s.scoring.current;
			//set the colour
			s.elements.livesLeftContainer.style.color = "#" + s.livesLeftColours[s.scoring.current];

			HangMan.updateHangmanImage(s.scoring.current);
		}
		
	},

	reRenderAvailableWords: function(letterToRemove) {
		var letter = document.getElementById(letterToRemove);
		letter.className += " letter-used";
		letter.onclick = '';
	},

	reRenderWordHolder: function(enteredLetter) {

		var elm = document.getElementsByClassName('individual-letter')[enteredLetter];
		elm.className="individual-letter";

		//push it into the word
		s.scoring.currentWordBuild += s.newWord[enteredLetter];

		//check if the game has been won
		if (s.scoring.currentWordBuild.length == s.newWord.length) {
			HangMan.renderUserFeedback("YOU WIN!","green");

			//remove all the click handlers
			for (var i = 0; i < document.getElementsByClassName('available-letter').length; i++) {
				document.getElementsByClassName('available-letter')[i].onclick = '';
			}
			for (var i = 0; i < document.getElementsByClassName('available-number').length; i++) {
				document.getElementsByClassName('available-number')[i].onclick = '';
			}
		}
	},

	updateHangmanImage: function(imageStep) {

		var hangmanImage = document.getElementById("hangman-image-element");	

		if (imageStep < 6) {
			hangmanImage.src = 'images/hangman' + imageStep + '.png';
		} else {
			//player has lost
			HangMan.renderUserFeedback("GAME OVER, TRY AGAIN.","red");
			hangmanImage.src = 'images/hangman6.png';

			//remove all the click handlers
			for (var i = 0; i < document.getElementsByClassName('available-letter').length; i++) {
				document.getElementsByClassName('available-letter')[i].onclick = '';
			}
			for (var i = 0; i < document.getElementsByClassName('available-number').length; i++) {
				document.getElementsByClassName('available-number')[i].onclick = '';
			}

			//show all of the letters
			var divsToShow = document.getElementsByClassName("individual-letter");
			for(var i = 0; i < divsToShow.length; i++){
				divsToShow[i].className = 'individual-letter';
			}
		}
	}

  }

HangMan.init();