$(document).ready(function() {

    function shuffle<T>(array: T[]): T[] {
      for (let i = array.length - 1; i > 0; i--) {
	// Generate a random index 'j' from 0 to 'i'
	const j = Math.floor(Math.random() * (i + 1));

	// Swap elements at indices 'i' and 'j'
	// This uses array destructuring for a concise swap
	[array[i], array[j]] = [array[j], array[i]]; 
      }
      return array;
    }

    class Answer {
	"@correct": string;
	"#text": string;
    }

    class Question {
	content: string;
	answer: Answer[];
	explanation: string;
    }
    let quizQuestions: Question[] = [];
    let currentIndex = 0;

    function loadQuestion(index: number) {
	let q: Question = quizQuestions[index];
	$("#question").html(q.content
			    .replace(/\*(.*?)\*/g, "<i>$1</i>")
			    .replace(/\n\s*\n/g, "<br><br>")
			    .replace(/---/g, "&mdash;")
			   );
	$("#quiz").empty();
	$("#feedback").hide().text("");
	$("#nextBtn").addClass("hidden");

	shuffle(q.answer).forEach((ans, i) => {
	    $("#quiz").append(
		`<label>
		<input type="radio" name="answer" value="${i}">
		${ans["#text"]
		    .replace(/\*(.*?)\*/g, "<i>$1</i>")
		    .replace(/---/g, "&mdash;")}
		</label><br>`
	    );
	});
    }

    // Handle answer selection
    $("#quiz").on("change", "input[type=radio]", function() {
	let selectedIndex = $(this).val();
	let selectedAnswer = quizQuestions[currentIndex].answer[selectedIndex];
	let feedbackDiv = $("#feedback");

	feedbackDiv.show();
	let feedbackText: string = quizQuestions[currentIndex]
	    .explanation
	    .replace(/\n\s*\n/g, "<br><br>")
	    .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
	    .replace(/\*(.*?)\*/g, "<i>$1</i>")
	    .replace(/---/g, "&mdash;")
	if (selectedAnswer["@correct"] === "1") {
	    feedbackDiv.removeClass("partial incorrect").addClass("correct");
	    feedbackDiv.html("<p>Correct!</p>" + `<p>${feedbackText}</p>`);
	} else if (selectedAnswer["@correct"] === "0.5") {
	    feedbackDiv.removeClass("correct incorrect"). addClass("partial"); 
	    feedbackDiv.html("<p>Only partially correct. (Read feedback carefully!)</p>" + `<p>${feedbackText}</p>`);
	} else {
	    feedbackDiv.removeClass("correct partial").addClass("incorrect");
	    feedbackDiv.html("Incorrect.\n\n" + `<p>${feedbackText}</p>`);
	}

	$("#nextBtn").removeClass("hidden");
    });

    // Handle next question
    $("#nextBtn").on("click", function(e) {
	e.preventDefault();
	currentIndex++;
	if (currentIndex < quizQuestions.length) {
	    loadQuestion(currentIndex);
	} else {
	    $("#container").css({
		'border': 'none',
	    });
	    $('body').css({
		'background-image': 'url("./quizComplete.jpg")',
		'background-size': '100% 100%',
		'background-repeat': 'no-repeat',
		'height': '80vh',
		'margin': '0'
	    });
	    $("#question").empty();
	    $("#quiz").empty();
	    $("#feedback").hide();
	    $(this).addClass("hidden");
	}
	// const dummy = document.createElement("div");
	// dummy.style.position = "absolute";
	// dummy.style.opacity = "0";
	// document.body.appendChild(dummy);
	// dummy.focus();
	setTimeout(() => { 
	    if (window.scrollY > 0) {
		window.scrollTo(0,0)
	    }
	}, 1000);
    });


    // Load JSON data
    $.getJSON("quiz.json", function(object) {
	quizQuestions = shuffle(object.quiz.q);
	console.log(quizQuestions)
	loadQuestion(currentIndex);
    });
});
