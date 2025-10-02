$(document).ready(function () {
    function shuffle(array) {
        var _a;
        for (var i = array.length - 1; i > 0; i--) {
            // Generate a random index 'j' from 0 to 'i'
            var j = Math.floor(Math.random() * (i + 1));
            // Swap elements at indices 'i' and 'j'
            // This uses array destructuring for a concise swap
            _a = [array[j], array[i]], array[i] = _a[0], array[j] = _a[1];
        }
        return array;
    }
    var Answer = /** @class */ (function () {
        function Answer() {
        }
        return Answer;
    }());
    var Question = /** @class */ (function () {
        function Question() {
        }
        return Question;
    }());
    var quizQuestions = [];
    var currentIndex = 0;
    function loadQuestion(index) {
        var q = quizQuestions[index];
        $("#question").html(q.content
            .replace(/\*(.*?)\*/g, "<i>$1</i>")
            .replace(/\n\s*\n/g, "<br><br>")
            .replace(/---/g, "&mdash;"));
        $("#quiz").empty();
        $("#feedback").hide().text("");
        $("#nextBtn").addClass("hidden");
        shuffle(q.answer).forEach(function (ans, i) {
            $("#quiz").append("<label>\n\t\t<input type=\"radio\" name=\"answer\" value=\"".concat(i, "\">\n\t\t").concat(ans["#text"]
                .replace(/\*(.*?)\*/g, "<i>$1</i>")
                .replace(/---/g, "&mdash;"), "\n\t\t</label><br>"));
        });
    }
    // Handle answer selection
    $("#quiz").on("change", "input[type=radio]", function () {
        var selectedIndex = $(this).val();
        var selectedAnswer = quizQuestions[currentIndex].answer[selectedIndex];
        var feedbackDiv = $("#feedback");
        feedbackDiv.show();
        var feedbackText = quizQuestions[currentIndex]
            .explanation
            .replace(/\n\s*\n/g, "<br><br>")
            .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
            .replace(/\*(.*?)\*/g, "<i>$1</i>")
            .replace(/---/g, "&mdash;");
        if (selectedAnswer["@correct"] === "1") {
            feedbackDiv.removeClass("partial incorrect").addClass("correct");
            feedbackDiv.html("<p>Correct!</p>" + "<p>".concat(feedbackText, "</p>"));
        }
        else if (selectedAnswer["@correct"] === "0.5") {
            feedbackDiv.removeClass("correct incorrect").addClass("partial");
            feedbackDiv.html("<p>Only partially correct. (Read feedback carefully!)</p>" + "<p>".concat(feedbackText, "</p>"));
        }
        else {
            feedbackDiv.removeClass("correct partial").addClass("incorrect");
            feedbackDiv.html("Incorrect.\n\n" + "<p>".concat(feedbackText, "</p>"));
        }
        $("#nextBtn").removeClass("hidden");
    });
    // Handle next question
    $("#nextBtn").on("click", function (e) {
        e.preventDefault();
        currentIndex++;
        if (currentIndex < quizQuestions.length) {
            loadQuestion(currentIndex);
        }
        else {
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
        setTimeout(function () {
            if (window.scrollY > 0) {
                window.scrollTo(0, 0);
            }
        }, 1000);
    });
    // Load JSON data
    $.getJSON("quiz.json", function (object) {
        quizQuestions = shuffle(object.quiz.q);
        console.log(quizQuestions);
        loadQuestion(currentIndex);
    });
});
