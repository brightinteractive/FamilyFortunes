//loop through all the answers and place them hidden into the dom
for(var i = 0; i<answers.length; i++){
	var answerRow = '<div class="answer" id="' + stripWhitespace(answers[i].value) + '">' +
	                '    <div class="answer__number">' + parseInt(i + 1) + '</div>' +
	                '    <div class="answer__value"><span style="display: none;">' + answers[i].value + '</span></div>' +
	                '    <div class="answer__stat"><span style="display: none;">' + answers[i].stat + '</span></div>' +
	                '</div>';

	$('#answerTable').append(answerRow);
}

//create arrays for incorrect and correct guesses that are either blank or collected from local storage
var incorrectGuesses = JSON.parse(localStorage.getItem('incorrectGuesses') || "[]");
var correctGuesses = JSON.parse(localStorage.getItem('correctGuesses') || "[]");

//if there are localstorage values, display the already guessed answers on the scoreboard
if((incorrectGuesses.length > 0) || (correctGuesses.length > 0)) {
	revealGuesses();
}

$('form').submit(function(e){
	e.preventDefault();

	var $input = $('form input#guess');
	var guess = $input.val().toLowerCase();
	var correct = checkAnswer(guess);

	if(guess != ''){
		if(correct){
			correctAudio.play();
			correctGuesses.push(guess);
			localStorage.setItem('correctGuesses', JSON.stringify(correctGuesses));

			$('#' + stripWhitespace(guess) + ' span').show(); //show guess on the scoreboard

			//check to see if top answer
			// if(answers[0].value == guess){
			// 	console.log('top answer');
			// }

		} else {
			wrongAudio.play();
			incorrectGuesses.push(guess);
			localStorage.setItem('incorrectGuesses', JSON.stringify(incorrectGuesses));

			showCross();

			$('ul#guessList').append('<li>' + guess + '</li>'); //add the guess to the incorrect guess list

			//if theres more than 3 guesses, disable the form and show the 'show answers' button
			if(incorrectGuesses.length >= 3){
				$('form input#submit').prop("disabled", true);
				$('#showAnswers').show();
			}
		}
	}

	$input.val(''); //empty the input field after submit clicked
});

function checkAnswer(guess){
	var exists = false;

	//loop through the answers array to see if guess exists
	for(var i = 0; i<answers.length; i++){
		if(answers[i].value.toLowerCase() == guess){
			exists = true;
			break;
		}
	}

	return exists;
}

function showCross(number){
	if(number == null){
		//if theres no number specified show first hidden cross.
		$('#crosses img.hidden').first().removeClass('hidden').addClass('show');
	}else{
		//if there is, show the passed number of crosses
		$('#crosses img.hidden').slice(0,number).removeClass('hidden').addClass('show');
	}
}

function revealGuesses(){
	//loop through incorrect guesses and add it to the guess list
	for(var i = 0; i<incorrectGuesses.length; i++){
		$('ul#guessList').append('<li>' + incorrectGuesses[i] + '</li>');
	}

	//loop through correct guesses and show them in the scoreboard
	for(var c = 0; c<correctGuesses.length; c++){
		$('#' + correctGuesses[c] + ' span').show();
	}

	//show the correct number of crosses
	showCross(incorrectGuesses.length);

	//disable the input and show the 'show answers' button if 3 incorrect guesses
	if(incorrectGuesses.length >= 3){
		$('#showAnswers').show();
		$('form input#submit').prop("disabled", true);
	}
}

function stripWhitespace(sentence) {
	return sentence.replace(/\s/g, '');
}

//remove localstorage items and refresh the browser
$('#clear').on('click', function(){
	localStorage.removeItem('incorrectGuesses');
	localStorage.removeItem('correctGuesses');

	location.reload();
});

//show all answers
$('#showAnswers').on('click', function(){
	$('.answer span').show();
});


var wrongAudio = document.createElement('audio');
wrongAudio.setAttribute('src', 'assets/audio/wrong.mp3');

var correctAudio = document.createElement('audio');
correctAudio.setAttribute('src', 'assets/audio/correct.wav');