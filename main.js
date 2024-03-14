const hotels = [
    {
        name: "Test hotel or destination in a city for people alone. Price: 3999 Euro",
        rating: 0,
        type: [0, 1],
        place: [0],
        people: [0],
        activities: [0, 1, 3],
        price: 3999
    },
    {
        name: "Test destination in a city with beach. Price: 6299 Euro",
        rating: 0,
        type: [0],
        place: [0, 1],
        people: [0, 1, 2, 3],
        activities: [1, 2, 3],
        price: 6299
    },
    {
        name: "Test hotel in the mountains. Maximum 2 people. Price: 1599 Euro",
        rating: 0,
        type: [1],
        place: [2],
        people: [0, 1],
        activities: [0, 2, 3],
        price: 1599
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
    price: {
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

        const submitButton = document.createElement("button");
        submitButton.type = "button";
        submitButton.innerHTML = "Submit";
        submitButton.onclick = function () {
            userAnswers[property] = sliderElement.value == 8050 ? 999999 : Math.floor(sliderElement.value / slider.step) * slider.step;
            sliderElement.parentElement.removeChild(sliderElement);
            sliderValue.parentElement.removeChild(sliderValue);
            submitButton.parentElement.removeChild(submitButton);
            currentQuestion++;
            if (currentQuestion < Object.entries(properties).length) {
                displayQuestion();
            }
            else {
                displayResult();
            }
        }

        answerContainer.appendChild(sliderElement);
        answerContainer.appendChild(sliderValue);
        answerContainer.appendChild(submitButton);
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
                buttonContainer.parentElement.removeChild(buttonContainer);
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
    for (const hotel of hotels) {
        for (const [property, userAnswer] of Object.entries(userAnswers)) {
            if (properties[property].slider) {
                hotel.rating += Math.max(0, 1 - Math.abs(1 - userAnswer / hotel[property]));
            }
            else if (hotel[property].includes(userAnswer)) {
                hotel.rating++;
                console.log("Property");
            }
        }
    }
    const sortedHotels = hotels.sort((a, b) => b.rating - a.rating);
    const output = document.createElement("h2");
    output.innerHTML = sortedHotels[0].name;
    document.getElementById("content").appendChild(output);
}

displayQuestion();