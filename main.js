const questions = [
    {
        question: "Where would you like to go?",
        answers: [
            { text: "City" },
            { text: "Beach" },
            { text: "Mountain" }
        ]
    },
    {
        question: "Who will go with you?",
        answers: [
            { text: "Alone" },
            { text: "With another person" },
            { text: "With my family" },
            { text: "With friends" }
        ]
    }
];

const answerContainer = document.getElementById("answerContainer");
const questionElement = document.getElementById("questionElement");

let currentQuestion = 0;
function displayQuestion() {
    questionElement.innerHTML = questions[currentQuestion].question;
    for (const answer of questions[currentQuestion].answers) {
        const button = document.createElement("button");
        button.innerHTML = answer.text;
        button.className = "answerButton";
        button.onclick = function () {
            for (const answerButton of document.querySelectorAll(".answerButton")) {
                answerButton.parentElement.removeChild(answerButton);
            }
            currentQuestion++;
            if (currentQuestion < questions.length) {
                displayQuestion();
            }
            else {
                questionElement.parentElement.removeChild(questionElement);
                displayResult();
            }
        }
        answerContainer.appendChild(button);
    }
}

function displayResult() {

}

displayQuestion();
