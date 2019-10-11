for(var i = 0; i<answers.length; i++){
	var answerRow = '<div class="answer" id="' + stripWhitespace(answers[i].value) + '">' +
	                '    <div class="answer__number">' + parseInt(i + 1) + '</div>' +
	                '    <div class="answer__value"><span style="display: none;">' + answers[i].value + '</span></div>' +
	                '    <div class="answer__stat"><span style="display: none;">' + answers[i].stat + '</span></div>' +
	                '</div>';

	$('#answerTable').append(answerRow);
}
var scoreRow = '<div class="answer" id="totalScore">' +
				'    <div class="answer__number"></div>' +
				'    <div class="answer__value"><span>total</span></div>' +
				'    <div class="answer__stat"><span id="runningTotal">0</span></div>' +
				'</div>';
$('#answerTable').append(scoreRow);

var incorrectGuesses = JSON.parse(localStorage.getItem('incorrectGuesses') || "[]");
var correctGuesses = JSON.parse(localStorage.getItem('correctGuesses') || "[]");

if((incorrectGuesses.length > 0) || (correctGuesses.length > 0)) {
	revealGuesses();
}

$('form').submit(function(e){
	e.preventDefault();

	var $input = $('form input#guess');
	var guess = $input.val().toLowerCase();
	var answer = checkAnswer(guess);

	if(guess != ''){
		if(answer != null){
			if (answer.bonus) {
				bonusAudio.play();
			}
			else {
				correctAudio.play();
			}
			correctGuesses.push(guess);
			localStorage.setItem('correctGuesses', JSON.stringify(correctGuesses));

			$('#' + stripWhitespace(guess) + ' span').show();
			currentTotal = parseInt($('#runningTotal').text());
			$('#runningTotal').text(currentTotal + answer.stat);

			if (incorrectGuesses.length == 3) {
				setupPostGameInputs();
			}

		} else {
			wrongAudio.play();
			incorrectGuesses.push(guess);
			localStorage.setItem('incorrectGuesses', JSON.stringify(incorrectGuesses));

			showCross(incorrectGuesses.length-1);

			$('ul#guessList').append('<li>' + guess + '</li>');

			if(incorrectGuesses.length >= 4){
				setupPostGameInputs();
			}
		}
	}

	$input.val('');
});

function checkAnswer(guess){
	for(var i = 0; i<answers.length; i++){
		if(answers[i].value.toLowerCase() == guess){
			return answers[i];
		}
	}

	return null;
}

function showCross(number){
	if(number == null){
		$('#crosses img.hidden').first().removeClass('hidden').addClass('show');
	} else {
		$('#crosses img').eq(number).removeClass('hidden').addClass('show');
	}
}

function showAllCrosses() {
	for (var i=0; i<4; i++){
		showCross(i);
	}
}

function revealGuesses(){
	for(var i = 0; i<incorrectGuesses.length; i++){
		$('ul#guessList').append('<li>' + incorrectGuesses[i] + '</li>');
	}

	for(var c = 0; c<correctGuesses.length; c++){
		$('#' + correctGuesses[c] + ' span').show();
	}

	showAllCrosses();

	if(incorrectGuesses.length >= 3){
		$('#showAnswers').show();
		$('form input#submit').prop("disabled", true);
	}
}

function stripWhitespace(sentence) {
	return sentence.replace(/\s/g, '');
}

function setupPostGameInputs() {
	$('form input#submit').prop("disabled", true);
	$('#showAnswers').show();
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

var bonusAudio = document.createElement('audio');
bonusAudio.setAttribute('src', 'assets/audio/siren.mp3');
