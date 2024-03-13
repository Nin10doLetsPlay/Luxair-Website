const hotels = [
    {
        place: [0],
        people: [0],
        activities: [0, 3]
    },
    {
        place: [0, 1],
        people: [0, 1, 2, 3],
        activities: [1, 2, 3]
    },
    {
        place: [2],
        people: [0, 1],
        activities: [0, 2]
    }
];

const properties = {
    type: {
        question: "What are you looking for?",
        answers: [
            { text: "Destination", image: "" },
            { text: "Hotel", image: "" }
        ]
    },
    place: {
        question: "Where would you like to go?",
        answers: [
            { text: "City", image: "images/city.webp" },
            { text: "Beach", image: "images/beach.webp" },
            { text: "Mountain", image: "images/mountains.webp" },
            { text: "Forest", image: "images/forest.webp" }
        ]
    },
    people: {
        question: "Who are you traveling with?",
        answers: [
            { text: "Alone", image: "" },
            { text: "With another person", image: "" },
            { text: "With my family", image: "" },
            { text: "With friends", image: "" }
        ]
    },
    activities: {
        question: "What would you like to do?",
        answers: [
            { text: "Visit a museum", image: "" },
            { text: "Visit a Zoo", image: "" },
            { text: "Go to a cinema", image: "" },
            { text: "Relax", image: "" }
        ]
    },
    budget: {
        question: "What is your budget?",
        slider: { min: 0, max: 8050, step: 50 }
    }
};

const answerContainer = document.getElementById("answerContainer");
const questionElement = document.getElementById("questionElement");

const userAnswers = {};

let currentQuestion = 0;

function displayQuestion() {
    const [property, { question, answers, slider }] = Object.entries(properties)[currentQuestion];
    questionElement.innerHTML = question;
    if (slider) {
        const sliderValue = document.createElement("h2");

        const sliderElement = document.createElement("input");
        sliderElement.className = "slider";
        sliderElement.type = "range";
        sliderElement.min = slider.min;
        sliderElement.max = slider.max;
        sliderElement.oninput = function () {
            sliderValue.innerHTML = this.value == 8050 ? "No limit" : Math.floor(this.value / slider.step) * slider.step;
        }

        answerContainer.appendChild(sliderElement);
        answerContainer.appendChild(sliderValue);
    }
    else if (answers) {
        const buttonContainer = document.createElement("div");
        buttonContainer.id = "buttonContainer"
        buttonContainer.className = answers.length == 3 ? "grid3" : "grid4";
        answerContainer.appendChild(buttonContainer);

        for (let [index, answer] of answers.entries()) {

            const answerButton = document.createElement("button");
            answerButton.className = "answerButton";
            answerButton.type = "button";
            answerButton.onclick = function () {
                userAnswers[property] = index;
                for (const element of document.querySelectorAll(".answerButton")) {
                    element.parentElement.removeChild(element);
                }
                currentQuestion++;
                if (currentQuestion < Object.entries(properties).length) {
                    displayQuestion();
                }
                else {
                    displayResult();
                }
            }

            if (answer.image) {
                const answerImage = document.createElement("img");
                answerImage.className = "answerImage";
                answerImage.alt = "Photo of a " + answer.text.toLowerCase() + " travel destination";
                answerImage.src = answer.image;
                answerButton.classList.add("imageAnswerButton");

                const imageContainer = document.createElement("div");
                imageContainer.className = "imageContainer";
                imageContainer.appendChild(answerImage);

                answerButton.appendChild(imageContainer)
            }

            const answerText = document.createElement("h2");
            answerText.className = "answerText";
            answerText.innerHTML = answer.text;
            answerButton.appendChild(answerText);

            buttonContainer.appendChild(answerButton);
        }
    }
}

function displayResult() {
    questionElement.parentElement.removeChild(questionElement);
    answerContainer.parentElement.removeChild(answerContainer);
    alert(JSON.stringify(userAnswers));
}

displayQuestion();