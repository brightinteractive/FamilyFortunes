for(var i = 0; i<answers.length; i++){
	var answerRow = '<div class="answer" id="' + stripWhitespace(answers[i].value) + '">' +
	                '    <div class="answer__number">' + parseInt(i + 1) + '</div>' +
	                '    <div class="answer__value"><span style="display: none;">' + answers[i].value + '</span></div>' +
	                '    <div class="answer__stat"><span style="display: none;">' + answers[i].stat + '</span></div>' +
	                '</div>';

	$('#answerTable').append(answerRow);
}

var incorrectGuesses = JSON.parse(localStorage.getItem('incorrectGuesses') || "[]");
var correctGuesses = JSON.parse(localStorage.getItem('correctGuesses') || "[]");

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

			$('#' + stripWhitespace(guess) + ' span').show();

		} else {
			wrongAudio.play();
			incorrectGuesses.push(guess);
			localStorage.setItem('incorrectGuesses', JSON.stringify(incorrectGuesses));

			showCross();

			$('ul#guessList').append('<li>' + guess + '</li>');

			if(incorrectGuesses.length >= 3){
				$('form input#submit').prop("disabled", true);
				$('#showAnswers').show();
			}
		}
	}

	$input.val('');
});

function checkAnswer(guess){
	var exists = false;

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
		$('#crosses img.hidden').first().removeClass('hidden').addClass('show');
	}else{
		$('#crosses img.hidden').slice(0,number).removeClass('hidden').addClass('show');
	}
}

function revealGuesses(){
	for(var i = 0; i<incorrectGuesses.length; i++){
		$('ul#guessList').append('<li>' + incorrectGuesses[i] + '</li>');
	}

	for(var c = 0; c<correctGuesses.length; c++){
		$('#' + correctGuesses[c] + ' span').show();
	}

	showCross(incorrectGuesses.length);

	if(incorrectGuesses.length >= 3){
		$('#showAnswers').show();
		$('form input#submit').prop("disabled", true);
	}
}

function stripWhitespace(sentence) {
	return sentence.replace(/\s/g, '');
}

$('#clear').on('click', function(){
	localStorage.removeItem('incorrectGuesses');
	localStorage.removeItem('correctGuesses');

	location.reload();
});

$('#showAnswers').on('click', function(){
	$('.answer span').show();
});


var wrongAudio = document.createElement('audio');
wrongAudio.setAttribute('src', 'assets/audio/wrong.mp3');

var correctAudio = document.createElement('audio');
correctAudio.setAttribute('src', 'assets/audio/correct.wav');
