
async function get(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw response.status;
        return await response.json();
    } catch (error) {
        console.error(`Get request to ${url} failed: ${error}`);
        return null;
    }
}

const properties = {
    type: {
        type: "answers",
        question: "What are you looking for?",
        answers: [
            { id: "hotel", text: "Destination with hotel", image: "images/luxairtours.png" },
            { id: "destination", text: "Just a destination", image: "images/luxair.png" }
        ]
    },
    place: {
        type: "answers",
        question: "Where would you like to go?",
        answers: [
            { id: "city", text: "City", image: "images/city.webp" },
            { id: "beach", text: "Beach", image: "images/beach.webp" }
        ]
    },
    kids: {
        type: "boolean",
        question: "Are you traveling with kids?"
    },
    activities: {
        type: "answers",
        question: "What would you like to do?",
        answers: [
            { id: "shopping", text: "Go shopping", image: "" },
            { id: "culture", text: "Discover the culture", image: "" },
            { id: "historical", text: "Visit a historical museum", image: "" },
            { id: "relax", text: "Just relax", image: "" }
        ]
    },
    price: {
        type: "slider",
        question: "What is your budget?",
        min: 0,
        max: 2050,
        step: 50,
        range: 1000
    }
};

const content = document.getElementById("content");
const answerContainer = document.getElementById("answerContainer");
const questionElement = document.getElementById("questionElement");

const userAnswers = {};

let currentQuestion = 0;

function displayQuestion() {
    const [key, property] = Object.entries(properties)[currentQuestion];
    questionElement.innerHTML = property.question;
    if (property.type == "slider") {
        const sliderValue = document.createElement("h2");
        sliderValue.innerHTML = "0";

        const sliderElement = document.createElement("input");
        sliderElement.className = "slider";
        sliderElement.type = "range";
        sliderElement.min = property.min;
        sliderElement.max = property.max;
        sliderElement.oninput = function () {
            sliderValue.innerHTML = this.value == property.max ? "No limit" : Math.floor(this.value / property.step) * property.step;
        }

        const buttonText = document.createElement("h2");
        buttonText.innerHTML = "Submit";

        const submitButton = document.createElement("button");
        submitButton.type = "button";
        submitButton.appendChild(buttonText);
        submitButton.onclick = function () {
            userAnswers[key] = sliderElement.value == 8050 ? 999999 : Math.floor(sliderElement.value / property.step) * property.step;
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
    else if (property.type == "answers") {
        const buttonContainer = document.createElement("div");
        buttonContainer.id = "buttonContainer"
        buttonContainer.className = property.answers.length == 3 ? "grid3" : "grid4";
        answerContainer.appendChild(buttonContainer);

        for (const answer of property.answers) {

            const answerButton = document.createElement("button");
            answerButton.className = "answerButton";
            answerButton.type = "button";
            answerButton.onclick = function () {
                userAnswers[key] = answer.id;
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
                answerImage.alt = answer.text;
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
    else if (property.type == "boolean") {

        const buttonContainer = document.createElement("div");
        buttonContainer.id = "buttonContainer"
        buttonContainer.className = "grid4";
        answerContainer.appendChild(buttonContainer);

        for (let i = 0; i < 2; i++) {

            const answerButton = document.createElement("button");
            answerButton.className = "answerButton";
            answerButton.type = "button";
            answerButton.onclick = function () {
                userAnswers[key] = i == 0;
                buttonContainer.parentElement.removeChild(buttonContainer);
                currentQuestion++;
                if (currentQuestion < Object.entries(properties).length) {
                    displayQuestion();
                }
                else {
                    displayResult();
                }
            }

            const answerText = document.createElement("h2");
            answerText.className = "answerText";
            answerText.innerHTML = i == 0 ? "Yes" : "No";
            answerButton.appendChild(answerText);

            buttonContainer.appendChild(answerButton);
        }
    }
}

async function displayResult() {
    questionElement.parentElement.removeChild(questionElement);
    answerContainer.parentElement.removeChild(answerContainer);
    const results = userAnswers["type"] == "hotel" ? await get("test_hotels.json") : await get("destinations.json");
    for (const result of results) {
        result.rating = 0;
        for (const [property, userAnswer] of Object.entries(userAnswers)) {
            if (property == "type") continue;
            if (properties[property].type == "slider") {
                result.rating += Math.max(0, 1 - (Math.abs(userAnswer - result[property]) / properties[property].range));
            }
            else if (properties[property].type == "answers") {
                if (result[property][userAnswer] == true) result.rating++;
            }
            else if (properties[property].type == "boolean") {
                if (!(userAnswer == true && result[property] == false)) result.rating++;
            }
        }
    }
    const sortedResults = results.sort((a, b) => b.rating - a.rating);

    for (const sortedResult of sortedResults) {

        const resultLink = document.createElement("a");
        resultLink.href = sortedResult.url;
        content.appendChild(resultLink);

        const resultContainer = document.createElement("div");
        resultContainer.className = "resultContainer";
        resultLink.appendChild(resultContainer);

        const resultImage = document.createElement("img");
        resultImage.className = "resultImage";
        resultImage.src = sortedResult.image;
        resultContainer.appendChild(resultImage);

        const resultText = document.createElement("div");
        resultText.className = "resultText";
        resultContainer.appendChild(resultText);

        const resultTitle = document.createElement("h2");
        resultTitle.innerHTML = sortedResult.region + " - " + sortedResult.country;
        resultText.appendChild(resultTitle);

        const resultDescription = document.createElement("p");
        resultDescription.innerHTML = "Price: " + sortedResult.price + "€<br>Recommendation: " + Math.round(sortedResult.rating / Object.entries(userAnswers).length * 100) + "%";
        resultText.appendChild(resultDescription);
    }
}

displayQuestion();